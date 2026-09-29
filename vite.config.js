import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  base:
    command === "build" && !process.env.VERCEL
      ? "/cotizador-inmobiliario/"
      : "/",
}));
