const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { connection } = require("./Models/db");
const { UserModel } = require("./Models/USERModel");
const { Authenticate, Authentication } = require("./Middleware");
const EmployeeModel = require("./Models/EmployeeModel");
require("dotenv").config();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 5);
    const user = new UserModel({ email, password: hashedPassword, name });
    const savedUser = await user.save();

    const { password: hashedPasswordResponse, ...userWithoutPassword } =
      savedUser._doc;

    res.status(201).json(userWithoutPassword);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "User creation error" });
  }

  console.log(User);
  res.send("user");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        var token = jwt.sign({ email: user.email }, "shhhhh");

        res.status(200).json({ message: token });
      } else {
        res.status(401).json({ error: "Wrong credentials" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.use(Authentication);

app.post("/employees", async (req, res) => {
  let { firstname, lastname, email, Department, Salary } = req.body;

  try {
    const Employee = await EmployeeModel.create({
      firstname,
      lastname,
      email,
      Department,
      Salary,
    });

    res.status(200).json(Employee);
  } catch (err) {
    console.log(err);
  }
});

app.get("/employees", async (req, res) => {
  const { page = 1, limit = 5, department, sortBy, search } = req.query;
  let query = {};
  if (department) {
    query.Department = department;
  }

  if (search) {
    query.firstname = { $eq: search };
  }

  const sortOptions = {};
  if (sortBy) {
    sortOptions.Salary = sortBy === "asc" ? 1 : -1;
  }
  try {
    const Employee = await EmployeeModel.find(query)
      .skip((page - 1) * 5)
      .limit(limit)
      .sort(sortOptions);

    res.status(200).json(Employee);
  } catch (err) {
    console.log(err);
  }
});

app.delete("/employees/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const Employee = await EmployeeModel.findByIdAndDelete(id);

    res.status(200).json(Employee);
  } catch (err) {
    console.log(err);
  }
});

app.patch("/employees/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedEmployee = await EmployeeModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ Message: "Internal server error" });
  }
});

app.get("/", (req, res) => {
  res.status(200).json("hello");
});

app.listen(PORT, async () => {
  try {
    await connection;
    console.log("connection established");
  } catch (err) {
    console.error(err);
  }
  console.log(`Listening on port: ${PORT}`);
});
