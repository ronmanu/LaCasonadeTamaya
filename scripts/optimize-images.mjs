import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CONFIGURATION
const INPUT_DIR = path.join(__dirname, '../public/images');
const OUTPUT_DIR = INPUT_DIR; // Sobrescribir en la misma carpeta o cambiar si prefieres
const MAX_WIDTH = 1920;
const QUALITY = 82; // Balance ideal entre peso y calidad visual

async function optimizeImages() {
    try {
        const files = await fs.readdir(INPUT_DIR);
        const imageExtensions = ['.jpg', '.jpeg', '.png'];

        console.log('--- Optimizando Imágenes (JPG/PNG -> WebP) ---');

        let totalSaved = 0;
        let fileCount = 0;

        for (const file of files) {
            const ext = path.extname(file).toLowerCase();
            if (!imageExtensions.includes(ext)) continue;

            const inputPath = path.join(INPUT_DIR, file);
            const outputName = `${path.parse(file).name}.webp`;
            const outputPath = path.join(OUTPUT_DIR, outputName);

            const stats = await fs.stat(inputPath);
            const originalSize = stats.size;

            // PROCESAR CON SHARP
            await sharp(inputPath)
                .resize({
                    width: MAX_WIDTH,
                    withoutEnlargement: true,
                    fit: 'inside'
                })
                .webp({ quality: QUALITY })
                .toFile(outputPath);

            const newStats = await fs.stat(outputPath);
            const newSize = newStats.size;
            const saved = originalSize - newSize;

            totalSaved += saved;
            fileCount++;

            console.log(`[✓] ${file} -> ${outputName}`);
            console.log(`    Antes: ${(originalSize / 1024).toFixed(1)}KB | Ahora: ${(newSize / 1024).toFixed(1)}KB | Ahorro: ${((saved / originalSize) * 100).toFixed(1)}%`);
        }

        console.log('\n--- RESUMEN ---');
        console.log(`Total imágenes procesadas: ${fileCount}`);
        console.log(`Ahorro total de espacio: ${(totalSaved / (1024 * 1024)).toFixed(2)} MB`);
        console.log('Web lista para cargar a la velocidad del rayo ⚡');

    } catch (err) {
        console.error('Error durante la optimización:', err);
    }
}

optimizeImages();
