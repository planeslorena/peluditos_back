import { Module } from "@nestjs/common";
import { WhatsappService } from "./whatsapp.service";
import { WhatsAppWebhookController } from "./webhook.controller";

@Module({
  controllers: [ WhatsAppWebhookController],
  providers: [WhatsappService],
  exports: [WhatsappService]
})
export class WhatsappModule {}