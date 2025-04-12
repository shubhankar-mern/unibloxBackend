//we have to create an inmemory db representation for the user


//singleton pattern
const init = () => {
    const db = {
        items: [],
        users: [],
        orders: [],
        discountCodes: []
    }
    return db;
}

class DB {
    static instance;
    constructor() {
        if(!DB.instance) {
            DB.instance = init();
        }
        return DB.instance;
    }


}

module.exports = DB;