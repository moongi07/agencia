import Sequelize from "sequelize";
import db from "../config/db.js";

export const Testimonial = db.define("testimoniales", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: Sequelize.STRING,
    },
    correoelectronico: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    mensaje: {
        type: Sequelize.STRING
    },
},{
    tableName: 'testimoniales', // Asegúrate de que la tabla se llame 'clientes'
    // timestamps: false, // Si no deseas los campos `createdAt` y `updatedAt`
});
Testimonial.sync({ alter: true }).catch(console.error);