import knex from 'knex';

const connectedKnex = knex({
    client: 'sqlite3',
    connection: {
        filename: './db.sqlite3'
    },
});

export default connectedKnex;