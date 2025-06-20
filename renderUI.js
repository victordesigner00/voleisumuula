// renderUI.js

import { gameState } from './gameState.js';

export const renderUI = (() => {
  function renderPlayers() {
    const state = gameState.getState();
    const container = document.getElementById("playersContainer");
    container.innerHTML = "";

    function createTeamDiv(name, players, teamLabel) {
      const div = document.createElement("div");
      div.className = "team";
      const title = document.createElement("h4");
      title.textContent = name;
      div.appendChild(title);

      players.forEach((p, i) => {
        const pElem = document.createElement("p");
        pElem.textContent = `${p} (P${i})`;
        if (state.server && state.server.team === teamLabel && state.server.index === i) {
          pElem.style.fontWeight = "bold";
          pElem.textContent += " 🎾";
        }
        div.appendChild(pElem);
      });

      return div;
    }

    container.appendChild(createTeamDiv(state.teamAName, state.teamA, "A"));
    container.appendChild(createTeamDiv(state.teamBName, state.teamB, "B"));
  }

  function updateScores() {
    const state = gameState.getState();
    document.getElementById("teamA-score").textContent = state.scoreA;
    document.getElementById("teamB-score").textContent = state.scoreB;
  }

  function renderSummary() {
    const state = gameState.getState();
    updateScores();

    let summaryText = `Fase do Torneio: ${state.tournamentPhase}\n`;
    summaryText += `Sets jogados: ${state.sets.length}\n\n`;
    state.sets.forEach(s => {
      summaryText += `Set ${s.set}: ${state.teamAName} ${s.scoreA} x ${s.scoreB} ${state.teamBName}\n`;
    });
    summaryText += `\nPlacar atual: ${state.teamAName} ${state.scoreA} x ${state.scoreB} ${state.teamBName}\n`;
    summaryText += `Sacador atual: ${state.server ? (state.server.team === "A" ? state.teamA[state.server.index] : state.teamB[state.server.index]) : "N/D"}\n`;

    document.getElementById("summary").textContent = summaryText;
  }

  function updateFinishedGamesList() {
    const state = gameState.getState();
    const container = document.getElementById("finishedGamesList");
    if (state.finishedGames.length === 0) {
      container.innerHTML = "<i>Nenhum jogo finalizado salvo.</i>";
      return;
    }
    container.innerHTML = "";
    state.finishedGames.forEach((game, i) => {
      const div = document.createElement("div");
      div.textContent = `${i+1}. ${game.teamAName} vs ${game.teamBName} - Fase: ${game.phase} - Vencedor: ${game.winner} (${game.sets.length} sets)`;
      container.appendChild(div);
    });
  }

  function updateFinishedGamesSetupList() {
    const state = gameState.getState();
    const container = document.getElementById("finishedGamesSetupList");
    if (state.finishedGames.length === 0) {
      container.innerHTML = "<option disabled selected>-- Nenhum jogo salvo --</option>";
      return;
    }
    container.innerHTML = "";
    state.finishedGames.forEach((game, i) => {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = `${game.teamAName} vs ${game.teamBName} (${game.phase})`;
      container.appendChild(option);
    });
  }

  return {
    renderPlayers,
    updateScores,
    renderSummary,
    updateFinishedGamesList,
    updateFinishedGamesSetupList
  };
})();
