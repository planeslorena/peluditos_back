import { Injectable } from "@nestjs/common";
import axios, { Axios, AxiosResponse } from "axios";
import { WhatsappAPIRequest } from "./dto/whatsappApiRequest.dto";
import { WhatsappAPIResponse } from "./dto/whatsappApiResponse.dto copy";

@Injectable()
export class WhatsappService {

    createClient = () => {
        const client = axios.create({
            baseURL: 'https://graph.facebook.com/v22.0/815777961617813/messages'
        });
        return client;
    }
    public clientAxios = this.createClient();

    async sendMessage(request: WhatsappAPIRequest): Promise<AxiosResponse<WhatsappAPIResponse>> {
        try {
            const response = await this.clientAxios.post('', request, {
                headers: {
                    'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error sending WhatsApp message:', error);
            throw error;
        }
    }
}