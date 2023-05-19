import {
  validate,
  schemaCreateCategory,
} from "../validator/validatorsCategories.js";
import { myDAO } from "../../app.js";

export async function create_main_category(req, res, next) {
  const validCategory = validate(
    schemaCreateCategory.validate(req.params.categoryname),
    res
  );
  if (validCategory == null) {
    return;
  }
  myDAO
    .add_main_category(validCategory)
    .then(function (result) {
      res.status(201).json({
        code: 201,
        message:
          "Handling POST requests to /events/category/:categoryname : category created",
        category: result,
      });
    })
    .catch(function (err) {
      sendBadRequest(res, err.message);
    });
}

export async function get_all_main_categories(req, res, next) {
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
