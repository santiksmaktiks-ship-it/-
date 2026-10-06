class SecretStore:
    @staticmethod
    def mask(value): return ("*" * max(0,len(value)-4) + value[-4:]) if value else ""
