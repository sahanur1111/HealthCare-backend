import express from "express";
import {
  getAllReviews,
  createReview,
} from "../Controllers/reviewController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";

const router = express.Router({mergeParams: true}); // doctor a jano merge hoi tarjonno merge kore rak lam this on "{mergeParams: true}"

// doctor/doctorId/review  // that is nested routes

router
  .route("/")
  .get(getAllReviews)
  .post(authenticate, restrict(["patient"]), createReview);

export default router;
