const fs = require('fs');
const path = require('path');

const logoPath = 'c:/ngo/client/src/assets/logo.png';
const sigPath = 'c:/ngo/client/src/assets/signature.png';

[logoPath, sigPath].forEach(p => {
    if (fs.existsSync(p)) {
        console.log(`${p}: ${fs.statSync(p).size} bytes`);
    } else {
        console.log(`${p}: NOT FOUND`);
    }
});
