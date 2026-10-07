import { useEffect, useState } from "react";
import { apiFetch } from "../lib/apiClient";
import type { Post } from "../types";

type Props = {
  navigate: (to: string) => void;
};

export default function TimelinePage(_props: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      const data = await apiFetch<Post[]>("/posts");
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await apiFetch("/posts", {
        method: "POST",
        body: JSON.stringify({ content }),
      });
      setContent("");
      await fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "投稿に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiFetch(`/posts/${id}`, { method: "DELETE" });
      await fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (post: Post) => {
    try {
      if (post.likedByMe) {
        await apiFetch(`/posts/${post.id}/likes`, { method: "DELETE" });
      } else {
        await apiFetch(`/posts/${post.id}/likes`, { method: "POST" });
      }
      await fetchPosts();
    } catch (err) {
      console.error("いいねエラー:", err);
    }
  };

  return (
    <main className="timeline">
      <h1>タイムライン</h1>

      <form onSubmit={handleSubmit} className="post-form">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="いまどうしてる？"
          maxLength={280}
          rows={3}
        />
        <div className="post-form-footer">
          <span>{content.length}/280</span>
          <button type="submit" disabled={submitting || !content.trim()}>
            {submitting ? "投稿中..." : "投稿する"}
          </button>
        </div>
      </form>
      {error && <p className="error">{error}</p>}

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
              <button
                className={post.likedByMe ? "like-btn liked" : "like-btn"}
                onClick={() => handleLike(post)}
              >
                ❤️ {post.likeCount}
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(post.id)}
              >
                削除
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}