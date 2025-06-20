// Variáveis de estado exportadas para serem acessíveis externamente (opcional, só se for usado fora)
export let teamAName = "";
export let teamBName = "";
export let teamA = [];
export let teamB = [];
export let scoreA = 0;
export let scoreB = 0;
export let currentSet = 1;
export let sets = [];
export let server = null; // {team: 'A'|'B', index: 0|1}
export let lastScoringTeam = null;
export let tournamentPhase = "";
export let lastServerIndexA = 0;
export let lastServerIndexB = 0;
export let historyStack = [];
export let finishedGames = [];

// Funções exportadas para uso externo
export function validateSetup(aName, aPlayersArr, bName, bPlayersArr, phase, initialServerTeam, initialServerIndex) {
  if (!aName || !bName) {
    alert("Nome das duplas é obrigatório.");
    return false;
  }
  if (aPlayersArr.length !== 2 || bPlayersArr.length !== 2) {
    alert("Cada dupla deve conter exatamente 2 jogadores.");
    return false;
  }
  if (!phase) {
    alert("Selecione a fase do torneio.");
    return false;
  }
  if (initialServerTeam !== "A" && initialServerTeam !== "B") {
    alert("Selecione a dupla do sacador inicial.");
    return false;
  }
  if (initialServerIndex !== 0 && initialServerIndex !== 1) {
    alert("Índice do sacador deve ser 0 ou 1.");
    return false;
  }
  return true;
}

export function addPoint(team) {
  if (team !== "A" && team !== "B") return;

  historyStack.push({
    scoreA, scoreB,
    server: {...server},
    lastScoringTeam,
    currentSet,
    lastServerIndexA,
    lastServerIndexB
  });

  if (team === "A") {
    scoreA++;
    lastScoringTeam = "A";
    lastServerIndexA = server.index;
  } else {
    scoreB++;
    lastScoringTeam = "B";
    lastServerIndexB = server.index;
  }

  if (server.team !== team) {
    server.team = team;
    server.index = (team === "A") ? lastServerIndexA : lastServerIndexB;
  }
}

export function undoLastAction() {
  if (historyStack.length === 0) return false;

  const lastState = historyStack.pop();
  scoreA = lastState.scoreA;
  scoreB = lastState.scoreB;
  server = {...lastState.server};
  lastScoringTeam = lastState.lastScoringTeam;
  currentSet = lastState.currentSet;
  lastServerIndexA = lastState.lastServerIndexA;
  lastServerIndexB = lastState.lastServerIndexB;
  return true;
}

export function finishSet() {
  if (!canFinishSet()) {
    alert("Pontuação insuficiente para finalizar o set.");
    return false;
  }
  sets.push({ setNumber: currentSet, scoreA, scoreB });
  currentSet++;
  scoreA = 0;
  scoreB = 0;
  lastScoringTeam = null;
  server = null;
  historyStack = [];
  return true;
}

export function canFinishSet() {
  const maxScore = Math.max(scoreA, scoreB);
  const diff = Math.abs(scoreA - scoreB);
  return maxScore >= 25 && diff >= 2;
}

export function getGameWinner() {
  let winsA = 0;
  let winsB = 0;
  sets.forEach(set => {
    if (set.scoreA > set.scoreB) winsA++;
    else winsB++;
  });
  if (winsA > winsB) return "A";
  else if (winsB > winsA) return "B";
  else return null;
}

export function finishGame() {
  if (sets.length === 0) {
    alert("Finalize pelo menos um set antes de finalizar o jogo.");
    return false;
  }
  const winner = getGameWinner();
  if (!winner) {
    alert("O jogo está empatado. Finalize mais sets.");
    return false;
  }

  const game = {
    teamAName, teamBName,
    teamA, teamB,
    sets: [...sets],
    winner,
    tournamentPhase
  };
  finishedGames.push(game);
  resetGame();
  return true;
}

export function resetGame() {
  teamAName = "";
  teamBName = "";
  teamA = [];
  teamB = [];
  scoreA = 0;
  scoreB = 0;
  currentSet = 1;
  sets = [];
  server = null;
  lastScoringTeam = null;
  tournamentPhase = "";
  lastServerIndexA = 0;
  lastServerIndexB = 0;
  historyStack = [];
}

export function changeTournamentPhase(newPhase) {
  tournamentPhase = newPhase;
}
