// Adres backendu na Render (zmień na swój!)
const API_URL = "https://poll-backend.onrender.com/api";

// --- Pobieranie pytań ---
async function loadQuestions() {
  const res = await fetch(`${API_URL}/questions`);
  const data = await res.json();

  const container = document.getElementById("questions");
  container.innerHTML = "";

  data.forEach(q => {
    const div = document.createElement("div");
    div.innerHTML = `<h3>${q.text}</h3>`;
    q.answers.forEach(a => {
      div.innerHTML += `
        <label>
          <input type="radio" name="q${q.id}" value="${a.id}">
          ${a.text}
        </label>`;
    });
    container.appendChild(div);
  });
}

// --- Wysyłanie głosu ---
async function submitVote() {
  const formData = new FormData(document.getElementById("voteForm"));
  for (let [key, value] of formData.entries()) {
    await fetch(`${API_URL}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer_id: value })
    });
  }
  alert("Dziękujemy za głos!");
  window.location.href = "results.html";
}

// --- Wyniki ---
async function loadResults() {
  const res = await fetch(`${API_URL}/results`);
  const data = await res.json();

  const container = document.getElementById("results");
  container.innerHTML = "";

  data.forEach(q => {
    const div = document.createElement("div");
    div.innerHTML = `<h3>${q.text}</h3>`;
    q.answers.forEach(a => {
      div.innerHTML += `<p>${a.text}: ${a.votes} głosów</p>`;
    });
    container.appendChild(div);
  });
}

// --- Admin: dodawanie pytania ---
async function addQuestion() {
  const qText = document.getElementById("newQuestion").value;
  const answersText = document.getElementById("newAnswers").value.split(",");

  await fetch(`${API_URL}/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: qText, answers: answersText })
  });

  alert("Dodano pytanie!");
  loadAdmin();
}

// --- Admin: edycja wyników ---
async function editVotes(answerId) {
  const newVotes = document.getElementById(`votes-${answerId}`).value;

  await fetch(`${API_URL}/edit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answer_id: answerId, votes: parseInt(newVotes) })
  });

  alert("Zaktualizowano głosy!");
  loadAdmin();
}

// --- Admin: pobieranie pytań ---
async function loadAdmin() {
  const res = await fetch(`${API_URL}/questions`);
  const data = await res.json();

  const container = document.getElementById("admin");
  container.innerHTML = "";

  data.forEach(q => {
    const div = document.createElement("div");
    div.innerHTML = `<h3>${q.text}</h3>`;
    q.answers.forEach(a => {
      div.innerHTML += `
        <label>${a.text}</label>
        <input type="number" id="votes-${a.id}" value="${a.votes}">
        <button onclick="editVotes(${a.id})">Zapisz</button><br>`;
    });
    container.appendChild(div);
  });
}
