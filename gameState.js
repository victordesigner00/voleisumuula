// gameState.js
export const gameState = {
  teamAName: "",
  teamBName: "",
  teamA: [],
  teamB: [],
  scoreA: 0,
  scoreB: 0,
  currentSet: 1,
  sets: [],
  server: null, // { team: "A"|"B", index: 0|1 }
  lastScoringTeam: null,
  tournamentPhase: "",
  lastServerIndexA: 0,
  lastServerIndexB: 0,
  historyStack: [],
  finishedGames: []
};

export function validateSetup(aName, aPlayers, bName, bPlayers, phase, serverTeam, serverIndex) {
  if (!aName || aPlayers.length !== 2 || !aPlayers.every(p => p) ||
      !bName || bPlayers.length !== 2 || !bPlayers.every(p => p)) {
    alert("Preencha os nomes e jogadores corretamente (2 jogadores por dupla).");
    return false;
  }
  if (!phase) {
    alert("Selecione a fase do torneio.");
    return false;
  }
  if (serverTeam !== "A" && serverTeam !== "B") {
    alert("Escolha a dupla que fará o saque inicial.");
    return false;
  }
  if (![0,1].includes(serverIndex)) {
    alert("Escolha o índice do sacador inicial.");
    return false;
  }
  return true;
}

export function addPoint(team) {
  if (team !== "A" && team !== "B") return;

  // Salva estado anterior para desfazer
  gameState.historyStack.push({
    scoreA: gameState.scoreA,
    scoreB: gameState.scoreB,
    server: {...gameState.server},
    lastScoringTeam: gameState.lastScoringTeam,
    currentSet: gameState.currentSet,
    lastServerIndexA: gameState.lastServerIndexA,
    lastServerIndexB: gameState.lastServerIndexB
  });

  if (team === "A") {
    gameState.scoreA++;
    gameState.lastScoringTeam = "A";
    gameState.lastServerIndexA = gameState.server.index;
  } else {
    gameState.scoreB++;
    gameState.lastScoringTeam = "B";
    gameState.lastServerIndexB = gameState.server.index;
  }

  if (gameState.server.team !== team) {
    gameState.server.team = team;
    gameState.server.index = (team === "A") ? gameState.lastServerIndexA : gameState.lastServerIndexB;
  }
}

export function undoLastAction() {
  if (gameState.historyStack.length === 0) return false;

  const lastState = gameState.historyStack.pop();
  gameState.scoreA = lastState.scoreA;
  gameState.scoreB = lastState.scoreB;
  gameState.server = lastState.server;
  gameState.lastScoringTeam = lastState.lastScoringTeam;
  gameState.currentSet = lastState.currentSet;
  gameState.lastServerIndexA = lastState.lastServerIndexA;
  gameState.lastServerIndexB = lastState.lastServerIndexB;

  return true;
}

export function finishSet() {
  // condições simples para finalizar set (pode melhorar)
  if (gameState.scoreA === gameState.scoreB) {
    alert("O set não pode terminar empatado.");
    return false;
  }

  gameState.sets.push({ set: gameState.currentSet, scoreA: gameState.scoreA, scoreB: gameState.scoreB });
  gameState.currentSet++;
  gameState.scoreA = 0;
  gameState.scoreB = 0;
  gameState.historyStack = [];
  return true;
}

export function finishGame() {
  if (gameState.sets.length === 0) {
    alert("Finalize pelo menos um set antes de encerrar o jogo.");
    return false;
  }

  // salva jogo finalizado
  const finished = {
    teamAName: gameState.teamAName,
    teamBName: gameState.teamBName,
    sets: [...gameState.sets],
    tournamentPhase: gameState.tournamentPhase
  };
  gameState.finishedGames.push(finished);

  // reseta estado do jogo
  gameState.teamAName = "";
  gameState.teamBName = "";
  gameState.teamA = [];
  gameState.teamB = [];
  gameState.scoreA = 0;
  gameState.scoreB = 0;
  gameState.currentSet = 1;
  gameState.sets = [];
  gameState.server = null;
  gameState.lastScoringTeam = null;
  gameState.tournamentPhase = "";
  gameState.lastServerIndexA = 0;
  gameState.lastServerIndexB = 0;
  gameState.historyStack = [];

  return true;
}

export function changeTournamentPhase(phase) {
  gameState.tournamentPhase = phase;
}

export function renderPlayers() {
  const container = document.getElementById("playersContainer");
  container.innerHTML = "";

  const teamAPlayers = gameState.teamA.map((p, i) => {
    const isServer = gameState.server && gameState.server.team === "A" && gameState.server.index === i;
    return `<div class="player${isServer ? " server" : ""}">Dupla 1: ${p}${isServer ? " (Sacador)" : ""}</div>`;
  }).join("");

  const teamBPlayers = gameState.teamB.map((p, i) => {
    const isServer = gameState.server && gameState.server.team === "B" && gameState.server.index === i;
    return `<div class="player${isServer ? " server" : ""}">Dupla 2: ${p}${isServer ? " (Sacador)" : ""}</div>`;
  }).join("");

  container.innerHTML = teamAPlayers + teamBPlayers;
}

export function updateScoreboard() {
  document.getElementById("teamA-score").textContent = gameState.scoreA;
  document.getElementById("teamB-score").textContent = gameState.scoreB;

  // Atualiza nomes dos botões
  document.getElementById("btnTeamAName").textContent = gameState.teamAName;
  document.getElementById("btnTeamBName").textContent = gameState.teamBName;
}

export function updateSummary() {
  const sum = document.getElementById("summary");
  let text = `Set atual: ${gameState.currentSet}\n`;
  text += `Placar atual: ${gameState.teamAName} ${gameState.scoreA} x ${gameState.scoreB} ${gameState.teamBName}\n\n`;
  text += "Sets anteriores:\n";
  gameState.sets.forEach(s => {
    text += `Set ${s.set}: ${s.scoreA} x ${s.scoreB}\n`;
  });
  sum.textContent = text;
}

export function renderFinishedGames() {
  const container = document.getElementById("finishedGamesList");
  const containerSetup = document.getElementById("finishedGamesSetupList");

  if (gameState.finishedGames.length === 0) {
    container.innerHTML = "<i>Nenhum jogo finalizado salvo.</i>";
    containerSetup.innerHTML = "<i>Nenhum jogo finalizado salvo.</i>";
    return;
  }

  const html = gameState.finishedGames.map((g, i) => {
    const sets = g.sets.map(s => `Set ${s.set}: ${s.scoreA} x ${s.scoreB}`).join("<br>");
    return `<div class="finished-game">
      <strong>${g.teamAName} x ${g.teamBName}</strong><br>
      Fase: ${g.tournamentPhase}<br>
      ${sets}
    </div>`;
  }).join("<hr>");

  container.innerHTML = html;
  containerSetup.innerHTML = html;
}
