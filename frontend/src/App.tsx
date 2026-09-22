import { useEffect, useState } from "react";
import { useHashRoute } from "./hooks/useHashRoute";
import { apiFetch, clearToken, isLoggedIn } from "./lib/apiClient";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import TimelinePage from "./pages/TimelinePage";
import type { User } from "./types";
import UserPage from "./pages/UserPage";

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


  if (path.startsWith("/users/")) {
  const username = path.split("/")[2];
  return (
    <div>
      <header className="header">
        <span className="header-title" onClick={() => navigate("/")}>SNS</span>
        {me && <span>@{me.username}</span>}
        <button onClick={handleLogout}>ログアウト</button>
      </header>
      <UserPage username={username} navigate={navigate} />
    </div>
  );
  }
  if (path === "/register") return <RegisterPage />;
  if (path === "/login") return <LoginPage navigate={navigate} />;
  if (path.startsWith("/verify-email")) return <VerifyEmailPage path={path} />;

  return (
    <div>
      <header className="header">
        <span className="header-title">SNS</span>
        {me && <span>@{me.username}</span>}
        <button onClick={handleLogout}>ログアウト</button>
      </header>
      <TimelinePage navigate={navigate} />
    </div>
  );
}