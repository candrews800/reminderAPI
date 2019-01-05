const express = require('express')
const app = express();
const port = 3000;

const config = require("./config/config");

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const { Pool, Client } = require('pg');

const pool = new Pool(config.pg);

pool.query('SELECT NOW()', (err, res) => {
  console.log(res);
  pool.end();
});

const client = new Client(config.pg);

client.connect();

client.query('SELECT NOW()', (err, res) => {
  console.log(res);
  client.end();
});
