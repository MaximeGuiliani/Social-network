import { DataTypes, Model } from "sequelize";

class EventMessage extends Model {
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
        content: {
          type: DataTypes.STRING(400),
          allowNull: false,
          validate: {
            notEmpty: true, // vérifie que la valeur n'est pas vide
          },
        },
      },
      {
        sequelize,
        modelName: "EventMessage",
      }
    );
  }
}

export { EventMessage };
