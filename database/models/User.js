// const { DataTypes } = require('sequelize');
//const sequelize = require('../db.js');
import { DataTypes, Model} from "sequelize";

class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        score_host: {
          type: DataTypes.INTEGER,
          allowNull: true,
          validate: {
            min: 0,
            max: 5,
          },
        },
        score_participant: {
          type: DataTypes.INTEGER,
          allowNull: true,
          validate: {
            min: 0,
            max: 5,
          },
        },
        username: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false,
          validate: {
            isEmail: true,
          },
        },
        password_hash: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            is: /^[0-9a-f]{64,}$/i, // 64 caractères hexadécimaux = 256 bits
          },
        },
      },
      {
        sequelize,
        modelName: "User",
      }
    );
  }
}

export { User };
