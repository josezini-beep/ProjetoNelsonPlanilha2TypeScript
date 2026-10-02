import express = require("express");
import fs = require("fs");

interface Pessoa {
    nome: string;
    email: string;
    cidade: string;
    profissao: string;
    idade: number;
    cpf: string;
}

const app = express();

app.use(express.json());

const pessoas: Pessoa[] = [];

// Lê os arquivos
for (let i = 1; i <= 10; i++) {
    const conteudo: string = fs.readFileSync(
        `pessoas_${i}.csv`,
        "utf8"
    );

    const linhas: string[] = conteudo
        .trim()
        .split(/\r?\n/);

    // Remove o cabeçalho
    linhas.shift();

    for (const linha of linhas) {
        const dados: string[] = linha.split(",");

        const pessoa: Pessoa = {
            nome: dados[0].trim(),
            email: dados[1].trim(),
            cidade: dados[2].trim(),
            profissao: dados[3].trim(),
            idade: parseInt(dados[4].trim(), 10),
            cpf: dados[5].trim()
        };

        pessoas.push(pessoa);
    }
}

fs.writeFileSync(
    "pessoas.txt",
    JSON.stringify(pessoas, null, 2),
    "utf8"
);

// Busca uma pessoa pelo CPF
app.get("/pessoas/:cpf", function (req, res) {
    const cpf = req.params.cpf;

    for (let i = 0; i < pessoas.length; i++) {
        if (pessoas[i].cpf === cpf) {
            res.status(200).json(pessoas[i]);
            return;
        }
    }

    res.status(404).json({
        mensagem: "Pessoa não encontrada"
    });
});

// Rota inicial
app.get("/", function (req, res) {
    res.status(200).json({
        mensagem: "API funcionando"
    });
});

// Retorna todas as pessoas
app.get("/pessoas", function (req, res) {
    res.status(200).json(pessoas);
});

// Cadastra uma nova pessoa
app.post("/pessoas", function (req, res) {

    const {
        nome,
        email,
        cidade,
        profissao,
        idade,
        cpf
        // como eu vou grantir que oque esta vindo dentro do body da requisição é exatamente o que eu espero, ou seja, que seja do tipo Pessoa?
    } = req.body;

    if (
        nome === undefined ||
        email === undefined ||
        cidade === undefined ||
        profissao === undefined ||
        idade === undefined ||
        cpf === undefined
    ) {
        return res.status(400).json({
            mensagem: "Todos os campos são obrigatórios"
        });
    }

    const novaPessoa: Pessoa = {
        nome: nome,
        email: email,
        cidade: cidade,
        profissao: profissao,
        idade: idade,
        cpf: cpf
    };

    pessoas.push(novaPessoa);

    res.status(201).json({
        mensagem: "Pessoa cadastrada com sucesso",
        pessoa: novaPessoa
    });
});

// Remove uma pessoa pelo CPF
app.delete("/pessoas/:cpf", function (req, res) {
    const cpf = req.params.cpf;
    let index = -1;

    for (let i = 0; i < pessoas.length; i++) {
        if (pessoas[i].cpf === cpf) {
            index = i;
            break;
        }
    }

    if (index === -1) {
        res.status(404).json({
            mensagem: "Pessoa não encontrada"
        });
        return;
    }

    const pessoaRemovida = pessoas[index];

    pessoas.splice(index, 1);
    // ao invés de apagar este cara colocar um marcador como apagado
    res.status(200).json({
        mensagem: "Pessoa removida com sucesso",
        pessoa: pessoaRemovida
    });
});
// atualiza uma pessoa pelo CPF
app.patch("/pessoas/:cpf", function (req, res) {
    const cpf = req.params.cpf;
    let index = -1;

    for (let i = 0; i < pessoas.length; i++) {
        if (pessoas[i].cpf === cpf) {
            index = i;
            break;
        }
    }

    if (index === -1) {
        res.status(404).json({
            mensagem: "Pessoa não encontrada"
        });
        return;
    }

    if (req.body.nome !== undefined) {
        pessoas[index].nome = req.body.nome;
    }

    if (req.body.email !== undefined) {
        pessoas[index].email = req.body.email;
    }

    if (req.body.cidade !== undefined) {
        pessoas[index].cidade = req.body.cidade;
    }

    if (req.body.profissao !== undefined) {
        pessoas[index].profissao = req.body.profissao;
    }

    if (req.body.idade !== undefined) {
        pessoas[index].idade = req.body.idade;
    }

    res.status(200).json({
        mensagem: "Alteração realizada com sucesso",
        pessoa: pessoas[index]
    });
});

// Inicia o servidor
app.listen(3000, function () {
    console.log("Servidor rodando na porta 3000");
});