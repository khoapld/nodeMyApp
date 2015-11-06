var express = require('express');
var router = express.Router();

var UserController = require('../controllers/userController.js');

/* GET users listing. */
router.get('/', UserController.getUsers);

/* POST /users */
router.post('/', UserController.createUser);

/* GET /users/id */
router.get('/:id', UserController.getUser);

/* PUT /users/:id */
router.put('/:id', UserController.updateUser);

/* DELETE /users/:id */
router.delete('/:id', UserController.deleteUser);

module.exports = router;
