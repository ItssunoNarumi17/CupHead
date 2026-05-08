const { MongoClient } = require('mongodb');

// Prioriza la variable de entorno de Render, si no existe, usa la local
const uri = process.env.MONGO_URI || "mongodb://is425289_db_user:gengarxd17@ac-rvrypdh-shard-00-00.e4cgpli.mongodb.net:27017,ac-rvrypdh-shard-00-01.e4cgpli.mongodb.net:27017,ac-rvrypdh-shard-00-02.e4cgpli.mongodb.net:27017/?ssl=true&replicaSet=atlas-hlljjs-shard-0&authSource=admin&appName=Cluster0";

const client = new MongoClient(uri);
let db;

async function conectarDB() {
    try {
        await client.connect();
        console.log('✅ ¡Conexión exitosa a las Islas Inkwell en Atlas!');
        db = client.db('cuphead_db');

        // Inicializar jefes si la colección está vacía
        const jefesCol = db.collection('jefes');
        const existe = await jefesCol.countDocuments();
        if (existe === 0) {
            await jefesCol.insertMany([
                { nombre: "The Root Pack", isla: "Inkwell Isle I", dificultad: "Fácil" },
                { nombre: "Grim Matchstick", isla: "Inkwell Isle II", dificultad: "Difícil" },
                { nombre: "King Dice", isla: "Inkwell Hell", dificultad: "Experto" }
            ]);
            console.log('👾 Lore de jefes inicializado');
        }
        return db;
    } catch (error) {
        console.error('❌ Error de conexión:', error.message);
        // No cerramos el proceso inmediatamente en Render para poder ver el error en los logs
        throw error; 
    }
}

module.exports = { conectarDB };