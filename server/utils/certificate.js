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
            console.log(`[Certificate] Generating for: ${data.donor_name}. Heap: ${memBefore.toFixed(2)}MB`);

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

            // ─── CONSTANTS ────────────────────────────────────────────────
            const primaryTeal = '#0d7c74';
            const textColor = '#333333';
            const W = 841.89;   // canvas width  (A4 landscape)
            const H = 595.28;   // canvas height

            const logoSmall = path.join(__dirname, 'logo_small.png');
            const logoOriginal = path.join(__dirname, '../../client/src/assets/logo.png');
            const bestLogo = fs.existsSync(logoSmall) ? logoSmall : logoOriginal;
            const logoExists = fs.existsSync(bestLogo);

            const sealPath = path.join(__dirname, '../../client/src/assets/seal.png');
            const sigPath = path.join(__dirname, '../../client/src/assets/signature.png');

            // ─── 1. WHITE BACKGROUND ─────────────────────────────────────
            doc.rect(0, 0, W, H).fill('#ffffff');

            // ─── 2. WATERMARK (centred, low opacity) ─────────────────────
            if (logoExists) {
                try {
                    doc.save()
                        .opacity(0.10)
                        .image(bestLogo, (W - 560) / 2, (H - 560) / 2, { width: 560 })
                        .restore();
                } catch (e) {
                    console.error('[Certificate] Watermark error:', e.message);
                }
            }

            // ─── 3. OUTER & INNER BORDERS ────────────────────────────────
            doc.lineWidth(8).strokeColor(primaryTeal)
                .rect(35, 35, W - 70, H - 70).stroke();
            doc.lineWidth(1).strokeColor('#cbd5e1')
                .rect(48, 48, W - 96, H - 96).stroke();

            // ─── 4. HEADER ────────────────────────────────────────────────
            //   Left logo  |  Centred title + tagline
            const headerTop = 62;
            const logoWidth = 90;
            const logoLeft = 68;         // just inside the inner border

            // Logo (left side)
            if (logoExists) {
                try {
                    doc.image(bestLogo, logoLeft, headerTop, { width: logoWidth });
                } catch (e) {
                    console.error('[Certificate] Header logo error:', e.message);
                }
            }

            // Organisation name – centred on full width
            doc.fillColor(primaryTeal)
                .font('Times-Bold')
                .fontSize(36)
                .text('VISWA VIGNANA VAARADHI', 0, headerTop + 12, {
                    align: 'center',
                    characterSpacing: 1.2,
                    width: W
                });

            // Tagline – centred, spaced out to visually match title width
            doc.fillColor(textColor)
                .font('Times-Roman')
                .fontSize(17)
                .text('foundation  for  a  better  tomorrow', 0, headerTop + 58, {
                    align: 'center',
                    characterSpacing: 2,
                    width: W
                });

            // ─── 5. DECORATIVE DIVIDER ────────────────────────────────────
            const divY = 163;
            // left line
            doc.moveTo(220, divY).lineTo(W / 2 - 14, divY)
                .lineWidth(1).strokeColor('#c0cad5').stroke();
            // right line
            doc.moveTo(W / 2 + 14, divY).lineTo(W - 220, divY)
                .lineWidth(1).strokeColor('#c0cad5').stroke();

            // two rotated diamonds (♦) at centre
            const drawDiamond = (cx, cy, size) => {
                doc.save()
                    .translate(cx, cy)
                    .rotate(45)
                    .rect(-size / 2, -size / 2, size, size)
                    .fill(primaryTeal)
                    .restore();
            };
            drawDiamond(W / 2 - 7, divY, 7);
            drawDiamond(W / 2 + 7, divY, 7);

            // ─── 6. CERTIFICATE TITLE ────────────────────────────────────
            doc.fillColor(primaryTeal)
                .font('Times-Bold')
                .fontSize(48)
                .text('CERTIFICATE OF PATRONAGE', 0, 188, {
                    align: 'center',
                    characterSpacing: 1.5,
                    width: W
                });

            // ─── 7. PRESENTED-TO LINE ────────────────────────────────────
            doc.fillColor(textColor)
                .font('Times-Roman')
                .fontSize(18)
                .text('This certificate is proudly presented to', 0, 265, {
                    align: 'center',
                    width: W
                });

            // ─── 8. PATRON NAME ──────────────────────────────────────────
            const rawName = (data.donor_name || 'Valued Patron').toUpperCase();
            const displayName = `[ ${rawName} ]`;

            let nameFontSize = 46;
            doc.font('Times-Bold').fontSize(nameFontSize);
            let nameWidth = doc.widthOfString(displayName);
            while (nameWidth > W - 160 && nameFontSize > 22) {
                nameFontSize--;
                doc.fontSize(nameFontSize);
                nameWidth = doc.widthOfString(displayName);
            }

            const nameY = 305;
            doc.fillColor(primaryTeal)
                .text(displayName, 0, nameY, { align: 'center', width: W });

            // Underline below name
            const nameTextX = (W - nameWidth) / 2;
            const underlineY = nameY + nameFontSize + 4;
            doc.moveTo(nameTextX, underlineY)
                .lineTo(nameTextX + nameWidth, underlineY)
                .lineWidth(1.2).strokeColor(primaryTeal).stroke();

            // ─── 9. RECOGNITION LINE ─────────────────────────────────────
            doc.fillColor(textColor)
                .font('Times-Roman')
                .fontSize(18)
                .text('in recognition of their invaluable contribution to the vision of VVV', 0, 400, {
                    align: 'center',
                    width: W
                });

            // ─── 10. SEAL (centred) ───────────────────────────────────────
            const sealSize = 110;
            const sealX = (W - sealSize) / 2;
            const sealY = 460;

            try {
                if (fs.existsSync(sealPath)) {
                    doc.image(sealPath, sealX, sealY, { width: sealSize });
                } else {
                    doc.save().circle(W / 2, sealY + sealSize / 2, sealSize / 2)
                        .fill('#D4AF37').restore();
                }
            } catch (e) {
                doc.save().circle(W / 2, sealY + sealSize / 2, sealSize / 2)
                    .fill('#D4AF37').restore();
            }

            // ─── 11. SIGNATURE (right side) ──────────────────────────────
            const sigWidth = 150;
            const sigX = W - 68 - sigWidth;   // flush against right inner border
            const sigY = 468;
            const lineY = sigY + 68;

            try {
                if (fs.existsSync(sigPath)) {
                    doc.image(sigPath, sigX, sigY, { width: sigWidth });
                }
            } catch (e) {
                console.error('[Certificate] Signature error:', e.message);
            }

            // Signature underline
            doc.moveTo(sigX, lineY).lineTo(sigX + sigWidth, lineY)
                .lineWidth(1.2).strokeColor(primaryTeal).stroke();

            // PRESIDENT label
            doc.fillColor(primaryTeal)
                .font('Times-Bold')
                .fontSize(16)
                .text('PRESIDENT', sigX, lineY + 6, {
                    width: sigWidth,
                    align: 'center'
                });

            // ─── FINALISE ────────────────────────────────────────────────
            doc.end();
            stream.on('finish', () => resolve(filePath));
            stream.on('error', reject);

        } catch (err) {
            console.error('[Certificate] Generation error:', err);
            reject(err);
        }
    });
}

module.exports = { generateCertificate };
