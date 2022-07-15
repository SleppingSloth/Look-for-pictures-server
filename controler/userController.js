import bcrypt from "bcryptjs";
import User from "../modules/User.js";
import Role from "../modules/Roles.js";
import jvt from "jsonwebtoken";
import { validationResult } from "express-validator";
import key from "../config/config.js";

const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles
  };
  return jvt.sign(payload, key.secret, { expiresIn: "1h" });
};

class UserController {
  async create(req, res) {
    try {
      const errorsValidator = validationResult(req);
      if (!errorsValidator.isEmpty()) {
        return res
          .status(400)
          .json({ message: `Errors validation`, errorsValidator });
      }
      const { password, email } = req.body;
      const candidate = await User.findOne({ email });
      if (candidate) {
        return res
          .status(400)
          .json({ message: `User "${email}" already exists` });
      }

      const hashPassword = bcrypt.hashSync(password, 7);
      const userRole = await Role.findOne({value: "USER"});

      const user = await User.create({
        password: hashPassword,
        email,
        roles: [userRole.value]
      });
      
      res.json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async getAll(req, res) {
    try {
      const users = await User.find();
      return res.json(users);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: "Id is not find" });
      }
      const user = await User.findById(id);
      return res.json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return req.status(400).json({ message: "User is not found" });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return req.status(400).json({ message: "Password is not correct" });
      }
      const token = generateAccessToken(user._id, user.roles);
      const idUser = user.id;

      return res.json({ token, id: idUser, roles: user.roles });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async update(req, res) {
    try {
      const user = req.body;
      if (!user._id) {
        res.status(400).json({ message: "Id is not find" });
      }
      const updatedUser = await User.findByIdAndUpdate(user._id, user, {
        new: true,
      });
      if (!updatedUser) {
        res.status(400).json({ message: "Error updating" });
      }

      return res.json(updatedUser);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: "Id is not find" });
      }
      const user = await User.findByIdAndDelete(id);
      return res.json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

export default new UserController();
