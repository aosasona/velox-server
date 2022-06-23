const router = require("express").Router();
import {create, login} from "../controllers/users";

///// Create a new user /////
router.post("/create", create);

///// Login to your account /////
router.post("/login", login);

export default router;
