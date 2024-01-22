const express = require("express");
const app = express();
const Controller = require("../controllers");
const router = express.Router();
const { body } = require("express-validator");

router.get("/", function (req, res) {
  res.redirect("/stores");
});
router.get("/stores", Controller.index);
router.get("/stores/add", function (req, res) {
  res.render("add");
});
router.post("/stores/add", Controller.post);
router.get("/stores/detail/:id", Controller.detail); // buat detail karna route nya udah dipake sama add
router.get("/employees", Controller.getEmployeesByPosition);
router.get("/employees/delete/:id", Controller.deleteEmployees);
router.get("/stores/detail/:storeId/employees/add", Controller.employeeAdd);

router.post(
  "/stores/detail/:storeId/employees/add",
  [
    body("firstName").notEmpty().withMessage("firstname is required"),
    body("lastName").notEmpty().withMessage("lastName is required"),
    body("dateOfBirth")
      .notEmpty()
      .withMessage("date of birth is required")
      .custom((value, { req }) => {
        // Periksa umur di atas 17 tahun
        const today = new Date();
        const birthDate = new Date(value);
        const age = today.getFullYear() - birthDate.getFullYear();

        if (age <= 17) {
          throw new Error("Age must be above 17 years");
        }
        return true;
      }),
    body("education").notEmpty().withMessage("education is required"),
    body("position").notEmpty().withMessage("position is required"),
    body("salary").notEmpty().withMessage("salary is required"),
  ],
  Controller.employeePost
);

router.get(
  "/stores/detail/:storeId/employees/:employeeId/delete",
  Controller.deleteEmployeesFromStore
);
router.get(
  "/stores/detail/:storeId/employees/:employeeId/edit",
  Controller.editEmployee
);
router.post(
  "/stores/detail/:storeId/employees/:employeeId/edit",
  [
    body("firstName").notEmpty().withMessage("firstname is required"),
    body("lastName").notEmpty().withMessage("lastName is required"),
    body("dateOfBirth")
      .notEmpty()
      .withMessage("date of birth is required")
      .custom((value, { req }) => {
        // Periksa umur di atas 17 tahun
        const today = new Date();
        const birthDate = new Date(value);
        const age = today.getFullYear() - birthDate.getFullYear();

        if (age <= 17) {
          throw new Error("Age must be above 17 years");
        }
        return true;
      }),
    body("education").notEmpty().withMessage("education is required"),
    body("position").notEmpty().withMessage("position is required"),
    body("salary").notEmpty().withMessage("salary is required"),
  ],
  Controller.updateEmployee
);

module.exports = router;
