const router = require("express").Router();
import { create } from "../controllers/users";

///// Create a new user /////
router.post("/create", create);

export default router;
