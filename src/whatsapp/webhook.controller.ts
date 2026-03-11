import { Controller, Get, Post, Query, Body, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('webhook')
export class WhatsAppWebhookController {
  
  // ✅ Verificación inicial (Meta te la pide al configurar el webhook)
  @Get()
  verifyToken(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
    @Res() res: Response
  ) {
    const VERIFY_TOKEN = 'token_poly'; // <-- usalo igual en Meta

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ Webhook verificado correctamente');
      res.status(200).send(challenge);
    } else {
      res.status(403).send('Token inválido');
    }
  }

  // ✅ Recepción de eventos (mensajes y estados)
  @Post()
  receiveUpdates(@Body() body, @Res() res: Response) {
    console.log('📩 Evento recibido desde Meta:', JSON.stringify(body, null, 2));
    res.sendStatus(200); 

    if (body.object) {
      body.entry.forEach((entry) => {
        const changes = entry.changes || [];
        changes.forEach((change) => {
          const value = change.value;
          const statuses = value.statuses;
          const messages = value.messages;

          if (statuses) {
            statuses.forEach((status) => {
              console.log(`📊 Estado del mensaje:
                ID: ${status.id}
                Estado: ${status.status}
                Teléfono: ${status.recipient_id}
                Timestamp: ${status.timestamp}`);
            });
          }

          if (messages) {
            messages.forEach((msg) => {
              console.log(`💬 Nuevo mensaje entrante de ${msg.from}: ${msg.text?.body}`);
            });
          }
        });
      });
    }

    return { success: true };
  }
}
