"use client";

import { useState, useRef, useEffect } from "react";
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

// Shuffle function
function shuffleArray<T>(array: T[]): T[] {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
}

export default function SessionPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const deckName = searchParams.get("deck");

    // --- State & refs ---
    const [cards, setCards] = useState<Card[]>([]);
    const [current, setCurrent] = useState(0);
    const [step, setStep] = useState<"english" | "pinyin" | "character">("english");
    const [deckExists, setDeckExists] = useState(true);

    const spacePressed = useRef(false);
    const leftPressed = useRef(false);
    const rightPressed = useRef(false);

    // --- Load deck ---
    useEffect(() => {
        const saved = localStorage.getItem("flashcardDecks");
        const decks: Deck[] = saved ? JSON.parse(saved) : [];
        const deck = decks.find((d) => d.name === deckName);

        if (!deck) {
            setDeckExists(false);
            return;
        }

        setDeckExists(true);
        setCards(deck.cards.length === 0 ? [] : shuffleArray(deck.cards));
    }, [deckName]);

    // --- Navigation functions ---
    const nextStep = () => {
        if (step === "english") setStep("pinyin");
        else if (step === "pinyin") setStep("character");
        else if (current < cards.length - 1) {
            setCurrent(current + 1);
            setStep("english");
        }
    };

    const prevStep = () => {
        if (step === "character") setStep("pinyin");
        else if (step === "pinyin") setStep("english");
        else if (current > 0) {
            setCurrent(current - 1);
            setStep("character");
        }
    };

    // --- Keyboard navigation ---
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight" && !rightPressed.current) {
                if (!(current === cards.length - 1 && step === "character")) nextStep();
                rightPressed.current = true;
            }
            if (e.key === "ArrowLeft" && !leftPressed.current) {
                if (!(current === 0 && step === "english")) prevStep();
                leftPressed.current = true;
            }
            if (e.code === "Space" && !spacePressed.current) {
                e.preventDefault();
                if (!(current === cards.length - 1 && step === "character")) nextStep();
                spacePressed.current = true;
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") rightPressed.current = false;
            if (e.key === "ArrowLeft") leftPressed.current = false;
            if (e.code === "Space") spacePressed.current = false;
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [current, step, cards]);

    // --- Conditional rendering ---
    let content;

    if (!deckName || !deckExists) {
        content = (
            <div className="text-center mt-6">
                <p className="text-red-500">This deck does not exist.</p>
                <button
                    onClick={() => router.push("/deck-selection?mode=session")}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                    Go Back
                </button>
            </div>
        );
    } else if (cards.length === 0) {
        content = (
            <div className="text-center mt-6">
                <p className="text-red-500">
                    This deck has no cards. Please go add some in the editor.
                </p>
                <button
                    onClick={() =>
                        router.push(`/editor?deck=${encodeURIComponent(deckName)}`)
                    }
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                    Edit Deck
                </button>
            </div>
        );
    } else {
        const card = cards[current];
        content = (
            <div className="relative w-full max-w-md p-6 rounded-xl shadow-lg bg-white dark:bg-neutral-900 text-center">
                <h2 className="text-2xl font-bold mb-4">Deck: {deckName}</h2>

                {/* Progress + card */}
                <div className="text-3xl font-semibold mb-6 space-y-2">
                    <p className="text-lg font-medium">
                        {current + 1}/{cards.length}
                    </p>
                    <p>{card.english}</p>
                    {step !== "english" && <p>{card.pinyin}</p>}
                    {step === "character" && <p>{card.character}</p>}
                </div>

                {/* Navigation buttons */}
                {!(current === 0 && step === "english") && (
                    <button
                        onClick={prevStep}
                        className="absolute left-[-60px] top-1/2 -translate-y-1/2 px-6 py-8 bg-gray-500 text-white rounded-lg shadow-lg hover:bg-gray-600 transition text-xl font-bold"
                    >
                        ◀ Back
                    </button>
                )}

                {!(current === cards.length - 1 && step === "character") && (
                    <button
                        onClick={nextStep}
                        className="absolute right-[-60px] top-1/2 -translate-y-1/2 px-6 py-8 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition text-xl font-bold"
                    >
                        {step === "character" ? "Next Card ▶" : "Next ▶"}
                    </button>
                )}
            </div>
        );
    }

    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-6 relative">
            {content}

            {/* Back to Deck Selection button */}
            <button
                onClick={() => router.push("/deck-selection?mode=session")}
                className="absolute top-6 left-6 px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition"
            >
                Back to Deck Selection
            </button>

            {/* Home button */}
            <button
                onClick={() => router.push("/")}
                className="fixed bottom-[80px] left-[24px] px-4 py-2 bg-gray-400 bg-opacity-70 text-white rounded-lg shadow-md hover:bg-gray-600 transition"
            >
                Home
            </button>
        </main>
    );
}
