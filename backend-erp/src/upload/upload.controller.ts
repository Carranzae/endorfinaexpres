import { Controller, Post, UploadedFile, UseInterceptors, UseGuards, BadRequestException, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as fs from 'fs';
import { removeBackground } from '@imgly/background-removal-node';

@Controller('upload')
export class UploadController {
    @UseGuards(JwtAuthGuard)
    @Post('image')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: join(process.cwd(), 'uploads'),
                filename: (req, file, cb) => {
                    const unique = Date.now() + '-' + Math.round(Math.random() * 1e6);
                    cb(null, unique + extname(file.originalname));
                },
            }),
            fileFilter: (req, file, cb) => {
                const allowed = /\.(jpg|jpeg|png|gif|webp|svg|mp4|webm|mov)$/i;
                if (!allowed.test(file.originalname)) {
                    return cb(new BadRequestException('Solo se permiten imágenes y videos (jpg, png, gif, webp, svg, mp4, webm, mov)'), false);
                }
                cb(null, true);
            },
            limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
        }),
    )
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
        if (!file) throw new BadRequestException('No se recibió ningún archivo');
        
        let finalFilename = file.filename;

        if (req.body.removeBg === 'true' && file.mimetype.startsWith('image/')) {
            try {
                console.log(`[Upload] Aplicando IA para quitar fondo a ${file.filename}...`);
                const blob = await removeBackground(file.path);
                const arrayBuffer = await blob.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                finalFilename = file.filename.replace(/\.[^/.]+$/, "") + "-nobg.png";
                const newPath = join(process.cwd(), 'uploads', finalFilename);
                fs.writeFileSync(newPath, buffer);
                
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path); // Remove the original image with background
                }
                console.log(`[Upload] Fondo quitado exitosamente. Guardado como ${finalFilename}`);
            } catch (err) {
                console.error("[Upload] Error quitando fondo con IA:", err);
                // Si falla, se usa la original
            }
        }

        const url = `http://localhost:3000/uploads/${finalFilename}`;
        return { url, filename: finalFilename, originalName: file.originalname, size: file.size };
    }
}
