var express = require('express');
var router = express.Router();

var IndexController = require('../controllers/indexController.js');

/* GET home page. */
router.get('/', IndexController.index);

/* GET Signup page. */
router.get('/signup', IndexController.signup);

/* GET Login page. */
router.get('/login', IndexController.login);

/* GET Logout page. */
router.get('/logout', IndexController.logout);

module.exports = router;
