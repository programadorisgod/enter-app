import crypto from 'node:crypto';
import fs from 'node:fs';

// Clave secreta
const secretKey = 'a3f6c8e2d4e5b7e8f9c1d2a3b4e5f6a7c8b9d0e1f2a3b4c5d6e7f8a9b0c1d2e3';

// Rutas estáticas
const RUTAS = {
    entrada: "C:\\Users\\manue\\Documentos\\Universidad\\Seguridad informatica\\enter-app\\uploads\\Documento sin tÃ­tulo.docx",
    encriptado: "C:\\Users\\manue\\Documentos\\Universidad\\Seguridad informatica\\enter-app\\encrypted-files\\Documento-cifrado.enc",
    desencriptado: "C:\\Users\\manue\\Documentos\\Universidad\\Seguridad informatica\\enter-app\\decrypted-files\\documento.docx"
};

export const encryptFile = () => {
    try {
        // Crear vector de inicialización (IV)
        const iv = crypto.randomBytes(16);
        
        // Crear cipher usando AES-256-CBC
        const cipher = crypto.createCipheriv(
            'aes-256-cbc', 
            Buffer.from(secretKey, 'hex'),
            iv
        );

        // Crear streams
        const input = fs.createReadStream(RUTAS.entrada);
        const output = fs.createWriteStream(RUTAS.encriptado);

        // Escribir IV al inicio del archivo
        output.write(iv);

        // Encriptar el archivo
        input.pipe(cipher).pipe(output);

        output.on('finish', () => {
            console.log('✅ Archivo encriptado exitosamente');
            console.log('📁 Guardado en:', RUTAS.encriptado);
        });

        input.on('error', (err) => console.error('❌ Error al leer el archivo:', err));
        output.on('error', (err) => console.error('❌ Error al escribir el archivo:', err));
    } catch (error) {
        console.error('❌ Error durante la encriptación:', error);
    }
};

export const decryptFile = () => {
    try {
        // Crear stream de entrada
        const input = fs.createReadStream(RUTAS.encriptado);
        const iv = Buffer.alloc(16);

        // Leer el IV del archivo cifrado
        let isFirstChunk = true;
        const chunks = [];

        input.on('data', (chunk) => {
            if (isFirstChunk) {
                // Copiar el IV de los primeros 16 bytes
                chunk.copy(iv, 0, 0, 16);
                
                // Guardar el resto del primer chunk (si hay)
                if (chunk.length > 16) {
                    chunks.push(chunk.slice(16));
                }
                isFirstChunk = false;

                // Crear decipher con el IV recuperado
                const decipher = crypto.createDecipheriv(
                    'aes-256-cbc',
                    Buffer.from(secretKey, 'hex'),
                    iv
                );

                const output = fs.createWriteStream(RUTAS.desencriptado);
                console.log("🔑 IV leído y desencriptación iniciada");

                // Procesar los datos almacenados
                if (chunks.length > 0) {
                    chunks.forEach(storedChunk => {
                        output.write(decipher.update(storedChunk));
                    });
                }

                // Continuar con el resto del stream
                input.pipe(decipher).pipe(output);

                output.on('finish', () => {
                    console.log('✅ Archivo desencriptado exitosamente');
                    console.log('📁 Guardado en:', RUTAS.desencriptado);
                });

                output.on('error', (err) => 
                    console.error('❌ Error al escribir el archivo desencriptado:', err)
                );
            } else {
                chunks.push(chunk);
            }
        });

        input.on('error', (err) => 
            console.error('❌ Error al leer el archivo encriptado:', err)
        );
    } catch (error) {
        console.error('❌ Error durante la desencriptación:', error);
    }
};
