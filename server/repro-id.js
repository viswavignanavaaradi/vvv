const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

async function testGeneration() {
    const volunteer = {
        _id: "67b960b700f11904b732f913",
        fullName: "Aravind Kumar",
        email: "aravindkumar23567@gmail.com",
        profilePhoto: "https://res.cloudinary.com/dp9qhgckr/image/upload/v1740300305/vv_foundation/profile_1740300303866.png",
        phone: "+91 9515574466",
        bloodGroup: "B+"
    };

    console.log('[REPRO] Starting...');

    try {
        const doc = new PDFDocument({ size: [242, 380], margin: 0 });
        const filePath = path.join(__dirname, 'test_id.pdf');
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        doc.rect(0, 0, 242, 380).fill('#FFFFFF');
        doc.rect(0, 0, 242, 95).fill('#FDFBEB');

        const photoSize = 78;
        const photoX = 82;
        const photoY = 135;

        try {
            console.log('[REPRO] Fetching photo...');
            const response = await axios.get(volunteer.profilePhoto, {
                responseType: 'arraybuffer',
                timeout: 10000
            });
            console.log('[REPRO] Photo fetched. Size:', response.data.length);
            doc.save().roundedRect(photoX, photoY, photoSize, photoSize, 12).clip();
            doc.image(response.data, photoX, photoY, { width: photoSize, height: photoSize, fit: [photoSize, photoSize] });
            doc.restore();
        } catch (e) {
            console.log('[REPRO] Photo failed:', e.message);
            doc.rect(photoX, photoY, photoSize, photoSize).fill('#CCCCCC');
        }

        console.log('[REPRO] Finishing...');
        doc.end();

        stream.on('finish', () => {
            console.log('[REPRO] Success at:', filePath);
            process.exit(0);
        });

    } catch (err) {
        console.error('[REPRO] Fatal error:', err);
        process.exit(1);
    }
}

testGeneration();
