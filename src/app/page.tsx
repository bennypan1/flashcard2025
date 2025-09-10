"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [decks, setDecks] = useState<{ name: string }[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("flashcardDecks");
    if (saved) setDecks(JSON.parse(saved));
    else setDecks([]);
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-6">
      <h1 className="text-5xl font-bold mb-6">Flashcard 2025</h1>

      <div className="flex flex-row gap-4">
        <button
          onClick={() => router.push("/deck-selection?mode=session")}
          className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Start Session
        </button>

        <button
          onClick={() => router.push("/deck-selection?mode=editor")}
          className="px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
        >
          Add / Edit Flashcards
        </button>
      </div>
    </main>
  );
}
