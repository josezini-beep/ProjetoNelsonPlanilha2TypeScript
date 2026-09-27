const fs = require("fs");
const conteudo = [ ];
for (let i =1;i<=10;i++){
 conteudo[i] = fs.readFileSync(`pessoas_${i}.csv`, "utf8");
}
const textoCompleto = conteudo.join("\n");
const linhas = textoCompleto.trim().split("\n");
linhas.shift();
const resultado=[]
for (const linha of linhas) {
   const Dados = linha.split(",");
   if(Dados[4]>30){
         if(Dados[5]!=undefined){
            if(Dados[3].includes("Gerente")||Dados[3].includes("Diretor")||Dados[3].includes("Coordenador")||Dados[3].includes("Encarregado")||Dados[3].includes("Líder")||Dados[3].   includes("Chefe")||Dados[3].includes("Supervisor")) {
               if (Dados[5][0]=="5"||Dados[5][0]=="7"||Dados[5][0]=="9"){
                  resultado.push(Dados.join(","));
              }
           }
        }
      }
  }
const textoFinal = resultado.sort().join("\n");

fs.writeFileSync("nomes.txt", textoFinal, "utf8");

console.log(textoFinal);

//pegar todos ons nomes de todos os cpf's que comecem 5, 7, 9 que tenham um profissao ligada chefia de area com idade acima de 30 anos
//pedir pra ia gerar um csv de 10 arquivos de 3k linhas com profissoes variadas