const express = require('express');
const router = express.Router();
const ativos = require('./AtivoController');

router.post('/', ativos.create);
router.delete('/:id', ativos.delete);
router.put('/:id', ativos.update);
router.get('/funcionario/:cpf', ativos.getByFuncionario);

module.exports = router;
