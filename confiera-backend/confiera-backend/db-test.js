const mysql = require('mysql2/promise');

async function test() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'confiera_app',
            password: 'ConfieraPlus123',
            database: 'confiera'
        });
        console.log('SUCCESS: Connected to confiera database');
        await connection.end();
    } catch (err) {
        console.error('ERROR:', err.message);
        if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('TIP: Access denied. Check if user confiera_app exists and password is correct.');
        } else if (err.code === 'ER_BAD_DB_ERROR') {
            console.log('TIP: Database "confiera" does not exist.');
        }
    }
}

test();
