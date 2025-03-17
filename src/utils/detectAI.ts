import axios from "axios";

export async function detectAI(text: string) {
    const response = await axios.post(
        "https://api.undetectable.ai/detect",
        { text },
        { headers: { Authorization: `Bearer ${process.env.AI_DETECTION_API_KEY}` } }
    );
    
    return response.data;
}
