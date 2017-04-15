import mongoose from 'mongoose';
import serverConfig from './config';
import seed from './seed';

class DataBase {

  constructor() {
    // Set native promises as mongoose promise
    mongoose.Promise = global.Promise;
    // MongoDB Connection
    mongoose.connect(serverConfig.mongoURL, (error) => {
      if (error) {
        console.error('Please make sure Mongodb is installed and running!'); // eslint-disable-line no-console
        throw error;
      }
      console.log('database started'); // eslint-disable-line no-console
      seed();
    });
  }
}

export const database = new DataBase();
