export default function Dashboard() {

  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <button onClick={() => window.location.href = "/new"}>
        New Article
      </button>

      <br /><br />

      <button onClick={() => window.location.href = "/articles"}>
        View Articles
      </button>

      <br /><br />

      <button onClick={logout}>
        Logout
      </button>

      {/* ✅ THIS MUST BE INSIDE return */}
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
