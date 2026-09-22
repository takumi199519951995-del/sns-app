import { useEffect, useState } from "react";
import { apiFetch } from "../lib/apiClient";
import type { Post, UserProfile } from "../types";

type Props = {
  username: string;
  navigate: (to: string) => void;
};

export default function UserPage({ username, navigate }: Props) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      const data = await apiFetch<UserProfile>(`/users/${username}`);
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    }
  };

  const fetchPosts = async () => {
    try {
      const data = await apiFetch<Post[]>(`/posts?username=${username}`);
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchPosts();
  }, [username]);

  const handleFollow = async () => {
    if (!profile) return;
    try {
      if (profile.isFollowing) {
        await apiFetch(`/users/${username}/follow`, { method: "DELETE" });
      } else {
        await apiFetch(`/users/${username}/follow`, { method: "POST" });
      }
      await fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  if (error) return <p className="error">{error}</p>;
  if (!profile) return <p>読み込み中...</p>;

  return (
    <main className="user-page">
      <div className="user-profile">
        <div className="user-avatar">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt={profile.displayName} />
          ) : (
            <div className="avatar-placeholder">
              {profile.displayName[0]}
            </div>
          )}
        </div>
        <div className="user-info">
          <h1>{profile.displayName}</h1>
          <p className="user-username">@{profile.username}</p>
          {profile.bio && <p className="user-bio">{profile.bio}</p>}
          <div className="user-counts">
            <span>{profile.followingCount} フォロー中</span>
            <span>{profile.followersCount} フォロワー</span>
          </div>
          <button
            className={profile.isFollowing ? "unfollow-btn" : "follow-btn"}
            onClick={handleFollow}
          >
            {profile.isFollowing ? "フォロー解除" : "フォローする"}
          </button>
        </div>
      </div>

      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.id} className="post-card">
            <div className="post-header">
              <span className="post-author">{post.author.displayName}</span>
              <span className="post-username">@{post.author.username}</span>
              <span className="post-date">
                {new Date(post.createdAt).toLocaleString("ja-JP")}
              </span>
            </div>
            <p className="post-content">{post.content}</p>
            <div className="post-footer">
              <span>❤️ {post.likeCount}</span>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}