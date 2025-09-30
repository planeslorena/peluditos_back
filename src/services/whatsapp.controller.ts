import { Body, Controller, Post } from "@nestjs/common";
import { WhatsappService } from "./whatsapp.service";
import { WhatsappAPIRequest } from "./dto/whatsappApiRequest.dto";

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) { }

    @Post()
  create(@Body() newMessage: WhatsappAPIRequest) {
    return this.whatsappService.sendMessage(newMessage);
  }
}