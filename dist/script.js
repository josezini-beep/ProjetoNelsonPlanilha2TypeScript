"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());
const pessoas = [];
// Lê os arquivos
for (let i = 1; i <= 10; i++) {
    const conteudo = fs.readFileSync(`pessoas_${i}.csv`, "utf8");
    const linhas = conteudo
        .trim()
        .split(/\r?\n/);
    // Remove o cabeçalho
    linhas.shift();
    for (const linha of linhas) {
        const dados = linha.split(",");
        const pessoa = {
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
fs.writeFileSync("pessoas.txt", JSON.stringify(pessoas, null, 2), "utf8");
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
    const novaPessoa = {
        nome: req.body.nome,
        email: req.body.email,
        cidade: req.body.cidade,
        profissao: req.body.profissao,
        idade: req.body.idade,
        cpf: req.body.cpf
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
