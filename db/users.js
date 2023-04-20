import knex from './knex.js';

function createUser(user) {
    return knex('users').insert(user);
}

function getUserByEmail(email) {
    return knex('users').where('email', email).first();
}

function getUserById(id) {
    return knex('users').where('id', id).first();
}

function getAllUsers() {
    return knex('users').select("*");
}

function deleteUser(id) {
    return knex('users').where('id', id).del();
}

function updateUser(id, user) {
    return knex('users').where('id', id).update(user);
}

export {
    createUser,
    getUserByEmail,
    getUserById,
    getAllUsers,
    deleteUser,
    updateUser
};