const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

async function testGeneration() {
    const volunteer = {
        _id: "67b960b700f11904b732f913",
        fullName: "Aravind Kumar",
        profilePhoto: "https://res.cloudinary.com/dp9qhgckr/image/upload/v1740306126/vv_foundation/profile_1740306123985_pumj42ts.png"
    };

    console.log('[REPRO] Starting with NEW URL:', volunteer.profilePhoto);

    try {
        const doc = new PDFDocument({ size: [242, 380], margin: 0 });
        const filePath = path.join(__dirname, 'test_id_real.pdf');
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        console.log('[REPRO] Fetching photo...');
        const response = await axios.get(volunteer.profilePhoto, {
            responseType: 'arraybuffer',
            timeout: 10000
        });
        console.log('[REPRO] Photo fetched. Size:', response.data.length);

        console.log('[REPRO] Drawing image...');
        doc.image(response.data, 82, 135, { width: 78, height: 78 });

        console.log('[REPRO] Finishing...');
        doc.end();

        stream.on('finish', () => {
            console.log('[REPRO] SUCCESS! Bytes in PDF:', fs.statSync(filePath).size);
            process.exit(0);
        });

    } catch (err) {
        console.error('[REPRO] CRASH!', err);
        process.exit(1);
    }
}

testGeneration();
