import express from 'express';
//import {paginaInicio, guardarCompra, paginaComprar, paginaNosotros, paginaTestimonios, paginaViajes, paginaDetallesViajes, guardarTestimonios} from "../controllers/paginaController.js";
import {paginaInicio} from "../controllers/paginaController.js";
import {paginaNosotros} from "../controllers/paginaController.js";
import {paginaTestimonios} from "../controllers/paginaController.js";
import {paginaViajes} from "../controllers/paginaController.js";
import {paginaDetallesViajes} from "../controllers/paginaController.js"
import {guardarTestimonios} from "../controllers/paginaController.js"
import {paginaComprar} from "../controllers/paginaController.js"
import {solicitud} from "../controllers/paginaController.js"

const router = express.Router();

//envio al controlador pagina inicio

router.get('/', paginaInicio)
router.get('/nosotros',paginaNosotros);
router.get('/testimonios',paginaTestimonios);
router.get('/viajes',paginaViajes);
router.get('/viajes/:slug', paginaDetallesViajes);
router.post('/testimonios', guardarTestimonios);
router.get('/comprar/:titulo', paginaComprar);
router.post('/comprar/:titulo/:imagen', solicitud);




export default router;


