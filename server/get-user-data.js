const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        const email = 'aravindkumar23567@gmail.com';
        const user = await User.findOne({ email });

        const data = {
            email: user.email,
            picture: user.picture,
            pictureType: typeof user.picture
        };

        fs.writeFileSync('user-data-raw.json', JSON.stringify(data, null, 2));
        console.log('User data saved to user-data-raw.json');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
