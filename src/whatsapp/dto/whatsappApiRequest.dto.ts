export interface WhatsappAPIRequest {
    messaging_product: string;
    to: string;
    type: string;
    template: Template;
}

export interface Template {
    name: string;
    language: Language;
    components?: Component[];
}

export interface Language {
    code: string;
}

export interface Component {
    type: string;
    parameters: Parameter[];
}

export interface Parameter {
    type: string;
    text?: string;
    parameter_name?: string;
    image?: Image;
    date_time?: {
        fallback_value: string;
    };
    currency?: {
        fallback_value: string;
        code: string;
        amount_1000: number;
    };
}

export interface Image {
    link: string;
}