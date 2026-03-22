import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { HeroService } from './hero.service';
import { CreateHeroDto, UpdateHeroDto } from './dto/hero.dto';
import { Hero } from './hero.entity';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';

@ApiTags('Heroes')
@Controller('heroes')
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Herói criado com sucesso!' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  async create(@Body() data: CreateHeroDto): Promise<Hero> {
    return this.heroService.create(data);
  }

  @Post(':id/upload')
  @ApiOperation({ summary: 'Fazer upload da foto do herói' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/images-heroes',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileName = `${req.params.id}-${uniqueSuffix}-${file.originalname}`;
          callback(null, fileName);
        },
      }),
    }),
  )
  @ApiResponse({
    status: 201,
    description: 'Foto enviada e salva com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Arquivo inválido ou campo incorreto.',
  })
  @ApiResponse({
    status: 404,
    description: 'Herói não encontrado.',
  })
  async uploadFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo foi enviado.');
    }

    try {
      const updatedHero = await this.heroService.uploadFilePath(
        Number(id),
        file.path,
      );

      return {
        message: `Foto do herói ${id} enviada com sucesso!`,
        hero: updatedHero,
      };
    } catch (error) {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      throw error;
    }
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Lista de heróis.' })
  async findAll(): Promise<Hero[]> {
    return this.heroService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Herói encontrado.' })
  @ApiResponse({ status: 404, description: 'Herói não encontrado.' })
  async findOne(@Param('id') id: string): Promise<Hero> {
    return this.heroService.findOne(Number(id));
  }

  @Put(':id')
  @ApiResponse({ status: 200, description: 'Atualizado.' })
  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateHeroDto,
  ): Promise<Hero> {
    return this.heroService.update(Number(id), data);
  }

  @Delete(':id')
  @ApiResponse({ status: 204, description: 'Removido.' })
  @ApiResponse({ status: 404, description: 'Não encontrado.' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.heroService.remove(Number(id));
  }

  @Post('upload-csv')
  @ApiOperation({ summary: 'Importa heróis em massa via arquivo CSV' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: '100 mil heróis processados com sucesso!',
  })
  @ApiResponse({
    status: 400,
    description: 'Arquivo inválido ou erro no processamento.',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/csv',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `import-${uniqueSuffix}.csv`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(csv)$/)) {
          return cb(new Error('Apenas arquivos CSV são permitidos!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadCsv(@UploadedFile() file: Express.Multer.File) {
    return await this.heroService.importHeroesFromCsv(file.path);
  }
}
