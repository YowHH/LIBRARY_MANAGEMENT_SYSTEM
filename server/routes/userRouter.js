import express from "express"
import { gettAllUsers, registerNewAdmin} from "../controllers/userController.js"
import { isAuthenticated, isAuthorized} from "../middlewares/authMiddleware.js"

const router = express.Router()

router.get("/all", isAuthenticated, isAuthorized("Admin"), gettAllUsers)
router.get("/add/new-admin", isAuthenticated, isAuthorized("Admin"), registerNewAdmin)

export default router