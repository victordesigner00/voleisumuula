// Inicia o jogo a partir dos inputs do setup
function startGame() {
  const aName = document.getElementById("teamAName").value.trim();
  const aPlayers = document.getElementById("teamAPlayers").value.split(",").map(s => s.trim()).filter(Boolean);
  const bName = document.getElementById("teamBName").value.trim();
  const bPlayers = document.getElementById("teamBPlayers").value.split(",").map(s => s.trim()).filter(Boolean);
  const phase = document.getElementById("tournamentPhaseSelect").value;
  const initialServerTeam = document.getElementById("initialServerTeam").value;
  const initialServerIndex = parseInt(document.getElementById("initialServerIndex").value);

  if (!validateSetup(aName, aPlayers, bName, bPlayers, phase, initialServerTeam, initialServerIndex)) return;

  // Inicializa estado
  teamAName = aName;
  teamBName = bName;
  teamA = aPlayers;
  teamB = bPlayers;
  tournamentPhase = phase;
  server = {team: initialServerTeam, index: initialServerIndex};
  currentSet = 1;
  sets = [];
  scoreA = 0;
  scoreB = 0;
  historyStack = [];
  lastScoringTeam = null;
  lastServerIndexA = initialServerTeam === "A" ? initialServerIndex : 0;
  lastServerIndexB = initialServerTeam === "B" ? initialServerIndex : 0;

  // Ajusta interface
  document.getElementById("setupContainer").classList.add("hidden");
  document.getElementById("gameContainer").classList.remove("hidden");
  document.getElementById("displayTeams").textContent = `${teamAName} x ${teamBName}`;
  document.getElementById("tournamentPhase").value = tournamentPhase;

  updateButtonNames();
  renderPlayers();
  updateScoreboard();
  updateSummary();
  renderFinishedGames();
}

// Pontuar para o time A ou B
function pointForTeamA() {
  addPoint("A");
  renderPlayers();
  updateScoreboard();
  updateSummary();
}
function pointForTeamB() {
  addPoint("B");
  renderPlayers();
  updateScoreboard();
  updateSummary();
}

// Desfaz última ação
function undo() {
  if (undoLastAction()) {
    renderPlayers();
    updateScoreboard();
    updateSummary();
  } else {
    alert("Nada para desfazer.");
  }
}

// Finaliza set
function finishSetHandler() {
  if (finishSet()) {
    renderPlayers();
    updateScoreboard();
    updateSummary();
    alert(`Set ${currentSet - 1} finalizado.`);
  }
}

// Finaliza jogo
function finishGameHandler() {
  if (finishGame()) {
    alert("Jogo finalizado!");
    document.getElementById("setupContainer").classList.remove("hidden");
    document.getElementById("gameContainer").classList.add("hidden");
    renderFinishedGames();
  }
}

// Alterar fase do torneio durante o jogo
function changePhase() {
  const phase = document.getElementById("tournamentPhase").value;
  changeTournamentPhase(phase);
}

// Configura listeners
document.getElementById("startGameBtn").addEventListener("click", startGame);
document.getElementById("pointTeamA").addEventListener("click", pointForTeamA);
document.getElementById("pointTeamB").addEventListener("click", pointForTeamB);
document.getElementById("undoBtn").addEventListener("click", undo);
document.getElementById("finishSetBtn").addEventListener("click", finishSetHandler);
document.getElementById("finishGameBtn").addEventListener("click", finishGameHandler);
