const express = require('express');
const app = express();
const port = 3000; // Escolha uma porta disponível

app.use(express.static('D:/Java/api_front')); // Define a pasta onde seus arquivos estáticos estão

app.listen(port, () => {
  console.log(`Servidor web local rodando em http://localhost:${port}`);
});
//INSTALANDO  EXPRESS 
// node -v
//npm init -y 
//npm install express --save
//node server.js
//npm start