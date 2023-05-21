import {
  validate,
  schemaCreateCategory,
} from "../validator/validatorsCategories.js";
import { myDAO } from "../../app.js";

export async function get_main_categories(req, res, next) {
  if (req.query.name != null) {
    myDAO
      .get_main_categories_by_name_like(req.query.name)
      .then(function (result) {
        res.status(200).json({
          code: 200,
          message:
            "Handling GET requests to /events/categories : returning all categories",
          categories: result,
        });
      })
      .catch(function (err) {
        sendBadRequest(res, err.message);
      });
  } else {
    myDAO
      .get_all_main_categories()
      .then(function (result) {
        res.status(200).json({
          code: 200,
          message:
            "Handling GET requests to /events/categories : returning all categories",
          categories: result,
        });
      })
      .catch(function (err) {
        sendBadRequest(res, err.message);
      });
  }
}
