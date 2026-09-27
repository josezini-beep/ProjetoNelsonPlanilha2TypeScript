import express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).send("API Planilhas2 TypeScript funcionando");
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});