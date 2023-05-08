import { DataTypes, Model } from "sequelize";

class Note extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        creationDate: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          validate: {
            isDate: true,
            isAfter: "2022-12-31", // only allow date strings after 31/12/2022
          },
        },
        title: {
          type: DataTypes.STRING(50),
          allowNull: true,
          validate: {
            len: [0, 50],
          },
        },
        comment: {
          type: DataTypes.STRING(200),
          allowNull: true,
          validate: {
            len: [0, 200],
          },
        },
        value: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 0,
            max: 5,
          },
        },
        type: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 0, // participant note host
            max: 1, // host note participant
          },
        },
      },
      {
        sequelize,
        modelName: "Note",
      }
    );
  }
}

export { Note };
