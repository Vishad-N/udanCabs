import { Controller, Get, Post, Query, Body, Res, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';

@Controller('whatsapp/webhook')
export class WhatsAppController {
  private readonly logger = new Logger(WhatsAppController.name);

  // Meta verification endpoint
  @Get()
  verifyWebhook(@Query() query: any, @Res() res: Response) {
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];

    const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

    if (mode && token) {
      if (mode === 'subscribe' && token === verifyToken) {
        this.logger.log('WhatsApp Webhook Verified Successfully!');
        return res.status(HttpStatus.OK).send(challenge);
      } else {
        this.logger.error('WhatsApp Webhook Verification Failed (Token mismatch)');
        return res.sendStatus(HttpStatus.FORBIDDEN);
      }
    }
    return res.sendStatus(HttpStatus.BAD_REQUEST);
  }

  // Meta event listener (messages, statuses)
  @Post()
  handleIncomingEvents(@Body() body: any, @Res() res: Response) {
    if (body.object) {
      if (
        body.entry &&
        body.entry[0].changes &&
        body.entry[0].changes[0] &&
        body.entry[0].changes[0].value.messages &&
        body.entry[0].changes[0].value.messages[0]
      ) {
        const phoneNumber = body.entry[0].changes[0].value.messages[0].from;
        const msgBody = body.entry[0].changes[0].value.messages[0].text?.body;
        this.logger.log(`Received WhatsApp message from ${phoneNumber}: ${msgBody}`);
      } else if (
        body.entry &&
        body.entry[0].changes &&
        body.entry[0].changes[0] &&
        body.entry[0].changes[0].value.statuses &&
        body.entry[0].changes[0].value.statuses[0]
      ) {
        const status = body.entry[0].changes[0].value.statuses[0].status;
        const recipientId = body.entry[0].changes[0].value.statuses[0].recipient_id;
        this.logger.log(`WhatsApp message to ${recipientId} status: ${status}`);
      }
      
      // Must return 200 OK to Meta
      return res.sendStatus(HttpStatus.OK);
    } else {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }
  }
}
