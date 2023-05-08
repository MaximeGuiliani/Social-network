import { DataTypes, Model } from "sequelize";

class MainCategory extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING(50),
          unique: true,
          allowNull: false,
          validate: {
            len: [0, 50],
          },
        },
      },
      {
        sequelize,
        modelName: "MainCategory",
      }
    );
  }
}

export { MainCategory};
