import express from "express";
import Joi from "joi";
import ExpressValidation from "express-joi-validation";
import {
  getChannelSettings,
  updateChannelSettings,
  updatePasswordChannelSettings,
} from "../controllers/controllers.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

const validator = ExpressValidation.createValidator({});

const channelSettingSchema = Joi.object({
    username: Joi.string().min(3).max(12).required(),
    title: Joi.string().min(3).max(30).required(),   
    description: Joi.string().min(10).max(200).required(), 
    avatarUrl: Joi.string().uri().required()
});

const changePasswordSchema = Joi.object({
    password: Joi.string().min(6).max(12).required(),
    newPassword: Joi.string().min(6).max(12).required(),
    
  });
  

router.get("/channel", verifyToken, getChannelSettings);
router.put("/channel", verifyToken,validator.body(channelSettingSchema), updateChannelSettings);
router.patch("/password", verifyToken,validator.body(changePasswordSchema),updatePasswordChannelSettings);

export default router;
