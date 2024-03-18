const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const QRCode = require('qrcode');

// Función para generar códigos QR y guardarlos como archivos PNG
async function generarQR(data, nombreArchivo, size=800) {
    try {

        await QRCode.toFile(`./qr_codes/${nombreArchivo}.png`, data, { width: size });
        console.log(`Código QR generado y guardado como ${nombreArchivo}.png`);
    } catch (error) {
        console.error('Error al generar el código QR:', error);
    }
}

// Función para generar PDF con los códigos QR generados
async function generarPDF(codigos) {

    
    console.log("aqui")

const pdfDoc = await PDFDocument.create();
    for (let i = 0; i < codigos.length; i++) {
        console.log(codigos[i])
        const qrImage = await pdfDoc.embedPng(fs.readFileSync(`./qr_codes/qr_embarcacion_${codigos[i].id}.png`));
        const page = pdfDoc.addPage();
        page.drawImage(qrImage, {
            x: page.getWidth() / 2 - 200,
            y: page.getHeight() / 2 - 200,
            width: 400,
            height: 400,
        });
    }
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync('codigos_qr_embarcaciones.pdf', pdfBytes);
    console.log('Archivo PDF generado con los códigos QR.');
}

var datos = require('./embarcaciones.json');

// Crear carpeta para guardar los códigos QR si no existe  
if (!fs.existsSync('./qr_codes')) {
    fs.mkdirSync('./qr_codes');
}

// Generar códigos QR
async function generarCodigosQR() {
    for (let i = 0; i < datos.length; i++) {
        await generarQR(JSON.stringify(datos[i]), `qr_embarcacion_${datos[i].id}`);
    }
    // Generar PDF con los códigos QR generados
    await generarPDF(datos);
}

// Ejecutar la generación de códigos QR y PDF
generarCodigosQR().catch(error => console.error('Error:', error));