import { Injectable, BadRequestException } from '@nestjs/common';
import { WebhookDto } from './dto/webhook-event.dto';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

@Injectable()
export class WebhookService {
  private snsClient = new SNSClient({
    region: process.env.AWS_REGION,
  });

  async handleEvent(dto: WebhookDto): Promise<void> {
    const { eventId, eventType, payload } = dto;

    if (!eventId || !eventType || !payload) {
      throw new BadRequestException('Payload inválido');
    }

    console.log(`Publicando evento ${eventId} do tipo ${eventType} no SNS`);

    await this.snsClient.send(
      new PublishCommand({
        TopicArn: 'arn:aws:sns:us-east-1:032281017874:hero-api-topic',
        Message: JSON.stringify({
          eventId,
          eventType,
          payload,
        }),
      }),
    );
  }
}
