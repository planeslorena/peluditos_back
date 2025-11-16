import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import axios, { Axios, AxiosResponse } from "axios";
import { WhatsappAPIRequest } from "./dto/whatsappApiRequest.dto";
import { Mascota } from "src/client/entities/mascota.entity";
import { Turno } from "src/turnos/entities/turno.entity";
import * as moment from 'moment';


@Injectable()
export class WhatsappService {
    private readonly logger = new Logger(WhatsappService.name);
        
    // Configura el cliente Axios para la API de WhatsApp
    createClient = () => {
        const client = axios.create({
            baseURL: 'https://graph.facebook.com/v23.0/824526260751557/messages'
        });
        return client;
    }
    public clientAxios = this.createClient();

    // Prepara el mensaje de WhatsApp usando la plantilla confirmacion_turno
    async prepareMessage(mascota: Mascota, turno: Turno): Promise<WhatsappAPIRequest> {
        moment.locale('es');

        const message: WhatsappAPIRequest = {
            "messaging_product": "whatsapp",
            "to": `54${mascota.duenio.telefono}`,
            "type": "template",
            "template": {
                "name": "confirmacion_turno",
                "language": { "code": "es_ar" },
                "components": [
                    {
                        "type": "header",
                        "parameters": [
                            {
                                "type": "image",
                                "image": {
                                    "link": "https://i.imgur.com/MzdqmdW.jpeg"
                                }
                            }
                        ]
                    },
                    {
                        "type": "body",
                        "parameters": [
                            { "type": "text", "parameter_name": "mascota", "text": mascota.nombre },
                            { "type": "text", "parameter_name": "turno", "text": `el día ${moment(turno.dia).format('DD')} de ${moment(turno.dia).format('MMMM')} a las ${moment(turno.hora, 'HH:mm:ss').format('HH:mm')} con ${turno.peluquera.nombre}` }
                        ]
                    }
                ]
            }
        };

        return message;
    }

     // Prepara el mensaje de WhatsApp usando la plantilla confirmacion_turno
    async prepareMessageRecordatorio(mascota: Mascota, turno: Turno): Promise<WhatsappAPIRequest> {
        moment.locale('es');

        const message: WhatsappAPIRequest = {
            "messaging_product": "whatsapp",
            "to": `54${mascota.duenio.telefono}`,
            "type": "template",
            "template": {
                "name": "recordatorio_turno",
                "language": { "code": "es_ar" },
                "components": [
                    {
                        "type": "header",
                        "parameters": [
                            {
                                "type": "image",
                                "image": {
                                    "link": "https://i.imgur.com/MzdqmdW.jpeg"
                                }
                            }
                        ]
                    },
                    {
                        "type": "body",
                        "parameters": [
                            { "type": "text", "parameter_name": "mascota", "text": mascota.nombre },
                            { "type": "text", "parameter_name": "turno", "text": `${moment(turno.dia).format('DD')} de ${moment(turno.dia).format('MMMM')} a las ${moment(turno.hora, 'HH:mm:ss').format('HH:mm')} con ${turno.peluquera.nombre}` }
                        ]
                    }
                ]
            }
        };

        return message;
    }

    // Envía el mensaje a través de la API de WhatsApp
    async sendMessage(request: WhatsappAPIRequest): Promise<any> {
        try {
            const response = await this.clientAxios.post('', request, {
                headers: {
                    'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });
           // this.logger.debug('WhatsApp API Response:', response.data);
            return {
                success: true,
                data: response.data
            };

        } catch (error) {
            this.logger.error('Error details:', {
                status: error.response?.status,
                message: error.response?.data?.error?.message,
                type: error.response?.data?.error?.type,
                code: error.response?.data?.error?.code,
            });

            throw new HttpException({
                status: error.response?.status,
                error: error.response?.data?.error?.message || 'Error sending WhatsApp message'
            }, error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
   

    
