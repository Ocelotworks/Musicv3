module.exports = {
    client: 'mysql',
    connection: process.env.DATABASE_URL,
    pool: {
        min: 2,
        max: 10
    },
    timezone: 'UTC'
};