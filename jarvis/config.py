import json, os
from pathlib import Path

class Config:
    def __init__(self, data=None):
        data = data or {}
        self.api_key = data.get("api_key", "")
        self.model = data.get("model", "gpt-4o-mini")
        self.language = data.get("language", "ru")
        self.voice = data.get("voice", "alloy")
        self.input_device = data.get("input_device")
        self.output_device = data.get("output_device")
        self.sample_rate = int(data.get("sample_rate", 16000))
        self.history_limit = int(data.get("history_limit", 24))

    @staticmethod
    def path():
        return Path(os.getenv("APPDATA", Path.home())) / "JarvisAssistant" / "config.json"

    @classmethod
    def load(cls):
        p = cls.path()
        try: return cls(json.loads(p.read_text(encoding="utf-8")))
        except Exception: return cls()

    def save(self):
        p = self.path(); p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(json.dumps(self.__dict__, ensure_ascii=False, indent=2), encoding="utf-8")
