const Model = require("../models");
const employees = require("../models/employees");
const Store = Model.Store;
const Employees = Model.Employees;
const { body, validationResult } = require("express-validator");

class Controller {
  static async index(req, res) {
    try {
      let stores = await Store.findAll();
      res.render("store", { stores });
    } catch (error) {
      console.log(error);
    }
  }
  static async detail(req, res) {
    const id = req.params.id;
    let store = await Store.findByPk(id, {
      include: "employees",
    });
    // menghitung total salary
    let totalSalary = 0;
    if (store && store.employees) {
      totalSalary = store.employees.reduce((sum, employee) => {
        return sum + employee.salary;
      }, 0);
    }

    res.render("store_detail", { store, totalSalary });
  }

  static async post(req, res) {
    const { name, location, storeType } = req.body;
    try {
      Store.create({ name: name, category: storeType, location: location });
      res.redirect("/stores");
    } catch (error) {
      console.log(error);
    }
  }
  static async getEmployeesByPosition(req, res) {
    try {
      const { position } = req.query;

      let whereClause = {}; // untuk ngecek kalau di query parameter ada position apa enggak. kalau ada dia pake where position itu untuk query ke DB nya.
      if (position) {
        //  tapi kalau ga ada, whereClause nya kosong. terus ambil data semua tanpa query dengan where position
        whereClause = {
          position: position,
        };
      }

      const employees = await Employees.findAll({
        include: "store",
        where: whereClause,
        order: [
          ["firstName", "ASC"], // biar namanya urut
        ],
      });

      employees.forEach((employee) => {
        const storeData = employee.store;
        console.log(storeData);
      });
      console.log(employees);
      res.render("employees", { employees });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
  static async deleteEmployees(req, res) {
    try {
      let idParams = req.params.id;
      await Employees.destroy({
        where: {
          id: idParams,
        },
      });

      res.redirect("/employees");
    } catch (error) {
      res.send(error.message);
    }
  }

  static async deleteEmployeesFromStore(req, res) {
    const storeId = req.params.storeId;
    const employeeId = req.params.employeeId;

    let deletedEmployeeName;

    Employees.findOne({
      where: {
        id: employeeId,
      },
    })
      .then((employeeToDelete) => {
        if (!employeeToDelete) {
          throw new Error("Employee not found");
        }

        deletedEmployeeName = employeeToDelete.firstName; // Replace 'name' with the actual field containing the employee name

        return Employees.destroy({
          where: {
            id: employeeId,
          },
        });
      })
      .then(() => {
        res.redirect(
          `/stores/detail/${storeId}?message=Employee ${deletedEmployeeName} has been deleted`
        );
      })
      .catch((error) => {
        res.redirect(`/stores/detail/${storeId}?message=${error.message}`);
      });
  }

  static async employeeAdd(req, res) {
    const storeId = req.params.storeId;
    let store = await Store.findByPk(storeId);
    res.render("employee_add", { store });
  }

  static async employeePost(req, res) {
    const body = req.body;
    let position = body.position;
    const storeId = req.params.storeId;
    let store = await Store.findByPk(storeId);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are validation errors, send a response with the errors
      const storeId = req.params.storeId;
      let store = await Store.findByPk(storeId);
      return res.render("employee_add", { errors: errors.array(), store });
    } else {
      if (body.education == "S2" || body.education == "S3") {
        if (position != "CEO" && position != "Manager") {
          var erors = [
            {
              msg: "Posisi yang diambil harus CEO atau Manager",
            },
          ];
          return res.render("employee_add", {
            errors: erors,
            store,
          });
        } else {
          await Employees.create({
            firstName: body.firstName,
            lastName: body.lastName,
            dateOfBirth: body.dateOfBirth,
            education: body.education,
            position: position,
            salary: body.salary,
            StoreId: storeId,
          });
          return res.redirect(`/stores/detail/${storeId}`);
        }
      } else {
        await Employees.create({
          firstName: body.firstName,
          lastName: body.lastName,
          dateOfBirth: body.dateOfBirth,
          education: body.education,
          position: position,
          salary: body.salary,
          StoreId: storeId,
        });
        return res.redirect(`/stores/detail/${storeId}`);
      }
    }
  }

  static async editEmployee(req, res) {
    const storeId = req.params.storeId;
    const employeeId = req.params.employeeId;

    let employee = await Employees.findByPk(employeeId);
    console.log(employee);
    let store = await Store.findByPk(storeId);
    res.render("employee_edit", { employee, store });
  }

  static async updateEmployee(req, res) {
    const body = req.body;
    const employeeId = req.params.employeeId; // Assuming you have a parameter for employee ID
    let position = body.position;
    const storeId = req.params.storeId;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // If there are validation errors, send a response with the errors
      let store = await Store.findByPk(storeId);
      return res.render("employee_edit", { errors: errors.array(), store });
    } else {
      if (body.education == "S2" || body.education == "S3") {
        if (position != "CEO" && position != "Manager") {
          let errors = [
            {
              msg: "Posisi yang diambil harus CEO atau Manager",
            },
          ];
          let store = await Store.findByPk(storeId);
          return res.render("employee_edit", {
            errors: errors,
            store,
          });
        } else {
          // Update the employee
          await Employees.update(
            {
              firstName: body.firstName,
              lastName: body.lastName,
              dateOfBirth: body.dateOfBirth,
              education: body.education,
              position: position,
              salary: body.salary,
              StoreId: storeId,
            },
            { where: { id: employeeId } }
          );

          return res.redirect(`/stores/detail/${storeId}`);
        }
      } else {
        // Update the employee
        await Employees.update(
          {
            firstName: body.firstName,
            lastName: body.lastName,
            dateOfBirth: body.dateOfBirth,
            education: body.education,
            position: position,
            salary: body.salary,
            StoreId: storeId,
          },
          { where: { id: employeeId } }
        );

        return res.redirect(`/stores/detail/${storeId}`);
      }
    }
  }
}

module.exports = Controller;
