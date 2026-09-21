import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);
  private readonly token = process.env.WHATSAPP_TOKEN;
  private readonly phoneId = process.env.WHATSAPP_PHONE_ID;
  private readonly businessPhone = process.env.WHATSAPP_BUSINESS_PHONE || '919876543210';

  private readonly newBookingTemplate = process.env.WHATSAPP_TEMPLATE_NEW_BOOKING || 'new_booking_received';
  private readonly driverAssignedTemplate = process.env.WHATSAPP_TEMPLATE_DRIVER_ASSIGNED || 'driver_assigned';
  private readonly bookingCancelledTemplate = process.env.WHATSAPP_TEMPLATE_BOOKING_CANCELLED || 'booking_cancelled';
  private readonly tripStartedTemplate = process.env.WHATSAPP_TEMPLATE_TRIP_STARTED || 'trip_started';
  private readonly tourConfirmedTemplate = process.env.WHATSAPP_TEMPLATE_TOUR_CONFIRMED || 'tour_confirmed';
  
  private readonly apiVersion = 'v21.0';

  private async sendTemplateMessage(
    to: string,
    templateName: string,
    components: any[] = [],
    languageCode: string = 'en'
  ) {
    if (!this.token || !this.phoneId) {
      this.logger.warn(
        `[MOCK WHATSAPP TEMPLATE] To ${to} | Template: ${templateName} | Components: ${JSON.stringify(components)}`
      );
      return;
    }

    try {
      await axios.post(
        `https://graph.facebook.com/${this.apiVersion}/${this.phoneId}/messages`,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'template',
          template: {
            name: templateName,
            language: { code: languageCode },
            components,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      this.logger.log(`WhatsApp template '${templateName}' sent to ${to}`);
    } catch (error: any) {
      this.logger.error(
        `Failed to send WhatsApp template '${templateName}' to ${to}`,
        error.response?.data || error.message
      );
    }
  }

  private async sendMessage(to: string, message: string) {
    if (!this.token || !this.phoneId) {
      this.logger.warn(`[MOCK WHATSAPP TEXT] To ${to}:\n${message}`);
      return;
    }

    try {
      await axios.post(
        `https://graph.facebook.com/${this.apiVersion}/${this.phoneId}/messages`,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { body: message },
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      this.logger.log(`WhatsApp text message sent to ${to}`);
    } catch (error: any) {
      this.logger.error(`Failed to send WhatsApp text message to ${to}`, error.response?.data || error.message);
    }
  }

  async notifyBusinessOwnerNewBooking(booking: any) {
    const components = [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: booking.bookingNumber },
          { type: 'text', text: booking.customerName },
          { type: 'text', text: booking.customerPhone },
          { type: 'text', text: booking.pickupLocation || 'N/A' },
          { type: 'text', text: booking.dropoffLocation || 'N/A' },
          { type: 'text', text: `${booking.pickupDate || 'N/A'} at ${booking.pickupTime || 'N/A'}` },
          { type: 'text', text: booking.vehicleCategory || 'N/A' },
          { type: 'text', text: String(booking.passengers || 'N/A') },
          { type: 'text', text: `₹${booking.estimatedFare || booking.totalFare || 'N/A'}` },
        ],
      },
    ];
    await this.sendTemplateMessage(this.businessPhone, this.newBookingTemplate, components);
  }

  async notifyCustomerDriverAssigned(booking: any) {
    const driver = booking.assignedDriver;
    const vehicle = booking.assignedVehicle;

    if (!driver || !vehicle) return;

    const components = [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: booking.bookingNumber },
          { type: 'text', text: driver.name },
          { type: 'text', text: driver.phone },
          { type: 'text', text: `${vehicle.make} ${vehicle.model}` },
          { type: 'text', text: vehicle.plateNumber },
          { type: 'text', text: booking.pickupLocation || 'N/A' },
          { type: 'text', text: booking.pickupTime || 'N/A' },
        ],
      },
    ];

    await this.sendTemplateMessage(booking.customerPhone, this.driverAssignedTemplate, components);
  }

  async notifyCustomerCancellation(booking: any) {
    const components = [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: booking.bookingNumber },
          { type: 'text', text: this.businessPhone },
        ],
      },
    ];

    await this.sendTemplateMessage(booking.customerPhone, this.bookingCancelledTemplate, components);
  }

  async notifyCustomerTripStarted(booking: any) {
    const components = [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: booking.bookingNumber },
        ],
      },
    ];

    await this.sendTemplateMessage(booking.customerPhone, this.tripStartedTemplate, components);
  }

  async sendDocumentMessage(to: string, documentUrl: string, caption: string) {
    if (!this.token || !this.phoneId) {
      this.logger.warn(`[MOCK WHATSAPP DOCUMENT] To ${to}:\nURL: ${documentUrl}\nCaption: ${caption}`);
      return;
    }

    try {
      await axios.post(
        `https://graph.facebook.com/${this.apiVersion}/${this.phoneId}/messages`,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'document',
          document: {
            link: documentUrl,
            caption: caption,
            filename: 'UdanCabs-Tour-Receipt.pdf'
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      this.logger.log(`WhatsApp document sent to ${to}`);
    } catch (error: any) {
      this.logger.error(`Failed to send WhatsApp document to ${to}`, error.response?.data || error.message);
    }
  }

  async notifyCustomerTourConfirmed(booking: any, receiptUrl: string) {
    const components = [
      {
        type: 'header',
        parameters: [
          {
            type: 'document',
            document: {
              link: receiptUrl,
              filename: 'UdanCabs-Tour-Receipt.pdf',
            }
          }
        ]
      },
      {
        type: 'body',
        parameters: [
          { type: 'text', text: booking.bookingNumber },
          { type: 'text', text: booking.dropoffLocation },
          { type: 'text', text: `${booking.pickupDate} at ${booking.pickupTime}` },
        ],
      },
    ];

    await this.sendTemplateMessage(booking.customerPhone, this.tourConfirmedTemplate, components);
  }
}
