// const { DataTypes } = require('sequelize');
//const sequelize = require('../db.js');
import { DataTypes, Model } from "sequelize";

class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
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
        creation_date: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          validate: {
            isDate: true,
            isAfter: "2022-12-31", // only allow date strings after 31/12/2022
          },
        },
        picture: {
          type: DataTypes.STRING,
          allowNull: true, // NULL AUTORISE
          validate: {
            isUrl: true,
          },
        },
        bio: {
          type: DataTypes.STRING(500),
          allowNull: false,
          defaultValue: "",
        },
        password_hash: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            // regex of bcrypt hash
            is: /^\$2[ayb]\$([0-9]{2})\$.{53}$/i
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
