import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "./App";
import './style.css';

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <BrowserRouter basename="/rodikliai">
    <App />
  </BrowserRouter>
);