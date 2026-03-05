const bookController = require('../controllers/bookController');

module.exports = {
    list: bookController.getAllBooks,
    detail: bookController.getBookById,
    add: bookController.createBook,
    update: bookController.updateBook,
    delete: bookController.deleteBook
};

