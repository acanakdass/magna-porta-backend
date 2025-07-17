import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {LogEntity} from "./log.entity";

@Injectable()
export class LogsService {
  constructor(@InjectRepository(LogEntity) private repo: Repository<LogEntity>) {}

  logRequest(method: string, url: string) {
    const log = this.repo.create({ method, url });
    return this.repo.save(log);
  }
}