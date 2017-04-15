import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const donorSchema = new Schema({
  cuid: { type: 'String', required: true },
  ip: { type: 'String', required: true },
  location: { type: [Number], index: '2dsphere' },
  firstName: { type: 'String', required: true },
  lastName: { type: 'String', required: true },
  email: { type: 'String', required: true },
  contactNumber: { type: 'String', required: true },
  address: { type: 'String', required: true },
  bloodGroup: { type: 'String', required: true },
  createdAt: { type: 'Date', default: Date.now, required: false },
});

export default mongoose.model('Donor', donorSchema);
