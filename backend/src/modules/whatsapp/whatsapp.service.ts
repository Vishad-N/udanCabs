import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);
  private readonly token = process.env.WHATSAPP_TOKEN;
  private readonly phoneId = process.env.WHATSAPP_PHONE_ID;
  private readonly businessPhone = process.env.WHATSAPP_BUSINESS_PHONE || '919876543210';

  private async sendMessage(to: string, message: string) {
    if (!this.token || !this.phoneId) {
      this.logger.warn(`[MOCK WHATSAPP] To ${to}:\n${message}`);
      return;
    }

    try {
      await axios.post(
        `https://graph.facebook.com/v17.0/${this.phoneId}/messages`,
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
      this.logger.log(`WhatsApp message sent to ${to}`);
    } catch (error: any) {
      this.logger.error(`Failed to send WhatsApp message to ${to}`, error.response?.data || error.message);
    }
  }

  async notifyBusinessOwnerNewBooking(booking: any) {
    const msg = `🚕 *New Booking Received!*\n
ID: ${booking.bookingNumber}
Name: ${booking.customerName}
Phone: ${booking.customerPhone}
Pickup: ${booking.pickupLocation || 'N/A'}
Dropoff: ${booking.dropoffLocation || 'N/A'}
Date: ${booking.pickupDate || 'N/A'} at ${booking.pickupTime || 'N/A'}
Category: ${booking.vehicleCategory || 'N/A'}
Passengers: ${booking.passengers || 'N/A'}
Fare: ₹${booking.estimatedFare || booking.totalFare || 'N/A'}`;
    
    await this.sendMessage(this.businessPhone, msg);
  }

  async notifyCustomerDriverAssigned(booking: any) {
    const driver = booking.assignedDriver;
    const vehicle = booking.assignedVehicle;

    if (!driver || !vehicle) return;

    const msg = `🚖 *Udan Cabs Booking Confirmed*

Booking ID: ${booking.bookingNumber}

Driver: ${driver.name}
Phone: ${driver.phone}

Vehicle: ${vehicle.make} ${vehicle.model}
Vehicle Number: ${vehicle.plateNumber}

Pickup: ${booking.pickupLocation || 'N/A'}
Pickup Time: ${booking.pickupTime || 'N/A'}

Thank you for choosing Udan Cabs.`;

    await this.sendMessage(booking.customerPhone, msg);
  }

  async notifyCustomerCancellation(booking: any) {
    const msg = `🚫 *Udan Cabs Booking Cancelled*

Booking ID: ${booking.bookingNumber}
We regret to inform you that your booking has been cancelled. 
Please contact our support at ${this.businessPhone} for further assistance.`;

    await this.sendMessage(booking.customerPhone, msg);
  }

  async notifyCustomerTripStarted(booking: any) {
    const msg = `🚕 *Udan Cabs Trip Started*\n\nYour trip for Booking ID: ${booking.bookingNumber} has started. Have a safe journey with the blessings of Mahakal!`;
    await this.sendMessage(booking.customerPhone, msg);
  }
}
