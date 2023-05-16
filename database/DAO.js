import {
  User,
  Event,
  MainCategory,
  Address,
  Note,
  EventMessage,
} from "./models/index.js";
import { Op } from "sequelize";

class DAO {
  constructor(sequelize) {
    this.sequelize = sequelize;
  }

  /*----------------------------VERY USEFUL----------------------------*/

  //ajout d'une main categoty
  async add_main_category(name) {
    return this.sequelize.transaction((t) => {
      return MainCategory.create({ name });
    });
  }

  // get all the main categories
  async get_all_main_categories() {
    return this.sequelize.transaction((t) => {
      return MainCategory.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
    });
  }

  // get des main cat par nom like
  async get_main_categories_by_name_like(name) {
    return this.sequelize.transaction((t) => {
      return MainCategory.findAll({
        where: {
          name: {
            [Op.like]: `%${name}%`,
          },
        },
      });
    });
  }

  // get d'une main cat par nom
  async get_main_category_by_name(name) {
    return this.sequelize.transaction((t) => {
      return MainCategory.findOne({ where: { name: name } });
    });
  }

  //ajout d'un utilisateur
  async add_user({ username, email, password_hash, bio, picture = null }) {
    return this.sequelize.transaction((t) => {
      return User.create({
        username: username,
        email: email,
        password_hash: password_hash,
        bio: bio,
        picture: picture,
      });
    });
  }

  //ajout d'un event
  async save_event({
    participants_number,
    category,
    description,
    name,
    date,
    organizerId,
    MainCategoryId,
    image_url = null,
    address: { street, city, country, zip },
  }) {
    return this.sequelize.transaction(async (t) => {
      const { id } = await Address.create({
        street,
        city,
        country,
        zip,
      });
      return Event.create({
        participants_number,
        category,
        description,
        name,
        date,
        organizerId,
        MainCategoryId,
        image_url,
        AddressId: id,
      });
    });
  }

  //get d'events par places restantes, catégorie, lieu, date, etc
  async get_events_by_filters({
    nb_places_wanted,
    category,
    range_places,
    address,
    description,
    event_name,
    username,
    range_date,
    score_host_min,
    MainCategoryId,
  }) {
    let info = {
      attributes: [
        "id",
        "name",
        "participants_number",
        "category",
        "description",
        "image_url",
        "date",
        "MainCategoryId",
        [
          this.sequelize.literal(
            "participants_number - COUNT( DISTINCT UserId)"
          ),
          "nb_places_left",
        ],
      ],
      include: [
        {
          model: User,
          as: "participants",
          through: { attributes: ["UserId"] },
          attributes: [],
        },
        {
          model: User,
          as: "organizer",
          attributes: ["id", "username"],
          include: [
            {
              model: Note,
              as: "receivedNotes",
              attributes: [
                //'value',
                //'type',
                [this.sequelize.literal("AVG(value)"), "score_host"],
              ],
              where: { type: 0 },
            },
          ],
        },
        // {
        // 	model: MainCategory,
        // 	attributes: { exclude: ['createdAt', 'updatedAt'] }
        // },
        {
          model: Address,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
      group: ["Event.id"],
      having: {
        [Op.and]: [],
      },
    };

    if (nb_places_wanted !== undefined)
      info.having[Op.and].push({
        nb_places_left: { [Op.gte]: nb_places_wanted },
      });
    if (category !== undefined)
      info.having[Op.and].push({ category: { [Op.like]: `%${category}%` } });
    if (range_places !== undefined)
      info.having[Op.and].push({
        participants_number: {
          [Op.between]: [range_places.min, range_places.max],
        },
      });
    if (MainCategoryId !== undefined)
      info.having[Op.and].push({ MainCategoryId: { [Op.eq]: MainCategoryId } });
    if (description !== undefined)
      info.having[Op.and].push({
        description: { [Op.like]: `%${description}%` },
      });
    if (event_name !== undefined)
      info.having[Op.and].push({ name: { [Op.like]: `%${event_name}%` } });
    if (username !== undefined)
      info.having[Op.and].push({
        "organizer.username": { [Op.like]: `%${username}%` },
      });
    if (range_date !== undefined)
      info.having[Op.and].push({
        date: { [Op.lte]: range_date.max, [Op.gte]: range_date.min },
      });
    if (score_host_min !== undefined)
      info.having[Op.and].push({
        "organizer.receivedNotes.score_host": {
          [Op.or]: { [Op.gte]: score_host_min, [Op.eq]: null },
        },
      }); //ici on fait le choix d'inclure les event d'organisateurs qui n'ont pas de score
    if (address) {
      const { street, city, country, zip } = address;
      if (street !== undefined)
        info.having[Op.and].push({
          "Address.street": { [Op.like]: `%${street}%` },
        });
      if (city !== undefined)
        info.having[Op.and].push({
          "Address.city": { [Op.like]: `%${city}%` },
        });
      if (country !== undefined)
        info.having[Op.and].push({
          "Address.country": { [Op.like]: `%${country}%` },
        });
      if (zip !== undefined)
        info.having[Op.and].push({ "Address.zip": { [Op.like]: `%${zip}%` } });
    }

    return this.sequelize.transaction((t) => {
      return Event.findAll(info);
    });
  }

  // get user avec ses event associés
  async get_user_with_related_events({
    id,
    include_organizedEvents = false,
    include_candidateEvents = false,
    include_participantEvents = false,
    include_givenNotes = false,
    include_receivedNotes = false,
    include_messages = false,
  }) {
    const include = [];
    if (id === undefined) throw new Error("id cannot be undefined");
    if (include_organizedEvents === true)
      include.push({
        model: Event,
        as: "organizedEvents",
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: MainCategory,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: Address,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
      }); // Otherway, can be false or undefined
    if (include_candidateEvents === true)
      include.push({
        model: Event,
        as: "candidateEvents",
        attributes: { exclude: ["createdAt", "updatedAt"] },
        through: { attributes: [] },
        include: [
          {
            model: MainCategory,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: Address,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
      });
    if (include_participantEvents === true)
      include.push({
        model: Event,
        as: "participantEvents",
        attributes: { exclude: ["createdAt", "updatedAt"] },
        through: { attributes: [] },
        include: [
          {
            model: MainCategory,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: Address,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
      });
    if (include_givenNotes === true)
      include.push({
        model: Note,
        as: "givenNotes",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        } /*include:[{model: User,  as: '', attributes: { exclude: ['createdAt', 'updatedAt'] }}, ]*/,
      });
    if (include_receivedNotes === true)
      include.push({
        model: Note,
        as: "receivedNotes",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        } /*include:[{model: Event, as: '', attributes: { exclude: ['createdAt', 'updatedAt'] }}, ]*/,
      });
    if (include_messages === true)
      include.push({
        model: EventMessage,
        as: "messages",
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [{ model: Event, as: "event", attributes: ["name"] }],
      });

    return this.sequelize.transaction(async (t) => {
      return await User.findOne({
        attributes: { exclude: ["createdAt", "updatedAt", "password_hash"] },
        where: { id: id },
        include: include,
      });
    });
  }

  // eager loading paramtétré pour un event
  async get_event_with_related_users({
    eventId,
    include_organizer = false,
    include_candidates = false,
    include_participants = false,
    include_notes = false,
    include_messages = false /*, include_Address=false, include_MainCategory=false*/,
  }) {
    const include = [
      {
        model: MainCategory,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      { model: Address, attributes: { exclude: ["createdAt", "updatedAt"] } },
    ];

    if (eventId === undefined) throw new Error("eventId cannot be undefined");
    if (include_organizer === true)
      include.push({
        model: User,
        as: "organizer",
        attributes: { exclude: ["createdAt", "updatedAt", "password_hash"] },
      });
    if (include_candidates === true)
      include.push({
        model: User,
        as: "candidates",
        attributes: { exclude: ["createdAt", "updatedAt", "password_hash"] },
        through: { attributes: [] },
      });
    if (include_participants === true)
      include.push({
        model: User,
        as: "participants",
        attributes: { exclude: ["createdAt", "updatedAt", "password_hash"] },
        through: { attributes: [] },
      });
    if (include_notes === true)
      include.push({
        model: Note,
        as: "notes",
        attributes: { exclude: ["createdAt", "updatedAt", "type"] },
      });
    if (include_messages === true)
      include.push({
        model: EventMessage,
        as: "messages",
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [{ model: User, as: "owner", attributes: ["username"] }],
      });
    // if(include_Address===true)      include.push({ model: Address,      attributes: {exclude: ['createdAt', 'updatedAt']}, });
    // if(include_MainCategory===true) include.push({ model: MainCategory, attributes: {exclude: ['createdAt', 'updatedAt']}, });

    return this.sequelize.transaction((t) => {
      return Event.findOne({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: { id: eventId },
        include: include,
      });
    });
  }

  // get all the event
  async get_all_events() {
    return this.sequelize.transaction((t) => {
      return Event.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
    });
  }

  // get all the users
  async get_all_users() {
    return this.sequelize.transaction((t) => {
      return User.findAll({
        attributes: { exclude: ["createdAt", "updatedAt", "password_hash"] },
      });
    });
  }

  //add note à un participant
  async add_note_from_host({
    creationDate,
    ownerId,
    eventId,
    targetId,
    value,
    title = null,
    comment = null,
  }) {
    return this.sequelize.transaction(async (t) => {
      if (
        !(await this.note_participant_is_possible({
          ownerId,
          targetId,
          eventId,
        }))
      )
        throw new Error("Cette note ne respecte pas les règles de coherence");
      return Note.create({
        type: 1,
        creationDate,
        ownerId,
        eventId,
        targetId,
        title,
        comment,
        value,
      });
    });
  }

  //add note à un event
  async add_note_from_participant({
    creationDate,
    ownerId,
    eventId,
    value,
    title = null,
    comment = null,
  }) {
    return this.sequelize.transaction(async (t) => {
      const { organizerId } = await this.get_event_by_id(eventId);
      if (
        !(await this.note_host_is_possible({
          ownerId,
          targetId: organizerId,
          eventId,
        }))
      )
        throw new Error("Cette note ne respecte pas les règles de coherence");
      return Note.create({
        type: 0,
        creationDate,
        ownerId,
        eventId,
        targetId: organizerId,
        title,
        comment,
        value,
      });
    });
  }

  async note_participant_is_possible({ ownerId, targetId, eventId }) {
    return this.sequelize.transaction(async (t) => {
      const events = await Event.findAll({
        include: [
          {
            model: User,
            as: "participants",
            where: {
              id: targetId,
            },
            attributes: ["username"],
            through: { attributes: [] },
          },
        ],
        where: {
          id: eventId,
          organizerId: ownerId,
        },
        attributes: ["name"],
      });

      // console.log("<--->\n" + JSON.stringify(events, null, 2).toString());
      return events.length !== 0;
    });
  }

  async note_host_is_possible({ ownerId, targetId, eventId }) {
    return this.sequelize.transaction(async (t) => {
      const events = await Event.findAll({
        include: [
          {
            model: User,
            as: "participants",
            where: {
              id: ownerId,
            },
            attributes: ["username"],
            through: { attributes: [] },
          },
        ],
        where: {
          id: eventId,
          organizerId: targetId,
        },
        attributes: ["name"],
      });

      // console.log("<--->\n" + JSON.stringify(events, null, 2).toString());
      return events.length !== 0;
    });
  }

  // add message to conversation(event)
  async add_message({ userId, eventId, content }) {
    return this.sequelize.transaction(async (t) => {
      if (!(await this.message_is_possible({ userId, eventId })))
        throw new Error("Ce message ne respecte pas les règles de coherence");
      return EventMessage.create({
        userId,
        eventId,
        content,
      });
    });
  }

  // get all messages d'un conversation
  async get_all_messages_from_event(eventId) {
    return this.sequelize.transaction((t) => {
      return EventMessage.findAll({
        where: { eventId },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: User,
            as: "owner",
            attributes: ["username"],
          },
          {
            model: Event,
            as: "event",
            attributes: ["name"],
          },
        ],
      });
    });
  }

  // check message is possible (participant ou organisateur)
  async message_is_possible({ userId, eventId }) {
    return this.sequelize.transaction(async (t) => {
      const events = await Event.findAll({
        include: [
          {
            model: User,
            as: "participants",
            attributes: ["username"],
            through: { attributes: [] },
          },
        ],
        where: [
          {
            id: eventId,
          },
          {
            [Op.or]: [{ "$participants.id$": userId }, { organizerId: userId }],
          },
        ],
        attributes: ["name"],
      });
      console.log("ICIIIIII\n" + JSON.stringify(events, null, 2).toString());
      return events.length !== 0;
    });
  }

  /*----------------------------LESS USEFUL----------------------------*/

  //suppression d'un utilisateur
  async remove_user_by_username(username) {
    return this.sequelize.transaction((t) => {
      return User.destroy({
        where: { username: username },
      });
    });
  }

  //modif d'un utilisateur
  async update_user_by_username({
    id,
    username,
    email,
    password_hash,
    bio,
    picture = null,
  }) {
    return this.sequelize.transaction((t) => {
      return User.update(
        {
          username,
          email,
          password_hash,
          bio,
          picture,
        },
        { where: { id: id } }
      );
    });
  }
  // TODO :
  // WARNING  :  Voir pour le update les valeurs que l'on peut changer et utilisation de find One pour retourner l'objet modifié et non le nombre de ligne modifié
  async update_user_by_id({ id, bio, picture = null }) {
    return this.sequelize.transaction((t) => {
      return User.findOne({ where: { id: id } }).then((user) => {
        if (user) {
          return user.update({ bio, picture }, { transaction: t });
        } else {
          throw new Error("User not found");
        }
      });
    });
  }

  //modif d'un utilisateur
  async update_user_by_username({
    username,
    email,
    password_hash,
    bio,
    picture = null,
  }) {
    return this.sequelize.transaction((t) => {
      return User.update(
        {
          username,
          email,
          password_hash,
          bio,
          picture,
        },
        { where: { username: username } }
      );
    });
  }

  //modif d'un utilisateur
  async update_user_by_email({
    username,
    email,
    password_hash,
    bio,
    picture = null,
  }) {
    return this.sequelize.transaction((t) => {
      return User.update(
        {
          username,
          email,
          password_hash,
          bio,
          picture,
        },
        { where: { email: email } }
      );
    });
  }

  // get d'un utilisateur
  async get_user_by_username(username) {
    return this.sequelize.transaction((t) => {
      return User.findOne({ where: { username: username } });
    });
  }

  async get_user_by_email(email) {
    return this.sequelize.transaction((t) => {
      return User.findOne({ where: { email: email } });
    });
  }

  //get d'un event par id
  async get_event_by_id(id) {
    return this.sequelize.transaction(async (t) => {
      return Event.findByPk(id);
    });
  }

  //suppression d'un event
  async remove_event_by_name(event_name) {
    return this.sequelize.transaction((t) => {
      return Event.destroy({ where: { name: event_name } });
    });
  }

  async remove_event_by_id(event_id) {
    return this.sequelize.transaction((t) => {
      return Event.destroy({ where: { id: event_id } });
    });
  }

  //modif d'un event
  async update_event_by_id(
    id,
    name,
    category,
    description,
    image_url,
    AdressId,
    MainCategoryId,
    date
  ) {
    return this.sequelize.transaction((t) => {
      return Event.update(
        {
          name,
          category,
          description,
          image_url,
          AdressId,
          MainCategoryId,
          date,
        },
        { where: { id: id } }
      );
    });
  }

  // get d'un event par nom like
  async get_events_by_name_like(name) {
    return this.sequelize.transaction((t) => {
      return Event.findAll({
        where: {
          name: {
            [Op.like]: `%${name}%`,
          },
        },
      });
    });
  }

  // get d'un event par nom
  async get_event_by_name(name) {
    return this.sequelize.transaction((t) => {
      return Event.findOne({ where: { name: name } });
    });
  }

  // // get d'un event par note exact de son organisateur
  // async get_events_by_organizer_score(score) {
  // 	return this.sequelize.transaction( t => {
  // 		return Event.findAll({
  // 			include: [
  // 				{
  // 					model: User,
  // 					as: 'organizer',
  // 					where: { score_host: score }
  // 				}
  // 			]
  // 		});
  // 	});
  // }

  // //get d'un event par note min de son organisateur
  // async get_events_by_organizer_score_min(score_min) {
  // 	return this.sequelize.transaction( t => {
  // 	return Event.findAll({
  // 		include: [{
  // 		model: User,
  // 		as: 'organizer',
  // 		where: { score_host: { [Op.gte]: score_min } }
  // 		}]
  // 	});
  // 	});
  // }

  //get d'events par catégorie
  async get_events_by_category(category) {
    let where = {};
    if (category !== undefined) where.category = category;
    return this.sequelize.transaction((t) => {
      return Event.findAll({
        where: where,
      });
    });
  }

  // get d'un utilisateur par id
  async get_user_by_id(id) {
    return this.sequelize.transaction((t) => {
      return User.findByPk(id);
    });
  }

  //faire candidater
  async apply(userId, eventId) {
    return this.sequelize.transaction(async (t) => {
      const user = await User.findByPk(userId);
      const event = await Event.findByPk(eventId);
      if (!user || !event) {
        throw new Error("User or event not found");
      }
      return event.addCandidate(user);
    });
  }

  // enlever une candidature
  async unapply(userId, eventId) {
    return this.sequelize.transaction(async (t) => {
      const user = await User.findByPk(userId);
      const event = await Event.findByPk(eventId);
      if (!user || !event) throw new Error("User or event not found");
      return event.removeCandidate(user);
    });
  }

  // get all candidatures d'un utilisateur
  async get_all_candidatures_from_user(userId) {
    return this.sequelize.transaction((t) => {
      return User.findAll({
        where: { id: userId },
        attributes: { exclude: ["createdAt", "updatedAt", "password_hash"] },
        include: [
          {
            model: Event,
            as: "candidateEvents",
            attributes: { exclude: ["createdAt", "updatedAt"] },
            through: { attributes: [] },
            include: [
              {
                model: MainCategory,
                attributes: { exclude: ["createdAt", "updatedAt"] },
              },
              {
                model: Address,
                attributes: { exclude: ["createdAt", "updatedAt"] },
              },
            ],
          },
        ],
      });
    });
  }

  // get all candidat d'un event

  async get_all_candidates_from_event(eventId) {
    return this.sequelize.transaction((t) => {
      return Event.findAll({
        where: { id: eventId },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: User,
            as: "candidates",
            attributes: {
              exclude: ["createdAt", "updatedAt", "password_hash"],
            },
            through: { attributes: [] },
          },
        ],
      });
    });
  }

  //faire candidater avec name
  async apply_by_name(username, event_name) {
    return this.sequelize.transaction(async (t) => {
      const user = await User.findOne({ where: { username: username } });
      const event = await Event.findOne({ where: { name: event_name } });
      if (!user || !event) throw new Error("User or event not found");
      return event.addCandidate(user);
    });
  }

  //faire participer
  async participate(userId, eventId) {
    return this.sequelize.transaction(async (t) => {
      const user = await User.findByPk(userId);
      const event = await Event.findByPk(eventId);
      if (!user || !event) throw new Error("User or event not found");
      return event.removeParticipant(user);
    });
  }

  //faire participer avec name
  async participate_by_name(username, event_name) {
    return this.sequelize.transaction(async (t) => {
      const user = await User.findOne({ where: { username: username } });
      const event = await Event.findOne({ where: { name: event_name } });
      if (!user || !event) throw new Error("User or event not found");
      return event.addParticipant(user);
    });
  }

  // _____________________   N O T E S  ______________________________________________

  async get_mean_and_count_all_notes_by_username(username) {
    return this.sequelize.transaction(async (t) => {
      const user = await User.findOne({ where: { username: username } });
      if (!user) throw new Error("User not found");
      const notes = await Note.findAll({ where: { owner_id: user.id } });
      let sum = 0;
      for (let i = 0; i < notes.length; i++) {
        sum += notes[i].value;
      }
      return { mean: sum / notes.length, count: notes.length };
    });
  }

  async get_mean_and_count_all_notes_by_eventId(eventId) {
    return this.sequelize.transaction(async (t) => {
      const event = await Event.findOne({ where: { id: eventId } });
      if (!event) throw new Error("Event not found");
      const notes = await Note.findAll({ where: { event_id: event.id } });
      let sum = 0;
      for (let i = 0; i < notes.length; i++) {
        sum += notes[i].value;
      }
      return { mean: sum / notes.length, count: notes.length };
    });
  }
}

export { DAO };

// blabla
// INFO: user.createEvent() , au lieu de passer par son id, on passe par son objet, c'est + ORM friendly
// INFO: Event.addParticpant(), pareil
