$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing
$srcPath = Resolve-Path "public\portfolio-image.jpeg"
$srcImg = [System.Drawing.Bitmap]::FromFile($srcPath)
$minSide = [Math]::Min($srcImg.Width, $srcImg.Height)
$cropX = [int](($srcImg.Width - $minSide) / 2)
$cropY = [int](($srcImg.Height - $minSide) / 2)
$cropRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $minSide, $minSide)
$croppedImg = $srcImg.Clone($cropRect, $srcImg.PixelFormat)

$ms = New-Object System.IO.MemoryStream
$croppedImg.Save($ms, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$avatarBase64 = [Convert]::ToBase64String($ms.ToArray())
$ms.Dispose()
$croppedImg.Dispose()
$srcImg.Dispose()

$avatarDataUri = "data:image/jpeg;base64," + $avatarBase64

$favSrcPath = Resolve-Path "public\favicon.png"
$favSrcImg = [System.Drawing.Bitmap]::FromFile($favSrcPath)
$favSize = 64
$favBmp = New-Object System.Drawing.Bitmap($favSize, $favSize, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$favG = [System.Drawing.Graphics]::FromImage($favBmp)
$favG.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$favG.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$favG.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$favG.Clear([System.Drawing.Color]::Transparent)
$favG.DrawImage($favSrcImg, 0, 0, $favSize, $favSize)
$favG.Dispose()
$favMs = New-Object System.IO.MemoryStream
$favBmp.Save($favMs, [System.Drawing.Imaging.ImageFormat]::Png)
$faviconDataUri = "data:image/png;base64," + [Convert]::ToBase64String($favMs.ToArray())
$favMs.Dispose()
$favBmp.Dispose()
$favSrcImg.Dispose()

$portfolioJsonRaw = [IO.File]::ReadAllText((Resolve-Path "data\portfolio.json"), [System.Text.Encoding]::UTF8)

$htmlTemplate = @'
<!DOCTYPE html>
<html lang="es" data-theme="light">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Mateo Padilla Pe&ntilde;a &mdash; Curriculum Vitae (ES / EN &bull; Light / Dark)</title>
  <link rel="icon" type="image/png" sizes="64x64" href="__FAVICON_DATA_URI__" />
  <link rel="shortcut icon" type="image/png" href="__FAVICON_DATA_URI__" />
  <link rel="apple-touch-icon" href="__FAVICON_DATA_URI__" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.2/html2pdf.bundle.min.js"></script>
  <style>
    @page {
      size: 210mm 535mm;
      margin: 0mm;
    }

    /* Fix html2canvas FontMetrics baseline calculation */
    img[src^="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP"] {
      display: inline !important;
      vertical-align: baseline !important;
    }

    body {
      background-color: #f1f5f9;
      margin: 0;
      padding: 20px 12px 36px 12px;
      font-family: 'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      transition: background-color 0.2s ease, color 0.2s ease;
    }

    html[data-theme="dark"] body {
      background-color: #020617;
      color: #f8fafc;
    }

    /* Barra superior exclusiva de la vista previa (NO sale en el PDF) */
    .preview-toolbar {
      width: 794px;
      max-width: 100%;
      margin: 0 auto 16px auto;
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 10px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 10px;
      box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06);
      box-sizing: border-box;
      position: sticky;
      top: 12px;
      z-index: 100;
      transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    }

    html[data-theme="dark"] .preview-toolbar {
      background-color: #0f172a;
      border-color: #1e293b;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
    }

    .toolbar-controls {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .toolbar-group {
      display: inline-flex;
      align-items: center;
      gap: 7px;
    }

    .toolbar-divider {
      width: 1px;
      height: 22px;
      background-color: #e2e8f0;
    }

    html[data-theme="dark"] .toolbar-divider {
      background-color: #1e293b;
    }

    .toolbar-label {
      font-size: 11.5px;
      font-weight: 600;
      color: #475569;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }

    html[data-theme="dark"] .toolbar-label {
      color: #94a3b8;
    }

    .switch-pill-group {
      display: inline-flex;
      background-color: #f1f5f9;
      padding: 3px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      gap: 3px;
      transition: background-color 0.2s ease, border-color 0.2s ease;
    }

    html[data-theme="dark"] .switch-pill-group {
      background-color: #020617;
      border-color: #1e293b;
    }

    .switch-btn {
      appearance: none;
      border: none;
      background: transparent;
      color: #475569;
      font-family: inherit;
      font-size: 11.5px;
      font-weight: 600;
      padding: 5px 10px;
      border-radius: 6px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: all 0.15s ease;
    }

    html[data-theme="dark"] .switch-btn {
      color: #94a3b8;
    }

    .switch-btn:hover {
      color: #0f172a;
    }

    html[data-theme="dark"] .switch-btn:hover {
      color: #f8fafc;
    }

    .switch-btn.active {
      background-color: #ffffff;
      color: #2563eb;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
    }

    html[data-theme="dark"] .switch-btn.active {
      background-color: #1e293b;
      color: #38bdf8;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
    }

    .download-pdf-btn {
      appearance: none;
      border: none;
      background-color: #2563eb;
      color: #ffffff;
      font-family: inherit;
      font-size: 12px;
      font-weight: 600;
      padding: 8px 14px;
      border-radius: 8px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 7px;
      transition: background-color 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease, opacity 0.15s ease;
      box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
    }

    .download-pdf-btn:hover:not(:disabled) {
      background-color: #1d4ed8;
    }

    .download-pdf-btn:disabled {
      opacity: 0.7;
      cursor: wait;
    }

    html[data-theme="dark"] .download-pdf-btn {
      background-color: #0284c7;
      box-shadow: 0 2px 10px rgba(56, 189, 248, 0.22);
    }

    html[data-theme="dark"] .download-pdf-btn:hover:not(:disabled) {
      background-color: #0369a1;
    }

    /* Estilos encapsulados del documento CV (#cv-export-root) */
    #cv-export-root,
    #cv-export-root *,
    #cv-export-root *::before,
    #cv-export-root *::after {
      box-sizing: border-box;
    }

    #cv-export-root {
      width: 794px;
      max-width: 794px;
      margin: 0 auto;
      background-color: #ffffff;
      color: #0f172a;
      font-family: 'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.58;
      -webkit-font-smoothing: antialiased;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      padding: 50px 48px;
      text-align: left;
      box-shadow: 0 4px 25px rgba(0, 0, 0, 0.07), 0 0 0 1px rgba(0, 0, 0, 0.03);
      border-radius: 6px;
      transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
    }

    html[data-theme="dark"] #cv-export-root {
      background-color: #0b1120;
      color: #f8fafc;
      box-shadow: 0 10px 35px rgba(0, 0, 0, 0.55), 0 0 0 1px #1e293b;
    }

    #cv-export-root h1,
    #cv-export-root h2,
    #cv-export-root h3,
    #cv-export-root p,
    #cv-export-root div,
    #cv-export-root span,
    #cv-export-root header,
    #cv-export-root section,
    #cv-export-root footer {
      margin: 0;
      padding: 0;
    }

    /* Encabezado */
    #cv-export-root .header-card {
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-left: 5px solid #2563eb;
      border-radius: 10px;
      padding: 20px 22px;
      margin-bottom: 21px;
      display: flex;
      align-items: center;
      gap: 18px;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
    }

    html[data-theme="dark"] #cv-export-root .header-card {
      background: linear-gradient(135deg, #0f172a 0%, #111827 100%);
      border: 1px solid #1e293b;
      border-left: 5px solid #38bdf8;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
    }

    #cv-export-root .avatar-wrapper {
      position: relative;
      flex-shrink: 0;
      width: 82px;
      height: 82px;
      border-radius: 50%;
      overflow: hidden;
      border: 2.5px solid #2563eb;
      background-color: #f8fafc;
    }

    html[data-theme="dark"] #cv-export-root .avatar-wrapper {
      border-color: #38bdf8;
      background-color: #0f172a;
    }

    #cv-export-root .avatar-img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      object-position: center;
      display: block;
    }

    #cv-export-root .header-info {
      flex: 1;
      min-width: 0;
    }

    #cv-export-root .header-name {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.4px;
      margin: 0 0 9px 0;
      color: #0f172a;
      line-height: 1.22;
    }

    html[data-theme="dark"] #cv-export-root .header-name {
      color: #f8fafc;
    }

    #cv-export-root .header-role {
      display: inline-block;
      font-family: 'JetBrains Mono', 'Cascadia Mono', 'Consolas', monospace;
      font-size: 11.5px;
      font-weight: 600;
      color: #1d4ed8;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      padding: 5.5px 11px;
      border-radius: 6px;
      margin: 0 0 13px 0;
      line-height: 1.38;
    }

    html[data-theme="dark"] #cv-export-root .header-role {
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.12);
      border-color: rgba(56, 189, 248, 0.3);
    }

    #cv-export-root .header-contacts {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 9px 16px;
      font-size: 10.5px;
      color: #475569;
      line-height: 1.48;
    }

    html[data-theme="dark"] #cv-export-root .header-contacts {
      color: #cbd5e1;
    }

    #cv-export-root .meta-item {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      color: #475569;
      text-decoration: none;
    }

    html[data-theme="dark"] #cv-export-root .meta-item {
      color: #cbd5e1;
    }

    #cv-export-root .meta-icon {
      color: #2563eb;
      flex-shrink: 0;
    }

    html[data-theme="dark"] #cv-export-root .meta-icon {
      color: #38bdf8;
    }

    /* Bloques de Seccion */
    #cv-export-root .cv-section {
      margin-bottom: 21px;
    }

    #cv-export-root .section-title-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }

    #cv-export-root .section-icon {
      color: #2563eb;
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
    }

    html[data-theme="dark"] #cv-export-root .section-icon {
      color: #38bdf8;
    }

    #cv-export-root .section-title-text {
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.6px;
      color: #0f172a;
      text-transform: uppercase;
      line-height: 1.32;
    }

    html[data-theme="dark"] #cv-export-root .section-title-text {
      color: #f8fafc;
    }

    #cv-export-root .section-divider {
      flex: 1;
      height: 1px;
      background: #e2e8f0;
    }

    html[data-theme="dark"] #cv-export-root .section-divider {
      background: #1e293b;
    }

    /* Perfil Profesional */
    #cv-export-root .profile-card {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 3.5px solid #2563eb;
      border-radius: 0 8px 8px 0;
      padding: 15px 16px;
      font-size: 10.8px;
      color: #334155;
      line-height: 1.65;
    }

    html[data-theme="dark"] #cv-export-root .profile-card {
      background-color: #0f172a;
      border-color: #1e293b;
      border-left-color: #38bdf8;
      color: #cbd5e1;
    }

    /* Linea de Tiempo de Experiencia */
    #cv-export-root .timeline-container {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    #cv-export-root .timeline-job {
      position: relative;
      padding-left: 17px;
      border-left: 2px solid #bfdbfe;
    }

    html[data-theme="dark"] #cv-export-root .timeline-job {
      border-left-color: rgba(56, 189, 248, 0.35);
    }

    #cv-export-root .timeline-job:last-child {
      border-left: 2px solid #e2e8f0;
    }

    html[data-theme="dark"] #cv-export-root .timeline-job:last-child {
      border-left-color: #1e293b;
    }

    #cv-export-root .timeline-node {
      position: absolute;
      left: -6px;
      top: 4px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #2563eb;
      border: 2px solid #ffffff;
      box-shadow: 0 0 0 1.5px #bfdbfe;
    }

    html[data-theme="dark"] #cv-export-root .timeline-node {
      background-color: #38bdf8;
      border-color: #0b1120;
      box-shadow: 0 0 0 1.5px rgba(56, 189, 248, 0.4);
    }

    #cv-export-root .job-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 7px;
    }

    #cv-export-root .job-role {
      font-size: 13.2px;
      font-weight: 700;
      color: #1d4ed8;
      line-height: 1.32;
    }

    html[data-theme="dark"] #cv-export-root .job-role {
      color: #38bdf8;
    }

    #cv-export-root .job-company-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: #0f172a;
      margin-top: 5.5px;
      line-height: 1.38;
    }

    html[data-theme="dark"] #cv-export-root .job-company-row {
      color: #f8fafc;
    }

    #cv-export-root .job-company {
      font-weight: 700;
    }

    #cv-export-root .job-location {
      color: #64748b;
      font-size: 10px;
      display: inline-flex;
      align-items: center;
      gap: 3px;
    }

    html[data-theme="dark"] #cv-export-root .job-location {
      color: #94a3b8;
    }

    #cv-export-root .job-period-pill {
      font-family: 'JetBrains Mono', 'Cascadia Mono', 'Consolas', monospace;
      font-size: 9.6px;
      font-weight: 600;
      background: #eff6ff;
      color: #1d4ed8;
      border: 1px solid #bfdbfe;
      padding: 5px 9.5px;
      border-radius: 12px;
      white-space: nowrap;
      flex-shrink: 0;
      line-height: 1.38;
    }

    html[data-theme="dark"] #cv-export-root .job-period-pill {
      background: rgba(56, 189, 248, 0.12);
      color: #38bdf8;
      border-color: rgba(56, 189, 248, 0.28);
    }

    #cv-export-root .job-desc {
      font-size: 10.6px;
      color: #334155;
      margin: 7px 0 10px 0;
      line-height: 1.58;
    }

    html[data-theme="dark"] #cv-export-root .job-desc {
      color: #cbd5e1;
    }

    #cv-export-root .achievements-list {
      display: flex;
      flex-direction: column;
      gap: 7px;
      margin-bottom: 7px;
    }

    #cv-export-root .achievement-item {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      font-size: 10.2px;
      color: #475569;
      line-height: 1.55;
    }

    html[data-theme="dark"] #cv-export-root .achievement-item {
      color: #cbd5e1;
    }

    #cv-export-root .achievement-bullet {
      color: #2563eb;
      flex-shrink: 0;
      font-size: 10px;
      line-height: 1.48;
    }

    html[data-theme="dark"] #cv-export-root .achievement-bullet {
      color: #38bdf8;
    }

    #cv-export-root .job-tech-stack {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 7px;
    }

    #cv-export-root .tech-pill {
      font-family: 'JetBrains Mono', 'Cascadia Mono', 'Consolas', monospace;
      font-size: 9.2px;
      font-weight: 500;
      background-color: #ffffff;
      border: 1px solid #cbd5e1;
      color: #475569;
      padding: 4.5px 7.5px;
      border-radius: 4px;
      line-height: 1.38;
    }

    html[data-theme="dark"] #cv-export-root .tech-pill {
      background-color: #1e293b;
      border-color: #334155;
      color: #e2e8f0;
    }

    /* Proyectos Destacados */
    #cv-export-root .projects-grid {
      display: flex;
      flex-direction: column;
      gap: 13px;
    }

    #cv-export-root .project-card {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 13.5px 15px;
    }

    html[data-theme="dark"] #cv-export-root .project-card {
      background-color: #0f172a;
      border-color: #1e293b;
    }

    #cv-export-root .project-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      margin-bottom: 7px;
    }

    #cv-export-root .project-title-wrap {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px;
    }

    #cv-export-root .project-title {
      font-size: 11.8px;
      font-weight: 700;
      color: #1d4ed8;
      line-height: 1.32;
    }

    html[data-theme="dark"] #cv-export-root .project-title {
      color: #38bdf8;
    }

    #cv-export-root .project-sector-tag {
      font-family: 'JetBrains Mono', 'Cascadia Mono', 'Consolas', monospace;
      font-size: 8.8px;
      font-weight: 600;
      padding: 4px 7px;
      border-radius: 4px;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      color: #475569;
      line-height: 1.38;
    }

    html[data-theme="dark"] #cv-export-root .project-sector-tag {
      background: #1e293b;
      border-color: #334155;
      color: #e2e8f0;
    }

    #cv-export-root .project-desc {
      font-size: 10.2px;
      color: #334155;
      line-height: 1.56;
      margin: 0 0 10px 0;
    }

    html[data-theme="dark"] #cv-export-root .project-desc {
      color: #cbd5e1;
    }

    #cv-export-root .project-impact {
      font-size: 9px;
      font-weight: 600;
      color: #059669;
      display: inline-flex;
      align-items: center;
      gap: 3.5px;
      flex-shrink: 0;
      line-height: 1.38;
    }

    html[data-theme="dark"] #cv-export-root .project-impact {
      color: #34d399;
    }

    /* 2 Columnas: Habilidades y Certificaciones/Idiomas */
    #cv-export-root .bottom-cols-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 21px;
      margin-bottom: 21px;
    }

    #cv-export-root .skills-category {
      margin-bottom: 14px;
    }

    #cv-export-root .skills-category:last-child {
      margin-bottom: 0;
    }

    #cv-export-root .skills-cat-title {
      font-family: 'JetBrains Mono', 'Cascadia Mono', 'Consolas', monospace;
      font-size: 9.6px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.35px;
      margin-bottom: 8px;
      color: #2563eb;
      line-height: 1.38;
    }

    html[data-theme="dark"] #cv-export-root .skills-cat-title {
      color: #38bdf8;
    }

    #cv-export-root .skills-badges-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
    }

    #cv-export-root .skill-chip {
      font-size: 9.6px;
      font-weight: 500;
      padding: 5px 8.5px;
      border-radius: 5px;
      line-height: 1.38;
      background-color: #eff6ff;
      border: 1px solid #bfdbfe;
      color: #1d4ed8;
    }

    html[data-theme="dark"] #cv-export-root .skill-chip {
      background-color: rgba(56, 189, 248, 0.12);
      border-color: rgba(56, 189, 248, 0.28);
      color: #38bdf8;
    }

    #cv-export-root .cert-list {
      margin-bottom: 14px;
    }

    #cv-export-root .cert-item {
      background-color: #f8fafc;
      border-left: 3px solid #2563eb;
      border-top: 1px solid #e2e8f0;
      border-right: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
      border-radius: 0 5px 5px 0;
      padding: 8.5px 10px;
      font-size: 9.6px;
      font-weight: 500;
      color: #0f172a;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      line-height: 1.38;
    }

    html[data-theme="dark"] #cv-export-root .cert-item {
      background-color: #0f172a;
      border-left-color: #38bdf8;
      border-top-color: #1e293b;
      border-right-color: #1e293b;
      border-bottom-color: #1e293b;
      color: #f1f5f9;
    }

    #cv-export-root .cert-issuer {
      font-family: 'JetBrains Mono', 'Cascadia Mono', 'Consolas', monospace;
      font-size: 8.6px;
      color: #64748b;
      flex-shrink: 0;
    }

    html[data-theme="dark"] #cv-export-root .cert-issuer {
      color: #94a3b8;
    }

    #cv-export-root .lang-item {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8.5px 10px;
      margin-bottom: 8px;
    }

    html[data-theme="dark"] #cv-export-root .lang-item {
      background-color: #0f172a;
      border-color: #1e293b;
    }

    #cv-export-root .lang-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 9.6px;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 6.5px;
      line-height: 1.38;
    }

    html[data-theme="dark"] #cv-export-root .lang-header {
      color: #f1f5f9;
    }

    #cv-export-root .lang-level-badge {
      font-size: 8.6px;
      color: #64748b;
      font-family: 'JetBrains Mono', 'Cascadia Mono', 'Consolas', monospace;
    }

    html[data-theme="dark"] #cv-export-root .lang-level-badge {
      color: #94a3b8;
    }

    #cv-export-root .lang-track {
      background-color: #e2e8f0;
      border-radius: 3px;
      height: 5px;
      width: 100%;
      overflow: hidden;
    }

    html[data-theme="dark"] #cv-export-root .lang-track {
      background-color: #1e293b;
    }

    #cv-export-root .lang-fill {
      background-color: #2563eb;
      height: 100%;
      border-radius: 3px;
    }

    html[data-theme="dark"] #cv-export-root .lang-fill {
      background-color: #38bdf8;
    }

    /* Referencias */
    #cv-export-root .references-section {
      margin-bottom: 19px;
    }

    #cv-export-root .ref-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 13px;
    }

    #cv-export-root .ref-box {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 11.5px 11.5px;
      font-size: 9.2px;
    }

    html[data-theme="dark"] #cv-export-root .ref-box {
      background-color: #0f172a;
      border-color: #1e293b;
    }

    #cv-export-root .ref-name {
      font-weight: 700;
      color: #0f172a;
      font-size: 9.8px;
      margin-bottom: 5.5px;
      line-height: 1.32;
    }

    html[data-theme="dark"] #cv-export-root .ref-name {
      color: #f8fafc;
    }

    #cv-export-root .ref-role {
      color: #475569;
      font-size: 8.7px;
      line-height: 1.4;
      margin-bottom: 7px;
    }

    html[data-theme="dark"] #cv-export-root .ref-role {
      color: #cbd5e1;
    }

    #cv-export-root .ref-contact {
      color: #64748b;
      font-size: 8.5px;
      font-family: 'JetBrains Mono', 'Cascadia Mono', 'Consolas', monospace;
      display: flex;
      flex-direction: column;
      gap: 4.5px;
      line-height: 1.32;
    }

    html[data-theme="dark"] #cv-export-root .ref-contact {
      color: #94a3b8;
    }

    /* Footer */
    #cv-export-root .cv-footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 11px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 9px;
      color: #94a3b8;
      font-family: 'JetBrains Mono', 'Cascadia Mono', 'Consolas', monospace;
      line-height: 1.38;
    }

    html[data-theme="dark"] #cv-export-root .cv-footer {
      border-top-color: #1e293b;
      color: #64748b;
    }

    @media print {
      body {
        padding: 0 !important;
      }
      .preview-toolbar {
        display: none !important;
      }
      #cv-export-root {
        box-shadow: none !important;
        border-radius: 0 !important;
      }
    }
  </style>
</head>
<body>

  <!-- Barra de Control de Vista Previa (Solo en vista previa, excluida del PDF) -->
  <div class="preview-toolbar">
    <div class="toolbar-controls">
      <!-- Selector de Idioma -->
      <div class="toolbar-group">
        <span class="toolbar-label" id="toolbar-lang-label">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
          <span>Idioma:</span>
        </span>
        <div class="switch-pill-group">
          <button type="button" class="switch-btn active" id="btn-lang-es" onclick="setCvLanguage('es')">
            <span>&#127466;&#127480;</span>
            <span>Espa&ntilde;ol</span>
          </button>
          <button type="button" class="switch-btn" id="btn-lang-en" onclick="setCvLanguage('en')">
            <span>&#127482;&#127480;</span>
            <span>English</span>
          </button>
        </div>
      </div>

      <div class="toolbar-divider"></div>

      <!-- Selector de Tema (Light / Dark) -->
      <div class="toolbar-group">
        <span class="toolbar-label" id="toolbar-theme-label">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
          <span>Tema:</span>
        </span>
        <div class="switch-pill-group">
          <button type="button" class="switch-btn active" id="btn-theme-light" onclick="setCvTheme('light')">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            <span>Light</span>
          </button>
          <button type="button" class="switch-btn" id="btn-theme-dark" onclick="setCvTheme('dark')">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            <span>Dark</span>
          </button>
        </div>
      </div>
    </div>

    <button type="button" class="download-pdf-btn" id="btn-download-pdf" onclick="downloadCurrentCvPdf()">
      <svg id="download-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
      <span id="download-btn-text">Descargar PDF (ES &bull; Light)</span>
    </button>
  </div>

  <!-- Contenedor del Documento CV (#cv-export-root) -->
  <div id="cv-export-root" class="cv-document"></div>

  <script>
    const PORTFOLIO_DATA = __PORTFOLIO_JSON__;
    const AVATAR_DATA_URI = "__AVATAR_DATA_URI__";

    let currentLang = "es";
    let currentTheme = "light";

    const CERTIFICATIONS = [
      { title: "Rest API Intermediate", issuer: "HackerRank" },
      { title: "JavaScript Intermediate", issuer: "HackerRank" },
      { title: "Python & Problem Solving Basic", issuer: "HackerRank" },
      { title: "Java Architecture & Programming", issuer: "Edutin Academy" },
      { title: "Django Enterprise Framework", issuer: "OpenBootcamp" }
    ];

    function renderCvMarkup(lang) {
      const data = PORTFOLIO_DATA[lang] || PORTFOLIO_DATA.es;
      const isEs = lang === "es";

      const labels = {
        profile: isEs ? "Perfil Profesional" : "Professional Profile",
        experience: isEs ? "Experiencia Profesional" : "Professional Experience",
        projects: isEs ? "Proyectos Destacados" : "Featured Projects",
        skills: isEs ? "Habilidades T\u00E9cnicas" : "Technical Skills",
        backend: isEs ? "Backend & Arquitectura" : "Backend & Architecture",
        frontend: isEs ? "Frontend & UI Moderno" : "Frontend & Modern UI",
        database: isEs ? "Bases de Datos & Cloud" : "Databases & Cloud",
        certifications: isEs ? "Certificados & Cursos" : "Certifications & Courses",
        references: isEs ? "Referencias Profesionales" : "Professional References",
        native: isEs ? "Nativo" : "Native",
        spanish: isEs ? "Espa\u00F1ol" : "Spanish",
        english: "English"
      };

      const root = document.getElementById("cv-export-root");
      if (!root) return;

      const expHtml = (data.experience || []).map(function(exp) {
        const achHtml = (exp.achievements || []).map(function(ach) {
          return '<div class="achievement-item"><span class="achievement-bullet">&#9656;</span><span>' + ach + '</span></div>';
        }).join("");
        return (
          '<div class="timeline-job">' +
            '<div class="timeline-node"></div>' +
            '<div class="job-top">' +
              '<div>' +
                '<h3 class="job-role">' + exp.position + '</h3>' +
                '<div class="job-company-row">' +
                  '<span class="job-company">' + exp.company + '</span>' +
                  '<span style="opacity:0.4;">&bull;</span>' +
                  '<span class="job-location">' +
                    '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>' +
                    exp.location +
                  '</span>' +
                '</div>' +
              '</div>' +
              '<span class="job-period-pill">' + exp.period + '</span>' +
            '</div>' +
            '<p class="job-desc">' + exp.description + '</p>' +
            (achHtml ? '<div class="achievements-list">' + achHtml + '</div>' : '') +
          '</div>'
        );
      }).join("");

      const projHtml = (data.projects || []).map(function(proj) {
        const techHtml = (proj.tech || []).map(function(t) {
          return '<span class="tech-pill">' + t + '</span>';
        }).join("");
        return (
          '<div class="project-card">' +
            '<div class="project-header">' +
              '<div class="project-title-wrap">' +
                '<h3 class="project-title">' + proj.title + '</h3>' +
                (proj.sector ? '<span class="project-sector-tag">' + proj.sector + '</span>' : '') +
              '</div>' +
            '</div>' +
            '<p class="project-desc">' + proj.description + '</p>' +
            '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">' +
              '<div class="job-tech-stack">' + techHtml + '</div>' +
              (proj.impact ? (
                '<span class="project-impact">' +
                  '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>' +
                  proj.impact +
                '</span>'
              ) : '') +
            '</div>' +
          '</div>'
        );
      }).join("");

      const backendSkillsHtml = ((data.about && data.about.skills && data.about.skills.backend) || []).map(function(s) {
        return '<span class="skill-chip">' + s.name + '</span>';
      }).join("");

      const frontendSkillsHtml = ((data.about && data.about.skills && data.about.skills.frontend) || []).map(function(s) {
        return '<span class="skill-chip">' + s.name + '</span>';
      }).join("");

      const servicesSkillsHtml = ((data.about && data.about.skills && data.about.skills.services) || []).map(function(s) {
        return '<span class="skill-chip">' + s.name + '</span>';
      }).join("");

      const certsHtml = CERTIFICATIONS.map(function(c) {
        return '<div class="cert-item"><span>' + c.title + '</span><span class="cert-issuer">' + c.issuer + '</span></div>';
      }).join("");

      const refsHtml = (data.references || []).map(function(ref) {
        return (
          '<div class="ref-box">' +
            '<div class="ref-name">' + ref.name + '</div>' +
            '<div class="ref-role">' + ref.position + '</div>' +
            '<div class="ref-contact">' +
              '<span>' + ref.phone + '</span>' +
              '<span>' + ref.email + '</span>' +
            '</div>' +
          '</div>'
        );
      }).join("");

      root.innerHTML =
        '<header class="header-card">' +
          '<div class="avatar-wrapper">' +
            '<img src="' + AVATAR_DATA_URI + '" alt="' + data.personal.name + '" class="avatar-img" />' +
          '</div>' +
          '<div class="header-info">' +
            '<h1 class="header-name">' + data.personal.name + '</h1>' +
            '<div class="header-role">Full Stack Developer</div>' +
            '<div class="header-contacts">' +
              '<span class="meta-item">' +
                '<svg class="meta-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>' +
                '<span>' + data.personal.location + '</span>' +
              '</span>' +
              '<a href="mailto:' + data.personal.email + '" class="meta-item">' +
                '<svg class="meta-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>' +
                '<span>' + data.personal.email + '</span>' +
              '</a>' +
              '<a href="tel:' + data.personal.phone.replace(/\s+/g, '') + '" class="meta-item">' +
                '<svg class="meta-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' +
                '<span>' + data.personal.phone + '</span>' +
              '</a>' +
              '<a href="https://' + data.personal.linkedin + '" target="_blank" class="meta-item">' +
                '<svg class="meta-icon" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.63 1.63 0 0 0-1.63 1.63c0 .9.73 1.63 1.63 1.63.9 0 1.63-.73 1.63-1.63 0-.9-.73-1.63-1.63-1.63Z"/></svg>' +
                '<span>' + data.personal.linkedin + '</span>' +
              '</a>' +
              '<a href="https://' + data.personal.github + '" target="_blank" class="meta-item">' +
                '<svg class="meta-icon" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"/></svg>' +
                '<span>' + data.personal.github + '</span>' +
              '</a>' +
            '</div>' +
          '</div>' +
        '</header>' +

        '<section class="cv-section">' +
          '<div class="section-title-wrap">' +
            '<span class="section-icon"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>' +
            '<h2 class="section-title-text">' + labels.profile + '</h2>' +
            '<div class="section-divider"></div>' +
          '</div>' +
          '<div class="profile-card"><p>' + data.personal.bio + '</p></div>' +
        '</section>' +

        '<section class="cv-section">' +
          '<div class="section-title-wrap">' +
            '<span class="section-icon"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></span>' +
            '<h2 class="section-title-text">' + labels.experience + '</h2>' +
            '<div class="section-divider"></div>' +
          '</div>' +
          '<div class="timeline-container">' + expHtml + '</div>' +
        '</section>' +

        '<section class="cv-section">' +
          '<div class="section-title-wrap">' +
            '<span class="section-icon"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></span>' +
            '<h2 class="section-title-text">' + labels.projects + '</h2>' +
            '<div class="section-divider"></div>' +
          '</div>' +
          '<div class="projects-grid">' + projHtml + '</div>' +
        '</section>' +

        '<div class="bottom-cols-grid">' +
          '<div>' +
            '<div class="section-title-wrap">' +
              '<span class="section-icon"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 8 3 3-3 3"/><line x1="14" x2="16" y1="17" y2="17"/></svg></span>' +
              '<h2 class="section-title-text">' + labels.skills + '</h2>' +
              '<div class="section-divider"></div>' +
            '</div>' +
            '<div class="skills-category"><div class="skills-cat-title">' + labels.backend + '</div><div class="skills-badges-wrap">' + backendSkillsHtml + '</div></div>' +
            '<div class="skills-category"><div class="skills-cat-title">' + labels.frontend + '</div><div class="skills-badges-wrap">' + frontendSkillsHtml + '</div></div>' +
            '<div class="skills-category"><div class="skills-cat-title">' + labels.database + '</div><div class="skills-badges-wrap">' + servicesSkillsHtml + '</div></div>' +
          '</div>' +
          '<div>' +
            '<div class="section-title-wrap">' +
              '<span class="section-icon"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg></span>' +
              '<h2 class="section-title-text">' + labels.certifications + '</h2>' +
              '<div class="section-divider"></div>' +
            '</div>' +
            '<div class="cert-list">' + certsHtml + '</div>' +
            '<div>' +
              '<div class="lang-item"><div class="lang-header"><span>' + labels.spanish + '</span><span class="lang-level-badge">' + labels.native + ' \u2022 100%</span></div><div class="lang-track"><div class="lang-fill" style="width: 100%;"></div></div></div>' +
              '<div class="lang-item"><div class="lang-header"><span>' + labels.english + '</span><span class="lang-level-badge">B2 Professional \u2022 75%</span></div><div class="lang-track"><div class="lang-fill" style="width: 75%;"></div></div></div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<section class="references-section">' +
          '<div class="section-title-wrap">' +
            '<span class="section-icon"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>' +
            '<h2 class="section-title-text">' + labels.references + '</h2>' +
            '<div class="section-divider"></div>' +
          '</div>' +
          '<div class="ref-grid">' + refsHtml + '</div>' +
        '</section>' +

        '<footer class="cv-footer">' +
          '<span>' + data.personal.name + ' \u2022 Full Stack Developer</span>' +
          '<span>' + data.personal.email + ' \u2022 ' + data.personal.phone + '</span>' +
        '</footer>';
    }

    function updateToolbarLabels() {
      const isEs = currentLang === "es";
      const themeCap = currentTheme === "dark" ? "Dark" : "Light";

      const langLabelEl = document.querySelector("#toolbar-lang-label span");
      if (langLabelEl) {
        langLabelEl.textContent = isEs ? "Idioma:" : "Language:";
      }

      const themeLabelEl = document.querySelector("#toolbar-theme-label span");
      if (themeLabelEl) {
        themeLabelEl.textContent = isEs ? "Tema:" : "Theme:";
      }

      const dlText = document.getElementById("download-btn-text");
      if (dlText) {
        dlText.textContent = isEs
          ? "Descargar PDF (" + currentLang.toUpperCase() + " \u2022 " + themeCap + ")"
          : "Download PDF (" + currentLang.toUpperCase() + " \u2022 " + themeCap + ")";
      }
    }

    function setCvLanguage(lang) {
      currentLang = lang === "en" ? "en" : "es";
      document.documentElement.lang = currentLang;

      const btnEs = document.getElementById("btn-lang-es");
      const btnEn = document.getElementById("btn-lang-en");
      if (btnEs && btnEn) {
        btnEs.classList.toggle("active", currentLang === "es");
        btnEn.classList.toggle("active", currentLang === "en");
      }

      updateToolbarLabels();
      renderCvMarkup(currentLang);
    }

    function setCvTheme(theme) {
      currentTheme = theme === "dark" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", currentTheme);

      const btnLight = document.getElementById("btn-theme-light");
      const btnDark = document.getElementById("btn-theme-dark");
      if (btnLight && btnDark) {
        btnLight.classList.toggle("active", currentTheme === "light");
        btnDark.classList.toggle("active", currentTheme === "dark");
      }

      updateToolbarLabels();
    }

    async function downloadCurrentCvPdf() {
      const btn = document.getElementById("btn-download-pdf");
      const dlText = document.getElementById("download-btn-text");
      const suffix = currentTheme === "dark" ? "_Dark" : "";
      const filename = "Mateo_Padilla_CV_" + currentLang.toUpperCase() + suffix + ".pdf";

      if (btn) btn.disabled = true;
      if (dlText) {
        dlText.textContent = currentLang === "es" ? "Generando PDF..." : "Generating PDF...";
      }

      const sourceRoot = document.getElementById("cv-export-root");
      if (typeof html2pdf === "undefined" || !sourceRoot) {
        window.print();
        if (btn) btn.disabled = false;
        updateToolbarLabels();
        return;
      }

      // 1. Contenedor temporal aislado en (0,0) para evitar desfases de scroll, toolbar y margin auto
      const renderContainer = document.createElement("div");
      renderContainer.id = "cv-pdf-render-container";
      renderContainer.style.cssText = "position: fixed; left: 0; top: 0; width: 794px; z-index: -9999; opacity: 0; pointer-events: none;";

      try {
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }

        // 2. Clonar el elemento de CV con alineacion exacta a (0,0)
        const clone = sourceRoot.cloneNode(true);
        clone.style.margin = "0";
        clone.style.boxShadow = "none";
        clone.style.borderRadius = "0";
        clone.style.width = "794px";
        clone.style.maxWidth = "794px";
        clone.setAttribute("data-theme", currentTheme);

        renderContainer.appendChild(clone);
        document.body.appendChild(renderContainer);

        await new Promise(function(r) { setTimeout(r, 150); });

        const rect = clone.getBoundingClientRect();
        const widthPx = 794;
        const heightPx = Math.ceil(Math.max(clone.scrollHeight, rect.height, 1123));
        const pdfWidthMm = 210;
        const pdfHeightMm = Math.ceil((heightPx * pdfWidthMm) / widthPx) + 2;

        await html2pdf()
          .set({
            margin: 0,
            filename: filename,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: {
              scale: 2,
              useCORS: true,
              allowTaint: true,
              backgroundColor: currentTheme === "dark" ? "#0b1120" : "#ffffff",
              width: widthPx,
              height: heightPx,
              windowWidth: widthPx,
              windowHeight: heightPx,
              scrollX: 0,
              scrollY: 0,
              x: 0,
              y: 0
            },
            jsPDF: {
              unit: "mm",
              format: [pdfWidthMm, pdfHeightMm],
              orientation: "portrait"
            },
            pagebreak: { mode: ["avoid-all"] }
          })
          .from(clone)
          .save();
      } catch (err) {
        console.error("Error generating PDF:", err);
        window.print();
      } finally {
        if (renderContainer.parentNode) {
          renderContainer.parentNode.removeChild(renderContainer);
        }
        if (btn) btn.disabled = false;
        updateToolbarLabels();
      }
    }

    // Inicializar segun query params ?lang=es|en y ?theme=light|dark
    (function initPreview() {
      let initialLang = "es";
      let initialTheme = "light";
      try {
        const params = new URLSearchParams(window.location.search);
        const langParam = params.get("lang");
        const themeParam = params.get("theme");
        if (langParam === "en" || langParam === "es") {
          initialLang = langParam;
        }
        if (themeParam === "dark" || themeParam === "light") {
          initialTheme = themeParam;
        }
      } catch (e) {}
      setCvTheme(initialTheme);
      setCvLanguage(initialLang);
    })();
  </script>
</body>
</html>
'@

$htmlContent = $htmlTemplate.Replace("__PORTFOLIO_JSON__", $portfolioJsonRaw).Replace("__AVATAR_DATA_URI__", $avatarDataUri).Replace("__FAVICON_DATA_URI__", $faviconDataUri)

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText((Join-Path $PWD "cv.html"), $htmlContent, $utf8NoBom)
[System.IO.File]::WriteAllText((Join-Path $PWD "cv-preview.html"), $htmlContent, $utf8NoBom)
[System.IO.File]::WriteAllText((Join-Path $PWD "public\cv-preview.html"), $htmlContent, $utf8NoBom)
if (Test-Path (Join-Path $PWD "out")) {
    [System.IO.File]::WriteAllText((Join-Path $PWD "out\cv-preview.html"), $htmlContent, $utf8NoBom)
}
[System.IO.File]::WriteAllText("C:\Users\mateo\.gemini\antigravity\brain\11868d65-8eb8-49d2-a890-a8c031297038\cv_preview.html", $htmlContent, $utf8NoBom)

Write-Output "Generated dynamic bilingual Light/Dark CV preview files with +1px extra Y-axis spacing successfully."
