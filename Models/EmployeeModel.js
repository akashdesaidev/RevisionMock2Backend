const { Schema, model } = require("mongoose");

const employeeSchema = new Schema({
  firstname: String,
  lastname: String,
  email: String,
  department: { type: String, enum: ["Tech", "Marketing", "Operations"] },
  Salary: Number,
});

const EmployeeModel = model("employees", employeeSchema);

module.exports = EmployeeModel;
