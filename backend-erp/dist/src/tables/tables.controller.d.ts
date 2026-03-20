import { TablesService } from './tables.service';
import { Prisma } from '@prisma/client';
export declare class TablesController {
    private readonly tablesService;
    constructor(tablesService: TablesService);
    create(createTableDto: Prisma.TableCreateInput): Promise<{
        number: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        capacity: number;
        status: import(".prisma/client").$Enums.TableStatus;
    }>;
    findAll(): Promise<{
        number: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        capacity: number;
        status: import(".prisma/client").$Enums.TableStatus;
    }[]>;
    findOne(id: string): Promise<{
        number: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        capacity: number;
        status: import(".prisma/client").$Enums.TableStatus;
    } | null>;
    update(id: string, updateTableDto: Prisma.TableUpdateInput): Promise<{
        number: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        capacity: number;
        status: import(".prisma/client").$Enums.TableStatus;
    }>;
    remove(id: string): Promise<{
        number: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        capacity: number;
        status: import(".prisma/client").$Enums.TableStatus;
    }>;
}
