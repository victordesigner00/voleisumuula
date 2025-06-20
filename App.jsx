import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';

function App() {
  // Estado jogadores: 2 por time
  const [teamA, setTeamA] = useState(['', '']);
  const [teamB, setTeamB] = useState(['', '']);

  // Config jogo
  const [numSets, setNumSets] = useState(3);
  const [pointsPerSet, setPointsPerSet] = useState(15);
  const [advantage, setAdvantage] = useState(2);

  // Estado do jogo
  const [currentSet, setCurrentSet] = useState(1);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);

  // Rodízio de saque: quem sacou da equipe? índice 0 ou 1
  const [serverA, setServerA] = useState(0);
  const [serverB, setServerB] = useState(0);

  // Quem tem o saque agora? 'A' ou 'B'
  const [servingTeam, setServingTeam] = useState('A');

  // Estatísticas de saque: [saques, erros]
  const [statsA, setStatsA] = useState([
    { serves: 0, errors: 0 },
    { serves: 0, errors: 0 },
  ]);
  const [statsB, setStatsB] = useState([
    { serves: 0, errors: 0 },
    { serves: 0, errors: 0 },
  ]);

  // Função para mudar o ponto
  function addPoint(team) {
    if (team === 'A') {
      const newScore = scoreA + 1;
      setScoreA(newScore);
      updateServeAndRotation('A', newScore, scoreB);
    } else {
      const newScore = scoreB + 1;
      setScoreB(newScore);
      updateServeAndRotation('B', newScore, scoreA);
    }
  }

  // Função para atualizar rodízio de saque
  function updateServeAndRotation(teamScored, newScore, otherScore) {
    // Se time que está sacando fez ponto, sacador repete
    if (servingTeam === teamScored) {
      // só atualiza placar, sacador continua
    } else {
      // side-out: troca saque de time e muda sacador na equipe que ganhou saque
      setServingTeam(teamScored);
      if (teamScored === 'A') {
        setServerA((prev) => (prev === 0 ? 1 : 0));
      } else {
        setServerB((prev) => (prev === 0 ? 1 : 0));
      }
    }
    checkSetEnd(newScore, otherScore);
  }

  // Verifica fim de set
  function checkSetEnd(score1, score2) {
    if (
      score1 >= pointsPerSet &&
      score1 - score2 >= advantage
    ) {
      if (currentSet < numSets) {
        alert(`Fim do set ${currentSet}!`);
        setCurrentSet(currentSet + 1);
        setScoreA(0);
        setScoreB(0);
        // manter rodízio serve pra próximo set
        // saque começa com time que perdeu último ponto (simples aqui, poderia ser custom)
        setServingTeam(currentSet % 2 === 1 ? 'B' : 'A');
      } else {
        alert('Fim do jogo!');
      }
    }
  }

  // Registrar saque: se foi erro ou ponto
  function recordServe(success) {
    if (servingTeam === 'A') {
      setStatsA((old) => {
        const newStats = [...old];
        newStats[serverA].serves++;
        if (!success) newStats[serverA].errors++;
        return newStats;
      });
    } else {
      setStatsB((old) => {
        const newStats = [...old];
        newStats[serverB].serves++;
        if (!success) newStats[serverB].errors++;
        return newStats;
      });
    }
  }

  // Gera súmula em PDF simples
  function generatePDF() {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Súmula Vôlei Dupla', 10, 10);

    doc.setFontSize(12);
    doc.text(`Time A: ${teamA[0]} e ${teamA[1]}`, 10, 20);
    doc.text(`Time B: ${teamB[0]} e ${teamB[1]}`, 10, 30);
    doc.text(`Placar Set ${currentSet}: ${scoreA} x ${scoreB}`, 10, 40);

    doc.text('Estatísticas Saque:', 10, 50);
    doc.text(`Time A:`, 10, 60);
    teamA.forEach((p, i) => {
      doc.text(
        `${p}: ${statsA[i].serves} saques, ${statsA[i].errors} erros`,
        15,
        70 + i * 10
      );
    });
    doc.text(`Time B:`, 10, 90);
    teamB.forEach((p, i) => {
      doc.text(
        `${p}: ${statsB[i].serves} saques, ${statsB[i].errors} erros`,
        15,
        100 + i * 10
      );
    });

    doc.save('sumula_volei_dupla.pdf');
  }

  return (
    <div style={{ padding: 20, fontFamily: 'Arial', maxWidth: 600, margin: 'auto' }}>
      <h1>Vôlei Dupla - Súmula</h1>

      <section>
        <h2>Cadastro das Duplas</h2>
        <div>
          <h3>Time A</h3>
          <input
            placeholder="Jogador 1"
            value={teamA[0]}
            onChange={(e) => setTeamA([e.target.value, teamA[1]])}
          />
          <input
            placeholder="Jogador 2"
            value={teamA[1]}
            onChange={(e) => setTeamA([teamA[0], e.target.value])}
          />
        </div>
        <div>
          <h3>Time B</h3>
          <input
            placeholder="Jogador 1"
            value={teamB[0]}
            onChange={(e) => setTeamB([e.target.value, teamB[1]])}
          />
          <input
            placeholder="Jogador 2"
            value={teamB[1]}
            onChange={(e) => setTeamB([teamB[0], e.target.value])}
          />
        </div>
      </section>

      <section>
        <h2>Configuração do Jogo</h2>
        <label>
          Número de Sets:
          <select value={numSets} onChange={e => setNumSets(Number(e.target.value))}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </label>

        <label>
          Pontos por Set:
          <input
            type="number"
            min={1}
            value={pointsPerSet}
            onChange={(e) => setPointsPerSet(Number(e.target.value))}
          />
        </label>

        <label>
          Vantagem mínima:
          <input
            type="number"
            min={1}
            value={advantage}
            onChange={(e) => setAdvantage(Number(e.target.value))}
          />
        </label>
      </section>

      <section>
        <h2>Jogo - Set {currentSet}</h2>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 20 }}>
          <div>
            <h3>Time A</h3>
            <p>{teamA[serverA]} sacando 🔄</p>
            <p>Placar: {scoreA}</p>
            <button onClick={() => addPoint('A')}>+ Ponto</button>
          </div>

          <div>
            <h3>Time B</h3>
            <p>{teamB[serverB]} sacando 🔄</p>
            <p>Placar: {scoreB}</p>
            <button onClick={() => addPoint('B')}>+ Ponto</button>
          </div>
        </div>

        <div>
          <h4>Registrar Saque</h4>
          <button onClick={() => { recordServe(true); alert('Saque bom registrado'); }}>
            Saque Bom
          </button>
          <button onClick={() => { recordServe(false); alert('Erro de saque registrado'); }}>
            Erro de Saque
          </button>
        </div>

        <button onClick={generatePDF} style={{ marginTop: 20 }}>
          Gerar Súmula PDF
        </button>
      </section>
    </div>
  );
}

export default App;
