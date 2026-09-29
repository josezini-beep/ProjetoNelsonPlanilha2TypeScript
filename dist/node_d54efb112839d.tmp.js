"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());
const pessoas = [];
//le os arquivos
for (let i = 1; i <= 10; i++) {
    const conteudo = fs.readFileSync(`pessoas_${i}.csv`, "utf8");
    const linhas = conteudo
        .trim()
        .split(/\n?\r/);
    // remove o cabeçalho
    linhas.shift();
    for (const linha of linhas) {
        const Dados = linha.split(",");
        const pessoa = {
            nome: Dados[0].trim(),
            email: Dados[1].trim(),
            cidade: Dados[2].trim(),
            profissao: Dados[3].trim(),
            idade: parseInt(Dados[4].trim()),
            cpf: Dados[5].trim()
        };
        pessoas.push(pessoa);
    }
}
fs.writeFileSync("pessoas.txt", JSON.stringify(pessoas, null, 2), "utf8");
// api
app.get("/pessoas/:cpf", (req, res) => {
    const cpf = req.params.cpf;
    const pessoa = pessoas.find(pessoa => {
        return pessoa.cpf === cpf;
    });
    if (!pessoa) {
        return res.status(404).json({
            mensagem: "Pessoa não encontrada"
        });
    }
    res.status(200).json(pessoa);
});
app.get("/", (req, res) => {
    res.status(200).json({
        mensagem: "API funcionando"
    });
});
// todas as pessoas
app.get("/pessoas", (req, res) => {
    res.status(200).json(pessoas);
});
// nova pessoa
app.post("/pessoas", (req, res) => {
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
// remover pessoa só pelo cpf
app.delete("/pessoas/:cpf", (req, res) => {
    const cpf = req.params.cpf;
    const index = pessoas.findIndex(pessoa => {
        return pessoa.cpf === cpf;
    });
    if (index === -1) {
        return res.status(404).json({
            mensagem: "Pessoa não encontrada"
        });
    }
    const pessoaRemovida = pessoas[index];
    pessoas.splice(index, 1);
    res.status(200).json({
        mensagem: "Pessoa removida com sucesso",
        pessoa: pessoaRemovida
    });
});
// inicia o servidor
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
