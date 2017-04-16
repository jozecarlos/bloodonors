import test from 'ava';
import request from 'supertest';
import app from '../../index';
import Donor from '../donor';
import { connectDB, dropDB } from '../../utils/test-helpers';

// Initial posts added into test db
const donors = [
  new Donor(
    {
      cuid: 'cikqgkv4q01ck7453ualdn3hd',
      ip: '192.168.0.12',
      firstName: 'Joze',
      lastName: 'Carlos',
      email: 'jozecarlos.it@gmail.com',
      contactNumber: '+5585981519864',
      address: 'Paracuru',
      bloodGroup: 'A',
      location: [-39.0712081, -3.4338655],
    }),

  new Donor({
    cuid: 'cikqgkv4q01ck7453ualdn3hd',
    ip: '192.168.0.14',
    firstName: 'Edson',
    lastName: 'Carlos',
    email: 'edson.lan@gmail.com',
    contactNumber: '+5585981519864',
    address: 'Caucaia',
    bloodGroup: 'O++',
    location: [-39.0744418, -3.7697569],
  }),
];

test.beforeEach('connect and add two post entries', t => {
  connectDB(t, () => {
    Donor.create(donors, err => {
      if (err) t.fail('Unable to create donors');
    });
  });
});

test.afterEach.always(t => {
  dropDB(t);
});

test.serial('Should correctly give number of Donors', async t => {
  t.plan(2);

  const res = await request(app)
    .get('/api/donors')
    .set('Accept', 'application/json');

  t.is(res.status, 200);
  t.deepEqual(donors.length, res.body.posts.length);
});
