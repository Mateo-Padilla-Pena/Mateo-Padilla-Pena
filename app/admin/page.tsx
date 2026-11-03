"use client";

import { useAuth } from "@/lib/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import portfolioData from "@/data/portfolio.json";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // A single JSON string to edit the whole data structure for simplicity and flexibility
  const [dataEs, setDataEs] = useState("");
  const [dataEn, setDataEn] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/admin/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const docRef = doc(db, "portfolio", "content");
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setDataEs(JSON.stringify(data.es, null, 2));
            setDataEn(JSON.stringify(data.en, null, 2));
          } else {
            // Initialize with local JSON as default
            setDataEs(JSON.stringify(portfolioData, null, 2));
            setDataEn(JSON.stringify(portfolioData, null, 2));
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const parsedEs = JSON.parse(dataEs);
      const parsedEn = JSON.parse(dataEn);
      await setDoc(doc(db, "portfolio", "content"), {
        es: parsedEs,
        en: parsedEn,
        updatedAt: new Date(),
      });
      setMessage("Saved successfully!");
    } catch (error: any) {
      setMessage(`Error: ${error.message || "Invalid JSON format"}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Admin</h1>
          <button
            onClick={() => signOut(auth)}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Sign Out
          </button>
        </div>

        {message && (
          <div className={`p-4 rounded-lg mb-6 ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Spanish Version */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">🇪🇸</span> Spanish Content
            </h2>
            <textarea
              className="w-full h-[600px] p-4 font-mono text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-gray-50"
              value={dataEs}
              onChange={(e) => setDataEs(e.target.value)}
              spellCheck={false}
            />
          </div>

          {/* English Version */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">🇺🇸</span> English Content
            </h2>
            <textarea
              className="w-full h-[600px] p-4 font-mono text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-gray-50"
              value={dataEn}
              onChange={(e) => setDataEn(e.target.value)}
              spellCheck={false}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white font-medium py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
