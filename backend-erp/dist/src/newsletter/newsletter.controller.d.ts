import { PrismaService } from '../prisma/prisma.service';
export declare class NewsletterController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getSubscribers(): Promise<{
        id: string;
        email: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        firstName: string | null;
        lastName: string | null;
    }[]>;
    subscribe(body: {
        email: string;
        firstName?: string;
        lastName?: string;
        phone?: string;
    }): Promise<{
        id: string;
        email: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        firstName: string | null;
        lastName: string | null;
    } | {
        success: boolean;
        message: string;
    }>;
    removeSubscriber(id: string): Promise<{
        id: string;
        email: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        firstName: string | null;
        lastName: string | null;
    } | {
        success: boolean;
    }>;
    sendNewsletter(body: {
        subject: string;
        body: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
