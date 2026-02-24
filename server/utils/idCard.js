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

            const doc = new PDFDocument({
                size: [242, 380],
                margin: 0
            });

            const fileName = `ID_${volunteer._id || Date.now()}_${Date.now()}.pdf`;
            const outputDir = path.join(__dirname, '../certificates');
            const filePath = path.join(outputDir, fileName);

            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            // 1. Background
            doc.rect(0, 0, 242, 380).fill('#FFFFFF');

            // 2. Header
            doc.rect(0, 0, 242, 95).fill('#FDFBEB');
            doc.fillColor('#111827').roundedRect(101, 12, 40, 6, 3).fill();

            // 3. Logo
            const logoPath = path.join(__dirname, 'logo_small.png');
            let logoAdded = false;
            if (fs.existsSync(logoPath)) {
                doc.image(logoPath, 12, 28, { width: 54 });
                logoAdded = true;
            } else {
                // Fallback to original if file doesn't exist (though we just created it)
                const origLogoPath = path.join(__dirname, '../../client/src/assets/logo.png');
                if (fs.existsSync(origLogoPath) && fs.statSync(origLogoPath).size < 1000000) {
                    doc.image(origLogoPath, 12, 28, { width: 54 });
                    logoAdded = true;
                }
            }

            if (!logoAdded) {
                doc.fillColor('#006D63').rect(12, 28, 54, 54).fill('#F3F4F6');
            }

            doc.fillColor('#006D63')
                .font('Helvetica-Bold')
                .fontSize(12)
                .text('VISWA VIGNANA', 72, 35, { width: 160 })
                .text('VAARADHI', 72, 49, { width: 160 });

            doc.font('Helvetica-Oblique')
                .fontSize(8.5)
                .fillColor('#006D63')
                .text('foundation for a better tomorrow', 72, 65, { width: 160 });

            // 4. Divider
            doc.rect(0, 95, 242, 4).fill('#00867D');

            // 5. Title
            doc.fillColor('#006D63').font('Helvetica-Bold').fontSize(11).text('DIGITAL IDENTITY CARD', 0, 110, { align: 'center' });

            // 6. Photo
            const photoSize = 78;
            const photoX = 82;
            const photoY = 135;

            doc.save().roundedRect(photoX - 4, photoY - 4, photoSize + 8, photoSize + 8, 16).lineWidth(3).stroke('#00867D');

            try {
                const photoUrl = volunteer.profilePhoto || volunteer.picture || "https://res.cloudinary.com/dp9qhgckr/image/upload/v1710150000/default_avatar.png";
                const response = await axios.get(photoUrl, {
                    responseType: 'arraybuffer',
                    timeout: 5000
                });
                doc.roundedRect(photoX, photoY, photoSize, photoSize, 12).clip();
                doc.image(response.data, photoX, photoY, { width: photoSize, height: photoSize, fit: [photoSize, photoSize] });
            } catch (e) {
                doc.roundedRect(photoX, photoY, photoSize, photoSize, 12).fill('#F3F4F6');
                doc.fillColor('#9CA3AF').fontSize(10).font('Helvetica-Bold').text('PHOTO', photoX, photoY + 34, { align: 'center', width: photoSize });
            }
            doc.restore();

            // 7. Blood Group
            const dropX = 188;
            const dropY = 140;
            doc.save();
            doc.fillColor('#EF4444');
            doc.moveTo(dropX, dropY)
                .bezierCurveTo(dropX - 5, dropY + 7, dropX - 5, dropY + 11, dropX, dropY + 11)
                .bezierCurveTo(dropX + 5, dropY + 11, dropX + 5, dropY + 7, dropX, dropY)
                .fill();
            doc.restore();
            doc.fillColor('#006D63').font('Helvetica-Bold').fontSize(12).text(': ' + (volunteer.bloodGroup || 'B+'), dropX + 8, dropY + 1);

            // 8. Contact
            doc.fillColor('#00867D').font('Helvetica-Bold').fontSize(9).text('EMERGENCY PHONE NO.:', 20, 225);
            doc.fillColor('#1F2937').font('Helvetica-Bold').fontSize(11).text(volunteer.phone || '+91 9515574466', 20, 238);

            // 9. Name
            doc.rect(20, 258, 202, 1.5).fill('#00867D');
            const vName = (volunteer.fullName || 'Volunteer Name').toUpperCase();
            doc.fillColor('#004D40').font('Helvetica-Bold').fontSize(16).text(vName, 20, 268, { width: 202 });

            doc.fillColor('#006D63').font('Helvetica').fontSize(11).text('VOLUNTEER', 20, 288);

            // 10. Signature (Safeguard)
            const sigPath = path.join(__dirname, '../../client/src/assets/signature.png');
            let sigAdded = false;
            try {
                if (fs.existsSync(sigPath)) {
                    const stats = fs.statSync(sigPath);
                    if (stats.size < 1000000) {
                        doc.image(sigPath, 20, 298, { width: 80 });
                        sigAdded = true;
                    }
                }
            } catch (err) { }

            if (!sigAdded) {
                doc.moveTo(20, 320).lineTo(100, 320).lineWidth(1).stroke('#00867D');
            }
            doc.fillColor('#004D40').font('Helvetica-Bold').fontSize(10).text('PRESIDENT', 20, 325);

            doc.fillColor('#006D63').font('Helvetica-Bold').fontSize(7).text('VISWAVIGNANAVAARADHI.ORG', 100, 325, { width: 122, align: 'right' });

            // 11. Banner
            doc.rect(15, 350, 212, 14).fill('#00867D');
            doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(6).text('BRIDGING THE GAP THROUGH EDUCATION AND EMPOWERMENT', 15, 355, { align: 'center', width: 212 });

            // 12. Address
            doc.fillColor('#00867D').font('Helvetica-Bold').fontSize(7.5).text('REGISTERED OFFICE: VISAKHAPATNAM, ANDHRA PRADESH', 0, 368, { align: 'center' });

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
