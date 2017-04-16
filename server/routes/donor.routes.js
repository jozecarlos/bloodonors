import { Router } from 'express';
import * as DonorController from '../controllers/donor.controller';
const router = new Router();

// Get all Posts
router.route('/donors').get(DonorController.getDonors);

// Get one donor by cuid
router.route('/donors/:cuid').get(DonorController.getPost);

// Add a new Donor
router.route('/donors').post(DonorController.addDonor);

// Delete a donor by cuid
router.route('/donors/:cuid').delete(DonorController.deleteDonor);

export default router;
