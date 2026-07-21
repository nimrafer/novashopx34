import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/storefront.css";

createRoot(document.getElementById("root")!).render(<App />);

// Keep static fallback visible for crawlers when JS app is blocked, but remove it for real SPA sessions.
requestAnimationFrame(() => {
  const fallback = document.getElementById("crawler-fallback");
  if (fallback) {
    fallback.remove();
  }
});
