const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const router = require("./router");
const path = require("path"); // Adicionado para lidar com caminhos de forma segura

dotenv.config(); // Carregar as variáveis de ambiente do arquivo .env

const app = express();

// Configuração do EJS como view engine
app.set("view engine", "ejs");
// Definir o diretório de views (opcional, caso queira especificar)
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(cors()); // Habilita CORS para requisições de origens diferentes
app.use(express.json()); // Permite que o servidor processe JSON no body das requisições
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Serve arquivos estáticos da pasta 'public'
app.use(router); // Usa as rotas definidas no arquivo router

// Corrigido o acesso à variável de ambiente
const { PORT } = process.env;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});