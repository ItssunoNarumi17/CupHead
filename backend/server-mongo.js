const express = require('express');
const cors = require('cors');
const { conectarDB } = require('./database');
const { ObjectId } = require('mongodb');
const path = require('path'); // Módulo necesario para manejar rutas de archivos

const app = express();

// Render asigna el puerto automáticamente mediante process.env.PORT
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// --- NUEVA LÍNEA: SERVIR ARCHIVOS ESTÁTICOS ---
// Esto permite que al entrar al link se carguen index.html, estilos.css, etc.
app.use(express.static(path.join(__dirname, '../'))); 

let db;

// Conexión inicial y arranque del servidor
conectarDB().then(database => {
    db = database;
    app.listen(PORT, () => {
        console.log(`🚀 Servidor Cuphead corriendo en el puerto: ${PORT}`);
    });
}).catch(err => {
    console.error("Fallo crítico al iniciar la base de datos:", err);
});

// --- FUNCIONES GENÉRICAS PARA EL CRUD ---
const gestionarRutas = (coleccion) => {
    
    // Obtener todos los registros (Read)
    app.get(`/api/${coleccion}`, async (req, res) => {
        try {
            const data = await db.collection(coleccion).find({}).toArray();
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Crear nuevo registro (Create)
    app.post(`/api/${coleccion}`, async (req, res) => {
        try {
            const resultado = await db.collection(coleccion).insertOne(req.body);
            res.json({ success: true, id: resultado.insertedId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Actualizar registro existente (Update)
    app.put(`/api/${coleccion}/:id`, async (req, res) => {
        try {
            const id = req.params.id;
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ error: "ID no válido" });
            }

            const { _id, ...datosNuevos } = req.body; 
            const resultado = await db.collection(coleccion).updateOne(
                { _id: new ObjectId(id) }, 
                { $set: datosNuevos }
            );

            res.json({ success: true, modifiedCount: resultado.modifiedCount });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Eliminar registro (Delete)
    app.delete(`/api/${coleccion}/:id`, async (req, res) => {
        try {
            const id = req.params.id;
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ error: "ID no válido" });
            }

            await db.collection(coleccion).deleteOne({ _id: new ObjectId(id) });
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};

// Rutas activas
gestionarRutas('inventario');
gestionarRutas('experiencias');
gestionarRutas('jefes');