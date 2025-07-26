import httpx
import os

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

def get_ai_response(prompt: str) -> str:
    response = httpx.post(
        "https://api.groq.com/v1/chat/completions",
        headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
        json={
            "model": "mixtral-8x7b-32768",
            "messages": [{"role": "user", "content": prompt}]
        }
    )
    data = response.json()
    return data["choices"][0]["message"]["content"]
