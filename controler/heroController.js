import bcrypt from "bcryptjs";
import Hero from "../modules/Hero.js";
import jvt from "jsonwebtoken";
import { validationResult } from "express-validator";
import key from "../config/config.js";

const generateAccessToken = (id) => {
  const payload = {
    id,
  };
  return jvt.sign(payload, key.secret, { expiresIn: "1h" });
};

class HeroController {
  async create(req, res) {
    try {
      const errorsValidator = validationResult(req);
      if (!errorsValidator.isEmpty()) {
        return res
          .status(400)
          .json({ message: `Errors validation`, errorsValidator });
      }
      const { name, description, img } = req.body;
      const candidate = await Hero.findOne({ name });
      if (candidate) {
        return res
          .status(400)
          .json({ message: `Hero with "${name}" already exists` });
      }

      const hero = await Hero.create({
        name,
        description,
        img,
      });
      res.json(hero);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async getAll(req, res) {
    try {
      const Heros = await Hero.find();
      return res.json(Heros);
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
      const hero = await Hero.findById(id);
      return res.json(hero);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const hero = await Hero.findOne({ email });
      if (!hero) {
        return req.status(400).json({ message: "Hero is not found" });
      }
      const validPassword = bcrypt.compareSync(password, hero.password);
      if (!validPassword) {
        return req.status(400).json({ message: "Password is not correct" });
      }
      const token = generateAccessToken(hero._id);
      const idHero = Hero.id;
      return res.json({ token, id: idHero });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async update(req, res) {
    try {
      const hero = req.body;

      console.log(hero);
      if (!hero._id) {
        res.status(400).json({ message: "Id is not find" });
      }

      const updatedHero = await Hero.findByIdAndUpdate(hero._id, hero, {
        new: true,
      });

      if (!updatedHero) {
        res.status(400).json({ message: "Error updating" });
      }

      return res.json(updatedHero);
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
      const hero = await Hero.findByIdAndDelete(id);
      return res.json(hero);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

export default new HeroController();
