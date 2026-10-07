import { useEffect, useState } from "react";
import { apiFetch } from "../lib/apiClient";
import type { User } from "../types";

type Props = {
  navigate: (to: string) => void;
};

export default function SettingsPage(_props: Props) {
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<User & { email: string }>("/auth/me")
      .then((me) => {
        setDisplayName(me.displayName);
        setBio(me.bio);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);
    setError(null);
    try {
      await apiFetch("/users/me", {
        method: "PATCH",
        body: JSON.stringify({ displayName, bio }),
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="settings-page">
      <h1>設定</h1>
      <form onSubmit={handleSubmit} className="settings-form">
        <label>
          表示名
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={50}
          />
        </label>
        <label>
          自己紹介
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={160}
            rows={4}
          />
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? "保存中..." : "保存する"}
        </button>
      </form>
      {success && <p className="success">プロフィールを更新しました</p>}
      {error && <p className="error">{error}</p>}
    </main>
  );
}