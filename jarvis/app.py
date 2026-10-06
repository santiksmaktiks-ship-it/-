import tkinter as tk
from .config import Config
from .ai.client import AIClient
from .audio.microphone import Microphone
from .audio.player import AudioPlayer
from .audio.devices import AudioDevices
from .chat.session import ChatSession
from .ui.window import JarvisWindow

class JarvisApp:
    def __init__(self):
        self.config = Config.load()
        self.ai = AIClient(self.config)
        self.mic = Microphone(self.config)
        self.player = AudioPlayer(self.config)
        self.devices = AudioDevices()
        self.chat = ChatSession(self.ai)
        self.window = JarvisWindow(self)

    def run(self):
        self.window.run()

    def ask(self, text):
        return self.chat.ask(text)
