const request = require('supertest');
const app = require('../index'); 
const DB = require('../config/db');
const { generateDiscountCode, checkDiscountCode } = require('../controllers/orders');



describe('Discount Code Utility Functions', () => {
    let db;
    
    beforeEach(() => {
        db = new DB();
        db.discountCodes = [];
    });

    describe('generateDiscountCode', () => {
        it('should generate a unique discount code with correct format', () => {
            const userId = 'test-user-123';
            const discountCode = generateDiscountCode(userId);
            
        
            expect(discountCode).toBeDefined();
            expect(typeof discountCode).toBe('string');
            
        });
    });

    describe('checkDiscountCode', () => {
        it('should validate discount code correctly', () => {
            const userId = 'test-user-123';
            
            
            const discountCode = generateDiscountCode(userId);
            
         
            const isValidCode = checkDiscountCode(discountCode, userId);
            expect(isValidCode).toBe(true);
            
        });
    });
});
