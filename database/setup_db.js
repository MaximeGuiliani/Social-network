import { Sequelize } from "sequelize";
import cls from "cls-hooked";
import {
  User,
  Event,
  MainCategory,
  Address,
  EventMessage,
  Note,
} from "./models/index.js";

function connect_db(context) {
  //Afin de faire des transactions avec moins de code redondant
  Sequelize.useCLS(cls.createNamespace("project_ns"));

  if (context == "prod") {
    return new Sequelize("sn_prod_db", "root", "", {
      host: "127.0.0.1",
      dialect: "mysql",
      collate: "utf8mb4_unicode_ci", // collation utf8mb4_general_ci ignore la casse et les accentuations
      charset: "utf8mb4",
      dialectOptions: {
        charset: "utf8mb4",
      },
      define: {
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
      },
    });
  }

  return new Sequelize("sn_test_db", "root", "", {
    host: "127.0.0.1",
    dialect: "mysql",
    collate: "utf8mb4_unicode_ci",
    charset: "utf8mb4",
    dialectOptions: {
      charset: "utf8mb4",
    },
    define: {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
    },
  });
}

function setup_associations() {
  // many-to-one organisation
  Event.belongsTo(User, {
    as: "organizer",
    foreignKey: { name: "organizerId", allowNull: false },
    onDelete: "CASCADE",
    allowNull: false,
  });
  User.hasMany(Event, {
    as: "organizedEvents",
    foreignKey: { name: "organizerId", allowNull: false },
  });

  // many-to-many candidats
  Event.belongsToMany(User, { as: "candidates", through: "EventCandidates" });
  User.belongsToMany(Event, {
    as: "candidateEvents",
    through: "EventCandidates",
  });

  // many-to-many partipants
  Event.belongsToMany(User, {
    as: "participants",
    through: "EventParticipants",
  });
  User.belongsToMany(Event, {
    as: "participantEvents",
    through: "EventParticipants",
  });

  // many-to-one main category
  Event.belongsTo(MainCategory, {
    foreignKey: { allowNull: false },
    onDelete: "CASCADE",
  });
  MainCategory.hasMany(Event);

  // one-to-one Adresse
  Address.hasOne(Event, {
    foreignKey: { allowNull: false },
    onDelete: "CASCADE",
  });
  Event.belongsTo(Address);

  // many-to-one User donnes plusieurs notes
  User.hasMany(Note, {
    as: "givenNotes",
    foreignKey: { name: "ownerId", allowNull: false },
  });
  Note.belongsTo(User, {
    as: "owner",
    foreignKey: { name: "ownerId", allowNull: false },
    onDelete: "CASCADE",
  });
  
  // many-to-one User recoit plusieurs notes
  User.hasMany(Note, {
    as: "receivedNotes",
    foreignKey: { name: "targetId", allowNull: false },
  });
  Note.belongsTo(User, {
    as: "target",
    foreignKey: { name: "targetId", allowNull: false },
    onDelete: "CASCADE",
  });
  
  // many-to-one Event a plusieurs notes
  Event.hasMany(Note, {
    as: "notes",
    foreignKey: { name: "eventId", allowNull: false },
  });
  Note.belongsTo(Event, {
    as: "event",
    foreignKey: { name: "eventId", allowNull: false },
    onDelete: "CASCADE",
  });
  
  // many-to-one Event a plusieurs messages
  Event.hasMany(EventMessage, {
    as: "messages",
    foreignKey: { name: "eventId", allowNull: false },
  });
  EventMessage.belongsTo(Event, {
    as: "event",
    foreignKey: { name: "eventId", allowNull: false },
    onDelete: "CASCADE",
  });

  // many-to-one User a plusieurs messages
  User.hasMany(EventMessage, {
    as: "messages",
    foreignKey: { name: "userId", allowNull: false },
  });
  EventMessage.belongsTo(User, {
    as: "owner",
    foreignKey: { name: "userId", allowNull: false },
    onDelete: "CASCADE",
  });

  //many to many ou 2 many to one
  // Event.belongsToMany(User, {
  //   as: "",
  //   through: "EventCandidates",
  // });
  // User.belongsToMany(Event, {
  //   as: "candidateEvents",
  //   through: "EventCandidates",
  // });
}

export async function setup_db(force, context) {
  let sequelize;

  //création de l'objet de connexion
  sequelize = connect_db(context);

  // Disable only_full_group_by in MySQL, utile pour la fonction de recherche d'event avec filtres
  // https://stackoverflow.com/questions/35882816/how-to-disable-only-full-group-by-in-mysql-or-sequelize
  await sequelize.query("SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));");

  
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  //Initialisation des modèles
  User.init(sequelize);
  Event.init(sequelize);
  MainCategory.init(sequelize);
  Address.init(sequelize);
  EventMessage.init(sequelize);
  Note.init(sequelize);
  setup_associations();

  try {
    // sequelize.sync() - This creates the table if it doesn't exist (and does nothing if it already exists)
    // sequelize.sync({ force: true }) - This creates the table, dropping it first if it already existed
    // sequelize.sync({ alter: true }) - This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model.
    await sequelize.sync({ force: force });
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.log("Error while synchronizing models: ", error);
  }
  const [results, meta] = await sequelize.query("SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));");
  console.log("SQL_MODE", results, meta);
  return sequelize;
}
