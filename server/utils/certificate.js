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
            console.log(`[Certificate] Full Content Scaling for: ${data.donor_name}. Heap: ${memBefore.toFixed(2)}MB`);

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

            // 2. BACKGROUND WATERMARK (Larger 650px & Centered)
            // Priority: Small logo (33KB) > Original logo (3MB) fallback
            const logoSmall = path.join(__dirname, 'logo_small.png');
            const logoOriginal = path.join(__dirname, '../../client/src/assets/logo.png');
            const bestLogo = fs.existsSync(logoSmall) ? logoSmall : logoOriginal;

            try {
                if (fs.existsSync(bestLogo)) {
                    doc.save()
                        .opacity(0.12)
                        .image(bestLogo, (canvasWidth - 650) / 2, (canvasHeight - 650) / 2, { width: 650 })
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
            const headerY = 55;
            const logoWidth = 110; // Aggressive logo
            const logoMargin = 35;

            doc.font('Times-Bold').fontSize(42); // Significant title
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
            doc.fillColor(primaryTeal).font('Times-Bold').fontSize(42).text(brandingText, 0, headerY + 25, { align: 'center', characterSpacing: 1.2 });

            // Centered Tagline: Precisely matched to title width
            doc.fillColor(textColor).font('Times-Roman').fontSize(20); // Bold tagline
            const rawTaglineWidth = doc.widthOfString(taglineText);
            const tagNeededSpacing = (titleWidth - rawTaglineWidth) / (taglineText.length - 1);
            doc.text(taglineText, titleX, headerY + 75, {
                width: titleWidth,
                align: 'justify',
                characterSpacing: tagNeededSpacing > 0 ? tagNeededSpacing : 0
            });

            // Horizontal Divider (Anchored)
            doc.moveTo(220, 165).lineTo(620, 165).lineWidth(1.5).strokeColor('#d1d5db').stroke();
            doc.save().translate(canvasWidth / 2, 165).rotate(45).rect(-5, -5, 10, 10).fill(primaryTeal).restore();

            // 5. MAIN TITLES (Distributed)
            doc.fillColor(primaryTeal).font('Times-Bold').fontSize(58).text('CERTIFICATE OF PATRONAGE', 0, 195, { align: 'center', characterSpacing: 2 });
            doc.fillColor(textColor).font('Times-Roman').fontSize(22).text('This certificate is proudly presented to', 0, 275, { align: 'center' });

            // 6. PATRON NAME (Premium Scaling)
            const rawName = (data.donor_name || 'Valued Patron').toUpperCase();
            const displayName = `[ ${rawName} ]`;

            let nameFontSize = 54;
            doc.font('Times-Bold').fontSize(nameFontSize);
            let nameWidth = doc.widthOfString(displayName);
            while (nameWidth > (canvasWidth - 140) && nameFontSize > 22) {
                nameFontSize -= 1;
                doc.fontSize(nameFontSize);
                nameWidth = doc.widthOfString(displayName);
            }

            doc.fillColor(primaryTeal).text(displayName, 0, 325, { align: 'center' });

            // 7. RECOGNITION TEXT (Distributed)
            doc.fillColor(textColor).font('Times-Roman').fontSize(20).text('in recognition of their invaluable contribution to the vision of VVV', 0, 420, { align: 'center' });

            // 8. SEAL & SIGNATURE ANCHORS (Bottom Fill)
            const lowerAssetsY = 485;

            // SEAL
            const sealPath = path.join(__dirname, '../../client/src/assets/seal.png');
            try {
                if (fs.existsSync(sealPath)) {
                    doc.image(sealPath, (canvasWidth - 110) / 2, lowerAssetsY - 10, { width: 110 });
                } else {
                    doc.save().circle(canvasWidth / 2, lowerAssetsY + 45, 45).fill('#D4AF37').restore();
                }
            } catch (err) {
                doc.save().circle(canvasWidth / 2, lowerAssetsY + 45, 45).fill('#D4AF37').restore();
            }

            // SIGNATURE
            const sigPath = path.join(__dirname, '../../client/src/assets/signature.png');
            const sigX = canvasWidth - 260;
            const sigY = lowerAssetsY - 15;

            try {
                if (fs.existsSync(sigPath)) {
                    doc.image(sigPath, sigX, sigY, { width: 160 });
                }
            } catch (err) {
                console.error('[Certificate] Sig fail:', err.message);
            }

            doc.moveTo(sigX - 10, sigY + 60).lineTo(sigX + 190, sigY + 60).lineWidth(1.5).strokeColor(primaryTeal).stroke();
            doc.fillColor(primaryTeal).font('Times-Bold').fontSize(20).text('PRESIDENT', sigX - 10, sigY + 68, { width: 200, align: 'center' });

            doc.end();
            stream.on('finish', () => resolve(filePath));
            stream.on('error', reject);
        } catch (err) {
            console.error('[Certificate] Full Content Error:', err);
            reject(err);
        }
    });
}

module.exports = { generateCertificate };
