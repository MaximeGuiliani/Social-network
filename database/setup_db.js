import { Sequelize } from "sequelize";
import cls from "cls-hooked";
import { User, Event } from "./models/index.js";

function connect_db(context){
  Sequelize.useCLS(cls.createNamespace('project_ns'));
  
  if(context=="prod"){
    return new Sequelize({
      dialect: "sqlite",
      storage: "./database/database_prod.sqlite",
    }); 
  }

  return new Sequelize({
    dialect: "sqlite",
    storage: "./database/database_test.sqlite",
  }); 

}

function setup_associations(){ 
  Event.belongsTo    (User , { as: 'organizer'        , foreignKey: 'organizerId', onDelete: 'CASCADE', allowNull: false});
  User.hasMany       (Event, { as: 'organizedEvents'  , foreignKey: 'organizerId'                                       });
  //---
  Event.belongsToMany(User , { as: 'candidates'       , through   : 'EventCandidates'                                   });
  User.belongsToMany (Event, { as: 'candidateEvents'  , through   : 'EventCandidates'                                   });
  //---
  Event.belongsToMany(User , { as: 'participants'     , through   : 'EventParticipants'                                 });
  User.belongsToMany (Event, { as: 'participantEvents', through   : 'EventParticipants'                                 });
}


export async function setup_db(force, context) {
  let sequelize;
  try {
    sequelize = connect_db(context)
    User.init(sequelize);
    Event.init(sequelize);
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    setup_associations()
    await sequelize.sync({ force: force });
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
  return sequelize;
}
