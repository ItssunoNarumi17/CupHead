const express = require('express');
const cors = require('cors');
const { conectarDB } = require('./database');
const { ObjectId } = require('mongodb');
const path = require('path');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// SERVIR ARCHIVOS ESTÁTICOS
// Esto es lo que hace que carguen tus estilos, imágenes y el JS del frontend
app.use(express.static(path.join(__dirname, '../')));

const PORT = process.env.PORT || 3000;
let db;

conectarDB().then(database => {
    db = database;
    app.listen(PORT, () => {
        console.log(`🚀 Servidor Cuphead listo en el puerto: ${PORT}`);
    });
}).catch(err => {
    console.error("Fallo crítico en DB:", err);
});

// --- FUNCIONES GENÉRICAS PARA EL CRUD ---
const gestionarRutas = (coleccion) => {
    app.get(`/api/${coleccion}`, async (req, res) => {
        try {
            const data = await db.collection(coleccion).find({}).toArray();
            res.json(data);
        } catch (error) { res.status(500).json({ error: error.message }); }
    });

    app.post(`/api/${coleccion}`, async (req, res) => {
        try {
            const resultado = await db.collection(coleccion).insertOne(req.body);
            res.json({ success: true, id: resultado.insertedId });
        } catch (error) { res.status(500).json({ error: error.message }); }
    });

    app.delete(`/api/${coleccion}/:id`, async (req, res) => {
        try {
            const id = req.params.id;
            await db.collection(coleccion).deleteOne({ _id: new ObjectId(id) });
            res.json({ success: true });
        } catch (error) { res.status(500).json({ error: error.message }); }
    });
};

// Activamos las rutas para tus 3 colecciones
gestionarRutas('inventario');
gestionarRutas('experiencias');
gestionarRutas('jefes');