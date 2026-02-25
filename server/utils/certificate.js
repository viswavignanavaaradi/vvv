const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');
const os = require('os');

/**
 * Generates a Patronage Certificate PDF and saves it locally.
 * @param {Object} data - Donation/Patron data from DB.
 * @returns {Promise<string>} - The path to the generated PDF file.
 */
function generateCertificate(data) {
    return new Promise((resolve, reject) => {
        try {
            const memBefore = process.memoryUsage().heapUsed / 1024 / 1024;
            console.log(`[Certificate] Starting for: ${data.donor_name}. Heap: ${memBefore.toFixed(2)}MB`);

            const doc = new PDFDocument({
                layout: 'landscape',
                size: 'A4',
                margin: 0,
                autoFirstPage: true
            });

            // Use system temp directory for reliability on Render
            const fileName = `Certificate_${(data.certificate_id || Date.now())}_${Date.now()}.pdf`;
            const filePath = path.join(os.tmpdir(), fileName);

            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            // 1. COLORS & FONTS
            const primaryTeal = '#0d7c74';
            const textColor = '#333333';
            const canvasWidth = 841.89;
            const canvasHeight = 595.28;

            // 2. BACKGROUND & BORDER
            doc.rect(0, 0, canvasWidth, canvasHeight).fill('#fdfdfd');
            doc.lineWidth(8).strokeColor(primaryTeal).rect(40, 40, canvasWidth - 80, canvasHeight - 80).stroke();

            // 3. HEADER
            const logoWidth = 85;
            const brandingText = 'VISWA VIGNANA VAARADHI';
            const headerGap = 25;
            const headerY = 75;

            const logoPath = path.join(__dirname, '../../client/src/assets/logo.png');
            let imageLoaded = false;

            try {
                if (fs.existsSync(logoPath)) {
                    const stats = fs.statSync(logoPath);
                    if (stats.size < 1500000) {
                        doc.image(logoPath, (canvasWidth - 500) / 2, headerY, { width: logoWidth });
                        imageLoaded = true;
                    }
                }
            } catch (imgErr) {
                console.error('[Certificate] Logo error:', imgErr.message);
            }

            const headerX = imageLoaded ? ((canvasWidth - 500) / 2) + logoWidth + headerGap : (canvasWidth - 400) / 2;
            doc.fillColor(primaryTeal).font('Times-Bold').fontSize(38).text(brandingText, headerX, headerY + 10, { characterSpacing: 1 });
            doc.fontSize(18).font('Times-Roman').text('foundation for a better tomorrow', headerX, headerY + 54, { characterSpacing: 2 });

            // 4. BIG TITLE
            doc.font('Times-Bold').fontSize(56).text('CERTIFICATE OF PATRONAGE', 0, 215, { align: 'center', characterSpacing: 1 });
            doc.fillColor(textColor).font('Times-Roman').fontSize(22).text('This certificate is proudly presented to', 0, 305, { align: 'center' });

            // 5. RECIPIENT NAME
            const patronName = (data.donor_name || 'Valued Patron').toUpperCase();
            doc.fillColor(primaryTeal).font('Times-Bold').fontSize(48).text(patronName, 0, 350, { align: 'center' });
            doc.moveTo(220, 405).lineTo(620, 405).lineWidth(2).stroke(primaryTeal);

            // 6. RECOGNITION TEXT
            doc.fillColor(textColor).font('Times-Roman').fontSize(20).text('in recognition of their invaluable contribution to the vision of VVV', 0, 440, { align: 'center' });

            // 7. SEAL & SIGNATURE
            const sealX = canvasWidth / 2;
            const sealY = 525;
            doc.save().circle(sealX, sealY - 10, 50).fill('#D4AF37').fillColor('#FFFFFF').font('Times-Bold').fontSize(10).text('OFFICIAL', sealX - 30, sealY - 22, { align: 'center', width: 60 }).text('SEAL', sealX - 30, sealY - 10, { align: 'center', width: 60 }).restore();

            const sigX = canvasWidth - 260;
            const sigY = 510;
            doc.fillColor(primaryTeal).font('Times-Bold').fontSize(18);
            doc.moveTo(sigX, sigY).lineTo(sigX + 200, sigY).lineWidth(2).stroke(primaryTeal);
            doc.text('PRESIDENT', sigX, sigY + 12, { width: 200, align: 'center' });

            doc.end();
            stream.on('finish', () => {
                const memAfter = process.memoryUsage().heapUsed / 1024 / 1024;
                console.log(`[Certificate] Success! File at: ${filePath}. Heap: ${memAfter.toFixed(2)}MB`);
                resolve(filePath);
            });
            stream.on('error', (err) => {
                console.error('[Certificate] Stream Error:', err.message);
                reject(err);
            });
        } catch (err) {
            console.error('[Certificate] Catch Error:', err.message);
            reject(err);
        }
    });
}

module.exports = { generateCertificate };
