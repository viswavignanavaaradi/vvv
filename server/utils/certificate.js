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
            console.log(`[Certificate] Advanced layout flow for: ${data.donor_name}. Heap: ${memBefore.toFixed(2)}MB`);

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

            // COLORS & DIMENSIONS
            const primaryTeal = '#0d7c74';
            const textColor = '#333333';
            const canvasWidth = 841.89;
            const canvasHeight = 595.28;

            // 0. BACKGROUND WATERMARK (Minimal visibility)
            const logoPath = path.join(__dirname, '../../client/src/assets/logo.png');
            try {
                if (fs.existsSync(logoPath) && fs.statSync(logoPath).size < 1000000) {
                    doc.save()
                        .opacity(0.02) // Extremely faint to simulate "minimal visible/blur" 
                        .image(logoPath, (canvasWidth - 350) / 2, (canvasHeight - 350) / 2, { width: 350 })
                        .restore();
                }
            } catch (e) {
                console.warn('[Certificate] Watermark skip:', e.message);
            }

            // 1. BACKGROUND & BORDER
            doc.rect(0, 0, canvasWidth, canvasHeight).fill('#ffffff');
            doc.lineWidth(8).strokeColor(primaryTeal).rect(35, 35, canvasWidth - 70, canvasHeight - 70).stroke();
            doc.lineWidth(1).strokeColor('#cbd5e1').rect(48, 48, canvasWidth - 96, canvasHeight - 96).stroke();

            // 2. HEADER: LOGO BESIDE TITLE
            const brandingText = 'VISWA VIGNANA VAARADHI';
            const taglineText = 'foundation for a better tomorrow';
            const headerY = 70;
            const logoWidth = 75;
            const spacing = 20;

            // Calculate total header width to center the block
            doc.font('Times-Bold').fontSize(36);
            const titleWidth = doc.widthOfString(brandingText, { characterSpacing: 1 });
            const totalHeaderWidth = logoWidth + spacing + titleWidth;
            const startX = (canvasWidth - totalHeaderWidth) / 2;

            try {
                if (fs.existsSync(logoPath) && fs.statSync(logoPath).size < 1000000) {
                    doc.image(logoPath, startX, headerY, { width: logoWidth });
                }
            } catch (err) {
                console.error('[Certificate] Logo fail:', err.message);
            }

            // Branding Title
            doc.fillColor(primaryTeal).font('Times-Bold').fontSize(36).text(brandingText, startX + logoWidth + spacing, headerY + 12, { characterSpacing: 1 });

            // Extended Tagline: Match the branding title width
            doc.fillColor(textColor).font('Times-Roman').fontSize(16);
            const currentTaglineWidth = doc.widthOfString(taglineText);
            // Calculate character spacing needed to reach titleWidth
            const neededSpacing = (titleWidth - currentTaglineWidth) / (taglineText.length - 1);
            doc.text(taglineText, startX + logoWidth + spacing, headerY + 52, {
                characterSpacing: neededSpacing > 0 ? neededSpacing : 0
            });

            // Horizontal Divider
            doc.moveTo(250, 160).lineTo(590, 160).lineWidth(1).strokeColor('#e5e7eb').stroke();
            doc.save().translate(canvasWidth / 2, 160).rotate(45).rect(-4, -4, 8, 8).fill(primaryTeal).restore();

            // 3. MAIN TITLES
            doc.fillColor(primaryTeal).font('Times-Bold').fontSize(44).text('CERTIFICATE OF PATRONAGE', 0, 195, { align: 'center', characterSpacing: 1.5 });
            doc.fillColor(textColor).font('Times-Roman').fontSize(16).text('This certificate is proudly presented to', 0, 265, { align: 'center' });

            // 4. DYNAMIC NAME FITTING
            const rawName = (data.donor_name || 'Valued Patron').toUpperCase();
            const displayName = `[ ${rawName} ]`;

            let nameFontSize = 38;
            doc.font('Times-Bold').fontSize(nameFontSize);
            let nameWidth = doc.widthOfString(displayName);
            while (nameWidth > (canvasWidth - 180) && nameFontSize > 14) {
                nameFontSize -= 1;
                doc.fontSize(nameFontSize);
                nameWidth = doc.widthOfString(displayName);
            }

            doc.fillColor(primaryTeal).text(displayName, 0, 310, { align: 'center' });

            // 5. RECOGNITION TEXT
            doc.fillColor(textColor).font('Times-Roman').fontSize(16).text('in recognition of their invaluable contribution to the vision of VVV', 0, 395, { align: 'center' });

            // 6. SEAL
            const sealPath = path.join(__dirname, '../../client/src/assets/seal.png');
            const sealX = (canvasWidth - 90) / 2;
            const sealY = 465;

            try {
                if (fs.existsSync(sealPath) && fs.statSync(sealPath).size < 1000000) {
                    doc.image(sealPath, sealX, sealY, { width: 90 });
                } else {
                    doc.save().circle(canvasWidth / 2, sealY + 45, 35).fill('#D4AF37').restore();
                }
            } catch (err) {
                doc.save().circle(canvasWidth / 2, sealY + 45, 35).fill('#D4AF37').restore();
            }

            // 7. SIGNATURE
            const sigPath = path.join(__dirname, '../../client/src/assets/signature.png');
            const sigX = canvasWidth - 240;
            const sigY = 460;

            try {
                if (fs.existsSync(sigPath) && fs.statSync(sigPath).size < 1000000) {
                    doc.image(sigPath, sigX, sigY, { width: 140 });
                }
            } catch (err) {
                console.error('[Certificate] Sig fail:', err.message);
            }

            doc.moveTo(sigX - 10, sigY + 50).lineTo(sigX + 170, sigY + 50).lineWidth(1.2).strokeColor(primaryTeal).stroke();
            doc.fillColor(primaryTeal).font('Times-Bold').fontSize(16).text('PRESIDENT', sigX - 10, sigY + 58, { width: 180, align: 'center' });

            doc.end();
            stream.on('finish', () => resolve(filePath));
            stream.on('error', (err) => {
                console.error('[Certificate] WriteStream Error:', err.message);
                reject(err);
            });
        } catch (err) {
            console.error('[Certificate] Precision Error:', err);
            reject(err);
        }
    });
}

module.exports = { generateCertificate };
