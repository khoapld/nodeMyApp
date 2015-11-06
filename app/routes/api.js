var express = require('express');
var router = express.Router();

var UserController = require('../controllers/userController.js');
var Auth = require('../middlewares/auth.js');

/* POST - login user */
router.post('/login', Auth.login);

/* GET - logout user */
router.post('/logout', Auth.logout);

/* POST - signup user */
router.post('/signup', UserController.signupUser);

/* GET - get users info */
router.get('/user/getUsers', UserController.getUsers);

/* POST - get user info */
router.post('/user/getUser', UserController.getUser);

/* PUT - update user info */
router.put('/user/updateUser', UserController.updateUser);

/* DELETE - delete user */
router.delete('/user/updateUser', UserController.deleteUser);

module.exports = router;
