import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ComplaintStatus } from '@prisma/client';

@Injectable()
export class ComplaintsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; email?: string; phone?: string; issue: string }) {
    return this.prisma.complaint.create({
      data: {
        ...data,
        status: 'PENDING',
      },
    });
  }

  async findAll() {
    return this.prisma.complaint.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: ComplaintStatus) {
    return this.prisma.complaint.update({
      where: { id },
      data: { status },
    });
  }
}
