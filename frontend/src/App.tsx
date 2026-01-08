import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Background } from "./components/Background";
import { Toasts } from "./components/Toasts";

export function App() {
  return (
    <div className="relative min-h-screen">
      <Background />
      <Toasts />
      <RouterProvider router={router} />
    </div>
  );
}
