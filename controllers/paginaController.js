import {Viaje} from "../models/Viaje.js";
import {Testimonial} from "../models/testimoniales.js";
//import {Cliente} from "../models/cliente.js";

import moment from "moment";
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
export{
    paginaInicio,
    paginaNosotros,
    paginaViajes,
    paginaTestimonios,
    paginaDetallesViajes,
    guardarTestimonios
}

