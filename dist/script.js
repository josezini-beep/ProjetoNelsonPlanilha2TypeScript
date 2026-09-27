"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const conteudo = [];
for (let i = 1; i <= 10; i++) {
    conteudo[i] = fs.readFileSync(`pessoas_${i}.csv`, "utf8");
}
const textoCompleto = conteudo.join("\n");
const linhas = textoCompleto
    .trim()
    .split("\n");
linhas.shift();
const resultado = [];
for (const linha of linhas) {
    const Dados = linha.split(",");
    const pessoa = {
        nome: Dados[0],
        email: Dados[1],
        cidade: Dados[2],
        profissao: Dados[3],
        idade: Dados[4],
        cpf: Dados[5]
    };
    if (Number(Dados[4]) > 30) {
        if (pessoa.profissao !== undefined && pessoa.cpf !== undefined) {
            if (pessoa.profissao.includes("Gerente") ||
                pessoa.profissao.includes("Diretor") ||
                pessoa.profissao.includes("Coordenador") ||
                pessoa.profissao.includes("Encarregado") ||
                pessoa.profissao.includes("Líder") ||
                pessoa.profissao.includes("Chefe") ||
                pessoa.profissao.includes("Supervisor")) {
                if (pessoa.cpf !== undefined) {
                    if (pessoa.cpf[0] === "5" ||
                        pessoa.cpf[0] === "7" ||
                        pessoa.cpf[0] === "9") {
                        resultado.push(Dados.join(","));
                    }
                }
            }
        }
    }
}
const textoFinal = resultado
    .sort()
    .join("\n");
fs.writeFileSync("nomes.txt", textoFinal, "utf8");
console.log(textoFinal);
