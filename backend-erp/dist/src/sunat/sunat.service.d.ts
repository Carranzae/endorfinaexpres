import { PrismaService } from '../prisma/prisma.service';
export declare class SunatService {
    private prisma;
    private readonly sunatWsUrl;
    constructor(prisma: PrismaService);
    buildUblXml(orderId: string, documentType: '01' | '03'): Promise<string>;
    signXml(xmlString: string, pfxBuffer: Buffer, password: string): string;
    sendToSunat(signedXml: string, fileName: string, username: string, password: string): Promise<any>;
}
