const router = require("express").Router();
import {getCurrentUser, viewAll, viewOne} from "../controllers/users";

///// View all users /////
router.get("/", viewAll);

///// Get logged in user /////
router.get("/me", getCurrentUser);

///// View one user /////
router.get("/:username", viewOne);

export default router;