const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

async function testLogoCrash() {
    console.log('[REPRO-LOGO] Starting...');

    try {
        const doc = new PDFDocument({ size: [242, 380], margin: 0 });
        const filePath = path.join(__dirname, 'test_logo_crash.pdf');
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        doc.rect(0, 0, 242, 380).fill('#FFFFFF');

        const logoPath = 'c:/ngo/client/src/assets/logo.png';
        if (fs.existsSync(logoPath)) {
            console.log('[REPRO-LOGO] Adding logo:', logoPath, fs.statSync(logoPath).size, 'bytes');
            doc.image(logoPath, 12, 30, { width: 52 });
        }

        console.log('[REPRO-LOGO] Finishing...');
        doc.end();

        stream.on('finish', () => {
            console.log('[REPRO-LOGO] SUCCESS!');
            process.exit(0);
        });

    } catch (err) {
        console.error('[REPRO-LOGO] CRASH!', err);
        process.exit(1);
    }
}

testLogoCrash();
