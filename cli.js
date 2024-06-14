const readline = require("readline");
const axios = require("axios");

const apiBaseURL = "http://localhost:3000";

const rline = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const pergunta = (query) =>
  new Promise((resolve) => rline.question(query, resolve));

const validarResposta = async (question) => {
  while (true) {
    const respo = (await pergunta(question)).trim().toLowerCase();
    if (respo === "s" || respo === "n") {
      return respo;
    }
    console.log('Resposta inválida. Por favor, digite "s" ou "n".');
  }
};

const verificarCPF = async (cpf) => {
  try {
    const response = await axios.get(`${apiBaseURL}/funcionarios/${cpf}`);
    return response.data !== null;
  } catch (error) {
    return false;
  }
};

const obterFuncionarioPorCPF = async (cpf) => {
  try {
    const response = await axios.get(`${apiBaseURL}/funcionarios/${cpf}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

const ativosPermitidos = [
  "notebook",
  "monitor1",
  "monitor2",
  "teclado",
  "mouse",
  "desktop",
  "nobreak",
  "headset",
  "celular",
  "acessorios",
];

const cadastrarFuncionario = async () => {
  try {
    const cpf = (await pergunta("CPF: ")).trim();
    const nome = (await pergunta("Nome: ")).trim();

    const ativos = {};
    const ativosDetalhes = [];

    for (const ativo of ativosPermitidos) {
      const resposta = await validarResposta(`Possui ${ativo}? (s/n): `);
      ativos[ativo] = resposta === "s";

      if (ativos[ativo]) {
        const modelo = await pergunta(`Modelo do ${ativo}: `);
        const numeroSerie = await pergunta(`Número de Série do ${ativo}: `);
        const versao = await pergunta(`Versão do ${ativo}: `);
        const caracteristicas = await pergunta(
          `Características do ${ativo}: `
        );
        const observacao = await pergunta(`Observação do ${ativo}: `);

        const ativoData = {
          tipo: ativo,
          modelo,
          numeroSerie,
          versao,
          caracteristicas,
          observacao,
          funcionarioCpf: cpf,
        };

        ativosDetalhes.push(ativoData);
      }
    }

    const responseFuncionario = await axios.post(`${apiBaseURL}/funcionarios`, {
      cpf,
      nome,
      ativos,
    });
    console.log(
      "Funcionário cadastrado com sucesso:",
      responseFuncionario.data
    );

    for (const ativo of ativosDetalhes) {
      try {
        const responseAtivo = await axios.post(`${apiBaseURL}/ativos`, ativo);
        console.log(
          `Ativo ${ativo.tipo} cadastrado com sucesso:`,
          responseAtivo.data
        );
      } catch (error) {
        console.error(
          `Erro ao cadastrar ativo ${ativo.tipo}:`,
          error.response ? error.response.data : error.message
        );
      }
    }
  } catch (error) {
    console.error(
      "Erro ao cadastrar funcionário:",
      error.response ? error.response.data : error.message
    );
  }
};

const excluirFuncionario = async () => {
  try {
    const cpf = (
      await pergunta(
        "CPF do funcionário que será excluido: "
      )
    ).trim();
    const funcionario = await obterFuncionarioPorCPF(cpf);

    if (!funcionario) {
      console.log("Funcionário não encontrado.");
      return;
    }

    const possuiAtivos = Object.values(funcionario.ativos).some(
      (possui) => possui
    );
    if (possuiAtivos) {
      console.log(
        "Não é possível excluir o funcionário porque ele possui ativos cadastrados."
      );
      return;
    }

    await axios.delete(`${apiBaseURL}/funcionarios/${cpf}`);
    console.log("Funcionário excluído com sucesso.");
  } catch (error) {
    console.error(
      "Erro ao excluir funcionário:",
      error.response ? error.response.data : error.message
    );
  }
};

const listarFuncionarios = async () => {
  try {
    const response = await axios.get(`${apiBaseURL}/funcionarios`);
    const funcionarios = response.data;

    console.log("\nLista de Funcionários:");
    funcionarios.forEach((funcionario) => {
      console.log(`- Nome: ${funcionario.nome}, CPF: ${funcionario.cpf}`);
    });
  } catch (error) {
    console.error(
      "Erro ao listar funcionários:",
      error.response ? error.response.data : error.message
    );
  }
};

const consultarInventarioFuncionario = async () => {
  try {
    const cpf = (
      await pergunta("CPF do funcionário: ")
    ).trim();
    const funcionario = await obterFuncionarioPorCPF(cpf);

    if (!funcionario) {
      console.log("Funcionário não encontrado.");
      return;
    }

    console.log(`\nInventário do Funcionário: ${funcionario.nome}`);
    console.log(`CPF: ${funcionario.cpf}`);
    console.log("Ativos:");
    for (const [ativo, possui] of Object.entries(funcionario.ativos)) {
      if (possui) {
        const ativoResponse = await axios.get(`${apiBaseURL}/ativos`, {
          params: { tipo: ativo, funcionarioCpf: funcionario.cpf },
        });
        const ativoDetalhes = ativoResponse.data[0];
        console.log(`  - ${ativo}`);
        console.log(`    - Modelo: ${ativoDetalhes.modelo}`);
        console.log(`    - Número de Série: ${ativoDetalhes.numeroSerie}`);
        console.log(`    - Versão: ${ativoDetalhes.versao}`);
        console.log(`    - Características: ${ativoDetalhes.caracteristicas}`);
        console.log(`    - Observação: ${ativoDetalhes.observacao}`);
      }
    }
  } catch (error) {
    console.error(
      "Erro ao consultar inventário do funcionário:",
      error.response ? error.response.data : error.message
    );
  }
};

const atualizarNomeFuncionario = async () => {
  try {
    const cpf = (
      await pergunta(
        "CPF do funcionário a ser atualizado (formato: xxx.xxx.xxx-xx): "
      )
    ).trim();
    const funcionario = await obterFuncionarioPorCPF(cpf);

    if (!funcionario) {
      console.log("Funcionário não encontrado.");
      return;
    }

    console.log(`Nome atual do funcionário: ${funcionario.nome}`);
    const nome = (await pergunta("Novo nome: ")).trim();

    const response = await axios.put(`${apiBaseURL}/funcionarios/${cpf}`, {
      nome,
    });
    console.log("Funcionário atualizado com sucesso:", response.data);
  } catch (error) {
    console.error(
      "Erro ao atualizar funcionário:",
      error.response ? error.response.data : error.message
    );
  }
};

const atualizarAtivo = async () => {
  try {
    let funcionarioCpf;
    while (true) {
      funcionarioCpf = (
        await pergunta(
          "CPF do Funcionário associado (formato: xxx.xxx.xxx-xx): "
        )
      ).trim();
      const cpfValido = await verificarCPF(funcionarioCpf);
      if (cpfValido) break;
      console.log(
        "CPF não encontrado. Por favor, digite um CPF que já esteja cadastrado."
      );
    }

    const funcionario = await obterFuncionarioPorCPF(funcionarioCpf);
    console.log("Ativos do funcionário:");
    const ativosPossuidos = Object.keys(funcionario.ativos).filter(
      (ativo) => funcionario.ativos[ativo]
    );

    if (ativosPossuidos.length === 0) {
      console.log("Este funcionário não possui ativos.");
      return;
    }

    ativosPossuidos.forEach((ativo, index) => {
      console.log(`(${index + 1}) ${ativo}`);
    });

    let ativoIndex;
    while (true) {
      ativoIndex = parseInt(
        await pergunta("Escolha o número do ativo que deseja atualizar: ")
      );
      if (ativoIndex > 0 && ativoIndex <= ativosPossuidos.length) break;
      console.log("Escolha inválida. Tente novamente.");
    }

    const tipo = ativosPossuidos[ativoIndex - 1];
    const modelo = (await pergunta(`Novo modelo do ${tipo}: `)).trim();
    const numeroSerie = (
      await pergunta(`Novo número de série do ${tipo}: `)
    ).trim();
    const versao = (await pergunta(`Nova versão do ${tipo}: `)).trim();
    const caracteristicas = (
      await pergunta(`Novas características do ${tipo}: `)
    ).trim();
    const observacao = (
      await pergunta(`Nova observação do ${tipo}: `)
    ).trim();

    const response = await axios.put(`${apiBaseURL}/ativos`, {
      tipo,
      modelo,
      numeroSerie,
      versao,
      caracteristicas,
      observacao,
      funcionarioCpf,
    });
    console.log("Ativo atualizado com sucesso:", response.data);
  } catch (error) {
    console.error(
      "Erro ao atualizar ativo:",
      error.response ? error.response.data : error.message
    );
  }
};

const limparAtivo = async () => {
  try {
    let funcionarioCpf;
    while (true) {
      funcionarioCpf = (
        await pergunta(
          "CPF do Funcionário associado (formato: xxx.xxx.xxx-xx): "
        )
      ).trim();
      const cpfValido = await verificarCPF(funcionarioCpf);
      if (cpfValido) break;
      console.log(
        "CPF não encontrado. Por favor, digite um CPF que já esteja cadastrado."
      );
    }

    const funcionario = await obterFuncionarioPorCPF(funcionarioCpf);
    console.log("Ativos do funcionário:");
    const ativosPossuidos = Object.keys(funcionario.ativos).filter(
      (ativo) => funcionario.ativos[ativo]
    );

    if (ativosPossuidos.length === 0) {
      console.log("Este funcionário não possui ativos.");
      return;
    }

    ativosPossuidos.forEach((ativo, index) => {
      console.log(`(${index + 1}) ${ativo}`);
    });

    let ativoIndex;
    while (true) {
      ativoIndex = parseInt(
        await pergunta("Escolha o número do ativo que deseja limpar: ")
      );
      if (ativoIndex > 0 && ativoIndex <= ativosPossuidos.length) break;
      console.log("Escolha inválida. Tente novamente.");
    }

    const tipo = ativosPossuidos[ativoIndex - 1];

    await axios.delete(`${apiBaseURL}/ativos`, {
      data: { tipo, funcionarioCpf },
    });
    console.log("Ativo limpo com sucesso.");

    funcionario.ativos[tipo] = false;
    await axios.put(`${apiBaseURL}/funcionarios/${funcionarioCpf}`, {
      nome: funcionario.nome,
      ativos: funcionario.ativos,
    });
  } catch (error) {
    console.error(
      "Erro ao limpar ativo:",
      error.response ? error.response.data : error.message
    );
  }
};

const Menu = async () => {
  console.log("\n===== Sistema de Cadastro de Funcionários e Ativos =====");
  const choice = (
    await pergunta(
      "Escolha uma opção:\n (1) Cadastrar Funcionário\n (2) Excluir Funcionário\n (3) Listar Funcionários\n (4) Consultar Inventário de Funcionário\n (5) Atualizar Nome de Funcionário\n (6) Atualizar Ativo\n (7) Limpar Ativo\n (8) Sair\nEscolha: "
    )
  ).trim();

  switch (choice) {
    case "1":
      await cadastrarFuncionario();
      break;
    case "2":
      await excluirFuncionario();
      break;
    case "3":
      await listarFuncionarios();
      break;
    case "4":
      await consultarInventarioFuncionario();
      break;
    case "5":
      await atualizarNomeFuncionario();
      break;
    case "6":
      await atualizarAtivo();
      break;
    case "7":
      await limparAtivo();
      break;
    case "8":
      console.log("Saindo...");
      rline.close();
      return;
    default:
      console.log("Opção inválida. Tente novamente.");
  }

  await Menu(); // Volta ao menu principal após a operação
};

Menu();
