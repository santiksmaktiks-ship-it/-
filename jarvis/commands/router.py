class CommandRouter:
    def route(self,text):
        t=text.lower().strip()
        if t in {"очисти чат","clear chat"}: return "clear_chat"
        if t in {"настройки","settings"}: return "settings"
        return None
