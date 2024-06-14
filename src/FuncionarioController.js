const Funcionario = require('./Funcionario');

exports.create = async (req, res) => {
  try {
    const funcionario = new Funcionario(req.body);
    await funcionario.save();
    res.status(201).send(funcionario);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.delete = async (req, res) => {
  try {
    const funcionario = await Funcionario.findOneAndDelete({ cpf: req.params.cpf });
    if (!funcionario) {
      return res.status(404).send();
    }
    res.send(funcionario);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getAll = async (req, res) => {
  try {
    const funcionarios = await Funcionario.find({});
    res.send(funcionarios);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getByCpf = async (req, res) => {
  try {
    const funcionario = await Funcionario.findOne({ cpf: req.params.cpf });
    if (!funcionario) {
      return res.status(404).send();
    }
    res.send(funcionario);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.update = async (req, res) => {
  try {
    const funcionario = await Funcionario.findOneAndUpdate({ cpf: req.params.cpf }, req.body, { new: true, runValidators: true });
    if (!funcionario) {
      return res.status(404).send();
    }
    res.send(funcionario);
  } catch (error) {
    res.status(400).send(error);
  }
};
