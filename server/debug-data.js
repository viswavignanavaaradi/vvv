const mongoose = require('mongoose');
const User = require('./models/User');
const Volunteer = require('./models/Volunteer');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        const email = 'aravindkumar23567@gmail.com';
        const volunteer = await Volunteer.findOne({ email });
        const user = await User.findOne({ email });

        console.log('--- VOLUNTEER DATA ---');
        console.log(JSON.stringify(volunteer, null, 2));
        console.log('--- USER DATA ---');
        console.log(JSON.stringify(user, null, 2));

        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
