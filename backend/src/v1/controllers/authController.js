const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

const JWT_SECRET = process.env.JWT_SECRET;

const loginUser = async (name, password) => {
    try {
        const user = await userRepository.findUserByName(name);

        // Verify user exists and hashed password matches
        if (user && await bcrypt.compare(password, user.password)) {
            // Create token with userID, name, and role
            const token = jwt.sign(
                { id: user.userID, name: user.name, role: user.role }, 
                JWT_SECRET, 
                { expiresIn: '1h' }
            );
            
            return { success: true, token };
        }
        
        throw new Error("Feil brukernavn eller passord");
    } catch (error) {
        console.error("Error during login:", error.message);
        throw error;
    }
};

const registerUser = async (name, password, email, phoneNumber, zipCode, role = 'user') => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await userRepository.createUser(name, hashedPassword, email, phoneNumber, zipCode, role);
        return { success: true };
    } catch (error) {
        console.error("Error during registration:", error.message);
        throw error;
    }
};

const listUsers = async () => {
    return await userRepository.findAllUsers();
};

const updateUser = async (id, name, email, phoneNumber, zipCode, role) => {
    return await userRepository.updateUser(id, name, email, phoneNumber, zipCode, role);
};

const deleteUser = async (id) => {
    return await userRepository.deleteUser(id);
};

module.exports = { registerUser, loginUser, listUsers, updateUser, deleteUser };