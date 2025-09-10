"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Card {
  english: string;
  pinyin: string;
  character: string;
}

interface Deck {
  name: string;
  cards: Card[];
}

export default function EditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deckName = searchParams.get("deck");

  const [decks, setDecks] = useState<Deck[]>([]);
  const [deck, setDeck] = useState<Deck | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("flashcardDecks");
    const loadedDecks: Deck[] = saved ? JSON.parse(saved) : [];
    setDecks(loadedDecks);

    const selected = loadedDecks.find((d) => d.name === deckName) || null;
    setDeck(selected);
  }, [deckName]);

  const updateCard = (index: number, field: keyof Card, value: string) => {
    if (!deck) return;
    const newCards = [...deck.cards];
    newCards[index][field] = value;
    const updatedDeck = { ...deck, cards: newCards };
    setDeck(updatedDeck);
    saveDeck(updatedDeck);
  };

  const addCard = () => {
    if (!deck) return;
    const updatedDeck = { ...deck, cards: [...deck.cards, { english: "", pinyin: "", character: "" }] };
    setDeck(updatedDeck);
    saveDeck(updatedDeck);
  };

  const deleteCard = (index: number) => {
    if (!deck) return;
    const newCards = [...deck.cards];
    newCards.splice(index, 1);
    const updatedDeck = { ...deck, cards: newCards };
    setDeck(updatedDeck);
    saveDeck(updatedDeck);
  };

  const saveDeck = (updatedDeck: Deck) => {
    const updatedDecks = decks.map((d) => (d.name === updatedDeck.name ? updatedDeck : d));
    setDecks(updatedDecks);
    localStorage.setItem("flashcardDecks", JSON.stringify(updatedDecks));
  };

  if (!deck) return <p>Loading deck...</p>;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-4xl font-bold mb-6">{deck.name} - Edit Cards</h1>

      <div className="w-full max-w-2xl space-y-4">
        {deck.cards.map((card, i) => (
          <div key={i} className="p-4 border rounded-lg bg-white dark:bg-neutral-900">
            <input
              type="text"
              placeholder="English"
              value={card.english}
              onChange={(e) => updateCard(i, "english", e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Pinyin"
              value={card.pinyin}
              onChange={(e) => updateCard(i, "pinyin", e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Character"
              value={card.character}
              onChange={(e) => updateCard(i, "character", e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
            <button
              onClick={() => deleteCard(i)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        ))}

        <button
          onClick={addCard}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Add Card
        </button>
      </div>

      <button
        onClick={() => router.push("/")}
        className="mt-6 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
      >
        Home
      </button>
    </main>
  );
}
