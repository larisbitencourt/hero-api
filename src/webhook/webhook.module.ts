import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { ListenerService } from './listener.service';
import { HeroesModule } from '../hero/hero.module';

@Module({
  imports: [HeroesModule],
  controllers: [WebhookController],
  providers: [WebhookService, ListenerService],
})
export class WebhookModule {}
