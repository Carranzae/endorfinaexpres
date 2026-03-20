import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Table } from '@prisma/client';
export declare class TablesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.TableCreateInput): Promise<Table>;
    findAll(): Promise<Table[]>;
    findOne(id: string): Promise<Table | null>;
    update(id: string, data: Prisma.TableUpdateInput): Promise<Table>;
    remove(id: string): Promise<Table>;
}
