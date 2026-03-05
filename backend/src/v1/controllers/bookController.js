const bookRepository = require('../repositories/bookRepository');

const getAllBooks = async () => {
    return await bookRepository.findAllBooks();
};

const getBookById = async (id) => {
    return await bookRepository.findBookById(id);
};

const createBook = async (title, authorID, releaseYear) => {
    return await bookRepository.createBook(title, authorID, releaseYear);
};

const updateBook = async (id, title, authorID, releaseYear) => {
    return await bookRepository.updateBook(id, title, authorID, releaseYear);
};

const deleteBook = async (id) => {
    return await bookRepository.deleteBook(id);
};

module.exports = { getAllBooks, getBookById, createBook, updateBook, deleteBook };