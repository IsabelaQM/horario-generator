function gerarDisciplinas() {
  const disciplinas = [];
  const totalDisciplinas = 25;
  const totalPeriodos = 5;
  const totalProfessores = 10;

  for (let i = 0; i < totalDisciplinas; i++) {
    const periodo = i % totalPeriodos; // Distribui disciplinas entre os 5 períodos
    const professor = i % totalProfessores; // Distribui professores entre as disciplinas
    disciplinas.push({
      sigla: `D${i.toString().padStart(2, "0")}`,
      professor: `P${professor.toString().padStart(2, "0")}`,
      periodo: periodo,
    });
  }

  return disciplinas;
}

function embaralhar(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function gerarPopulacao(disciplinas, linhas = 50, colunas = 100) {
  const populacao = [];

  for (let i = 0; i < linhas; i++) {
    const individuo = Array(colunas).fill(null); // Cria uma linha com 100 colunas
    const disciplinasEmbaralhadas = embaralhar(disciplinas);

    // Alocar disciplinas nos horários
    disciplinasEmbaralhadas.forEach((disciplina) => {
      let alocados = 0;
      const horariosDisponiveis = [];

      // Identificar horários disponíveis no período correto
      for (let j = 0; j < colunas; j++) {
        if (Math.floor(j / 20) === disciplina.periodo && individuo[j] === null) {
          horariosDisponiveis.push(j);
        }
      }

      // Embaralhar os horários disponíveis para distribuir ao longo da semana
      const horariosEmbaralhados = embaralhar(horariosDisponiveis);

      // Alocar 4 horários para a disciplina
      for (const horario of horariosEmbaralhados) {
        if (alocados < 4) {
          individuo[horario] = `${disciplina.sigla} ${disciplina.professor}`;
          alocados++;
        } else {
          break;
        }
      }
    });

    populacao.push(individuo);
  }

  return populacao;
}

function renderizarGrade(populacao) {
  const app = document.getElementById("app");
  app.innerHTML = ""; // Limpa o conteúdo anterior

  const tabela = document.createElement("table");

  // Cabeçalho 1: Períodos
  const trPeriodos = document.createElement("tr");
  const thVazio1 = document.createElement("th");
  thVazio1.rowSpan = 2; // Mescla a célula para incluir o número da linha
  thVazio1.textContent = "#";
  trPeriodos.appendChild(thVazio1);

  for (let i = 0; i < 5; i++) {
    const th = document.createElement("th");
    th.colSpan = 20; // Cada período ocupa 20 colunas
    th.textContent = `Período ${i + 1}`;
    trPeriodos.appendChild(th);
  }
  tabela.appendChild(trPeriodos);

  // Cabeçalho 2: Dias e Horários
  const trHorarios = document.createElement("tr");
  for (let i = 0; i < 100; i++) {
    const th = document.createElement("th");
    const dia = ["Seg", "Ter", "Qua", "Qui", "Sex"][Math.floor((i % 20) / 4)];
    const horario = (i % 4) + 1;
    th.textContent = `${dia} H${horario}`;
    trHorarios.appendChild(th);
  }
  tabela.appendChild(trHorarios);

  // Corpo da Tabela
  populacao.forEach((linha, idx) => {
    const tr = document.createElement("tr");

    // Número da linha
    const thLinha = document.createElement("th");
    thLinha.textContent = idx + 1;
    tr.appendChild(thLinha);

    // Horários
    linha.forEach((celula) => {
      const td = document.createElement("td");
      td.textContent = celula || ""; // Preenche com vazio se a célula for null
      tr.appendChild(td);
    });

    tabela.appendChild(tr);
  });

  app.appendChild(tabela);
}

// Execução
const disciplinas = gerarDisciplinas();
const populacao = gerarPopulacao(disciplinas);
renderizarGrade(populacao);