const db = require('../data/db');

const createUser = async (name, hashedPassword, email, phoneNumber, zipCode, role = 'user') => {
    // Check if zipCode exists in city table first
    const [cityExists] = await db.execute('SELECT zipCode FROM city WHERE zipCode = ?', [zipCode]);

    if (cityExists.length === 0) {
        await db.execute('INSERT INTO city (zipCode, city) VALUES (?, ?)', [zipCode, 'Unknown City']);
        console.log(`New zipCode (${zipCode}) added to city table`);
    }


    const [result] = await db.execute(
        'INSERT INTO user (name, password, email, phoneNumber, zipCode, role) VALUES (?, ?, ?, ?, ?, ?)',
        [name, hashedPassword, email, phoneNumber, zipCode, role]
    );
    return result.insertId;
};

const findUserByName = async (name) => {
    const [rows] = await db.execute('SELECT * FROM user WHERE name = ?', [name]);
    return rows[0];
};

const findAllUsers = async () => {
    const [rows] = await db.execute('SELECT * FROM user');
    return rows;
};

const updateUser = async (id, name, email, phoneNumber, zipCode, role) => {
    const [result] = await db.execute(
        'UPDATE user SET name = ?, email = ?, phoneNumber = ?, zipCode = ?, role = ? WHERE userID = ?',
        [name, email, phoneNumber, zipCode, role, id]
    );
    return result.affectedRows > 0;
};

const deleteUser = async (id) => {
    // Delete related records from loan table
    await db.execute('DELETE FROM loan WHERE userID = ?', [id]);
    // Delete user
    const [result] = await db.execute('DELETE FROM user WHERE userID = ?', [id]);
    return result.affectedRows > 0;
};

module.exports = { createUser, findUserByName, findAllUsers, updateUser, deleteUser };