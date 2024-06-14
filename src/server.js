const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());



mongoose.connect('mongodb+srv://brunoHenrique:hesoyam987@inventarioativos.dbforjh.mongodb.net/Ativos', { useNewUrlParser: true, useUnifiedTopology: true });

const ativoSchema = new mongoose.Schema({
  tipo: String,
  modelo: String,
  numeroSerie: String,
  versao: String,
  caracteristicas: String,
  observacao: String,
  funcionarioCpf: String
});

const funcionarioSchema = new mongoose.Schema({
  cpf: String,
  nome: String,
  ativos: Object
});


const Funcionario = mongoose.model('Funcionario', funcionarioSchema);
const Ativo = mongoose.model('Ativo', ativoSchema);

app.get('/funcionarios/:cpf', async (req, res) => {
  try {
    const funcionario = await Funcionario.findOne({ cpf: req.params.cpf });
    res.json(funcionario);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/funcionarios', async (req, res) => {
  try {
    const funcionarios = await Funcionario.find();
    res.json(funcionarios);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/funcionarios', async (req, res) => {
  try {
    const funcionario = new Funcionario(req.body);
    await funcionario.save();
    res.json(funcionario);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put('/funcionarios/:cpf', async (req, res) => {
  try {
    const funcionario = await Funcionario.findOneAndUpdate({ cpf: req.params.cpf }, req.body, { new: true });
    res.json(funcionario);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete('/funcionarios/:cpf', async (req, res) => {
  try {
    await Funcionario.deleteOne({ cpf: req.params.cpf });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/ativos', async (req, res) => {
  try {
    const ativo = new Ativo(req.body);
    await ativo.save();
    res.json(ativo);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/ativos', async (req, res) => {
  try {
    const { tipo, funcionarioCpf } = req.query;
    const ativos = await Ativo.find({ tipo, funcionarioCpf });
    res.json(ativos);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put('/ativos', async (req, res) => {
  try {
    const { tipo, funcionarioCpf, ...updateData } = req.body;
    const ativo = await Ativo.findOneAndUpdate({ tipo, funcionarioCpf }, updateData, { new: true });
    res.json(ativo);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete('/ativos', async (req, res) => {
  try {
    const { tipo, funcionarioCpf } = req.body;
    await Ativo.deleteOne({ tipo, funcionarioCpf });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
