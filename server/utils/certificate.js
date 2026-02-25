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
            const textDark = '#2b2b2b';
            const W = 841.89;
            const H = 595.28;
            const midX = W / 2;

            // Asset paths
            const logoSmall = path.join(__dirname, 'logo_small.png');
            const logoOriginal = path.join(__dirname, '../../client/src/assets/logo.png');
            const bestLogo = fs.existsSync(logoSmall) ? logoSmall : logoOriginal;
            const logoExists = fs.existsSync(bestLogo);
            const sealPath = path.join(__dirname, '../../client/src/assets/seal.png');
            const sigPath = path.join(__dirname, '../../client/src/assets/signature.png');

            // ─── HELPER: draw a ♦ diamond shape ──────────────────────────
            const drawDiamond = (cx, cy, hw, hh) => {
                doc.save()
                    .moveTo(cx, cy - hh)
                    .lineTo(cx + hw, cy)
                    .lineTo(cx, cy + hh)
                    .lineTo(cx - hw, cy)
                    .closePath()
                    .fill(primaryTeal)
                    .restore();
            };

            // ─── 1. WHITE BACKGROUND ─────────────────────────────────────
            doc.rect(0, 0, W, H).fill('#ffffff');

            // ─── 2. FAINT WATERMARK ───────────────────────────────────────
            if (logoExists) {
                try {
                    doc.save()
                        .opacity(0.07)
                        .image(bestLogo, (W - 360) / 2, (H - 360) / 2, { width: 360 })
                        .restore();
                } catch (e) {
                    console.error('[Certificate] Watermark error:', e.message);
                }
            }

            // ─── 3. BORDERS ──────────────────────────────────────────────
            doc.lineWidth(7).strokeColor(primaryTeal)
                .rect(30, 30, W - 60, H - 60).stroke();
            doc.lineWidth(1).strokeColor('#b0bec5')
                .rect(43, 43, W - 86, H - 86).stroke();

            // ─── 4. HEADER: LOGO LEFT + TITLE/TAGLINE ────────────────────
            // FIX: increased org name font from 32 → 38, adjusted logo size & spacing
            const headerTop = 55;
            const logoW = 90;
            const logoLeft = 62;
            const textLeft = logoLeft + logoW + 18;
            const textWidth = W - textLeft - 62;

            if (logoExists) {
                try {
                    doc.image(bestLogo, logoLeft, headerTop, { width: logoW });
                } catch (e) {
                    console.error('[Certificate] Logo error:', e.message);
                }
            }

            // Organisation name — bigger font
            doc.fillColor(primaryTeal)
                .font('Times-Bold')
                .fontSize(38)
                .text('VISWA VIGNANA VAARADHI', textLeft, headerTop + 2, {
                    width: textWidth,
                    align: 'left',
                    characterSpacing: 0.5,
                    lineBreak: false
                });

            // Tagline
            doc.fillColor(textDark)
                .font('Times-Roman')
                .fontSize(15)
                .text('foundation  for  a  better  tomorrow', textLeft, headerTop + 50, {
                    width: textWidth,
                    align: 'left',
                    characterSpacing: 2.2,
                    lineBreak: false
                });

            // ─── 5. DIVIDER LINE + DIAMONDS ──────────────────────────────
            const divY = 158;
            const lineL = 62;
            const lineR = W - 62;
            const gapHalf = 13;

            doc.moveTo(lineL, divY).lineTo(midX - gapHalf, divY)
                .lineWidth(1).strokeColor('#a0adb8').stroke();
            doc.moveTo(midX + gapHalf, divY).lineTo(lineR, divY)
                .lineWidth(1).strokeColor('#a0adb8').stroke();

            drawDiamond(midX - 8, divY, 5, 5);
            drawDiamond(midX + 8, divY, 5, 5);

            // ─── 6. CERTIFICATE TITLE ────────────────────────────────────
            // FIX: reduced from 42 → 38 so it never clips the borders,
            //      and constrained width with padding so text stays well inside
            doc.fillColor(primaryTeal)
                .font('Times-Bold')
                .fontSize(38)
                .text('CERTIFICATE OF PATRONAGE', 80, 178, {
                    align: 'center',
                    width: W - 160,   // 80px padding each side — well clear of border
                    characterSpacing: 2,
                    lineBreak: false
                });

            // ─── 7. "PRESENTED TO" LINE ──────────────────────────────────
            doc.fillColor(textDark)
                .font('Times-Roman')
                .fontSize(16)
                .text('This certificate is proudly presented to', 0, 248, {
                    align: 'center',
                    width: W,
                    lineBreak: false
                });

            // ─── 8. PATRON NAME ──────────────────────────────────────────
            const rawName = (data.donor_name || 'Valued Patron').toUpperCase();
            const displayName = `[ ${rawName} ]`;

            let nameFontSize = 40;
            doc.font('Times-Bold').fontSize(nameFontSize);
            let nameWidth = doc.widthOfString(displayName);
            while (nameWidth > W - 200 && nameFontSize > 20) {
                nameFontSize--;
                doc.fontSize(nameFontSize);
                nameWidth = doc.widthOfString(displayName);
            }

            const nameY = 280;
            const nameX = (W - nameWidth) / 2;

            doc.fillColor(primaryTeal)
                .font('Times-Bold')
                .fontSize(nameFontSize)
                .text(displayName, nameX, nameY, { lineBreak: false });

            // Underline
            const underlineY = nameY + nameFontSize + 4;
            doc.moveTo(nameX, underlineY)
                .lineTo(nameX + nameWidth, underlineY)
                .lineWidth(1).strokeColor(primaryTeal).stroke();

            // Small diamond below underline
            drawDiamond(midX, underlineY + 9, 5, 5);

            // ─── 9. RECOGNITION LINE ─────────────────────────────────────
            doc.fillColor(textDark)
                .font('Times-Roman')
                .fontSize(16)
                .text('in recognition of their invaluable contribution to the vision of VVV', 0, 368, {
                    align: 'center',
                    width: W,
                    lineBreak: false
                });

            // ─── 10. SEAL (centred) ───────────────────────────────────────
            const sealSize = 100;
            const sealX = (W - sealSize) / 2;
            const sealY = 440;

            try {
                if (fs.existsSync(sealPath)) {
                    doc.image(sealPath, sealX, sealY, { width: sealSize });
                } else {
                    doc.save()
                        .circle(midX, sealY + sealSize / 2, sealSize / 2 - 4)
                        .fill('#D4AF37')
                        .restore();
                }
            } catch (e) {
                doc.save()
                    .circle(midX, sealY + sealSize / 2, sealSize / 2 - 4)
                    .fill('#D4AF37')
                    .restore();
            }

            // ─── 11. SIGNATURE BLOCK (right side) ────────────────────────
            // FIX: increased sigImgY gap so the signature image, underline,
            //      and PRESIDENT label are clearly separated and don't collide.
            const sigW = 140;
            const sigRight = W - 68;
            const sigX = sigRight - sigW;
            const sigImgY = 438;   // signature image starts here
            const sigLineY = sigImgY + 62;  // underline: 62px below image top (well below sig)
            const labelY = sigLineY + 8;  // PRESIDENT label: 8px below underline

            try {
                if (fs.existsSync(sigPath)) {
                    doc.image(sigPath, sigX, sigImgY, { width: sigW });
                }
            } catch (e) {
                console.error('[Certificate] Signature error:', e.message);
            }

            // Signature underline
            doc.moveTo(sigX, sigLineY)
                .lineTo(sigX + sigW, sigLineY)
                .lineWidth(1.2).strokeColor(primaryTeal).stroke();

            // PRESIDENT label — clearly below underline, not overlapping it
            doc.fillColor(primaryTeal)
                .font('Times-Bold')
                .fontSize(14)
                .text('PRESIDENT', sigX, labelY, {
                    width: sigW,
                    align: 'center',
                    lineBreak: false
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
