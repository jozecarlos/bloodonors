import { Router } from 'express';
import * as DonorController from '../controllers/donor.controller';
const router = new Router();

// Get all Posts
router.route('/donors').get(DonorController.getDonors);

// Get one post by cuid
router.route('/donors/:cuid').get(DonorController.getPost);

// Add a new Post
router.route('/donors').post(DonorController.addDonor);

// Delete a post by cuid
router.route('/donors/:cuid').delete(DonorController.deletePost);

export default router;
