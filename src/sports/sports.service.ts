import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Sport } from './entities/sport.entity';
import { CreateSportDto } from './dto/create-sport.dto';
import { UpdateSportDto } from './dto/update-sport.dto';
import { QuerySportDto } from './dto/read-sport.dto';

@Injectable()
export class SportsService {
  constructor(
    @InjectRepository(Sport)
    private readonly sportRepository: Repository<Sport>,
  ) {}

  private normalizeName(name: string): string {
    return name.trim().replace(/\s+/g, ' ');
  }

  async create(createSportDto: CreateSportDto): Promise<Sport> {
    const normalizedName = this.normalizeName(createSportDto.name);

    const existingSport = await this.sportRepository.findOne({
      where: { name: Like(normalizedName) },
    });

    if (existingSport) {
      throw new ConflictException('Ya existe un deporte con ese nombre');
    }

    const sport = this.sportRepository.create({
      name: normalizedName,
      description: createSportDto.description?.trim(),
      maxPlayers: createSportDto.maxPlayers,
    });

    return await this.sportRepository.save(sport);
  }

  async findAll(query: QuerySportDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where = query.name
      ? { name: Like(`%${query.name.trim()}%`) }
      : {};

    const [data, total] = await this.sportRepository.findAndCount({
      where,
      order: { id: 'ASC' },
      skip,
      take: limit,
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<Sport> {
    const sport = await this.sportRepository.findOne({
      where: { id },
    });

    if (!sport) {
      throw new NotFoundException(`No existe un deporte con id ${id}`);
    }

    return sport;
  }

  async update(id: number, updateSportDto: UpdateSportDto): Promise<Sport> {
    const sport = await this.findOne(id);

    if (updateSportDto.name !== undefined) {
      const normalizedName = this.normalizeName(updateSportDto.name);

      const existingSport = await this.sportRepository.findOne({
        where: { name: Like(normalizedName) },
      });

      if (existingSport && existingSport.id !== id) {
        throw new ConflictException('Ya existe un deporte con ese nombre');
      }

      sport.name = normalizedName;
    }

    if (updateSportDto.description !== undefined) {
      sport.description = updateSportDto.description?.trim();
    }

    if (updateSportDto.maxPlayers !== undefined) {
      sport.maxPlayers = updateSportDto.maxPlayers;
    }

    return await this.sportRepository.save(sport);
  }

  async remove(id: number): Promise<{ message: string }> {
  const sport = await this.sportRepository.findOne({
    where: { id },
    relations: ['scenarios'],
  });

  if (!sport) {
    throw new NotFoundException(`No existe un deporte con id ${id}`);
  }

  if (sport.scenarios && sport.scenarios.length > 0) {
    throw new ConflictException(
      'No se puede eliminar el deporte porque tiene escenarios asociados',
    );
  }

  await this.sportRepository.remove(sport);

  return {
    message: `Deporte con id ${id} eliminado correctamente`,
  };
}
}