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
            console.log(`[Certificate] Final robust layout for: ${data.donor_name}. Heap: ${memBefore.toFixed(2)}MB`);

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

            // NEW ASSET PATHS (Robust for Render production)
            const logoPath = path.join(__dirname, '../assets/logo.png');
            const sealPath = path.join(__dirname, '../assets/seal.png');
            const sigPath = path.join(__dirname, '../assets/signature.png');

            // 1. BACKGROUND RECT
            doc.rect(0, 0, canvasWidth, canvasHeight).fill('#ffffff');

            // 2. BACKGROUND WATERMARK (Visible but subtle)
            try {
                if (fs.existsSync(logoPath)) {
                    doc.save()
                        .opacity(0.06) // Slightly higher for better visibility on white bg
                        .image(logoPath, (canvasWidth - 500) / 2, (canvasHeight - 500) / 2, { width: 500 })
                        .restore();
                }
            } catch (e) {
                console.warn('[Certificate] Watermark skip:', e.message);
            }

            // 3. BORDER
            doc.lineWidth(8).strokeColor(primaryTeal).rect(35, 35, canvasWidth - 70, canvasHeight - 70).stroke();
            doc.lineWidth(1).strokeColor('#cbd5e1').rect(48, 48, canvasWidth - 96, canvasHeight - 96).stroke();

            // 4. HEADER: CENTERED LOGO + TITLE + TAGLINE
            const brandingText = 'VISWA VIGNANA VAARADHI';
            const taglineText = 'foundation for a better tomorrow';
            const headerY = 70;
            const logoDisplayWidth = 72;
            const spacing = 18;

            doc.font('Times-Bold').fontSize(34);
            const titleWidth = doc.widthOfString(brandingText, { characterSpacing: 1 });
            const totalHeaderWidth = logoDisplayWidth + spacing + titleWidth;
            const startX = (canvasWidth - totalHeaderWidth) / 2;

            // Draw Logo on the left of the title block
            try {
                if (fs.existsSync(logoPath)) {
                    doc.image(logoPath, startX, headerY, { width: logoDisplayWidth });
                }
            } catch (err) {
                console.error('[Certificate] Header Logo fail:', err.message);
            }

            // Draw Centered Branding Title
            doc.fillColor(primaryTeal).font('Times-Bold').fontSize(34).text(brandingText, startX + logoDisplayWidth + spacing, headerY + 12, { characterSpacing: 1 });

            // Extended Tagline matching Title width
            doc.fillColor(textColor).font('Times-Roman').fontSize(16);
            const rawTaglineWidth = doc.widthOfString(taglineText);
            const tagNeededSpacing = (titleWidth - rawTaglineWidth) / (taglineText.length - 1);
            doc.text(taglineText, startX + logoDisplayWidth + spacing, headerY + 52, {
                width: titleWidth,
                align: 'justify',
                characterSpacing: tagNeededSpacing > 0 ? tagNeededSpacing : 0
            });

            // Horizontal Divider
            doc.moveTo(250, 160).lineTo(590, 160).lineWidth(1).strokeColor('#e5e7eb').stroke();
            doc.save().translate(canvasWidth / 2, 160).rotate(45).rect(-4, -4, 8, 8).fill(primaryTeal).restore();

            // 5. MAIN TITLES
            doc.fillColor(primaryTeal).font('Times-Bold').fontSize(44).text('CERTIFICATE OF PATRONAGE', 0, 195, { align: 'center', characterSpacing: 1.5 });
            doc.fillColor(textColor).font('Times-Roman').fontSize(16).text('This certificate is proudly presented to', 0, 265, { align: 'center' });

            // 6. DYNAMIC NAME FITTING
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

            // 7. RECOGNITION TEXT
            doc.fillColor(textColor).font('Times-Roman').fontSize(16).text('in recognition of their invaluable contribution to the vision of VVV', 0, 395, { align: 'center' });

            // 8. SEAL
            try {
                if (fs.existsSync(sealPath)) {
                    doc.image(sealPath, (canvasWidth - 90) / 2, 465, { width: 90 });
                } else {
                    doc.save().circle(canvasWidth / 2, 510, 35).fill('#D4AF37').restore();
                }
            } catch (err) {
                doc.save().circle(canvasWidth / 2, 510, 35).fill('#D4AF37').restore();
            }

            // 9. SIGNATURE
            const sigX = canvasWidth - 240;
            const sigY = 460;
            try {
                if (fs.existsSync(sigPath)) {
                    doc.image(sigPath, sigX, sigY, { width: 140 });
                }
            } catch (err) {
                console.error('[Certificate] Sig fail:', err.message);
            }

            doc.moveTo(sigX - 10, sigY + 50).lineTo(sigX + 170, sigY + 50).lineWidth(1.2).strokeColor(primaryTeal).stroke();
            doc.fillColor(primaryTeal).font('Times-Bold').fontSize(16).text('PRESIDENT', sigX - 10, sigY + 58, { width: 180, align: 'center' });

            doc.end();
            stream.on('finish', () => {
                const memAfter = process.memoryUsage().heapUsed / 1024 / 1024;
                console.log(`[Certificate] Stable Generation Done. Heap: ${memAfter.toFixed(2)}MB`);
                resolve(filePath);
            });
            stream.on('error', reject);
        } catch (err) {
            console.error('[Certificate] Final Layout Error:', err);
            reject(err);
        }
    });
}

module.exports = { generateCertificate };
