import { DataTypes, Model } from "sequelize";

class Address extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        street: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true, // vérifie que la valeur n'est pas vide
          },
        },
        city: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true, // vérifie que la valeur n'est pas vide
          },
        },
        country: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true, // vérifie que la valeur n'est pas vide
          },
        },
        zip: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true, // vérifie que la valeur n'est pas vide
            is: /^[a-z0-9]{1,50}$/i,
          },
        },
      },
      {
        sequelize,
        modelName: "Address",
      }
    );
  }
}

export { Address };
