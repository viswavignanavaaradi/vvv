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
            console.log(`[Certificate] Filling Layout & Scaling for: ${data.donor_name}. Heap: ${memBefore.toFixed(2)}MB`);

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

            // 1. BACKGROUND RECT
            doc.rect(0, 0, canvasWidth, canvasHeight).fill('#ffffff');

            // 2. BACKGROUND WATERMARK (Scale up to 600)
            // Priority: Small logo (33KB) > Original logo (3MB) fallback
            const logoSmall = path.join(__dirname, 'logo_small.png');
            const logoOriginal = path.join(__dirname, '../../client/src/assets/logo.png');
            const bestLogo = fs.existsSync(logoSmall) ? logoSmall : logoOriginal;

            try {
                if (fs.existsSync(bestLogo)) {
                    doc.save()
                        .opacity(0.12) // Slightly higher for the smaller/crisper logo
                        .image(bestLogo, (canvasWidth - 600) / 2, (canvasHeight - 600) / 2, { width: 600 })
                        .restore();
                }
            } catch (e) {
                console.error('[Certificate] Watermark Error:', e.message);
            }

            // 3. BORDER
            doc.lineWidth(8).strokeColor(primaryTeal).rect(35, 35, canvasWidth - 70, canvasHeight - 70).stroke();
            doc.lineWidth(1).strokeColor('#cbd5e1').rect(48, 48, canvasWidth - 96, canvasHeight - 96).stroke();

            // 4. HEADER: CENTERED TITLE & TAGLINE WITH LEFT LOGO
            const brandingText = 'VISWA VIGNANA VAARADHI';
            const taglineText = 'foundation for a better tomorrow';
            const headerY = 60; // Shifted up
            const logoWidth = 90; // Increased
            const logoMargin = 30;

            doc.font('Times-Bold').fontSize(38); // Increased
            const titleWidth = doc.widthOfString(brandingText, { characterSpacing: 1 });
            const titleX = (canvasWidth - titleWidth) / 2;

            // Header Logo (Safety First)
            try {
                if (fs.existsSync(bestLogo)) {
                    doc.image(bestLogo, titleX - logoWidth - logoMargin, headerY, { width: logoWidth });
                }
            } catch (err) {
                console.error('[Certificate] Header Logo Fail:', err.message);
            }

            // Centered Branding Title
            doc.fillColor(primaryTeal).font('Times-Bold').fontSize(38).text(brandingText, 0, headerY + 15, { align: 'center', characterSpacing: 1 });

            // Centered Tagline: Extended precisely to match title width
            doc.fillColor(textColor).font('Times-Roman').fontSize(18); // Increased
            const rawTaglineWidth = doc.widthOfString(taglineText);
            const tagNeededSpacing = (titleWidth - rawTaglineWidth) / (taglineText.length - 1);
            doc.text(taglineText, titleX, headerY + 60, {
                width: titleWidth,
                align: 'justify',
                characterSpacing: tagNeededSpacing > 0 ? tagNeededSpacing : 0
            });

            // Horizontal Divider (Tighter)
            doc.moveTo(250, 155).lineTo(590, 155).lineWidth(1).strokeColor('#e5e7eb').stroke();
            doc.save().translate(canvasWidth / 2, 155).rotate(45).rect(-4, -4, 8, 8).fill(primaryTeal).restore();

            // 5. MAIN TITLES (Bigger & Tighter)
            doc.fillColor(primaryTeal).font('Times-Bold').fontSize(52).text('CERTIFICATE OF PATRONAGE', 0, 185, { align: 'center', characterSpacing: 1.5 });
            doc.fillColor(textColor).font('Times-Roman').fontSize(18).text('This certificate is proudly presented to', 0, 255, { align: 'center' });

            // 6. DYNAMIC NAME FITTING (Bigger)
            const rawName = (data.donor_name || 'Valued Patron').toUpperCase();
            const displayName = `[ ${rawName} ]`;

            let nameFontSize = 46; // Increased
            doc.font('Times-Bold').fontSize(nameFontSize);
            let nameWidth = doc.widthOfString(displayName);
            while (nameWidth > (canvasWidth - 160) && nameFontSize > 18) {
                nameFontSize -= 1;
                doc.fontSize(nameFontSize);
                nameWidth = doc.widthOfString(displayName);
            }

            doc.fillColor(primaryTeal).text(displayName, 0, 295, { align: 'center' });

            // 7. RECOGNITION TEXT (Tighter)
            doc.fillColor(textColor).font('Times-Roman').fontSize(18).text('in recognition of their invaluable contribution to the vision of VVV', 0, 375, { align: 'center' });

            // 8. SEAL (Bigger & Higher)
            const sealPath = path.join(__dirname, '../../client/src/assets/seal.png');
            try {
                if (fs.existsSync(sealPath)) {
                    doc.image(sealPath, (canvasWidth - 100) / 2, 440, { width: 100 });
                } else {
                    doc.save().circle(canvasWidth / 2, 440 + 50, 40).fill('#D4AF37').restore();
                }
            } catch (err) {
                doc.save().circle(canvasWidth / 2, 440 + 50, 40).fill('#D4AF37').restore();
            }

            // 9. SIGNATURE (Higher)
            const sigPath = path.join(__dirname, '../../client/src/assets/signature.png');
            const sigX = canvasWidth - 250;
            const sigY = 435;

            try {
                if (fs.existsSync(sigPath)) {
                    doc.image(sigPath, sigX, sigY, { width: 150 });
                }
            } catch (err) {
                console.error('[Certificate] Sig fail:', err.message);
            }

            doc.moveTo(sigX - 10, sigY + 55).lineTo(sigX + 180, sigY + 55).lineWidth(1.2).strokeColor(primaryTeal).stroke();
            doc.fillColor(primaryTeal).font('Times-Bold').fontSize(18).text('PRESIDENT', sigX - 10, sigY + 63, { width: 190, align: 'center' });

            doc.end();
            stream.on('finish', () => resolve(filePath));
            stream.on('error', reject);
        } catch (err) {
            console.error('[Certificate] Layout Fill Error:', err);
            reject(err);
        }
    });
}

module.exports = { generateCertificate };
