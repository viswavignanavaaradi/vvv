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
            const teal = '#006D63';
            const tealMid = '#00867D';
            const tealDark = '#004D40';
            const cream = '#FDFBEB';
            const white = '#FFFFFF';
            const nearBlack = '#111827';
            const darkText = '#1F2937';

            // ── ASSET PATHS ───────────────────────────────────────────────
            const logoPath = path.join(__dirname, 'logo_small.png');
            const origLogo = path.join(__dirname, '../../client/src/assets/logo.png');
            const sigPath = path.join(__dirname, '../../client/src/assets/signature.png');

            const bestLogo = fs.existsSync(logoPath) ? logoPath
                : fs.existsSync(origLogo) ? origLogo
                    : null;

            // Header height — tall enough for logo + text to breathe
            const HEADER_H = 105;

            // ═══════════════════════════════════════════════════════════
            // 1. CREAM HEADER BACKGROUND
            // ═══════════════════════════════════════════════════════════
            doc.rect(0, 0, CW, HEADER_H).fill(cream);

            // Lanyard notch (dark pill at top centre)
            doc.fillColor(nearBlack).roundedRect(CW / 2 - 20, 10, 40, 7, 3.5).fill();

            // ── Logo (left) — large to match Image 2 ─────────────────
            if (bestLogo) {
                try { doc.image(bestLogo, 8, 18, { width: 68 }); } catch (e) { }
            } else {
                doc.rect(8, 18, 68, 68).fill('#E5E7EB');
            }

            // ── Org name + tagline (right of logo) ───────────────────
            // "VISWA VIGNANA VAARADHI" on ONE line — font sized to fit
            doc.fillColor(teal)
                .font('Helvetica-Bold')
                .fontSize(14)
                .text('VISWA VIGNANA VAARADHI', 74, 36, { width: 162, lineBreak: false });

            // Tagline in italic directly below org name
            doc.fillColor(teal)
                .font('Helvetica-Oblique')
                .fontSize(8.5)
                .text('foundation for a better tomorrow', 74, 58, { width: 162, lineBreak: false });
            // ── NO sub-caption under logo ─────────────────────────────

            // ═══════════════════════════════════════════════════════════
            // 2. THICK TEAL DIVIDER BAR
            // ═══════════════════════════════════════════════════════════
            doc.rect(0, HEADER_H, CW, 5).fill(tealMid);

            // ═══════════════════════════════════════════════════════════
            // 3. WHITE BODY BACKGROUND
            // ═══════════════════════════════════════════════════════════
            doc.rect(0, HEADER_H + 5, CW, CH - HEADER_H - 5).fill(white);

            // ═══════════════════════════════════════════════════════════
            // 4. "DIGITAL IDENTITY CARD" TITLE
            // ═══════════════════════════════════════════════════════════
            doc.fillColor(tealMid)
                .font('Helvetica-Bold')
                .fontSize(10.5)
                .text('DIGITAL IDENTITY CARD', 0, HEADER_H + 12, { align: 'center', width: CW, lineBreak: false });

            // ═══════════════════════════════════════════════════════════
            // 5. PHOTO (centred, rounded with teal border)
            // ═══════════════════════════════════════════════════════════
            const photoSize = 80;
            const photoX = (CW - photoSize) / 2;        // centred
            const photoY = HEADER_H + 28;                // below title
            const radius = 14;

            // Teal rounded border
            doc.save()
                .roundedRect(photoX - 4, photoY - 4, photoSize + 8, photoSize + 8, radius + 2)
                .lineWidth(3).strokeColor(tealMid).stroke();

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
                    .text('PHOTO', photoX, photoY + 35, { width: photoSize, align: 'center', lineBreak: false });
            }
            doc.restore();

            // ═══════════════════════════════════════════════════════════
            // 6. BLOOD GROUP (top-right area, beside photo)
            // ═══════════════════════════════════════════════════════════
            const dropX = 196;
            const dropY = HEADER_H + 35;

            // Blood drop icon
            doc.save().fillColor('#EF4444')
                .moveTo(dropX, dropY)
                .bezierCurveTo(dropX - 6, dropY + 8, dropX - 6, dropY + 14, dropX, dropY + 14)
                .bezierCurveTo(dropX + 6, dropY + 14, dropX + 6, dropY + 8, dropX, dropY)
                .fill().restore();

            doc.fillColor(teal).font('Helvetica-Bold').fontSize(11)
                .text(': ' + (volunteer.bloodGroup || 'B+'), dropX + 9, dropY + 2, { lineBreak: false });

            // ═══════════════════════════════════════════════════════════
            // 7. EMERGENCY PHONE
            // ═══════════════════════════════════════════════════════════
            doc.fillColor(tealMid).font('Helvetica-Bold').fontSize(8.5)
                .text('EMERGENCY PHONE NO.:', 18, HEADER_H + 121, { lineBreak: false });
            doc.fillColor(darkText).font('Helvetica-Bold').fontSize(11)
                .text(volunteer.phone || '+91 9515574466', 18, HEADER_H + 133, { lineBreak: false });

            // ═══════════════════════════════════════════════════════════
            // 8. TEAL RULE + NAME + ROLE
            // ═══════════════════════════════════════════════════════════
            doc.rect(18, HEADER_H + 152, CW - 36, 1.5).fill(tealMid);

            // Name — auto-shrink if long
            const vName = (volunteer.fullName || 'Volunteer Name').toUpperCase();
            let nameFontSize = 15;
            doc.font('Helvetica-Bold').fontSize(nameFontSize);
            while (doc.widthOfString(vName) > CW - 36 && nameFontSize > 9) {
                nameFontSize -= 0.5;
                doc.fontSize(nameFontSize);
            }
            doc.fillColor(tealDark).font('Helvetica-Bold').fontSize(nameFontSize)
                .text(vName, 18, HEADER_H + 160, { width: CW - 36, lineBreak: false });

            // Role
            const role = (volunteer.role || volunteer.designation || 'VOLUNTEER').toUpperCase();
            doc.fillColor(teal).font('Helvetica').fontSize(10)
                .text(role, 18, HEADER_H + 160 + nameFontSize + 3, { width: CW - 36, lineBreak: false });

            // ═══════════════════════════════════════════════════════════
            // 9. SIGNATURE + PRESIDENT  |  WEBSITE (right)
            // ═══════════════════════════════════════════════════════════
            const sigImgY = HEADER_H + 195;
            const sigLineY = sigImgY + 24;

            // Signature image or fallback line
            let sigAdded = false;
            try {
                if (fs.existsSync(sigPath) && fs.statSync(sigPath).size < 1000000) {
                    doc.image(sigPath, 18, sigImgY, { width: 80 });
                    sigAdded = true;
                }
            } catch (e) { }

            if (!sigAdded) {
                doc.moveTo(18, sigLineY).lineTo(98, sigLineY).lineWidth(1).strokeColor(tealMid).stroke();
            }

            // Underline below signature
            doc.moveTo(18, sigLineY + 2).lineTo(98, sigLineY + 2)
                .lineWidth(1).strokeColor(tealMid).stroke();

            doc.fillColor(tealDark).font('Helvetica-Bold').fontSize(9)
                .text('PRESIDENT', 18, sigLineY + 5, { lineBreak: false });

            // Website — right aligned
            doc.fillColor(teal).font('Helvetica-Bold').fontSize(7)
                .text('VISWAVIGNANAVAARADHI.ORG', 100, sigLineY + 5, {
                    width: CW - 118,
                    align: 'right',
                    lineBreak: false
                });

            doc.rect(14, 348, CW - 28, 15).fill(tealMid);
            doc.fillColor(white).font('Helvetica-Bold').fontSize(5.8)
                .text('BRIDGING THE GAP THROUGH EDUCATION AND EMPOWERMENT', 14, 353, {
                    align: 'center', width: CW - 28, lineBreak: false
                });

            doc.fillColor(tealMid).font('Helvetica-Bold').fontSize(7)
                .text('REGISTERED OFFICE: VISAKHAPATNAM, ANDHRA PRADESH', 0, 367, {
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
