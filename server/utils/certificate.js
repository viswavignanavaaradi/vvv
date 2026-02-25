const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');

/**
 * Generates a Patronage Certificate PDF and pipes it to the provided stream.
 * @param {Object} data - Donation/Patron data from DB.
 * @param {Stream} outputStream - A writeable stream (e.g., Cloudinary upload stream).
 * @param {Function} callback - Callback with (err).
 */
function generateCertificate(data, outputStream, callback) {
    try {
        console.log('[Certificate] Starting generation for:', data.certificate_id);
        const doc = new PDFDocument({
            layout: 'landscape',
            size: 'A4',
            margin: 0
        });

        // Pipe to the provided destination (Cloudinary or Response)
        doc.pipe(outputStream);

        // 1. COLORS & FONTS
        const primaryTeal = '#0d7c74';
        const textColor = '#333333';
        const canvasWidth = 841.89;
        const canvasHeight = 595.28;

        // 2. BACKGROUND & BORDER
        doc.rect(0, 0, canvasWidth, canvasHeight).fill('#fdfdfd');
        doc.lineWidth(8).strokeColor(primaryTeal).rect(40, 40, canvasWidth - 80, canvasHeight - 80).stroke();

        // 3. HEADER
        const logoWidth = 85;
        const brandingText = 'VISWA VIGNANA VAARADHI';
        doc.font('Times-Bold').fontSize(42);
        const brandingWidth = doc.widthOfString(brandingText, { characterSpacing: 1 });
        const headerGap = 25;
        const headerTotalWidth = logoWidth + headerGap + brandingWidth;
        const headerX = (canvasWidth - headerTotalWidth) / 2;
        const headerY = 75;

        // Robust path for Render
        const logoPath = path.join(__dirname, '../../client/src/assets/logo.png');
        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, headerX, headerY, { width: logoWidth });
        }

        doc.fillColor(primaryTeal)
            .font('Times-Bold')
            .fontSize(42)
            .text(brandingText, headerX + logoWidth + headerGap, headerY + 10, { characterSpacing: 1 });

        doc.fontSize(20)
            .font('Times-Roman')
            .text('foundation for a better tomorrow', headerX + logoWidth + headerGap, headerY + 58, { characterSpacing: 3 });

        // 4. BIG TITLE
        doc.font('Times-Bold')
            .fontSize(60)
            .text('CERTIFICATE OF PATRONAGE', 0, 215, { align: 'center', characterSpacing: 1 });

        // 5. PRESENTATION TEXT
        doc.fillColor(textColor)
            .font('Times-Roman')
            .fontSize(22)
            .text('This certificate is proudly presented to', 0, 305, { align: 'center' });

        // 6. RECIPIENT NAME
        const patronName = (data.donor_name || 'Patron Name').toUpperCase();
        doc.fillColor(primaryTeal)
            .font('Times-Bold')
            .fontSize(52)
            .text(patronName, 0, 350, { align: 'center' });

        const nameWidth = doc.widthOfString(patronName);
        const linePadding = 50;
        const lineLength = nameWidth + (linePadding * 2);
        const lineX = (canvasWidth - lineLength) / 2;
        doc.moveTo(lineX, 405).lineTo(lineX + lineLength, 405).lineWidth(3).stroke(primaryTeal);

        // 7. RECOGNITION TEXT
        doc.fillColor(textColor)
            .font('Times-Roman')
            .fontSize(22)
            .text('in recognition of their invaluable contribution to the vision of VVV', 0, 440, { align: 'center' });

        // 8. SEAL
        const sealX = canvasWidth / 2;
        const sealY = 530;
        doc.save()
            .opacity(0.95)
            .circle(sealX, sealY - 15, 55).fill('#D4AF37')
            .circle(sealX, sealY - 15, 55).lineWidth(2).stroke('#B8860B')
            .circle(sealX, sealY - 15, 48).stroke('#FFFFFF')
            .fillColor('#FFFFFF').font('Times-Bold').fontSize(9)
            .text('OFFICIAL', sealX - 35, sealY - 30, { align: 'center', width: 70 })
            .text('SEAL', sealX - 35, sealY - 18, { align: 'center', width: 70 })
            .restore();

        // 9. SIGNATURE AREA
        const sigX = canvasWidth - 280;
        const sigY = 510;
        doc.fillColor(primaryTeal)
            .font('Times-Bold')
            .fontSize(22);

        doc.moveTo(sigX, sigY).lineTo(sigX + 220, sigY).lineWidth(3).stroke(primaryTeal);
        doc.text('PRESIDENT', sigX, sigY + 15, { width: 220, align: 'center' });

        // Watermark
        if (fs.existsSync(logoPath)) {
            doc.save()
                .opacity(0.03)
                .image(logoPath, canvasWidth / 2 - 150, canvasHeight / 2 - 150, { width: 300 })
                .restore();
        }

        doc.end();
        console.log('[Certificate] Doc generation finished, stream flushing...');
        callback(null);

    } catch (err) {
        console.error('[Certificate] Critical Generation Error:', err);
        callback(err);
    }
}

module.exports = { generateCertificate };
