const DB = require('../config/db');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const register = (req, res) => {
    const { email, password } = req.body;
    const db = new DB();
    const user = db.users.find((user) => user.email === email);
    if (user) {
        return res.status(400).json({ message: 'User already exists', success: false });
    }else{
        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = { email, password: hashedPassword, id: uuidv4() };
        db.users.push(user);
        return res.status(200).json({ message: 'User registered successfully', success: true });
    }
}

const login = (req, res) => {
    const { email, password } = req.body;
    const db = new DB();
    const user = db.users.find((user) => user.email === email && bcrypt.compareSync(password, user.password));
    if (!user) {
        return res.status(400).json({ message: 'Invalid username or password', success: false });
    }else{
        const token = jwt.sign({ email, id: user.id }, 'uniblox', { expiresIn: '7d' });
        
        return res.status(200).json({ message: 'Login successful', token, success: true });
    }
}

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized', success: false });
    }
    const decoded = jwt.verify(token, 'uniblox');
    if (!decoded) {
        return res.status(401).json({ message: 'Unauthorized', success: false });
    }
    req.user = decoded;
    next();
}

module.exports = { register, login, verifyToken };
