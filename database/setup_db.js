import { Sequelize } from "sequelize";
import cls from "cls-hooked";
import { User, Event } from "./models/index.js";

function connect_db(context){ //Afin de faire des transactions avec moins de code redondant
  Sequelize.useCLS(cls.createNamespace('project_ns'));
  
  if(context=="prod"){
    return new Sequelize('sn_prod_db','root', '',{
      host: 'localhost',
      dialect: 'mysql',
      collate: 'utf8mb4_unicode_ci', // collation utf8mb4_general_ci ignore la casse et les accentuations
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

    //création de l'objet de connexion
    sequelize = connect_db(context)

    // Disable only_full_group_by in MySQL, utile pour la fonction de recherche d'event avec filtres 
    // https://stackoverflow.com/questions/35882816/how-to-disable-only-full-group-by-in-mysql-or-sequelize
    await sequelize.query('SET sql_mode = ""')

    try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
    
    //Initialisation des modèles
    User.init(sequelize);
    Event.init(sequelize);
    setup_associations()
    
    
    try{
      // sequelize.sync() - This creates the table if it doesn't exist (and does nothing if it already exists)
      // sequelize.sync({ force: true }) - This creates the table, dropping it first if it already existed
      // sequelize.sync({ alter: true }) - This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model.
      await sequelize.sync({ force: force });
      console.log("All models were synchronized successfully.");
    }catch(error){
      console.log("Error while synchronizing models: ", error);
    }
    
  return sequelize;
}
