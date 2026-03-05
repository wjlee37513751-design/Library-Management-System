const express = require('express');
require('dotenv').config();

const authRoutes = require('./v1/routes/authRoutes');
const bookRoutes = require('./v1/routes/bookRoutes');
const { verifyToken, requireAdmin } = require('./v1/middleware/authMiddleware');

const app = express();
app.use(express.json());

// register/login endpoints
app.post('/register', async (req, res) => {
    const { name, password, email, phoneNumber, zipCode, role } = req.body;
    try {
        const result = await authRoutes.register(name, password, email, phoneNumber, zipCode, role);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/login', async (req, res) => {
    const { name, password } = req.body;
    try {
        const auth = await authRoutes.login(name, password);
        res.json(auth);
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
});

// admin-only route to list users
app.get('/users', verifyToken, requireAdmin, async (req, res) => {
    try {
        const users = await authRoutes.list();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// admin-only route to update user
app.put('/users/:id', verifyToken, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, email, phoneNumber, zipCode, role } = req.body;
    try {
        const success = await authRoutes.update(id, name, email, phoneNumber, zipCode, role);
        if (success) {
            res.json({ message: 'User updated' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// admin-only route to delete user
app.delete('/users/:id', verifyToken, requireAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const success = await authRoutes.delete(id);
        if (success) {
            res.json({ message: 'User deleted' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// book endpoints
app.get('/books', async (req, res) => {
    try {
        const books = await bookRoutes.list();
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// create/update/delete require admin
app.post('/books', verifyToken, requireAdmin, async (req, res) => {
    const { title, authorID, releaseYear } = req.body;
    try {
        const bookId = await bookRoutes.add(title, authorID, releaseYear);
        res.status(201).json({ bookId });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/books/:id', verifyToken, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { title, authorID, releaseYear } = req.body;
    try {
        const success = await bookRoutes.update(id, title, authorID, releaseYear);
        if (success) {
            res.json({ message: 'Book updated' });
        } else {
            res.status(404).json({ error: 'Book not found' });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/books/:id', verifyToken, requireAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const success = await bookRoutes.delete(id);
        if (success) {
            res.json({ message: 'Book deleted' });
        } else {
            res.status(404).json({ error: 'Book not found' });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));
