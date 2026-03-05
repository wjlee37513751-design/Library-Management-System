const authController = require('../controllers/authController');

module.exports = {
    register: authController.registerUser,
    login: authController.loginUser,
    list: authController.listUsers,
    update: authController.updateUser,
    delete: authController.deleteUser
};