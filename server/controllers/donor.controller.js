import Donor from '../models/donor';
import cuid from 'cuid';

/**
 * Get all donors
 * @param req
 * @param res
 * @returns void
 */
export function getDonors(req, res) {
  Donor.find().exec((err, posts) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ posts });
  });
}

export function list(callback) {
  Donor.find().exec((err, donors) => {
    callback(err, donors);
  });
}

/**
 * Get all ponts near of the current location
 * @param location is coordinate spacial
 */
export function near(loc, callback) {
  Donor.find({ location: { '$near': {
    '$maxDistance': 300000,
    '$geometry': { type: 'Point', coordinates: loc } } },
    }).exec((err, donors) => {
    callback(err, donors);
  });
}

/**
 * Save a donor
 * @param obj
 * @returns void
 */
export function addDonor(obj, callback) {
  const newDonor = new Donor(obj);
  newDonor.cuid = cuid();
  newDonor.save((err) => {
    callback(err, newDonor);
  });
}

/**
 * Get a single post
 * @param req
 * @param res
 * @returns void
 */
export function getPost(req, res) {
  Donor.findOne({ cuid: req.params.cuid }).exec((err, post) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ post });
  });
}

/**
 * Delete a donor
 * @param donor
 * @param callback function
 * @returns void
 */
export function deleteDonor(dn, callback) {
  Donor.findOne({ cuid: dn.cuid }).exec((err, donor) => {
    donor.remove(() => {
      callback(err, true);
    });
  });
}
