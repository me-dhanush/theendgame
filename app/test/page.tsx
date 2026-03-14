"use client";

export default function TestPage() {
async function createGame() {
  const res = await fetch("/api/create-game", {
    method: "POST",
  });

  const data = await res.json();

  console.log(data);

  if (data.lichessGame) {
    window.open(data.lichessGame, "_blank");
  }
}

  return (
    <div className="p-10">
      <button
        onClick={createGame}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Create Test Game
      </button>
    </div>
  );
}
