// eventHandlers.js

import { gameState } from './gameState.js';
import { renderUI } from './renderUI.js';

export const eventHandlers = (() => {

  function setupStartGameButton() {
    document.getElementById("startGameButton").addEventListener("click", () => {
      const teamAName = document.getElementById("teamAName").value.trim();
      const teamBName = document.getElementById("teamBName").value.trim();
      const teamAPlayers = [
        document.getElementById("teamAPlayer1").value.trim(),
        document.getElementById("teamAPlayer2").value.trim()
      ];
      const teamBPlayers = [
        document.getElementById("teamBPlayer1").value.trim(),
        document.getElementById("teamBPlayer2").value.trim()
      ];
      const phase = document.getElementById("tournamentPhase").value;
      const initialServerTeam = document.querySelector('input[name="initialServer"]:checked')?.value;
      const initialServerIndex = parseInt(document.querySelector('input[name="initialServerPlayer"]:checked')?.value);

      const validation = gameState.validateSetup(teamAName, teamAPlayers, teamBName, teamBPlayers, phase, initialServerTeam, initialServerIndex);

      if (!validation.valid) {
        alert(validation.message);
        return;
      }

      gameState.initGame({
        teamAName,
        teamBName,
        teamAPlayers,
        teamBPlayers,
        phase,
        initialServerTeam,
        initialServerIndex
      });

      renderUI.renderPlayers();
      renderUI.renderSummary();
    });
  }

  function setupPointButtons() {
    document.getElementById("teamAAddPoint").addEventListener("click", () => {
      gameState.addPoint("A");
      renderUI.renderSummary();
      renderUI.renderPlayers();
    });

    document.getElementById("teamBAddPoint").addEventListener("click", () => {
      gameState.addPoint("B");
      renderUI.renderSummary();
      renderUI.renderPlayers();
    });
  }

  function setupUndoButton() {
    document.getElementById("undoButton").addEventListener("click", () => {
      if (!gameState.undo()) {
        alert("Nada a desfazer.");
        return;
      }
      renderUI.renderSummary();
      renderUI.renderPlayers();
    });
  }

  function setupFinishSetButton() {
    document.getElementById("finishSetButton").addEventListener("click", () => {
      const result = gameState.finishSet();
      if (!result.success) {
        alert(result.message);
        return;
      }
      renderUI.renderSummary();
      renderUI.renderPlayers();
    });
  }

  function setupFinishGameButton() {
    document.getElementById("finishGameButton").addEventListener("click", () => {
      const result = gameState.finishGame();
      if (!result.success) {
        alert(result.message);
        return;
      }
      alert("Jogo finalizado! Vencedor: " + result.finishedGame.winner);
      renderUI.updateFinishedGamesList();
      renderUI.updateFinishedGamesSetupList();
      // Reinicializar ou limpar a tela, se quiser
    });
  }

  function initAll() {
    setupStartGameButton();
    setupPointButtons();
    setupUndoButton();
    setupFinishSetButton();
    setupFinishGameButton();
  }

  return {
    initAll,
  };
})();
