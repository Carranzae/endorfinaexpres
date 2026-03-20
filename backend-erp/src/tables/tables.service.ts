import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Table } from '@prisma/client';

@Injectable()
export class TablesService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.TableCreateInput): Promise<Table> {
        return this.prisma.table.create({
            data,
        });
    }

    async findAll(): Promise<Table[]> {
        return this.prisma.table.findMany({
            orderBy: { number: 'asc' },
        });
    }

    async findOne(id: string): Promise<Table | null> {
        return this.prisma.table.findUnique({
            where: { id },
            include: {
                qrSessions: {
                    where: { status: 'ACTIVE' },
                },
                orders: {
                    where: { status: { in: ['PENDING', 'PREPARING', 'READY'] } },
                }
            }
        });
    }

    async update(id: string, data: Prisma.TableUpdateInput): Promise<Table> {
        return this.prisma.table.update({
            where: { id },
            data,
        });
    }

    async remove(id: string): Promise<Table> {
        return this.prisma.table.delete({
            where: { id },
        });
    }
}
