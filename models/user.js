const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

// create our user model
class User extends Model {
    // set up a method to run on instance data (per user) to check password
    checkPassword(loginPw) {
        return bcrypt.compare(loginPw, this.password);
    }
}

// define table columns and configuration
User.init(
    {
        //define an id column
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        //define a username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // there cannot be any duplicate email values in this table
            unique: true,
            // if allowedNull is set to false, we can run our data through validators before creating the table data
            validate: {
                isEmail: true
            }
        },
        // define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // this means the password must be at least four characters long
                len: [4]
            }
        }
    },
    {
        hooks: {
            // set up beforeCreate lifecycle "hook" functionality
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                    return newUserData;
                },
                // set up beforeUpdate lifecycle "hook" functionality
                async beforeUpdate(updatedUserData) {
                    updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                    return updatedUserData;
                }
        },
        // TABLE CONFIG OPTIONS GO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration))
        // pass in our imported sequelize connection (the direct connection to database)
        sequelize,
        // don't automatically create createAt/updateAt timestamp fields
        timestamps: false,
        // don't pluralize name of database table
        freezeTableName: true,
        // use underscores instead of camel casing
        underscored: true,
        // make it so our model name stays lowercase in the database 
        modelName: 'user'
    }
);

module.exports = User;