import {Viaje} from "../models/Viaje.js";
import {Testimonial} from "../models/testimoniales.js";
//import {Cliente} from "../models/cliente.js";

import moment from "moment";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';

import req from "express/lib/request.js";

const paginaInicio = async (req, res) => {

    const promiseDB=[];

    promiseDB.push(Viaje.findAll({
        limit: 3,
        order: [["Id", "DESC"]],
    }));

    promiseDB.push(Testimonial.findAll({
        limit: 3,
        order: [["Id", "DESC"]],
    }));

    //Consultar 3 viajes del modelo de Viaje
    try{
      const resultado = await Promise.all(promiseDB);


        res.render('inicio', {
            pagina: 'Inicio',
            clase: 'home',
            viajes: resultado[0],
            testimonios: resultado[1],
            moment: moment,
        });

    }catch(err){
        console.log(err);
    }


}
const paginaNosotros = async (req, res) => {
    res.render('nosotros', {
        pagina: 'Nosotros'
    });
}

const paginaViajes = async (req, res) => {
    const viajes = await Viaje.findAll();
    res.render('viajes', {
        pagina: 'Viajes',
        viajes,
        moment:moment,
    });
}

const paginaTestimonios = async (req, res) => {
    try{
        const testimonios = await Testimonial.findAll({
            limit: 6,
            order: [["Id", "DESC"]],
        });
        res.render('testimonios', {
            pagina: 'Testimonios',
            testimonios: testimonios,
            moment: moment,
        });
    }catch(err){
        console.log(err);
    }


}
const paginaDetallesViajes = async (req, res) => {
   const {slug}= req.params;
    try {
        const resultado = await Viaje.findOne({ where: { slug: slug } });
        res.render('viaje', {
            pagina: 'Información del viaje',
            resultado,
            moment: moment,
        });
    } catch (error) {
        console.error(error);

    }

}




const guardarTestimonios =  async (req, res) => {

    const {nombre, correo, mensaje} = req.body;

    const errores = [];

    if (nombre.trim()===''){
        errores.push({mensaje: 'El nombre está vacío'});
    }
    if (correo.trim()===''){
        errores.push({mensaje: 'El correo está vacío'});
    }
    if (mensaje.trim()===''){
        errores.push({mensaje: 'El mensaje está vacío'});
    }

    if (errores.length>0){ //Debemos volver a la vista y mostrar los errores

      /*  const testimonios = await Testimonial.findAll({
            limit: 6,
            order: [["Id", "DESC"]],
        });*/

        res.render('testimonios', {
            pagina: 'Testimonios',
            errores: errores,
            nombre: nombre,
            correo: correo,
            mensaje: mensaje,
            //testimonios: testimonios,
        })
    }else{//Si me envia los 3 campos rellenos Almacenar el mensaje en la BBDD
       try{

            await Testimonial.create({nombre: nombre, correoelectronico: correo,mensaje: mensaje,});
            res.redirect('/testimonios'); //Guardo en la base de datos y lo envío a la misma vista
        }catch(error){
            console.log(error);
        }
    }
}

const paginaComprar = async (req, res) => {
    const titulo = decodeURIComponent(req.params.titulo);

    try {
        const resultado = await Viaje.findOne({ where: { titulo: titulo } });
        if (!resultado) {
            return res.status(404).render('404', { mensaje: 'Viaje no encontrado' });
        }
        res.render('comprar', {
            pagina: 'Formulario de compra',
            resultado
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
}







// Convertir __dirname en un módulo ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const solicitud = async (req, res) => {
    const { nombre, apellidos, email, pais } = req.body;
    const { titulo = 'Documento', imagen } = req.params;
    const errores = [];

    if (!nombre?.trim()) errores.push({ mensaje: 'El nombre está vacío' });
    if (!apellidos?.trim()) errores.push({ mensaje: 'El apellido está vacío' });
    if (!email?.trim()) errores.push({ mensaje: 'El correo está vacío' });
    if (!pais?.trim()) errores.push({ mensaje: 'Selecciona un país' });

    if (errores.length > 0) {
        return res.render('comprar', {
            pagina: 'comprar',
            errores,
            nombre,
            apellidos,
            email,
            pais
        });
    }

    const dir = path.join(__dirname, 'downloads');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const nombreArchivo = `${titulo.replace(/\s+/g, '_')}.pdf`;
    let archivoFinal = path.join(dir, nombreArchivo);

    let i = 1;
    while (fs.existsSync(archivoFinal)) {
        archivoFinal = path.join(dir, `${titulo.replace(/\s+/g, '_')}_${i}.pdf`);
        i++;
    }

    const doc = new PDFDocument();
    let imagePath = null;
    if (imagen) {
        imagePath = path.join(__dirname,'..', 'public', 'img', `destinos_${imagen}.jpg`);
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${path.basename(archivoFinal)}`);
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#F0F0F0'); // Un fondo gris claro
    doc.fillColor('black');
    doc.pipe(res);
    doc.rect(0, 0, doc.page.width, 50).fill('#3498db'); // Fondo azul para el encabezado
    doc.fillColor('white').fontSize(35).text("Resumen de Solicitud", 50, 15, { align: "center" });
// Ajusta la posición manualmente reduciendo `doc.y`
    doc.moveDown();


    if (imagePath && fs.existsSync(imagePath)) {
        doc.image(imagePath, { fit: [500, 200], align: 'center' }); // Ajusta el tamaño
        doc.moveDown(6);
    }

    doc.font('Helvetica-Bold').fontSize(16).fillColor('black').text('Detalles de la Solicitud', { align: 'center' });
    doc.moveDown(1.5);

    doc.font('Helvetica-Bold').fontSize(14).text('Título:', { continued: true });
    doc.font('Helvetica').text(` ${titulo}`);

    doc.font('Helvetica-Bold').text('Nombre:', { continued: true });
    doc.font('Helvetica').text(` ${nombre} ${apellidos}`);

    doc.font('Helvetica-Bold').text('Email:', { continued: true });
    doc.font('Helvetica').text(` ${email}`);

    doc.font('Helvetica-Bold').text('País:', { continued: true });
    doc.font('Helvetica').text(` ${pais}`);

    doc.moveDown(2);
    doc.font('Helvetica-Bold').fontSize(16).text('¡Gracias por tu compra!', { align: 'center', underline: true });

    doc.end();

};



export{
    paginaInicio,
    paginaNosotros,
    paginaViajes,
    paginaTestimonios,
    paginaDetallesViajes,
    guardarTestimonios,
    paginaComprar,
    solicitud
}

