import { Controller, Get, Post, Query, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { WhatsappService } from './whatsapp.service';

@Controller('webhook')
export class WhatsAppWebhookController {
  constructor(private readonly whatsappService: WhatsappService) {}
  
  // ✅ Verificación inicial (Meta te la pide al configurar el webhook)
  @Get()
  verifyToken(@Query() query: any, @Res() res: Response) {
    const VERIFY_TOKEN = 'token_poly'; // <-- usalo igual en Meta
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];

    console.log('📋 Query recibida:', { mode, token, challenge });

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ Webhook verificado correctamente');
      res.status(200).send(challenge);
    } else {
      console.warn('❌ Token inválido o modo incorrecto');
      res.status(403).send('Token inválido');
    }
  }

  // ✅ Recepción de eventos (mensajes y estados)
  @Post()
  receiveUpdates(@Body() body: any, @Res() res: Response) {
    // Responde inmediatamente a Meta
    if (body.object === 'whatsapp_business_account') {
      res.status(200).json({ received: true });

      // Procesa el evento de forma asíncrona (sin bloquear a Meta)
      this.processWebhookEvent(body).catch((error) => {
        console.error('❌ Error procesando webhook:', error);
      });
    } else {
      res.status(400).send('Evento no válido');
    }
  }

  private async processWebhookEvent(body: any) {
    if (body.entry && Array.isArray(body.entry)) {
      for (const entry of body.entry) {
        const changes = entry.changes || [];

        for (const change of changes) {
          const value = change.value;
          const statuses = value.statuses;
          const messages = value.messages;

          // Procesa cambios de estado
          if (statuses && Array.isArray(statuses)) {
            statuses.forEach((status) => {
              const time = new Date(status.timestamp * 1000).toLocaleTimeString('es-AR');
              console.log(`📊 [${status.status.toUpperCase()}] → ${status.recipient_id} | ${time} | ${status.id.substring(0, 20)}…`);
            });
          }

          // Procesa mensajes entrantes
          if (messages && Array.isArray(messages)) {
            messages.forEach((msg) => {
              const text = msg.text?.body || '[sin texto]';
              const time = new Date(msg.timestamp * 1000).toLocaleTimeString('es-AR');
              console.log(`💬 [${msg.from}] ${text} | ${time} | ${msg.id.substring(0, 20)}…`);
            });
          }
        }
      }
    }
  }
}