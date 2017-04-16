import * as DonorController from './controllers/donor.controller';
import SocketIO from 'socket.io';

class Socket {
  /* eslint-disable no-console */

  init = (server) => {
    this._io = new SocketIO(server);

    this._io.on('connection', (socket) => {
      console.log('a donor connected');

      socket.on('disconnect', () => {
        console.log('donor disconnected');
      });

      socket.on('add:donor', (donor) => {
        console.log(donor);
        DonorController.addDonor(donor, (err, dn) => {
          if (err) {
            socket.emit('response:error', err);
          } else {
            socket.emit('response:add', { type: 'add:donors', data: dn });
          }
        });
      });

      socket.on('edit:donor', (donor) => {
        // DonorController.addDonor(donor);
        console.log(donor);
      });

      socket.on('delete:donor', (donor) => {
        // DonorController.addDonor(donor);
        console.log(donor);
      });

      socket.on('list:donor', (loc) => {
        console.log(loc);
        DonorController.near(loc, (err, donors) => {
          if (err) {
            socket.emit('response:error', err);
          } else {
            socket.emit('response:points', { type: 'list:donors', data: donors });
          }
        });
      });

    });
  }
}

export const socket = new Socket();
