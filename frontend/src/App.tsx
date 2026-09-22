import { useEffect, useState } from "react";
import { useHashRoute } from "./hooks/useHashRoute";
import { apiFetch, clearToken, isLoggedIn } from "./lib/apiClient";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import TimelinePage from "./pages/TimelinePage";
import UserPage from "./pages/UserPage";
import ChatPage from "./pages/ChatPage";
import type { User } from "./types";

export default function App() {
  const { path, navigate } = useHashRoute();
  const [me, setMe] = useState<(User & { email: string }) | null>(null);

  useEffect(() => {
    const isPublic =
      path === "/login" ||
      path === "/register" ||
      path.startsWith("/verify-email");
    if (!isLoggedIn() && !isPublic) {
      navigate("/login");
    } else if (isLoggedIn() && !me) {
      apiFetch<User & { email: string }>("/auth/me")
        .then(setMe)
        .catch(() => {});
    }
  }, [path]);

  const handleLogout = () => {
    clearToken();
    setMe(null);
    navigate("/login");
  };

  const Header = () => (
    <header className="header">
      <span className="header-title" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>SNS</span>
      {me && <span>@{me.username}</span>}
      <nav style={{ display: "flex", gap: "12px", marginLeft: "auto" }}>
        <a href="#/" style={{ textDecoration: "none" }}>タイムライン</a>
        <a href="#/chat" style={{ textDecoration: "none" }}>チャット</a>
      </nav>
      <button onClick={handleLogout}>ログアウト</button>
    </header>
  );

  if (path === "/register") return <RegisterPage />;
  if (path === "/login") return <LoginPage navigate={navigate} />;
  if (path.startsWith("/verify-email")) return <VerifyEmailPage path={path} />;

  if (path.startsWith("/users/")) {
    const username = path.split("/")[2];
    return (
      <div>
        <Header />
        <UserPage username={username} navigate={navigate} />
      </div>
    );
  }

  if (path === "/chat") {
    return (
      <div>
        <Header />
        <ChatPage navigate={navigate} />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <TimelinePage navigate={navigate} />
    </div>
  );
}