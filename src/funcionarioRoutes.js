const express = require('express');
const router = express.Router();
const funcionarios = require('./FuncionarioController');

router.post('/', funcionarios.create);
router.delete('/:cpf', funcionarios.delete);
router.get('/', funcionarios.getAll);
router.get('/:cpf', funcionarios.getByCpf);
router.put('/:cpf', funcionarios.update);

module.exports = router;
