import express from "express";
import Joi from "joi";
import ExpressValidation from "express-joi-validation";
import {
  getChannelDetails,
  getChannels,
  postFollowChannel,
  getFollowedChannel,
} from "../controllers/controllers.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

const validator = ExpressValidation.createValidator({});

const channelDetailsSchema = Joi.object({
  channelId: Joi.string().required(),
});

router.get("/followed", verifyToken, getFollowedChannel);

router.post(
  "/follow",
  verifyToken,
  validator.body(channelDetailsSchema),
  postFollowChannel
);

router.get(
  "/:channelId",
  validator.params(channelDetailsSchema),
  getChannelDetails
);

router.get("/", getChannels);

export default router;
