// Estado principal
let teamAName = "";
let teamBName = "";
let teamA = [];
let teamB = [];
let scoreA = 0;
let scoreB = 0;
let currentSet = 1;
let sets = [];
let server = null; // {team: 'A'|'B', index: 0|1}
let lastScoringTeam = null;
let tournamentPhase = "";
let lastServerIndexA = 0;
let lastServerIndexB = 0;
let historyStack = [];
let finishedGames = [];

// Valida dados do setup antes de iniciar jogo
function validateSetup(aName, aPlayersArr, bName, bPlayersArr, phase, initialServerTeam, initialServerIndex) {
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

// Lógica para adicionar ponto
function addPoint(team) {
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

// Undo da última ação (ponto)
function undoLastAction() {
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

// Finaliza o set atual
function finishSet() {
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

// Verifica se é possível finalizar o set
function canFinishSet() {
  // Regra: o time vencedor deve ter no mínimo 25 pontos e diferença de pelo menos 2 pontos
  const maxScore = Math.max(scoreA, scoreB);
  const diff = Math.abs(scoreA - scoreB);
  return maxScore >= 25 && diff >= 2;
}

// Calcula o vencedor do jogo com base nos sets
function getGameWinner() {
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

// Finaliza o jogo, salva na lista de jogos finalizados
function finishGame() {
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

// Reseta o estado para novo jogo
function resetGame() {
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

// Altera a fase do torneio
function changeTournamentPhase(newPhase) {
  tournamentPhase = newPhase;
}
