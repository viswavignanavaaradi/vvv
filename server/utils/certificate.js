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
            console.log(`[Certificate] Starting typography refinement for: ${data.donor_name}. Heap: ${memBefore.toFixed(2)}MB`);

            const doc = new PDFDocument({
                layout: 'landscape',
                size: 'A4',
                margin: 0,
                autoFirstPage: true,
                info: {
                    Title: 'Certificate of Patronage',
                    Author: 'Viswa Vignana Vaaradhi'
                }
            });

            const fileName = `Certificate_${(data.certificate_id || Date.now())}_${Date.now()}.pdf`;
            const filePath = path.join(os.tmpdir(), fileName);

            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            // COLORS
            const primaryTeal = '#0d7c74';
            const textColor = '#333333';
            const canvasWidth = 841.89;
            const canvasHeight = 595.28;

            // 1. BACKGROUND & BORDER
            doc.rect(0, 0, canvasWidth, canvasHeight).fill('#ffffff');
            doc.lineWidth(10).strokeColor(primaryTeal).rect(40, 40, canvasWidth - 80, canvasHeight - 80).stroke();
            doc.lineWidth(1).strokeColor('#e5e7eb').rect(55, 55, canvasWidth - 110, canvasHeight - 110).stroke();

            // 2. HEADER
            const logoPath = path.join(__dirname, '../../client/src/assets/logo.png');
            const brandingText = 'VISWA VIGNANA VAARADHI';
            const headerY = 70;

            try {
                if (fs.existsSync(logoPath) && fs.statSync(logoPath).size < 500000) {
                    doc.image(logoPath, 110, headerY, { width: 75 });
                }
            } catch (err) {
                console.error('[Certificate] Logo fail:', err.message);
            }

            doc.fillColor(primaryTeal).font('Times-Bold').fontSize(36).text(brandingText, 205, headerY + 12, { characterSpacing: 1 });
            doc.fontSize(16).font('Times-Roman').text('foundation for a better tomorrow', 205, headerY + 52, { characterSpacing: 2 });

            // Horizontal Divider
            doc.moveTo(220, 165).lineTo(620, 165).lineWidth(1).strokeColor('#cbd5e1').stroke();
            doc.save().translate(421, 164).rotate(45).rect(-5, -5, 10, 10).fill(primaryTeal).restore();

            // 3. MAIN TITLES
            doc.fillColor(primaryTeal).font('Times-Bold').fontSize(54).text('CERTIFICATE OF PATRONAGE', 0, 195, { align: 'center', characterSpacing: 1 });
            doc.fillColor(textColor).font('Times-Roman').fontSize(18).text('This certificate is proudly presented to', 0, 275, { align: 'center' });

            // 4. DYNAMIC NAME FITTING
            const rawName = (data.donor_name || 'Valued Patron').toUpperCase();
            const displayName = `[ ${rawName} ]`;

            let nameFontSize = 48;
            doc.font('Times-Bold').fontSize(nameFontSize);
            let nameWidth = doc.widthOfString(displayName);
            while (nameWidth > (canvasWidth - 160) && nameFontSize > 18) {
                nameFontSize -= 2;
                doc.fontSize(nameFontSize);
                nameWidth = doc.widthOfString(displayName);
            }

            doc.fillColor(primaryTeal).text(displayName, 0, 320, { align: 'center' });

            // 5. RECOGNITION TEXT
            doc.fillColor(textColor).font('Times-Roman').fontSize(20).text('in recognition of their invaluable contribution to the vision of VVV', 0, 415, { align: 'center' });

            // 6. SEAL
            const sealPath = path.join(__dirname, '../../client/src/assets/seal.png');
            const sealX = (canvasWidth - 95) / 2;
            const sealY = 475;

            try {
                if (fs.existsSync(sealPath) && fs.statSync(sealPath).size < 500000) {
                    doc.image(sealPath, sealX, sealY, { width: 95 });
                } else {
                    doc.save().circle(canvasWidth / 2, sealY + 45, 40).fill('#D4AF37').restore();
                }
            } catch (err) {
                console.error('[Certificate] Seal fail:', err.message);
                doc.save().circle(canvasWidth / 2, sealY + 45, 40).fill('#D4AF37').restore();
            }

            // 7. SIGNATURE
            const sigPath = path.join(__dirname, '../../client/src/assets/signature.png');
            const sigX = canvasWidth - 260;
            const sigY = 470;

            try {
                if (fs.existsSync(sigPath) && fs.statSync(sigPath).size < 500000) {
                    doc.image(sigPath, sigX + 10, sigY, { width: 160 });
                }
            } catch (err) {
                console.error('[Certificate] Sig fail:', err.message);
            }

            doc.moveTo(sigX, sigY + 50).lineTo(sigX + 200, sigY + 50).lineWidth(1.5).strokeColor(primaryTeal).stroke();
            doc.fillColor(primaryTeal).font('Times-Bold').fontSize(20).text('PRESIDENT', sigX, sigY + 60, { width: 200, align: 'center' });

            doc.end();
            stream.on('finish', () => {
                const memAfter = process.memoryUsage().heapUsed / 1024 / 1024;
                console.log(`[Certificate] Balanced Layout Generated! File: ${fileName}. Heap: ${memAfter.toFixed(2)}MB`);
                resolve(filePath);
            });
            stream.on('error', (err) => {
                console.error('[Certificate] WriteStream Error:', err.message);
                reject(err);
            });
        } catch (err) {
            console.error('[Certificate] Typography Refinement Error:', err);
            reject(err);
        }
    });
}

module.exports = { generateCertificate };
