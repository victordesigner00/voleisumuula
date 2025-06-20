// gameState.js

export const gameState = (() => {
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

  function validateSetup(aName, aPlayersArr, bName, bPlayersArr, phase, initialServerTeam, initialServerIndex) {
    if (!aName || !bName) {
      return { valid: false, message: "Nome das duplas é obrigatório." };
    }
    if (aPlayersArr.length !== 2 || bPlayersArr.length !== 2) {
      return { valid: false, message: "Cada dupla deve conter exatamente 2 jogadores." };
    }
    if (!phase) {
      return { valid: false, message: "Selecione a fase do torneio." };
    }
    if (initialServerTeam !== "A" && initialServerTeam !== "B") {
      return { valid: false, message: "Selecione a dupla do sacador inicial." };
    }
    if (initialServerIndex !== 0 && initialServerIndex !== 1) {
      return { valid: false, message: "Índice do sacador deve ser 0 ou 1." };
    }
    return { valid: true };
  }

  function initGame(data) {
    teamAName = data.teamAName;
    teamBName = data.teamBName;
    teamA = data.teamAPlayers;
    teamB = data.teamBPlayers;
    tournamentPhase = data.phase;
    server = { team: data.initialServerTeam, index: data.initialServerIndex };
    lastServerIndexA = (data.initialServerTeam === "A") ? data.initialServerIndex : 0;
    lastServerIndexB = (data.initialServerTeam === "B") ? data.initialServerIndex : 0;
    scoreA = 0;
    scoreB = 0;
    currentSet = 1;
    sets = [];
    lastScoringTeam = null;
    historyStack = [];
  }

  function addPoint(team) {
    if (team !== "A" && team !== "B") return;

    historyStack.push({
      scoreA, scoreB,
      server: { ...server },
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
      if (team === "A") {
        server.index = lastServerIndexA === 0 ? 1 : 0;
        lastServerIndexA = server.index;
      } else {
        server.index = lastServerIndexB === 0 ? 1 : 0;
        lastServerIndexB = server.index;
      }
    }
  }

  function undo() {
    if (historyStack.length === 0) {
      return false;
    }
    const lastState = historyStack.pop();
    scoreA = lastState.scoreA;
    scoreB = lastState.scoreB;
    server = lastState.server;
    lastScoringTeam = lastState.lastScoringTeam;
    currentSet = lastState.currentSet;
    lastServerIndexA = lastState.lastServerIndexA;
    lastServerIndexB = lastState.lastServerIndexB;
    return true;
  }

  function finishSet() {
    if (scoreA === 0 && scoreB === 0) {
      return { success: false, message: "O set não pode ser finalizado com placar zerado." };
    }
    sets.push({ set: currentSet, scoreA, scoreB });
    currentSet++;
    scoreA = 0;
    scoreB = 0;
    lastScoringTeam = null;
    historyStack = [];
    return { success: true };
  }

  function finishGame() {
    if (sets.length === 0) {
      return { success: false, message: "Finalize pelo menos um set antes de finalizar o jogo." };
    }
    const winner = calculateWinner();
    const finishedGame = {
      teamAName,
      teamBName,
      sets: [...sets],
      winner,
      phase: tournamentPhase
    };
    finishedGames.push(finishedGame);
    return { success: true, finishedGame };
  }

  function calculateWinner() {
    let winsA = 0, winsB = 0;
    sets.forEach(s => {
      if (s.scoreA > s.scoreB) winsA++;
      else if (s.scoreB > s.scoreA) winsB++;
    });
    if (winsA > winsB) return teamAName;
    if (winsB > winsA) return teamBName;
    return "Empate";
  }

  function changePhase(newPhase) {
    tournamentPhase = newPhase;
  }

  // Getters para acesso controlado
  function getState() {
    return {
      teamAName, teamBName, teamA, teamB, scoreA, scoreB, currentSet,
      sets, server, lastScoringTeam, tournamentPhase, finishedGames
    };
  }

  return {
    validateSetup,
    initGame,
    addPoint,
    undo,
    finishSet,
    finishGame,
    changePhase,
    getState,
  };
})();
