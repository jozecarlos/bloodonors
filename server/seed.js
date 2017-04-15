import Donor from './models/donor';

export default function () {
  Donor.count().exec((err, count) => {
    if (count > 0) {
      return;
    }

    const donor1 = new Donor(
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
      }
     );

    const donor2 = new Donor(
      {
        cuid: 'cikqgkv4q01ck7453ualdn3hd',
        ip: '192.168.0.14',
        firstName: 'Edson',
        lastName: 'Carlos',
        email: 'edson.lan@gmail.com',
        contactNumber: '+5585981519864',
        address: 'Caucaia',
        bloodGroup: 'O++',
        location: [-39.0744418, -3.7697569],
      }
    );

    Donor.create([donor1, donor2], (error) => {
      if (error) {
         console.log('seed error: ' + error);
         return;
      }
      console.log('initial data loaded');
    });
  });
}
