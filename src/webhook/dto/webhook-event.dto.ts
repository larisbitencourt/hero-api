import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateHeroDto } from 'src/hero/dto/hero.dto';

export class WebhookDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'O eventId não pode estar vazio' })
  eventId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'O tipo do evento é obrigatório' })
  eventType: string;

  @ApiProperty({ type: CreateHeroDto })
  @ValidateNested()
  @Type(() => CreateHeroDto)
  @IsNotEmpty()
  payload: CreateHeroDto;
}

// export class WebhookDto {
//   eventId: string;
//   eventType: string;
//   payload: object;
// }
