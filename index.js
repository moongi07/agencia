import express from 'express';
import router from './routes/index.js';
import db from './config/db.js';

const app = express();

db.authenticate()
    .then(()=> console.log('conectado a la base de datos'))
    .catch(err=> console.log(err));

const port = process.env.PORT || 4000;

app.set('view engine', 'pug');

app.use((req,res,next)=>
{
    const year= new Date().getFullYear();
    res.locals.year = year;
    res.locals.nombreP="Agencia de viajes";
    next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use("/", router); // Aquí usas el router correctamente

app.listen(port, () => console.log("Escuchando en el puerto " + port));
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

//desarrollo
//"dev": "nodemon index.js"
//produccion
//"start": "index.js"
