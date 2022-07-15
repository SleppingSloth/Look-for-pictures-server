import Router from "express";
import HeroController from "../controler/heroController.js";
import { check } from "express-validator";
import authMiddleware from "../middlewaree/authMiddlewaree.js";
import roleMiddleware from "../middlewaree/roleMiddlewaree.js";

const router = new Router();

router.post(
  "/",
  [
    check("name", "Name is not required").notEmpty(),
    check("img", "Img is not required").notEmpty(),
    check("description", "Description is not required").notEmpty(),
  ],
  HeroController.create
);


router.get("/", authMiddleware, HeroController.getAll);

router.get("/:id", authMiddleware, HeroController.getOne);

router.put("/", roleMiddleware(["ADMIN"]), HeroController.update);

router.delete("/:id", roleMiddleware(["ADMIN"]), HeroController.delete);

export default router;
