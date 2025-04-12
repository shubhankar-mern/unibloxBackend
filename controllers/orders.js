const DB = require('../config/db');
const { v4: uuidv4 } = require('uuid');


const generateDiscountCode = (requestedBy) => {
    const db = new DB();
    let discountAmount = 10;
    const discountCode = Math.random().toString(36).substring(2, 15) + uuidv4().substring(0, 7);
    db.discountCodes.push({ code: discountCode, amount: discountAmount, id: uuidv4(), used: false });
    return discountCode;
}

const checkDiscountCode = (code,requestedBy) => {
    console.log(code,requestedBy);
    const db = new DB();
    const discountCode = db.discountCodes.find(codes => codes.code === code);
    if ( discountCode.used === false) {
        return true;
    }
    return false;
}
const createOrder = (req, res) => {
    const db = new DB();
    const { order, discountCode } = req.body;
    const { id } = req.user;
    

    const totalAmount = order.reduce((acc, item) => acc + item.price*item.quantity, 0);
    if(discountCode && checkDiscountCode(discountCode,id)){
        const discountAmountpercentage = db.discountCodes.find(code => code.code === discountCode).amount;
        const discountAmount = totalAmount * discountAmountpercentage / 100;
        const totalAmountWithDiscount = totalAmount - discountAmount;
        return res.status(200).json({ message: 'Discount code applied successfully', totalAmountWithDiscount,discountAmount, success: true });
    }else{
        return res.status(400).json({ message: 'Invalid discount code',totalAmount, success: false, });
    }
    
}

const placeOrder = (req, res) => {
    const db = new DB();
    const { order, discountCode, finalAmount, discountAmount } = req.body;
    const { id } = req.user;
    
    const orderId = uuidv4();
    db.orders.push({ ...order, id: orderId, userId: id, finalAmount, discountAmount });
    if(discountCode){
        db.discountCodes.find(code => code.code === discountCode).used = true;
    }
    return res.status(200).json({ message: 'Order created successfully', orderId, success: true });
    
}



const adminDiscountCode = (req, res) => {
    const db = new DB();
    const requestedBy = req.user.id;
    let discountAfter = 2;
    if((db.orders.length + 1) % discountAfter === 0) {
        const discountCode = generateDiscountCode(requestedBy);
        return res.status(200).json({ message: 'Discount code generated successfully', discountCode, success: true });
    }else{
        return res.status(400).json({ message: 'Discount code not generated', success: false });
    }
}

const totalOrders = (req, res) => {
    const db = new DB();
    const { id } = req.user;
    const totalOrders = db.orders.filter(order => order.userId === id);
    return res.status(200).json({ message: 'Total orders', totalOrders, success: true });
}

const totalOrdersAdmin = (req, res) => {
    const db = new DB();
    const totalOrders = db.orders;
    return res.status(200).json({ message: 'Total orders', totalOrders, success: true });
}

module.exports = { createOrder, generateDiscountCode, checkDiscountCode, placeOrder, adminDiscountCode, totalOrders, totalOrdersAdmin };