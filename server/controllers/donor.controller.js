import Donor from '../models/donor';
import cuid from 'cuid';

/**
 * Get all posts
 * @param req
 * @param res
 * @returns void
 */
export function getPosts(req, res) {
  Donor.find().sort('-dateAdded').exec((err, posts) => {
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
export function addDonor(obj) {
  const newDonor = new Donor(obj);
  newDonor.cuid = cuid();
  newDonor.save((err) => {
    if (err) {
      console.log(err); // eslint-disable-line no-console
    }
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
 * Delete a post
 * @param req
 * @param res
 * @returns void
 */
export function deletePost(req, res) {
  Donor.findOne({ cuid: req.params.cuid }).exec((err, post) => {
    if (err) {
      res.status(500).send(err);
    }

    post.remove(() => {
      res.status(200).end();
    });
  });
}