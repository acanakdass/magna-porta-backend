import { Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import { Repository} from 'typeorm';
import {PaginatedResponseDto, PaginationDto} from 'src/common/models/pagination-dto';
import {CompanyEntity} from './company.entity';
import {BaseService} from "../common/services/base.service";
import {CreateCompanyDto} from "./dtos/create-company-dto";

@Injectable()
export class CompaniesService extends BaseService<CompanyEntity> {
    constructor(
        @InjectRepository(CompanyEntity)
        private readonly repo: Repository<CompanyEntity>,
    ) {
        super(repo);
    }


    async listCompaniesPaginated(paginationDto: PaginationDto): Promise<PaginatedResponseDto<CompanyEntity>> {
        return await this.findAllWithPagination({
            ...paginationDto,
            select: [],
            relations: ['users'],
            where: {},
        });
    }

    async createCompany(createCompanyDto: CreateCompanyDto): Promise<CompanyEntity> {


        // console.log(createCompanyDto)
        const entity = Object.assign(new CompanyEntity(), createCompanyDto);
        entity.isVerified = false;
        entity.isActive = false;
        entity.createdAt = new Date()
        return super.create(entity);
    }

}
