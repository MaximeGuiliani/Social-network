import { Sequelize } from "sequelize";
import cls from "cls-hooked";
import { User, Event } from "./models/index.js";

function connect_db(context){
  Sequelize.useCLS(cls.createNamespace('project_ns'));
  
  if(context=="prod"){
    return new Sequelize('sn_prod_db','root', '',{
      host: 'localhost',
      dialect: 'mysql',
      collate: 'utf8mb4_unicode_ci',
      charset: 'utf8mb4',
      dialectOptions: {
        charset: 'utf8mb4',
      },
      define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
      }
    });
  }

  return new Sequelize('sn_test_db','root', '',{
    host: 'localhost',
    dialect: 'mysql',
    collate: 'utf8mb4_unicode_ci',
    charset: 'utf8mb4',
    dialectOptions: {
      charset: 'utf8mb4',
    },
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    }
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

    // disable only_full_group_by in MySQL or Sequelize, utile pour la focntion de recherche d'event
    // https://stackoverflow.com/questions/35882816/how-to-disable-only-full-group-by-in-mysql-or-sequelize
    await sequelize.query('SET sql_mode = ""')

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
