import {
  validateSetup,
  addPoint,
  undoLastAction,
  finishSet,
  finishGame,
  changeTournamentPhase,
  renderPlayers,
  updateScoreboard,
  updateSummary,
  renderFinishedGames,
  gameState // objeto que mantém o estado
} from './gameState.js';

function startGame() {
  const aName = document.getElementById("teamAName").value.trim();
  const aPlayers = document.getElementById("teamAPlayers").value.split(",").map(s => s.trim()).filter(Boolean);
  const bName = document.getElementById("teamBName").value.trim();
  const bPlayers = document.getElementById("teamBPlayers").value.split(",").map(s => s.trim()).filter(Boolean);
  const phase = document.getElementById("tournamentPhaseSelect").value;
  const initialServerTeam = document.getElementById("initialServerTeam").value;
  const initialServerIndex = parseInt(document.getElementById("initialServerIndex").value);

  if (!validateSetup(aName, aPlayers, bName, bPlayers, phase, initialServerTeam, initialServerIndex)) return;

  // Atualiza o estado do jogo centralizado
  gameState.teamAName = aName;
  gameState.teamBName = bName;
  gameState.teamA = aPlayers;
  gameState.teamB = bPlayers;
  gameState.tournamentPhase = phase;
  gameState.server = { team: initialServerTeam, index: initialServerIndex };
  gameState.currentSet = 1;
  gameState.sets = [];
  gameState.scoreA = 0;
  gameState.scoreB = 0;
  gameState.historyStack = [];
  gameState.lastScoringTeam = null;
  gameState.lastServerIndexA = initialServerTeam === "A" ? initialServerIndex : 0;
  gameState.lastServerIndexB = initialServerTeam === "B" ? initialServerIndex : 0;

  // Ajusta interface
  document.getElementById("setupContainer").classList.add("hidden");
  document.getElementById("gameContainer").classList.remove("hidden");
  document.getElementById("displayTeams").textContent = `${gameState.teamAName} x ${gameState.teamBName}`;
  document.getElementById("tournamentPhase").value = gameState.tournamentPhase;

  updateButtonNames();
  renderPlayers();
  updateScoreboard();
  updateSummary();
  renderFinishedGames();
}

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

function undo() {
  if (undoLastAction()) {
    renderPlayers();
    updateScoreboard();
    updateSummary();
  } else {
    alert("Nada para desfazer.");
  }
}

function finishSetHandler() {
  if (finishSet()) {
    renderPlayers();
    updateScoreboard();
    updateSummary();
    alert(`Set ${gameState.currentSet - 1} finalizado.`);
  }
}

function finishGameHandler() {
  if (finishGame()) {
    alert("Jogo finalizado!");
    document.getElementById("setupContainer").classList.remove("hidden");
    document.getElementById("gameContainer").classList.add("hidden");
    renderFinishedGames();
  }
}

function changePhase() {
  const phase = document.getElementById("tournamentPhase").value;
  changeTournamentPhase(phase);
}

document.getElementById("startGameBtn").addEventListener("click", startGame);
document.getElementById("pointTeamA").addEventListener("click", pointForTeamA);
document.getElementById("pointTeamB").addEventListener("click", pointForTeamB);
document.getElementById("undoBtn").addEventListener("click", undo);
document.getElementById("finishSetBtn").addEventListener("click", finishSetHandler);
document.getElementById("finishGameBtn").addEventListener("click", finishGameHandler);
