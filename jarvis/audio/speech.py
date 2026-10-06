import os
class Speech:
    def __init__(self, ai, player): self.ai=ai; self.player=player
    def say(self, text):
        path=self.player.temp_path(); self.ai.speak(text,path); self.player.play_file(path)
        try: os.remove(path)
        except OSError: pass
