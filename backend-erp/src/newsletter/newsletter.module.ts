import { Module } from '@nestjs/common';
import { NewsletterController } from './newsletter.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [NewsletterController],
})
export class NewsletterModule { }
