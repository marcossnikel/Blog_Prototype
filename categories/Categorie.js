const Sequelize = require ('sequelize');
const connection = require ("../database/database")

const Categorie = connection.define('categories',{
    title :{
        type: Sequelize.STRING,
        allowNull : false
    },slug:{
        type: Sequelize.STRING,
        allowNull: false
    }
})
// Categorie.sync({force: true});

module.exports= Categorie;




