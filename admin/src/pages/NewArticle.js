// src/pages/NewArticle.js
import React, { useState } from "react";
import axios from "axios";

export default function NewArticle() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [page, setPage] = useState("news");
  const [status, setStatus] = useState("draft");

  


  async function submit(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("page", page);
    if (image) formData.append("image", image);

    try {
      await axios.post("http://localhost:3001/articles", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Article saved!");
      window.location.href = "/articles";

    } catch (err) {
      alert("Error saving article");
      console.error(err);
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>New Article</h1>

      <form onSubmit={submit}>
        <label>Page</label>
<select value={page} onChange={e => setPage(e.target.value)}>
  <option value="news">News</option>
  <option value="admissions">Admissions</option>
  <option value="students">Students</option>
</select>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        /><br /><br />

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        /><br /><br />

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        /><br /><br />

        <button type="submit">Save Article</button>
      </form>
      <a
        href="/home.html"
        style={{
          position: "fixed",
          top: "15px",
          right: "15px",
          padding: "8px 12px",
          border: "1px solid #ccc",
          textDecoration: "none",
          background: "#fff"
        }}
      >
        ← Back to Website
      </a>
    </div>
  );
}
