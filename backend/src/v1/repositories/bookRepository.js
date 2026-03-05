const db = require('../data/db');

const findAllBooks = async () => {
    const [rows] = await db.execute('SELECT * FROM book');
    return rows;
};

const findBookById = async (id) => {
    const [rows] = await db.execute('SELECT * FROM book WHERE bookID = ?', [id]);
    return rows[0];
};

const createBook = async (title, authorID, releaseYear) => {
    const [result] = await db.execute(
        'INSERT INTO book (title, authorID, releaseYear) VALUES (?, ?, ?)',
        [title, authorID, releaseYear]
    );
    return result.insertId;
};

const updateBook = async (id, title, authorID, releaseYear) => {
    const [result] = await db.execute(
        'UPDATE book SET title = ?, authorID = ?, releaseYear = ? WHERE bookID = ?',
        [title, authorID, releaseYear, id]
    );
    return result.affectedRows > 0;
};

const deleteBook = async (id) => {
    // Delete related records from all tables that reference book
    await db.execute('DELETE FROM review WHERE bookID = ?', [id]);
    await db.execute('DELETE FROM loan WHERE bookID = ?', [id]);
    await db.execute('DELETE FROM book_has_category WHERE bookID = ?', [id]);
    // Delete book
    const [result] = await db.execute('DELETE FROM book WHERE bookID = ?', [id]);
    return result.affectedRows > 0;
};

module.exports = { findAllBooks, findBookById, createBook, updateBook, deleteBook };