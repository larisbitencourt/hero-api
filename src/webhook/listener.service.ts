import { Injectable, OnModuleInit } from '@nestjs/common';
import { HeroService } from '../hero/hero.service';
import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from '@aws-sdk/client-sqs';
import Redis from 'ioredis';

@Injectable()
export class ListenerService implements OnModuleInit {
  constructor(private readonly heroService: HeroService) {}

  private sqsClient = new SQSClient({
    region: process.env.AWS_REGION,
  });

  private redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
  });

  onModuleInit() {
    console.log('ListenerService iniciado...');
    this.pollQueue();
  }

  async pollQueue() {
    const queueUrl =
      'https://sqs.us-east-1.amazonaws.com/032281017874/hero-api-queue';

    while (true) {
      const command = new ReceiveMessageCommand({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 10,
      });

      const response = await this.sqsClient.send(command);

      if (!response.Messages || response.Messages.length === 0) {
        continue; // nenhuma mensagem para processar
      }

      for (const message of response.Messages) {
        try {
          const snsMessage = JSON.parse(message.Body!).Message;
          const event = JSON.parse(snsMessage);

          const lockKey = `lock:event:${event.eventId}`;

          // Tenta criar lock atômico no Redis
          const lockAcquired = await this.redis.set(
            lockKey,
            'locked',
            'EX',
            60,
            'NX',
          );

          if (!lockAcquired) {
            console.log(
              `Evento ${event.eventId} já está sendo processado. Ignorando.`,
            );
            // Deleta a mensagem da fila pra não ficar pendente
            await this.sqsClient.send(
              new DeleteMessageCommand({
                QueueUrl: queueUrl,
                ReceiptHandle: message.ReceiptHandle!,
              }),
            );
            continue; // pula pro próximo evento
          }

          console.log(`Processando evento ${event.eventId}...`);
          await this.heroService.create(event.payload);
          console.log(`Evento ${event.eventId} processado e gravado no banco.`);

          // Deleta a mensagem da fila SQS **após salvar no banco**
          await this.sqsClient.send(
            new DeleteMessageCommand({
              QueueUrl: queueUrl,
              ReceiptHandle: message.ReceiptHandle!,
            }),
          );
        } catch (err) {
          console.error('Erro ao processar mensagem SQS:', err);
        } finally {
          // Sempre garante que o lock será liberado
          if (message.Body) {
            const snsMessage = JSON.parse(message.Body).Message;
            const event = JSON.parse(snsMessage);
            await this.redis.del(`lock:event:${event.eventId}`);
            console.log(`Lock liberado para evento ${event.eventId}`);
          }
        }
      }
    }
  }
}
