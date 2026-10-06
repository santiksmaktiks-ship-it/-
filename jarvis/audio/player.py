import tempfile, os, requests
class AudioPlayer:
    def __init__(self, config): self.config=config
    def play_file(self, path):
        try:
            from playsound3 import playsound; playsound(path)
        except Exception: pass
    def temp_path(self): return tempfile.mktemp(suffix=".mp3")
