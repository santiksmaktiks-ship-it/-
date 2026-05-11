/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#0c0f14",
          card: "#161b22",
          cardHover: "#1c222c",
          panel: "#10141a",
          inset: "#0f141b",
        },
        accent: {
          DEFAULT: "#3b82f6",
          hover: "#2563eb",
          soft: "#1e3a8a",
        },
        border: {
          subtle: "rgba(255,255,255,0.06)",
          card: "rgba(255,255,255,0.08)",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 24px rgba(0,0,0,0.35)",
        play: "0 8px 24px rgba(59,130,246,0.45)",
      },
      backgroundImage: {
        "news-hero":
          "linear-gradient(135deg, rgba(30,58,138,0.85) 0%, rgba(30,64,175,0.7) 50%, rgba(15,23,42,0.85) 100%)",
        "app-bg":
          "radial-gradient(1200px 600px at 50% -10%, rgba(59,130,246,0.08), transparent 60%), linear-gradient(180deg, #0a0d12 0%, #0c0f14 100%)",
      },
    },
  },
  plugins: [],
};
