const express = require('express');
const router = express.Router();
const { register, login, verifyToken } = require('../controllers/auth');
const { createOrder, placeOrder, adminDiscountCode, totalOrders, totalOrdersAdmin } = require('../controllers/orders');

router.post('/register', register);
router.post('/login', login);
router.post('/orders',verifyToken, createOrder);
router.get('/admin/discount-code',verifyToken, adminDiscountCode);
router.post('/place-order',verifyToken, placeOrder);
router.get('/admin/orders',verifyToken, totalOrders);
router.get('/admin/orders/all',verifyToken, totalOrdersAdmin);
module.exports = router;
