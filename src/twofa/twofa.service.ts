import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class TwoFaService {
  private codes = new Map<string, string>();
  private client: Twilio;

  constructor() {
    
    this.client = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  async generateCode(phone: string): Promise<string> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.codes.set(phone, code);

    try {
      await this.client.messages.create({
        body: `Tu código de pago es: ${code}`,
        from: process.env.TWILIO_PHONE_NUMBER, 
        to: `whatsapp:${phone}`, 
      });

      console.log(`Código enviado a ${phone}: ${code}`);
    } catch (error) {
      console.error(' Error enviando WhatsApp:', error.message);
      throw error;
    }

    return code;
  }

  validateCode(phone: string, code: string): boolean {
    const valid = this.codes.get(phone) === code;
    if (valid) this.codes.delete(phone); 
    return valid;
  }
}