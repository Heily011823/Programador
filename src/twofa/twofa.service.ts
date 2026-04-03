import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class TwoFaService {
  private client: Twilio;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    this.client = new Twilio(accountSid, authToken);
  }

  //  Generar código
  generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  //  Enviar código
  async sendCode(phone: string, code: string): Promise<void> {
    try {
      await this.client.messages.create({
        body: `Tu código de verificación es: ${code}`,
        from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
        to: `whatsapp:${phone}`,
      });
    } catch (error: any) {
      console.error('Error de Twilio:', error.message);
      throw new InternalServerErrorException(
        'Error al enviar el mensaje de WhatsApp.',
      );
    }
  }

  //  Validar código
  async validateCode(
    storedCode: string,
    inputCode: string,
  ): Promise<boolean> {
    return storedCode === inputCode;
  }

  
  async sendVerificationCode(phone: string): Promise<string> {
    const code = this.generateCode();
    await this.sendCode(phone, code);
    return code;
  }
}