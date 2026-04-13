import { PartialType } from '@nestjs/mapped-types';
import { CreateScenarioDto } from './create-scenario.dto';
import { ScenarioStatus } from '../enums/scenario-status.enum';

export class UpdateScenarioDto extends PartialType(CreateScenarioDto) {
  sportId?: number;
  name?: string;
  location?: string;
  capacity?: number;
  price?: number;
  status?: ScenarioStatus;
}