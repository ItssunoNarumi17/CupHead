const express = require('express');
const cors = require('cors');
const { conectarDB } = require('./database');
const { ObjectId } = require('mongodb');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

let db;

conectarDB().then(database => {
    db = database;
    app.listen(PORT, () => {
        console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
    });
});

// --- RUTA: JUGUETES Y ROPA ---
app.get('/api/inventario', async (req, res) => {
    try {
        const items = await db.collection('inventario').find({}).toArray();
        res.json(items);
    } catch (e) { res.status(500).send(e); }
});

app.post('/api/inventario', async (req, res) => {
    try {
        const { nombre, tipo, precio } = req.body;
        await db.collection('inventario').insertOne({ nombre, tipo, precio: parseFloat(precio) });
        res.json({ success: true });
    } catch (e) { res.status(500).send(e); }
});

// --- RUTA: EXPERIENCIA CON JEFES ---
app.get('/api/experiencias', async (req, res) => {
    try {
        const exps = await db.collection('experiencias').find({}).toArray();
        res.json(exps);
    } catch (e) { res.status(500).send(e); }
});

app.post('/api/experiencias', async (req, res) => {
    try {
        const { jugador, jefe, nivel } = req.body;
        await db.collection('experiencias').insertOne({ jugador, jefe, nivel });
        res.json({ success: true });
    } catch (e) { res.status(500).send(e); }
});