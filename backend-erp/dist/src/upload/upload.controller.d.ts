export declare class UploadController {
    uploadFile(file: Express.Multer.File, req: any): Promise<{
        url: string;
        filename: string;
        originalName: string;
        size: number;
    }>;
}
