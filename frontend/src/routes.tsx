import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from "./pages/Login";
import { LobbyPage } from "./pages/Lobby";
import { GamePage } from "./pages/Game";
import { RankingPage } from "./pages/Ranking";

export const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/lobby", element: <LobbyPage /> },
  { path: "/game", element: <GamePage /> },
  { path: "/ranking", element: <RankingPage /> }
]);
