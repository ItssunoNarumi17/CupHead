const express = require('express');
const cors = require('cors');
const { conectarDB } = require('./database');
const { ObjectId } = require('mongodb');

const app = express();

// IMPORTANTE: Esto permite que el servidor (Render/Railway) elija el puerto automáticamente
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

let db;

// Conexión inicial
conectarDB().then(database => {
    db = database;
    app.listen(PORT, () => {
        console.log(`🚀 Servidor Cuphead corriendo en el puerto: ${PORT}`);
    });
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
            await db.collection(coleccion).insertOne(req.body);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Actualizar registro existente (Update)
    app.put(`/api/${coleccion}/:id`, async (req, res) => {
        try {
            const id = req.params.id;
            const { _id, ...datosNuevos } = req.body; // Quitamos el _id para evitar conflictos con Mongo
            await db.collection(coleccion).updateOne(
                { _id: new ObjectId(id) }, 
                { $set: datosNuevos }
            );
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Eliminar registro (Delete)
    app.delete(`/api/${coleccion}/:id`, async (req, res) => {
        try {
            await db.collection(coleccion).deleteOne({ _id: new ObjectId(req.params.id) });
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};

// Activar las rutas para las colecciones de tu proyecto
gestionarRutas('inventario');
gestionarRutas('experiencias');
gestionarRutas('jefes');