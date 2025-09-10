"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cards as defaultCards } from "../../data/cards";

interface Card {
    english: string;
    pinyin: string;
    character: string;
}

export default function EditorPage() {
    const router = useRouter();
    const [cards, setCards] = useState<Card[]>([]);

    // Load cards from localStorage or fallback to default
    useEffect(() => {
        const saved = localStorage.getItem("flashcards");
        if (saved) {
            setCards(JSON.parse(saved));
        } else {
            setCards(defaultCards);
        }
    }, []);

    // Save to localStorage whenever cards change
    useEffect(() => {
        localStorage.setItem("flashcards", JSON.stringify(cards));
    }, [cards]);

    const addCard = () => {
        setCards([...cards, { english: "", pinyin: "", character: "" }]);
    };

    const updateCard = (index: number, field: keyof Card, value: string) => {
        const newCards = [...cards];
        newCards[index][field] = value;
        setCards(newCards);
    };

    const deleteCard = (index: number) => {
        const newCards = [...cards];
        newCards.splice(index, 1);
        setCards(newCards);
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-background text-foreground">
            <h1 className="text-4xl font-bold mb-6">Edit Flashcards</h1>

            <div className="w-full max-w-2xl space-y-4">
                {cards.map((card, i) => (
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
