import Router from "express";
import UserController from "../controler/userController.js";
import { check } from "express-validator";
import authMiddleware from "../middlewaree/authMiddlewaree.js";
import roleMiddleware from "../middlewaree/roleMiddlewaree.js";

const router = new Router();

router.post(
  "/",
  [
    check("email", "Email is not required").notEmpty().isEmail(),
    check("password", "Password is not required")
      .notEmpty()
      .isLength({ min: 5, max: 50 }),
  ],
  UserController.create
);

router.post("/login", UserController.login);

router.get("/", authMiddleware, UserController.getAll);

router.get("/:id", authMiddleware, UserController.getOne);

router.put("/", authMiddleware, UserController.update);

router.delete("/:id", roleMiddleware(["ADMIN"]), UserController.delete);

export default router;
