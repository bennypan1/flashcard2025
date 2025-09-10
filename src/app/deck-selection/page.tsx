"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function DeckSelectionPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DeckSelection />
        </Suspense>
    );
}

function DeckSelection() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const mode = searchParams.get("mode"); // "session" or "editor"

    const [decks, setDecks] = useState<{ name: string; cards: any[] }[]>([]);
    const [selectedDeck, setSelectedDeck] = useState<string | null>(null);
    const [newDeckName, setNewDeckName] = useState("");

    useEffect(() => {
        const saved = localStorage.getItem("flashcardDecks");
        if (saved) setDecks(JSON.parse(saved));
        else setDecks([]);
    }, []);

    // Determine if selected deck is empty
    const selectedDeckObj = decks.find((d) => d.name === selectedDeck);
    const isDeckEmpty = selectedDeckObj ? selectedDeckObj.cards.length === 0 : false;

    const startOrEditDeck = () => {
        if (!selectedDeck) return;
        if (mode === "session") router.push(`/session?deck=${encodeURIComponent(selectedDeck)}`);
        else router.push(`/editor?deck=${encodeURIComponent(selectedDeck)}`);
    };

    const createDeck = () => {
        if (!newDeckName) return;
        const newDeck = { name: newDeckName, cards: [] };
        const updatedDecks = [...decks, newDeck];
        setDecks(updatedDecks);
        localStorage.setItem("flashcardDecks", JSON.stringify(updatedDecks));
        setSelectedDeck(newDeckName);
        setNewDeckName("");
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-6">
            <h1 className="text-4xl font-bold mb-6">
                {mode === "session" ? "Select a Deck to Study" : "Select a Deck to Edit"}
            </h1>

            <div className="flex flex-col gap-4 w-full max-w-md">
                {decks.length === 0 && mode === "session" && (
                    <p className="text-center text-red-500">
                        No decks available. Please go create a deck first.
                    </p>
                )}

                {decks.map((deck, i) => (
                    <div key={i} className="flex items-center w-full max-w-md mb-2">
                        {/* Gray/blue box for deck selection */}
                        <button
                            className={`flex-1 text-left px-4 py-2 rounded ${selectedDeck === deck.name
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-black"
                                }`}
                            onClick={() => setSelectedDeck(deck.name)}
                        >
                            {deck.name}
                        </button>

                        {/* Delete button outside gray/blue box */}
                        {mode === "editor" && (
                            <button
                                onClick={() => {
                                    if (confirm(`Are you sure you want to delete the deck "${deck.name}"?`)) {
                                        const updatedDecks = decks.filter((d) => d.name !== deck.name);
                                        setDecks(updatedDecks);
                                        localStorage.setItem("flashcardDecks", JSON.stringify(updatedDecks));

                                        if (selectedDeck === deck.name) setSelectedDeck(null);
                                    }
                                }}
                                className="ml-3 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Only show “Create Deck” input & button if mode is editor */}
            {mode === "editor" && (
                <form
                    className="flex mt-4 gap-2 w-full max-w-md"
                    onSubmit={(e) => {
                        e.preventDefault();
                        createDeck();
                    }}
                >
                    <input
                        type="text"
                        placeholder="New Deck Name"
                        value={newDeckName}
                        onChange={(e) => setNewDeckName(e.target.value)}
                        className="p-2 border rounded flex-1"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                        Create Deck
                    </button>
                </form>
            )}

            {/* Warning if selected deck is empty in session mode */}
            {mode === "session" && isDeckEmpty && (
                <p className="text-center text-red-500 mt-2">
                    This deck has no cards. Please go create some in the editor.
                </p>
            )}

            <button
                onClick={startOrEditDeck}
                disabled={!selectedDeck || (mode === "session" && isDeckEmpty)}
                className="mt-6 px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50"
            >
                {mode === "session" ? "Start Session" : "Edit Deck"}
            </button>

            <button
                onClick={() => router.push("/")}
                className="fixed bottom-[80px] left-[24px] px-4 py-2 bg-gray-400 bg-opacity-70 text-white rounded-lg shadow-md hover:bg-gray-600 transition"
            >
                Home
            </button>
        </main>
    );
}
