const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

/**
 * Generates a Digital ID Card PDF for a volunteer.
 * @param {Object} volunteer - Volunteer data from DB.
 * @returns {Promise<string>} - Path to the generated PDF.
 */
function generateIDCard(volunteer) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('[ID Generator] Starting for:', volunteer?.fullName);
            if (!volunteer) return reject(new Error('Volunteer data is missing'));

            // Card dimensions (portrait ID card)
            const CW = 242;
            const CH = 380;

            const doc = new PDFDocument({ size: [CW, CH], margin: 0 });

            const fileName = `ID_${volunteer._id || Date.now()}_${Date.now()}.pdf`;
            const outputDir = path.join(__dirname, '../certificates');
            const filePath = path.join(outputDir, fileName);

            if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            // ── COLOURS ──────────────────────────────────────────────────
            const tealMid = '#007A74'; // Adjusted to match the deep teal in the image
            const cream = '#F5F4E6';
            const white = '#FFFFFF';
            const nearBlack = '#111827';
            const redBlood = '#D32F2F';

            // ── ASSET PATHS ───────────────────────────────────────────────
            const logoPath = path.join(__dirname, 'logo_small.png');
            const origLogo = path.join(__dirname, '../../client/src/assets/logo.png');
            const sigPath = path.join(__dirname, '../../client/src/assets/signature.png');

            const bestLogo = fs.existsSync(logoPath) ? logoPath
                : fs.existsSync(origLogo) ? origLogo
                    : null;

            // ═══════════════════════════════════════════════════════════
            // 1. CREAM HEADER BACKGROUND
            // ═══════════════════════════════════════════════════════════
            const HEADER_H = 95;
            doc.rect(0, 0, CW, HEADER_H).fill(cream);

            // Lanyard notch (dark pill at top centre, moved higher up)
            doc.fillColor(nearBlack).roundedRect(CW / 2 - 20, 8, 40, 7, 3.5).fill();

            // ── Logo (left) ──────────────────────────────────────────────
            if (bestLogo) {
                try { doc.image(bestLogo, 12, 18, { width: 60 }); } catch (e) { }
            } else {
                doc.rect(12, 18, 60, 60).fill('#E5E7EB');
            }

            // ── Org name + tagline (right of logo) ───────────────────────
            doc.fillColor(tealMid)
                .font('Helvetica-Bold')
                .fontSize(13.5)
                .text('VISWA VIGNANA VAARADHI', 76, 32, { width: 160, lineBreak: false });

            // Tagline in an elegant serif italic to match image
            doc.fillColor(tealMid)
                .font('Times-Italic')
                .fontSize(11)
                .text('foundation for a better tomorrow', 76, 52, { width: 160, lineBreak: false });

            // ═══════════════════════════════════════════════════════════
            // 2. PARTIAL TEAL DIVIDER BAR (Only goes halfway across)
            // ═══════════════════════════════════════════════════════════
            doc.rect(0, HEADER_H, 125, 6).fill(tealMid);

            // ═══════════════════════════════════════════════════════════
            // 3. WHITE BODY BACKGROUND
            // ═══════════════════════════════════════════════════════════
            doc.rect(0, HEADER_H + 6, CW, CH - HEADER_H - 6).fill(white);

            // ═══════════════════════════════════════════════════════════
            // 4. "DIGITAL IDENTITY CARD" TITLE
            // ═══════════════════════════════════════════════════════════
            doc.fillColor(tealMid)
                .font('Helvetica-Bold')
                .fontSize(10.5)
                .text('DIGITAL IDENTITY CARD', 0, 112, { align: 'center', width: CW, lineBreak: false });

            // ═══════════════════════════════════════════════════════════
            // 5. PHOTO (centred, rounded with thick teal border)
            // ═══════════════════════════════════════════════════════════
            const photoSize = 85;
            const photoX = (CW - photoSize) / 2;
            const photoY = 135;
            const radius = 16;

            // Thick Teal rounded border
            doc.save()
                .roundedRect(photoX - 3, photoY - 3, photoSize + 6, photoSize + 6, radius + 2)
                .lineWidth(3.5).strokeColor(tealMid).stroke();

            // Photo or placeholder
            try {
                const photoUrl = volunteer.profilePhoto || volunteer.picture
                    || 'https://res.cloudinary.com/dp9qhgckr/image/upload/v1710150000/default_avatar.png';
                const response = await axios.get(photoUrl, { responseType: 'arraybuffer', timeout: 6000 });
                doc.save()
                    .roundedRect(photoX, photoY, photoSize, photoSize, radius).clip()
                    .image(response.data, photoX, photoY, { width: photoSize, height: photoSize, fit: [photoSize, photoSize] })
                    .restore();
            } catch (e) {
                doc.save()
                    .roundedRect(photoX, photoY, photoSize, photoSize, radius)
                    .fill('#E5E7EB').restore();
                doc.fillColor('#9CA3AF').font('Helvetica-Bold').fontSize(9)
                    .text('PHOTO', photoX, photoY + 38, { width: photoSize, align: 'center', lineBreak: false });
            }
            doc.restore();

            // ═══════════════════════════════════════════════════════════
            // 6. BLOOD GROUP (top-right area, beside photo)
            // ═══════════════════════════════════════════════════════════
            const dropX = 186;
            const dropY = 126;

            // Curved blood drop icon
            doc.save().fillColor(redBlood)
                .moveTo(dropX, dropY)
                .bezierCurveTo(dropX - 4, dropY + 6, dropX - 5, dropY + 11, dropX, dropY + 11)
                .bezierCurveTo(dropX + 5, dropY + 11, dropX + 4, dropY + 6, dropX, dropY)
                .fill().restore();

            doc.fillColor(tealMid).font('Helvetica-Bold').fontSize(11)
                .text(': ' + (volunteer.bloodGroup || 'B+'), dropX + 8, dropY, { lineBreak: false });

            // ═══════════════════════════════════════════════════════════
            // 7. EMERGENCY PHONE (Teal color applied to number too)
            // ═══════════════════════════════════════════════════════════
            doc.fillColor(tealMid).font('Helvetica-Bold').fontSize(8.5)
                .text('EMERGENCY PHONE NO.:', 20, 226, { lineBreak: false });
            doc.fillColor(tealMid).font('Helvetica-Bold').fontSize(11)
                .text(volunteer.phone || '+91 1234567890', 20, 238, { lineBreak: false });

            // ═══════════════════════════════════════════════════════════
            // 8. THICK TEAL RULE + NAME + ROLE
            // ═══════════════════════════════════════════════════════════
            doc.rect(20, 256, CW - 40, 3).fill(tealMid);

            // Name
            const vName = (volunteer.fullName || 'VANTAKU VINOD').toUpperCase();
            let nameFontSize = 14;
            doc.font('Helvetica-Bold').fontSize(nameFontSize);
            while (doc.widthOfString(vName) > CW - 40 && nameFontSize > 9) {
                nameFontSize -= 0.5;
                doc.fontSize(nameFontSize);
            }
            doc.fillColor(tealMid).font('Helvetica-Bold').fontSize(nameFontSize)
                .text(vName, 20, 266, { width: CW - 40, lineBreak: false });

            // Role
            const role = (volunteer.role || volunteer.designation || 'VOLUNTEER LEAD').toUpperCase();
            doc.fillColor(tealMid).font('Helvetica').fontSize(10.5)
                .text(role, 20, 282, { width: CW - 40, lineBreak: false });

            // ═══════════════════════════════════════════════════════════
            // 9. SIGNATURE + PRESIDENT  |  WEBSITE & DATE (right)
            // ═══════════════════════════════════════════════════════════
            const sigLineY = 328;

            // Signature image
            let sigAdded = false;
            try {
                if (fs.existsSync(sigPath) && fs.statSync(sigPath).size < 1000000) {
                    doc.image(sigPath, 20, sigLineY - 24, { width: 60 });
                    sigAdded = true;
                }
            } catch (e) { }

            // Underline below signature
            doc.moveTo(20, sigLineY).lineTo(90, sigLineY)
                .lineWidth(1.5).strokeColor(tealMid).stroke();

            // "PRESIDENT" text aligned under line
            doc.fillColor(tealMid).font('Helvetica-Bold').fontSize(9)
                .text('PRESIDENT', 20, sigLineY + 4, { width: 70, align: 'center', lineBreak: false });

            // Website (regular font) & Date (bold font) — right aligned
            doc.fillColor(tealMid).font('Helvetica').fontSize(7.5)
                .text('VISWAVIGNANAVAARADHI.ORG', CW - 150, sigLineY - 6, {
                    width: 130, align: 'right', lineBreak: false
                });
            doc.fillColor(tealMid).font('Helvetica-Bold').fontSize(7.5)
                .text('JANUARY, 2026', CW - 150, sigLineY + 4, {
                    width: 130, align: 'right', lineBreak: false
                });

            // ═══════════════════════════════════════════════════════════
            // 10. CHEVRON BANNER
            // ═══════════════════════════════════════════════════════════
            const bx = 20, by = 345, bw = CW - 40, bh = 14;

            // Draw polygon shape to create notched ribbons
            doc.fillColor(tealMid)
                .moveTo(bx, by)
                .lineTo(bx + bw, by)
                .lineTo(bx + bw - 5, by + bh / 2) // Right inward notch
                .lineTo(bx + bw, by + bh)
                .lineTo(bx, by + bh)
                .lineTo(bx + 5, by + bh / 2)      // Left inward notch
                .fill();

            doc.fillColor(white).font('Helvetica-Bold').fontSize(5.8)
                .text('BRIDGING THE GAP THROUGH EDUCATION AND EMPOWERMENT', bx + 5, by + 4.5, {
                    align: 'center', width: bw - 10, lineBreak: false
                });

            // ═══════════════════════════════════════════════════════════
            // 11. REGISTERED OFFICE
            // ═══════════════════════════════════════════════════════════
            doc.fillColor(tealMid).font('Helvetica-Bold').fontSize(7)
                .text('REGISTERED OFFICE: VISAKHAPATNAM, ANDHRA PRADESH', 0, 365, {
                    align: 'center', width: CW, lineBreak: false
                });

            // ── DONE ─────────────────────────────────────────────────────
            doc.end();
            stream.on('finish', () => resolve(filePath));
            stream.on('error', (err) => reject(err));

        } catch (error) {
            console.error('[ID Generator] Final Catch:', error.message);
            reject(error);
        }
    });
}

module.exports = { generateIDCard };
