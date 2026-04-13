import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class TwilioService {
  private client: Twilio;

  constructor(private readonly configService: ConfigService) {
    const sid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const token = this.configService.get<string>('TWILIO_AUTH_TOKEN');

    console.log('SID cargado:', !!sid);
    console.log('TOKEN cargado:', !!token);

    if (!sid || !token) {
      throw new Error('Twilio credentials no cargadas');
    }

    this.client = new Twilio(sid, token);
  }

  async sendVerificationCode(phone: string, code: string) {
    try {
      const formattedPhone = this.formatToE164(phone);

      await this.client.messages.create({
        body: `Tu código de verificación es: ${code}`,
        from: `whatsapp:${this.configService.get<string>('TWILIO_PHONE_NUMBER')}`,
        to: `whatsapp:${formattedPhone}`,
      });

      return { message: 'Código enviado por WhatsApp' };
    } catch (error) {
      console.error('Error enviando WhatsApp con Twilio:', error);
      throw new InternalServerErrorException(
        'No se pudo enviar el código por WhatsApp',
      );
    }
  }

  private formatToE164(phone: string): string {
    const cleaned = phone.replace(/[^\d+]/g, '');

    if (cleaned.startsWith('+')) return cleaned;
    if (cleaned.startsWith('57')) return `+${cleaned}`;
    return `+57${cleaned}`;
  }
}