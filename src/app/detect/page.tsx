"use client";

import { useState } from "react";
import { detectAI } from "@/utils/detectAI";

export default function DetectPage() {
    const [text, setText] = useState("");
    const [result, setResult] = useState("");

    async function handleDetect() {
        const response = await detectAI(text);
        setResult(response.result);
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">AI Detection Tool</h1>
            <textarea 
                className="w-full border p-2 my-4" 
                placeholder="Enter text to analyze..." 
                value={text} 
                onChange={(e) => setText(e.target.value)}
            />
            <button className="bg-blue-500 text-white px-4 py-2" onClick={handleDetect}>
                Analyze
            </button>
            {result && <p className="mt-4">Result: {result}</p>}
        </div>
    );
}
