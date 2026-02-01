import { useEffect, useState } from "react";

const API = "http://localhost:3001";

export default function Mission() {
  const [mission, setMission] = useState("");
  const [vision, setVision] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/mission-vision`)
      .then(res => res.json())
      .then(data => {
        setMission(data.mission || "");
        setVision(data.vision || "");
      });
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch(`${API}/api/mission-vision`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mission, vision })
    });
    setSaving(false);
    alert("Saved");
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Mission & Vision</h2>

      <label>Mission</label>
      <textarea
        rows={6}
        value={mission}
        onChange={e => setMission(e.target.value)}
        style={{ width: "100%", marginBottom: 20 }}
      />

      <label>Vision</label>
      <textarea
        rows={6}
        value={vision}
        onChange={e => setVision(e.target.value)}
        style={{ width: "100%", marginBottom: 20 }}
      />

      <button onClick={save} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
