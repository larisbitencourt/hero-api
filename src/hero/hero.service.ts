import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hero } from './hero.entity';
import { CreateHeroDto } from './dto/hero.dto';
import { LogService } from 'src/logs/logs.service';
import { validateHeroRow } from '../utils/hero-validation.util';
import * as fs from 'fs';
import * as csv from 'csv-parser';

@Injectable()
export class HeroService {
  constructor(
    @InjectRepository(Hero)
    private readonly heroRepository: Repository<Hero>,
    private readonly logService: LogService, //
  ) {}

  async create(data: CreateHeroDto): Promise<Hero> {
    const hero = this.heroRepository.create(data);
    return await this.heroRepository.save(hero);
  }

  async uploadFilePath(id: number, filePath: string): Promise<Hero> {
    const hero = await this.findOne(id); 

    if (hero.photoUrl) {
 
    if (fs.existsSync(hero.photoUrl)) {
      fs.unlinkSync(hero.photoUrl); 
    }
  }
    hero.photoUrl = filePath; 
    return this.heroRepository.save(hero); 
  }

  async findAll(): Promise<Hero[]> {
    return this.heroRepository.find();
  }

  async findOne(id: number): Promise<Hero> {
    const hero = await this.heroRepository.findOneBy({ id });

    if (!hero) {
      throw new NotFoundException(`Herói com ID ${id} não encontrado.`);
    }

    return hero;
   
  }

  async update(id: number, data: Partial<Hero>): Promise<Hero> {
    const hero = await this.findOne(id);

    Object.assign(hero, data);
    return this.heroRepository.save(hero);

  }

  async remove(id: number): Promise<void> {
    const hero = await this.findOne(id);
    await this.heroRepository.remove(hero);

  }

async importHeroesFromCsv(filePath: string) {
    const fileName = filePath.split('/').pop() || 'arquivo.csv';
    const heroesToSave = [];
    const errorsList = []; 
    const batchSize = 1000;
    let currentLine = 0;

    try {
      const stream = fs.createReadStream(filePath).pipe(csv());

      for await (const row of stream) {
        currentLine++;

        try {
          
          const validatedHero = validateHeroRow(row);
          heroesToSave.push(validatedHero);

          if (heroesToSave.length >= batchSize) {
            await this.heroRepository.insert(heroesToSave);
            heroesToSave.length = 0;
          }
        } catch (error) {
         
          errorsList.push({
            line: currentLine,
            column: error.column || null,
            message: error.message,
            rowData: row, 
          });
        }
      }

      if (heroesToSave.length > 0) {
        await this.heroRepository.insert(heroesToSave);
      }

      if (errorsList.length > 0) {
        await this.logService.createLog({
         fileName: fileName,
         errors: errorsList 
        });
      }

      return {
        message: 'Processamento concluído.',
        detalhes: {
          file: fileName,
          totalLines: currentLine,
          sucesses: currentLine - errorsList.length,
          totalErrors: errorsList.length,
        },
      };

    } catch (error) {
      throw new Error(`Erro crítico no processamento: ${error.message}`);
    } finally {
     
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
  }

}
