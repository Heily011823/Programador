import {ConflictException, Injectable, NotFoundException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Scenario } from './entities/scenario.entity';
import { Sport } from '../sports/entities/sport.entity';
import { CreateScenarioDto } from './dto/create-scenario.dto';
import { UpdateScenarioDto } from './dto/update-scenario.dto';
import { QueryScenarioDto } from './dto/read-scenario.dto';
import { ScenarioStatus } from './enums/scenario-status.enum';

@Injectable()
export class ScenariosService {
  constructor(
    @InjectRepository(Scenario)
    private readonly scenarioRepository: Repository<Scenario>,

    @InjectRepository(Sport)
    private readonly sportRepository: Repository<Sport>,
  ) {}

  private normalizeText(value: string): string {
    return value.trim().replace(/\s+/g, ' ');
  }

  async create(createScenarioDto: CreateScenarioDto): Promise<Scenario> {
    const sport = await this.sportRepository.findOne({
      where: { id: createScenarioDto.sportId },
    });

    if (!sport) {
      throw new NotFoundException(
        `No existe un deporte con id ${createScenarioDto.sportId}`,
      );
    }

    const normalizedName = this.normalizeText(createScenarioDto.name);
    const normalizedLocation = this.normalizeText(createScenarioDto.location);

    const existingScenario = await this.scenarioRepository.findOne({
      where: {
        name: Like(normalizedName),
        location: Like(normalizedLocation),
      },
      relations: ['sport'],
    });

    if (existingScenario) {
      throw new ConflictException(
        'Ya existe un escenario con ese nombre en esa ubicación',
      );
    }

    const scenario = this.scenarioRepository.create({
      name: normalizedName,
      location: normalizedLocation,
      capacity: createScenarioDto.capacity,
      price: createScenarioDto.price,
      status: createScenarioDto.status ?? ScenarioStatus.AVAILABLE,
      sport,
    });

    return await this.scenarioRepository.save(scenario);
  }

  async findAll(query: QueryScenarioDto): Promise<Scenario[]> {
    const where: any = {};

    if (query.name) {
      where.name = Like(`%${query.name.trim()}%`);
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.sportId) {
      where.sport = { id: query.sportId };
    }

    return await this.scenarioRepository.find({
      where,
      order: { id: 'ASC' },
      relations: ['sport'],
    });
  }

  async findOne(id: number): Promise<Scenario> {
    const scenario = await this.scenarioRepository.findOne({
      where: { id },
      relations: ['sport'],
    });

    if (!scenario) {
      throw new NotFoundException(`No existe un escenario con id ${id}`);
    }

    return scenario;
  }

  async update(
    id: number,
    updateScenarioDto: UpdateScenarioDto,
  ): Promise<Scenario> {
    const scenario = await this.findOne(id);

    if (updateScenarioDto.sportId !== undefined) {
      const sport = await this.sportRepository.findOne({
        where: { id: updateScenarioDto.sportId },
      });

      if (!sport) {
        throw new NotFoundException(
          `No existe un deporte con id ${updateScenarioDto.sportId}`,
        );
      }

      scenario.sport = sport;
    }

    const newName =
      updateScenarioDto.name !== undefined
        ? this.normalizeText(updateScenarioDto.name)
        : scenario.name;

    const newLocation =
      updateScenarioDto.location !== undefined
        ? this.normalizeText(updateScenarioDto.location)
        : scenario.location;

    const existingScenario = await this.scenarioRepository.findOne({
      where: {
        name: Like(newName),
        location: Like(newLocation),
      },
      relations: ['sport'],
    });

    if (existingScenario && existingScenario.id !== id) {
      throw new ConflictException(
        'Ya existe un escenario con ese nombre en esa ubicación',
      );
    }

    scenario.name = newName;
    scenario.location = newLocation;

    if (updateScenarioDto.capacity !== undefined) {
      scenario.capacity = updateScenarioDto.capacity;
    }

    if (updateScenarioDto.price !== undefined) {
      scenario.price = updateScenarioDto.price;
    }

    if (updateScenarioDto.status !== undefined) {
      scenario.status = updateScenarioDto.status;
    }

    return await this.scenarioRepository.save(scenario);
  }

  async remove(id: number): Promise<{ message: string }> {
    const scenario = await this.findOne(id);

    await this.scenarioRepository.remove(scenario);

    return {
      message: `Escenario con id ${id} eliminado correctamente`,
    };
  }
}