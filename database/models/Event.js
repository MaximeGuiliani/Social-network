import { DataTypes, Model } from "sequelize";

class Event extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        participants_number: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 0,
            max: 99999,
          },
        },
        category: {
          type: DataTypes.STRING(100),
          allowNull: false,
          validate: {
            len: [0, 100],
          },
        },
        address: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT, //TEXT pour taille non définie, STRING pour taille max connue
          allowNull: false,
        },
        image_url: {
          type: DataTypes.STRING,
          allowNull: true,
          validate: {
            isUrl: true,
          },
        },
        name: {
          type: DataTypes.STRING(200),
          unique: true,
          allowNull: false,
          validate: {
            len: [0, 100],
          },
        },
        date: {
          type: DataTypes.DATE,
          allowNull: false,
          validate: {
            isDate: true,
            isAfter: "2022-12-31",    // only allow date strings after 31/12/2022
          },
        },
      },
      {
        sequelize,
        modelName: "Event",
      }
    );
  }
}

export { Event };
