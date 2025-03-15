const { Sequelize } = require("sequelize");

const connection = new Sequelize("if0_38527140_nutritionist", "if0_38527140", "Z166826042213l", {
    host: "sql103.infinityfree.com",
    dialect: "mysql",  // Definindo o dialeto como MySQL
    port: 3306,        // Definindo a porta padrão do MySQL
    logging: false     // Desativa o log de SQL (opcional, mas recomendado em produção)
});

// Testando a conexão com o banco de dados
connection.authenticate()
  .then(() => {
    console.log("Conexão bem-sucedida!");
  })
  .catch((err) => {
    console.error("Erro ao conectar:", err);
  });

module.exports = connection;  // Exportando a instância do Sequelize para usá-la em outros arquivos
