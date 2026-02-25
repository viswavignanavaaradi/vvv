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

            // ── Card dimensions ───────────────────────────────────────
            const CW = 252;   // slightly wider for better proportions
            const CH = 390;

            const doc = new PDFDocument({ size: [CW, CH], margin: 0 });

            const fileName = `ID_${volunteer._id || Date.now()}_${Date.now()}.pdf`;
            const outputDir = path.join(__dirname, '../certificates');
            const filePath = path.join(outputDir, fileName);
            if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            // ── PALETTE ───────────────────────────────────────────────
            const teal = '#006D63';
            const tealMid = '#00867D';
            const tealDark = '#004D40';
            const tealLight = '#E0F2F1';
            const cream = '#F5F9F0';
            const white = '#FFFFFF';
            const charcoal = '#1A1A2E';
            const darkText = '#1F2937';

            // ── FONTS (built-in PDFKit — no Times) ───────────────────
            // Helvetica family: 'Helvetica', 'Helvetica-Bold',
            //                   'Helvetica-Oblique', 'Helvetica-BoldOblique'
            // Courier family:   'Courier', 'Courier-Bold'

            // ── ASSET PATHS ───────────────────────────────────────────
            const logoPath = path.join(__dirname, 'logo_small.png');
            const origLogo = path.join(__dirname, '../../client/src/assets/logo.png');
            const sigPath = path.join(__dirname, '../../client/src/assets/signature.png');
            const bestLogo = fs.existsSync(logoPath) ? logoPath
                : fs.existsSync(origLogo) ? origLogo : null;

            // ── HEADER HEIGHT ─────────────────────────────────────────
            const HDR = 108;   // cream header zone

            // ════════════════════════════════════════════════════════
            // 1. CREAM HEADER BACKGROUND
            // ════════════════════════════════════════════════════════
            doc.rect(0, 0, CW, HDR).fill(cream);

            // Lanyard notch
            doc.fillColor(charcoal).roundedRect(CW / 2 - 22, 9, 44, 8, 4).fill();

            // ── Logo ─────────────────────────────────────────────────
            const logoW = 70;
            const logoX = 10;
            const logoY = 20;
            if (bestLogo) {
                try { doc.image(bestLogo, logoX, logoY, { width: logoW }); } catch (e) { }
            } else {
                doc.roundedRect(logoX, logoY, logoW, logoW, 6).fill('#E5E7EB');
            }

            // ── Org name: auto-shrink to guarantee single line ────────
            const orgName = 'VISWA VIGNANA VAARADHI';
            const txtX = logoX + logoW + 10;   // text starts after logo
            const txtMaxW = CW - txtX - 8;        // max available width

            let orgSize = 13.5;
            doc.font('Helvetica-Bold').fontSize(orgSize);
            while (doc.widthOfString(orgName) > txtMaxW && orgSize > 8) {
                orgSize -= 0.25;
                doc.fontSize(orgSize);
            }

            doc.fillColor(teal)
                .font('Helvetica-Bold')
                .fontSize(orgSize)
                .text(orgName, txtX, 36, { width: txtMaxW, lineBreak: false });

            // Tagline
            doc.fillColor(teal)
                .font('Helvetica-Oblique')
                .fontSize(8)
                .text('foundation for a better tomorrow', txtX, 36 + orgSize + 5, {
                    width: txtMaxW,
                    lineBreak: false
                });

            // ── Small label under logo ────────────────────────────────
            doc.fillColor(teal)
                .font('Helvetica')
                .fontSize(5.5)
                .text('VISWA VIGNANA\n— VAARADHI —', logoX, logoY + logoW + 2, {
                    width: logoW,
                    align: 'center'
                });

            // ════════════════════════════════════════════════════════
            // 2. TEAL ACCENT BAR (thick)
            // ════════════════════════════════════════════════════════
            doc.rect(0, HDR, CW, 6).fill(tealMid);

            // ════════════════════════════════════════════════════════
            // 3. WHITE BODY
            // ════════════════════════════════════════════════════════
            doc.rect(0, HDR + 6, CW, CH - HDR - 6).fill(white);

            // ════════════════════════════════════════════════════════
            // 4. "DIGITAL IDENTITY CARD" — spaced title
            // ════════════════════════════════════════════════════════
            doc.fillColor(tealMid)
                .font('Helvetica-Bold')
                .fontSize(10)
                .text('DIGITAL IDENTITY CARD', 0, HDR + 13, {
                    align: 'center',
                    width: CW,
                    characterSpacing: 0.8,
                    lineBreak: false
                });

            // ════════════════════════════════════════════════════════
            // 5. PHOTO — left-aligned like Image 2
            // ════════════════════════════════════════════════════════
            const photoSize = 82;
            const photoX = 18;
            const photoY = HDR + 30;
            const radius = 13;

            // Teal rounded border
            doc.save()
                .roundedRect(photoX - 3, photoY - 3, photoSize + 6, photoSize + 6, radius + 2)
                .lineWidth(3).strokeColor(tealMid).stroke();

            try {
                const photoUrl = volunteer.profilePhoto || volunteer.picture
                    || 'https://res.cloudinary.com/dp9qhgckr/image/upload/v1710150000/default_avatar.png';
                const resp = await axios.get(photoUrl, { responseType: 'arraybuffer', timeout: 6000 });
                doc.save()
                    .roundedRect(photoX, photoY, photoSize, photoSize, radius).clip()
                    .image(resp.data, photoX, photoY, {
                        width: photoSize, height: photoSize, fit: [photoSize, photoSize]
                    })
                    .restore();
            } catch (e) {
                doc.save()
                    .roundedRect(photoX, photoY, photoSize, photoSize, radius)
                    .fill(tealLight).restore();
                doc.fillColor(tealMid).font('Helvetica-Bold').fontSize(8)
                    .text('PHOTO', photoX, photoY + 36, {
                        width: photoSize, align: 'center', lineBreak: false
                    });
            }
            doc.restore();

            // ════════════════════════════════════════════════════════
            // 6. BLOOD GROUP — right side
            // ════════════════════════════════════════════════════════
            const dropX = CW - 52;
            const dropY = HDR + 36;

            doc.save().fillColor('#EF4444')
                .moveTo(dropX + 6, dropY)
                .bezierCurveTo(dropX, dropY + 9, dropX, dropY + 15, dropX + 6, dropY + 15)
                .bezierCurveTo(dropX + 12, dropY + 15, dropX + 12, dropY + 9, dropX + 6, dropY)
                .fill().restore();

            const bg = volunteer.bloodGroup || 'B+';
            doc.fillColor(tealDark).font('Helvetica-Bold').fontSize(11)
                .text(': ' + bg, dropX + 16, dropY + 2, { lineBreak: false });

            // ID number (if available) — small, under blood group
            if (volunteer.volunteerId || volunteer.idNumber) {
                doc.fillColor('#9CA3AF').font('Helvetica').fontSize(7)
                    .text('ID: ' + (volunteer.volunteerId || volunteer.idNumber),
                        dropX - 10, dropY + 55, { width: 60, align: 'center', lineBreak: false });
            }

            // ════════════════════════════════════════════════════════
            // 7. EMERGENCY PHONE — below photo
            // ════════════════════════════════════════════════════════
            const phoneY = HDR + 124;
            doc.fillColor(tealMid).font('Helvetica-Bold').fontSize(8)
                .text('EMERGENCY PHONE NO.:', 18, phoneY, { lineBreak: false });
            doc.fillColor(darkText).font('Helvetica-Bold').fontSize(11.5)
                .text(volunteer.phone || '+91 9515574466', 18, phoneY + 13, { lineBreak: false });

            // ════════════════════════════════════════════════════════
            // 8. TEAL DIVIDER RULE
            // ════════════════════════════════════════════════════════
            const ruleY = phoneY + 36;
            doc.rect(18, ruleY, CW - 36, 2).fill(tealMid);

            // ════════════════════════════════════════════════════════
            // 9. NAME + ROLE
            // ════════════════════════════════════════════════════════
            const nameY = ruleY + 8;
            const vName = (volunteer.fullName || 'Volunteer Name').toUpperCase();

            let nameFontSize = 16;
            doc.font('Helvetica-Bold').fontSize(nameFontSize);
            while (doc.widthOfString(vName) > CW - 36 && nameFontSize > 9) {
                nameFontSize -= 0.5;
                doc.fontSize(nameFontSize);
            }

            doc.fillColor(tealDark).font('Helvetica-Bold').fontSize(nameFontSize)
                .text(vName, 18, nameY, { width: CW - 36, lineBreak: false });

            const role = (volunteer.role || volunteer.designation || 'VOLUNTEER').toUpperCase();
            doc.fillColor(teal).font('Helvetica').fontSize(10)
                .text(role, 18, nameY + nameFontSize + 3, { width: CW - 36, lineBreak: false });

            // ════════════════════════════════════════════════════════
            // 10. SIGNATURE + PRESIDENT  |  WEBSITE
            // ════════════════════════════════════════════════════════
            const sigY = nameY + nameFontSize + 28;
            const sigLineY = sigY + 28;

            let sigAdded = false;
            try {
                if (fs.existsSync(sigPath) && fs.statSync(sigPath).size < 1000000) {
                    doc.image(sigPath, 18, sigY, { width: 82 });
                    sigAdded = true;
                }
            } catch (e) { }

            if (!sigAdded) {
                doc.moveTo(18, sigLineY).lineTo(100, sigLineY)
                    .lineWidth(1).strokeColor(tealMid).stroke();
            }

            // Underline below signature
            doc.moveTo(18, sigLineY + 2).lineTo(100, sigLineY + 2)
                .lineWidth(1.2).strokeColor(tealMid).stroke();

            doc.fillColor(tealDark).font('Helvetica-Bold').fontSize(9)
                .text('PRESIDENT', 18, sigLineY + 6, { lineBreak: false });

            // Website right-side
            doc.fillColor(teal).font('Helvetica-Bold').fontSize(7)
                .text('VISWAVIGNANAVAARADHI.ORG', 108, sigLineY + 6, {
                    width: CW - 120, align: 'right', lineBreak: false
                });

            // ════════════════════════════════════════════════════════
            // 11. BOTTOM TEAL BANNER
            // ════════════════════════════════════════════════════════
            doc.rect(14, CH - 42, CW - 28, 16).fill(tealMid);
            doc.fillColor(white).font('Helvetica-Bold').fontSize(5.8)
                .text('BRIDGING THE GAP THROUGH EDUCATION AND EMPOWERMENT',
                    14, CH - 37, { align: 'center', width: CW - 28, lineBreak: false });

            // ════════════════════════════════════════════════════════
            // 12. REGISTERED OFFICE
            // ════════════════════════════════════════════════════════
            doc.fillColor(tealMid).font('Helvetica-Bold').fontSize(7)
                .text('REGISTERED OFFICE: VISAKHAPATNAM, ANDHRA PRADESH',
                    0, CH - 20, { align: 'center', width: CW, lineBreak: false });

            // ── DONE ─────────────────────────────────────────────────
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
