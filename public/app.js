document.getElementById("rewrite").addEventListener("click", async () => {
  const text = document.getElementById("input").value.trim();
  if (!text) return alert("Please enter text first.");

  const btn = document.getElementById("rewrite");
  btn.disabled = true;
  btn.textContent = "Working...";

  try {
    const res = await fetch("/api/rewrite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    const data = await res.json();
    document.getElementById("output").textContent = data.result || data.error;
  } catch {
    document.getElementById("output").textContent = "Error contacting server.";
  } finally {
    btn.disabled = false;
    btn.textContent = "Rewrite";
  }
});
