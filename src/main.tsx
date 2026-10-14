import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

async function start() {
  const container = document.getElementById("root")!;
  if (/^\/blog(?:\/|$)/.test(window.location.pathname)) {
    // Keep the generated article visible until its components are ready.
    // Passing them directly avoids replacing readable HTML with a loading state.
    const [blog, post] = await Promise.all([import("./pages/Blog"), import("./pages/BlogPost")]);
    createRoot(container).render(<App blogPages={{ Blog: blog.default, BlogPost: post.default }} />);
  } else {
    createRoot(container).render(<App />);
  }
}

void start();
