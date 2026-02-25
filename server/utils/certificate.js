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
            console.log(`[Certificate] Starting reliability flow for: ${data.donor_name}. Current Heap: ${memBefore.toFixed(2)}MB`);

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
            doc.lineWidth(12).strokeColor(primaryTeal).rect(40, 40, canvasWidth - 80, canvasHeight - 80).stroke();
            doc.lineWidth(2).strokeColor('#e5e7eb').rect(55, 55, canvasWidth - 110, canvasHeight - 110).stroke();

            // 2. HEADER
            const logoPath = path.join(__dirname, '../../client/src/assets/logo.png');
            const brandingText = 'VISWA VIGNANA VAARADHI';
            const headerY = 75;

            // Memory-Safe Logo Loading
            try {
                if (fs.existsSync(logoPath)) {
                    const stats = fs.statSync(logoPath);
                    // RENDER OOM PROTECT: Skip images > 500KB to prevent 502 crashes
                    if (stats.size < 500000) {
                        doc.image(logoPath, 110, headerY, { width: 85 });
                    } else {
                        console.warn(`[Certificate] Logo skipped (Size: ${(stats.size / 1024 / 1024).toFixed(2)}MB > 0.5MB limit)`);
                    }
                }
            } catch (err) {
                console.error('[Certificate] Logo fail:', err.message);
            }

            doc.fillColor(primaryTeal).font('Times-Bold').fontSize(42).text(brandingText, 215, headerY + 15, { characterSpacing: 1 });
            doc.fontSize(20).font('Times-Roman').text('foundation for a better tomorrow', 215, headerY + 60, { characterSpacing: 3 });

            // Horizontal Divider
            doc.moveTo(220, 185).lineTo(620, 185).lineWidth(1.5).strokeColor('#cbd5e1').stroke();
            doc.save().translate(421, 184).rotate(45).rect(-6, -6, 12, 12).fill(primaryTeal).restore();

            // 3. MAIN TITLES
            doc.fillColor(primaryTeal).font('Times-Bold').fontSize(62).text('CERTIFICATE OF PATRONAGE', 0, 210, { align: 'center', characterSpacing: 1 });
            doc.fillColor(textColor).font('Times-Roman').fontSize(22).text('This certificate is proudly presented to', 0, 295, { align: 'center' });

            // 4. DYNAMIC NAME FITTING
            const rawName = (data.donor_name || 'Valued Patron').toUpperCase();
            const displayName = `[ ${rawName} ]`;

            let nameFontSize = 54;
            doc.font('Times-Bold').fontSize(nameFontSize);
            let nameWidth = doc.widthOfString(displayName);
            while (nameWidth > (canvasWidth - 150) && nameFontSize > 20) {
                nameFontSize -= 2;
                doc.fontSize(nameFontSize);
                nameWidth = doc.widthOfString(displayName);
            }

            doc.fillColor(primaryTeal).text(displayName, 0, 345, { align: 'center' });

            // 5. RECOGNITION TEXT
            doc.fillColor(textColor).font('Times-Roman').fontSize(22).text('in recognition of their invaluable contribution to the vision of VVV', 0, 445, { align: 'center' });

            // 6. SEAL
            const sealPath = path.join(__dirname, '../../client/src/assets/seal.png');
            const sealX = (canvasWidth - 110) / 2;
            const sealY = 485;

            try {
                if (fs.existsSync(sealPath)) {
                    const stats = fs.statSync(sealPath);
                    if (stats.size < 500000) {
                        doc.image(sealPath, sealX, sealY, { width: 110 });
                    } else {
                        console.warn(`[Certificate] Seal skipped (Size: ${(stats.size / 1024 / 1024).toFixed(2)}MB > 0.5MB limit)`);
                        doc.save().circle(canvasWidth / 2, sealY + 50, 45).fill('#D4AF37').restore();
                    }
                } else {
                    doc.save().circle(canvasWidth / 2, sealY + 50, 45).fill('#D4AF37').restore();
                }
            } catch (err) {
                console.error('[Certificate] Seal fail:', err.message);
                doc.save().circle(canvasWidth / 2, sealY + 50, 45).fill('#D4AF37').restore();
            }

            // 7. SIGNATURE
            const sigPath = path.join(__dirname, '../../client/src/assets/signature.png');
            const sigX = canvasWidth - 280;
            const sigY = 480;

            try {
                if (fs.existsSync(sigPath)) {
                    const stats = fs.statSync(sigPath);
                    if (stats.size < 500000) {
                        doc.image(sigPath, sigX + 10, sigY, { width: 180 });
                    } else {
                        console.warn(`[Certificate] Signature skipped (Size: ${(stats.size / 1024 / 1024).toFixed(2)}MB > 0.5MB limit)`);
                    }
                }
            } catch (err) {
                console.error('[Certificate] Sig fail:', err.message);
            }

            doc.moveTo(sigX, sigY + 55).lineTo(sigX + 220, sigY + 55).lineWidth(2).strokeColor(primaryTeal).stroke();
            doc.fillColor(primaryTeal).font('Times-Bold').fontSize(22).text('PRESIDENT', sigX, sigY + 65, { width: 220, align: 'center' });

            doc.end();
            stream.on('finish', () => {
                const memAfter = process.memoryUsage().heapUsed / 1024 / 1024;
                console.log(`[Certificate] Generated Successfully! File: ${fileName}. Heap: ${memAfter.toFixed(2)}MB`);
                resolve(filePath);
            });
            stream.on('error', (err) => {
                console.error('[Certificate] WriteStream Error:', err.message);
                reject(err);
            });
        } catch (err) {
            console.error('[Certificate] Critical Generation Error:', err);
            reject(err);
        }
    });
}

module.exports = { generateCertificate };
