"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cards } from "../../data/cards";

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

    const [cards, setCards] = useState<typeof import("../../data/cards").cards>([]);
    const [current, setCurrent] = useState(0);
    const [step, setStep] = useState<"english" | "pinyin" | "character">("english");

    // Load cards from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("flashcards");
        if (saved) {
            const loaded = JSON.parse(saved);
            setCards(shuffleArray(loaded)); // <-- shuffle here
        } else {
            // fallback to default cards
            import("../../data/cards").then((module) => setCards(module.cards));
        }
    }, []);

    const nextStep = () => {
        if (step === "english") {
            setStep("pinyin");
        } else if (step === "pinyin") {
            setStep("character");
        } else {
            if (current < cards.length - 1) {
                setStep("english");
                setCurrent((prev) => prev + 1);
            }
            // else do nothing (last card reached)
        }
    };

    const prevStep = () => {
        if (step === "character") {
            setStep("pinyin");
        } else if (step === "pinyin") {
            setStep("english");
        } else {
            if (current > 0) {
                setCurrent((prev) => prev - 1);
                setStep("character");
            }
            // else do nothing (first card)
        }
    };

    const card = cards[current];

    if (!card) {
        return (
            <main className="flex items-center justify-center min-h-screen">
                <p>Loading cards...</p>
            </main>
        );
    }

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-6 relative">
            {/* Flashcard box */}
            <div className="relative w-full max-w-md p-6 rounded-xl shadow-lg bg-white dark:bg-neutral-900 text-center">
                <div className="text-3xl font-semibold mb-6 space-y-2">
                    <p className="text-lg font-medium">{current + 1}/{cards.length}</p>
                    <p>{card.english}</p>
                    {step !== "english" && <p>{card.pinyin}</p>}
                    {step === "character" && <p>{card.character}</p>}
                </div>

                {/* Back button — only show if not the first card */}
                {current > 0 || step !== "english" ? (
                    <button
                        onClick={prevStep}
                        className="absolute left-[-60px] top-1/2 -translate-y-1/2 px-6 py-8 bg-gray-500 text-white rounded-lg shadow-lg hover:bg-gray-600 transition text-xl font-bold"
                    >
                        ◀ Back
                    </button>
                ) : null}

                {/* Next button — only show if not the last card or not on last step */}
                {!(current === cards.length - 1 && step === "character") ? (
                    <button
                        onClick={nextStep}
                        className="absolute right-[-60px] top-1/2 -translate-y-1/2 px-6 py-8 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition text-xl font-bold"
                    >
                        {step === "character" ? "Next Card ▶" : "Next ▶"}
                    </button>
                ) : null}
            </div>

            {/* Home button fixed at bottom-left */}
            <button
                onClick={() => router.push("/")}
                className="fixed bottom-[80px] left-[24px] px-4 py-2 bg-gray-400 bg-opacity-70 text-white rounded-lg shadow-md hover:bg-opacity-100 transition"
            >
                Home
            </button>
        </main>
    );
}
