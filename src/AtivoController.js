const Ativo = require('./Ativo');

exports.create = async (req, res) => {
  try {
    const ativo = new Ativo(req.body);
    await ativo.save();
    res.status(201).send(ativo);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.delete = async (req, res) => {
  try {
    const ativo = await Ativo.findByIdAndDelete(req.params.id);
    if (!ativo) {
      return res.status(404).send();
    }
    res.send(ativo);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.update = async (req, res) => {
  try {
    const ativo = await Ativo.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!ativo) {
      return res.status(404).send();
    }
    res.send(ativo);
  } catch (error) {
    res.status(400).send(error);
  }
};



exports.getByFuncionario = async (req, res) => {
  try {
    const ativos = await Ativo.find({ funcionarioCpf: req.params.cpf });
    res.send(ativos);
  } catch (error) {
    res.status(500).send(error);
  }
};
