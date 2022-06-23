const router = require("express").Router();
import {create, login} from "../controllers/auth";

///// Create a new user /////
router.post("/create", create);

///// Login to your account /////
router.post("/login", login);

export default router;