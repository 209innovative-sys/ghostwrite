import { useState } from "react";
import { signIn } from "./firebase";

function App() {
  const [text, setText] = useState("");
  const [rewritten, setRewritten] = useState("");
  const [user, setUser] = useState(null);

  const handleRewrite = async () => {
    const res = await fetch("http://localhost:5000/api/rewrite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    setRewritten(data.rewritten);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      {!user ? (
        <button className="bg-blue-600 px-4 py-2 rounded" onClick={async () => setUser(await signIn())}>
          Sign in with Google
        </button>
      ) : (
        <>
          <textarea
            className="w-2/3 p-3 text-black rounded"
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text..."
          />
          <button className="mt-4 bg-green-600 px-4 py-2 rounded" onClick={handleRewrite}>
            Rewrite
          </button>
          <p className="mt-6 w-2/3 bg-gray-800 p-3 rounded">{rewritten}</p>
        </>
      )}
    </div>
  );
}

export default App;
