import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateHeroDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'O nome civil é obrigatório' })
  civilName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'O nome de herói é obrigatório' })
  heroName: string;

  @ApiProperty()
  @IsNumber()
  @Min(1, { message: 'A idade deve ser um número positivo' })
  age: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  team?: string;
}

export class UpdateHeroDto extends PartialType(CreateHeroDto) {}
