import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";
import { execFile } from "child_process";
import { promisify } from "util";
import { generateCvHtml, type CvTheme } from "@/components/cv/cvHtmlTemplate";
import type { PortfolioData } from "@/types/portfolio";

const execFileAsync = promisify(execFile);

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function findBrowserExecutable(): string | null {
  const candidates = [
    process.env.CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ].filter(Boolean) as string[];

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    } catch {
      // ignore
    }
  }
  return null;
}

function getAvatarDataUri(): string {
  try {
    const imgPath = path.join(process.cwd(), "public", "portfolio-image.jpeg");
    if (fs.existsSync(imgPath)) {
      const buf = fs.readFileSync(imgPath);
      return `data:image/jpeg;base64,${buf.toString("base64")}`;
    }
  } catch {
    // ignore
  }
  return "/portfolio-image.jpeg";
}

function getPortfolioDataFromDisk(lang: "es" | "en"): PortfolioData {
  const jsonPath = path.join(process.cwd(), "data", "portfolio.json");
  const raw = fs.readFileSync(jsonPath, "utf-8");
  const parsed = JSON.parse(raw);
  return parsed[lang] || parsed.es;
}

async function renderHtmlToPdfBuffer(
  data: PortfolioData,
  lang: "es" | "en",
  theme: CvTheme
): Promise<Buffer> {
  const browserExe = findBrowserExecutable();
  if (!browserExe) {
    throw new Error("NO_LOCAL_BROWSER");
  }

  const avatarDataUri = getAvatarDataUri();
  const fullHtml = generateCvHtml({
    data,
    language: lang,
    theme,
    avatarBase64: avatarDataUri,
    standalone: true,
  });

  const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const tmpDir = os.tmpdir();
  const tmpHtmlPath = path.join(tmpDir, `cv-${lang}-${theme}-${uniqueId}.html`);
  const tmpPdfPath = path.join(tmpDir, `cv-${lang}-${theme}-${uniqueId}.pdf`);
  const userDataDir = path.join(tmpDir, `cv-chrome-profile-${uniqueId}`);

  try {
    fs.mkdirSync(userDataDir, { recursive: true });
    fs.writeFileSync(tmpHtmlPath, fullHtml, "utf-8");

    const fileUrl = `file:///${tmpHtmlPath.replace(/\\/g, "/")}`;

    await execFileAsync(
      browserExe,
      [
        "--headless=new",
        "--no-sandbox",
        "--disable-gpu",
        `--user-data-dir=${userDataDir}`,
        "--no-pdf-header-footer",
        `--print-to-pdf=${tmpPdfPath}`,
        fileUrl,
      ],
      { timeout: 25000 }
    );

    if (!fs.existsSync(tmpPdfPath)) {
      throw new Error("PDF_NOT_CREATED");
    }

    return fs.readFileSync(tmpPdfPath);
  } finally {
    try {
      if (fs.existsSync(tmpHtmlPath)) fs.unlinkSync(tmpHtmlPath);
    } catch {}
    try {
      if (fs.existsSync(tmpPdfPath)) fs.unlinkSync(tmpPdfPath);
    } catch {}
    try {
      if (fs.existsSync(userDataDir)) {
        fs.rmSync(userDataDir, { recursive: true, force: true });
      }
    } catch {}
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const langParam = searchParams.get("lang");
    const themeParam = searchParams.get("theme");

    const lang: "es" | "en" = langParam === "en" ? "en" : "es";
    const theme: CvTheme = themeParam === "dark" ? "dark" : "light";

    const data = getPortfolioDataFromDisk(lang);
    const pdfBuffer = await renderHtmlToPdfBuffer(data, lang, theme);
    const darkSuffix = theme === "dark" ? "_Dark" : "";
    const filename = `Mateo_Padilla_CV_${lang.toUpperCase()}${darkSuffix}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "UNKNOWN_ERROR";
    return NextResponse.json(
      { error: "Dynamic vector PDF generation unavailable", reason: message },
      { status: 501 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const lang: "es" | "en" = body?.lang === "en" ? "en" : "es";
    const theme: CvTheme = body?.theme === "dark" ? "dark" : "light";
    const data: PortfolioData = body?.data || getPortfolioDataFromDisk(lang);

    const pdfBuffer = await renderHtmlToPdfBuffer(data, lang, theme);
    const darkSuffix = theme === "dark" ? "_Dark" : "";
    const filename = `Mateo_Padilla_CV_${lang.toUpperCase()}${darkSuffix}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "UNKNOWN_ERROR";
    return NextResponse.json(
      { error: "Dynamic vector PDF generation unavailable", reason: message },
      { status: 501 }
    );
  }
}

