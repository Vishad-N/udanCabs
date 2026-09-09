const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/client/components/modals/BookingModal.tsx');
// Actually, I am modifying backend/src/modules/booking/booking.service.ts
const backendFilePath = path.join(__dirname, 'backend/src/modules/booking/booking.service.ts');
let content = fs.readFileSync(backendFilePath, 'utf8');

// 1. Add imports
content = content.replace(
  /import { WhatsAppService } from '\.\.\/whatsapp\/whatsapp\.service';/,
  `import { WhatsAppService } from '../whatsapp/whatsapp.service';\nimport { UploadService } from '../upload/upload.service';\nimport * as PDFDocument from 'pdfkit';`
);

// 2. Add UploadService to constructor
content = content.replace(
  /private whatsappService: WhatsAppService\s*\) \{\}/,
  `private whatsappService: WhatsAppService,\n    private uploadService: UploadService\n  ) {}`
);

// 3. Add confirmTour method
const confirmTourMethod = `
  async confirmTour(id: string, dto: import('./dto/booking.dto').ConfirmTourBookingDto) {
    const booking = await this.findOne(id);

    if (booking.bookingType !== 'TOUR') {
      throw new BadRequestException('This action is only valid for Tour bookings.');
    }

    if (booking.status !== BookingStatusEnum.PENDING) {
      throw new BadRequestException('Booking is already confirmed or cancelled.');
    }

    const updated = await this.prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: BookingStatusEnum.CONFIRMED,
        pickupDate: dto.reportingDate || booking.pickupDate,
        pickupTime: dto.reportingTime || booking.pickupTime,
        pickupLocation: dto.reportingPlace || booking.pickupLocation,
      },
      include: this.commonIncludes,
    });

    await this.timelineService.addEvent(
      booking.id,
      'Tour Confirmed',
      'Admin confirmed the tour booking and generated receipt.'
    );

    // Generate PDF Receipt in memory
    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];
      doc.on('data', (buffer) => buffers.push(buffer));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // PDF Content
      doc.fontSize(24).font('Helvetica-Bold').text('Udan Cabs', { align: 'center' });
      doc.fontSize(14).font('Helvetica').text('Spiritual Tour Receipt', { align: 'center' });
      doc.moveDown(2);

      doc.fontSize(12).font('Helvetica-Bold').text('Booking Details:');
      doc.font('Helvetica').text(\`Booking Number: \${updated.bookingNumber}\`);
      doc.text(\`Date Issued: \${new Date().toLocaleDateString()}\`);
      doc.moveDown();

      doc.font('Helvetica-Bold').text('Customer Information:');
      doc.font('Helvetica').text(\`Name: \${updated.customerName}\`);
      doc.text(\`Phone: \${updated.customerPhone}\`);
      if (updated.passengerNames && updated.passengerNames.length > 0) {
        doc.text(\`Passengers: \${updated.passengerNames.join(', ')}\`);
      }
      doc.moveDown();

      doc.font('Helvetica-Bold').text('Tour Information:');
      doc.font('Helvetica').text(\`Package: \${updated.dropoffLocation || 'Ujjain Tour'}\`);
      doc.text(\`Vehicle: \${updated.vehicleCategory}\`);
      doc.text(\`Reporting Date: \${updated.pickupDate}\`);
      doc.text(\`Reporting Time: \${updated.pickupTime}\`);
      doc.text(\`Reporting Place: \${updated.pickupLocation}\`);
      doc.moveDown(2);

      doc.fontSize(10).font('Helvetica-Oblique').text('Please present this receipt to your driver at the reporting location.', { align: 'center' });
      doc.text('Thank you for choosing Udan Cabs. Have a blessed journey!', { align: 'center' });

      doc.end();
    });

    // Upload PDF to Cloudinary
    const filename = \`receipt_\${updated.bookingNumber}_\${Date.now()}.pdf\`;
    const uploadResult = await this.uploadService.uploadPdfBuffer(pdfBuffer, filename);

    // Send WhatsApp notification
    await this.whatsappService.notifyCustomerTourConfirmed(updated, uploadResult.url);

    return this.parseBooking(updated);
  }
`;

content = content.replace(
  /async update\(/,
  `${confirmTourMethod}\n\n  async update(`
);

fs.writeFileSync(backendFilePath, content);
console.log('Update complete.');
