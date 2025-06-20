// Atualiza visual do placar e informações do set
function updateScoreboard() {
  document.getElementById("teamA-score").textContent = scoreA;
  document.getElementById("teamB-score").textContent = scoreB;
  document.getElementById("set-info").textContent = currentSet;
}

// Renderiza os nomes dos jogadores e o sacador
function renderPlayers() {
  const container = document.getElementById("playersContainer");
  container.innerHTML = "";

  const teamAdiv = document.createElement("div");
  teamAdiv.classList.add("team");
  teamAdiv.innerHTML = `<h3>${teamAName}</h3>`;
  teamA.forEach((player, idx) => {
    const playerDiv = document.createElement("div");
    playerDiv.textContent = player;
    if (server && server.team === "A" && server.index === idx) {
      playerDiv.style.fontWeight = "bold";
      playerDiv.textContent += " (Sacador)";
    }
    teamAdiv.appendChild(playerDiv);
  });

  const teamBdiv = document.createElement("div");
  teamBdiv.classList.add("team");
  teamBdiv.innerHTML = `<h3>${teamBName}</h3>`;
  teamB.forEach((player, idx) => {
    const playerDiv = document.createElement("div");
    playerDiv.textContent = player;
    if (server && server.team === "B" && server.index === idx) {
      playerDiv.style.fontWeight = "bold";
      playerDiv.textContent += " (Sacador)";
    }
    teamBdiv.appendChild(playerDiv);
  });

  container.appendChild(teamAdiv);
  container.appendChild(teamBdiv);
}

// Atualiza nomes dos botões com os nomes das duplas
function updateButtonNames() {
  document.getElementById("btnTeamAName").textContent = teamAName;
  document.getElementById("btnTeamBName").textContent = teamBName;
}

// Atualiza o resumo da partida com os sets finalizados e placar parcial
function updateSummary() {
  let text = `Sets finalizados:\n`;
  if (sets.length === 0) {
    text += "Nenhum set finalizado.\n";
  } else {
    sets.forEach(set => {
      text += `Set ${set.setNumber}: ${set.scoreA} x ${set.scoreB}\n`;
    });
  }
  text += `\nPontuação atual:\n${scoreA} x ${scoreB}\n`;
  document.getElementById("summary").textContent = text;
}

// Renderiza a lista de jogos finalizados na tela de configuração e na tela do jogo
function renderFinishedGames() {
  const finishedListSetup = document.getElementById("finishedGamesSetupList");
  const finishedListGame = document.getElementById("finishedGamesList");

  if (finishedGames.length === 0) {
    finishedListSetup.innerHTML = "<i>Nenhum jogo finalizado salvo.</i>";
    finishedListGame.innerHTML = "<i>Nenhum jogo finalizado salvo.</i>";
    return;
  }

  const html = finishedGames.map(game => {
    return `<div>${game.teamAName} vs ${game.teamBName} - Vencedor: ${game.winner === "A" ? game.teamAName : game.teamBName} - Fase: ${game.tournamentPhase}</div>`;
  }).join("");

  finishedListSetup.innerHTML = html;
  finishedListGame.innerHTML = html;
}
