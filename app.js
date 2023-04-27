import express from "express";
const app = express();
import morgan from "morgan";
import pkg from 'body-parser';
const { urlencoded, json } = pkg;
import eventRoutes from "./api/routes/events.js";
import usersRoutes from "./api/routes/users.js";
import { setup_db } from './database/setup_db.js';
import { DAO } from './database/DAO.js';

app.use(morgan("dev"));
app.use(urlencoded({ extended: false }));
app.use(json());

let sequelize;


const myDAO = async function test() {
  sequelize = await setup_db(true, "prod");
  return  new DAO(sequelize);
}();
export {myDAO};

// handling CORS errors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/users", usersRoutes);
app.use("/events", eventRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

export default app;
