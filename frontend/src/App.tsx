import { useEffect, useState } from "react";
import { useHashRoute } from "./hooks/useHashRoute";
import { apiFetch, clearToken, isLoggedIn } from "./lib/apiClient";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import type { User } from "./types";

function TemporaryHome({ navigate }: { navigate: (to: string) => void }) {
  const [me, setMe] = useState<(User & { email: string }) | null>(null);

  useEffect(() => {
    apiFetch<User & { email: string }>("/auth/me")
      .then(setMe)
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  return (
    <main>
      <h1>ようこそ{me ? `、${me.displayName} さん` : ""}</h1>
      <p>タイムラインは「投稿機能とタイムライン」の章で実装します。</p>
      <button onClick={handleLogout}>ログアウト</button>
    </main>
  );
}

export default function App() {
  const { path, navigate } = useHashRoute();

  useEffect(() => {
    const isPublic =
      path === "/login" ||
      path === "/register" ||
      path.startsWith("/verify-email");
    if (!isLoggedIn() && !isPublic) {
      navigate("/login");
    }
  }, [path]);

  if (path === "/register") return <RegisterPage />;
  if (path === "/login") return <LoginPage navigate={navigate} />;
  if (path.startsWith("/verify-email")) return <VerifyEmailPage path={path} />;
  return <TemporaryHome navigate={navigate} />;
}