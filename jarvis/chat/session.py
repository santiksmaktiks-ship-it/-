class ChatSession:
    def __init__(self, ai):
        self.ai=ai
        self.messages=[{"role":"system","content":"Ты JARVIS, умный персональный AI-ассистент. Отвечай точно, полезно и по делу на языке пользователя."}]
    def ask(self, text):
        self.messages.append({"role":"user","content":text})
        try:
            answer=self.ai.chat(self.messages)
            self.messages.append({"role":"assistant","content":answer})
            self.messages=self.messages[:1]+self.messages[-48:]
            return answer
        except Exception:
            self.messages.pop(); raise
    def clear(self): self.messages=self.messages[:1]
