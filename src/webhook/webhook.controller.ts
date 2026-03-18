import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookDto } from './dto/webhook-event.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponse, ApiBadRequestResponse } from '@nestjs/swagger';

@ApiTags('Heroes')
@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('evento')
  @ApiResponse({ status: 201, description: 'Criado com sucesso!' })
  @ApiBadRequestResponse({
    description: 'Dados inválidos. Verifique os campos obrigatórios.',
  })
  @HttpCode(200)
  async receiveEvent(@Body() dto: WebhookDto) {
    await this.webhookService.handleEvent(dto);
    return { message: 'Evento recebido', evento: dto };
  }
}
