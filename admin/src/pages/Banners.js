import { useEffect, useState } from "react";

function Banners() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [status, setStatus] = useState("");

  // Load existing banner
  useEffect(() => {
    fetch("http://localhost:3001/api/banner/home")
      .then(res => res.json())
      .then(data => {
        setTitle(data.title || "");
        setContent(data.content || "");
        setImageUrl(data.imageUrl || "");
      });
  }, []);

  async function saveBanner(e) {
    e.preventDefault();
    let finalImageUrl = imageUrl;

    // Upload new image if selected
    if (newImage) {
      const formData = new FormData();
      formData.append("image", newImage);

      const uploadRes = await fetch("http://localhost:3001/api/upload", {
        method: "POST",
        body: formData
      });

      const uploadData = await uploadRes.json();
      finalImageUrl = uploadData.imageUrl;
    }

    await fetch("http://localhost:3001/api/banner/home", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        imageUrl: finalImageUrl
      })
    });

    setImageUrl(finalImageUrl);
    setNewImage(null);
    setStatus("Saved successfully ✅");
  }

  async function deleteBanner() {
    await fetch("http://localhost:3001/api/banner/home", {
      method: "DELETE"
    });

    setTitle("");
    setContent("");
    setImageUrl("");
    setNewImage(null);
    setStatus("Banner deleted 🗑️");
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Home Banner</h2>

      <form onSubmit={saveBanner}>
        <label>Title</label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <label>Content</label>
        <textarea
          rows="4"
          value={content}
          onChange={e => setContent(e.target.value)}
        />

        <label>Image</label>

        {imageUrl && (
          <div style={{ marginBottom: "10px" }}>
            <img
              src={`http://localhost:3001${imageUrl}`}
              alt="Banner"
              style={{ width: "100%", maxHeight: "250px", objectFit: "cover" }}
            />
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={e => setNewImage(e.target.files[0])}
        />

        <div style={{ marginTop: "15px" }}>
          <button type="submit">Save Changes</button>
          <button
            type="button"
            onClick={deleteBanner}
            style={{ marginLeft: "10px", background: "#b00020", color: "white" }}
          >
            Delete Banner
          </button>
        </div>
      </form>

      {status && <p>{status}</p>}
    </div>
  );
}

export default Banners;
