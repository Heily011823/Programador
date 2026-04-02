import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class TwoFaService {
  private codes = new Map<string, string>();
  private client: Twilio;

  constructor() {
    
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      console.error(' Faltan las credenciales de Twilio en el .env');
    }

    this.client = new Twilio(accountSid, authToken);
  }

  async generateCode(phone: string): Promise<string> {
    
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    
    this.codes.set(phone, code);

    try {
      await this.client.messages.create({
        body: `Tu código de seguridad para el sistema de Reservas es: ${code}`,
        from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`, 
        to: `whatsapp:${phone}`, 
      });

      console.log(` WhatsApp enviado a ${phone}: ${code}`);
      return code;
    } catch (error) {
      console.error(' Error de Twilio:', error.message);
     
      throw new InternalServerErrorException('No se pudo enviar el código de verificación.');
    }
  }

  validateCode(phone: string, code: string): boolean {
    const valid = this.codes.get(phone) === code;
    
   
    if (valid) {
      this.codes.delete(phone);
    } 
    return valid;
  }
}