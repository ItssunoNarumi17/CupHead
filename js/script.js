// ==========================================
// 1. CONFIGURACIÓN DE LA API (CRUD)
// ==========================================
// IMPORTANTE: Cambia 'cuphead-8l18' por el nombre real de tu servicio en Render
const RENDER_URL = "https://cuphead-8l18.onrender.com/api";
const API = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
            ? 'http://localhost:3000/api' 
            : RENDER_URL;

// ==========================================
// 2. MODO OBSCURO (PERSISTENTE)
// ==========================================
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');

// Verificar si ya estaba activo el modo oscuro antes
if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
    if(themeToggle) themeToggle.innerText = "Modo Claro";
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        let theme = 'light';
        
        if (document.body.classList.contains('dark-theme')) {
            theme = 'dark';
            themeToggle.innerText = "Modo Claro";
        } else {
            themeToggle.innerText = "Modo Obscuro";
        }
        localStorage.setItem('theme', theme);
    });
}

// ==========================================
// 3. LÓGICA DE LIKES (INDEX)
// ==========================================
const likeBtn = document.getElementById('like-btn');
const likeCount = document.getElementById('like-count');
if (likeBtn && likeCount) {
    let count = parseInt(localStorage.getItem('likes')) || 0;
    likeCount.innerText = count;

    likeBtn.addEventListener('click', () => {
        count++;
        likeCount.innerText = count;
        localStorage.setItem('likes', count);
        likeBtn.style.transform = "scale(1.2)";
        setTimeout(() => likeBtn.style.transform = "scale(1)", 200);
    });
}

// ==========================================
// 4. ENCUESTA / QUIZ (TABLA)
// ==========================================
const checks = document.querySelectorAll('.quiz-check');
const quizCounter = document.getElementById('quiz-counter');
if (checks.length > 0 && quizCounter) {
    checks.forEach(check => {
        check.addEventListener('change', () => {
            const activos = document.querySelectorAll('.quiz-check:checked').length;
            quizCounter.innerText = activos;
        });
    });
}

// ==========================================
// 5. BOTÓN IR ARRIBA
// ==========================================
const btnTop = document.getElementById('btn-top');
if (btnTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btnTop.style.display = "block";
        } else {
            btnTop.style.display = "none";
        }
    });

    btnTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ==========================================
// 6. CAROUSEL AUTOMÁTICO (INDEX)
// ==========================================
let slideIndex = 0;
const slides = document.getElementsByClassName("slide");
if (slides.length > 0) {
    function showSlides() {
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";  
        }
        slideIndex++;
        if (slideIndex > slides.length) {slideIndex = 1}    
        slides[slideIndex-1].style.display = "block";  
        setTimeout(showSlides, 3000); // Cambia imagen cada 3 segundos
    }
    showSlides();
}

// ==========================================
// 7. FUNCIONES DEL CRUD (SOLO PARA CRUD.HTML)
// ==========================================
// Estas funciones se llaman desde los botones onclick en crud.html
async function cargarTodo() {
    if (!document.getElementById('listaInv')) return; // Solo ejecutar en crud.html

    const fetchAndRender = async (col, listId, pre, f1, f2) => {
        try {
            const res = await fetch(`${API}/${col}`);
            const data = await res.json();
            const lista = document.getElementById(listId);
            lista.innerHTML = data.map(item => `
                <li>
                    <div><strong>${item[f1]}</strong></div>
                    <div style="font-size: 0.9em; color: #ccc;">${f2}: ${item[f2]}</div>
                    <div class="acciones-fila">
                        <button class="btn-edit" onclick='editar("${pre}", ${JSON.stringify(item)})'>Editar</button>
                        <button class="btn-del" onclick="eliminar('${col}', '${item._id}')">Eliminar</button>
                    </div>
                </li>`).join('');
        } catch (e) { console.error("Error cargando " + col, e); }
    };
    fetchAndRender('inventario', 'listaInv', 'p', 'nombre', 'precio');
    fetchAndRender('experiencias', 'listaExp', 'e', 'jugador', 'jefe');
    fetchAndRender('jefes', 'listaJefes', 'j', 'nombre', 'isla');
}

async function procesar(col) {
    const pre = col === 'inventario' ? 'p' : col === 'experiencias' ? 'e' : 'j';
    const id = document.getElementById(pre + 'Id').value;
    const payload = col === 'inventario' ? { nombre: document.getElementById('pNombre').value, precio: document.getElementById('pPrecio').value } :
                    col === 'experiencias' ? { jugador: document.getElementById('eJugador').value, jefe: document.getElementById('eJefe').value } :
                    { nombre: document.getElementById('jNombre').value, isla: document.getElementById('jIsla').value };

    if(!Object.values(payload).every(val => val !== "")) return alert("Llena todos los campos");

    try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API}/${col}/${id}` : `${API}/${col}`;
        await fetch(url, {
            method: method,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        cancelar(pre);
        cargarTodo();
    } catch (e) { alert("Error al conectar con el servidor."); }
}

function editar(pre, item) {
    document.getElementById(pre + 'Id').value = item._id;
    if(pre==='p'){ document.getElementById('pNombre').value=item.nombre; document.getElementById('pPrecio').value=item.precio; }
    if(pre==='e'){ document.getElementById('eJugador').value=item.jugador; document.getElementById('eJefe').value=item.jefe; }
    if(pre==='j'){ document.getElementById('jNombre').value=item.nombre; document.getElementById('jIsla').value=item.isla; }
    document.getElementById(pre + 'Btn').innerText = "Actualizar Registro";
    document.getElementById(pre + 'Cancel').style.display = "block";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function eliminar(col, id) {
    if(confirm('¿Deseas eliminar este registro de la base de datos?')) {
        await fetch(`${API}/${col}/${id}`, { method: 'DELETE' });
        cargarTodo();
    }
}

function cancelar(pre) {
    document.getElementById(pre + 'Id').value = "";
    const inputs = document.querySelectorAll(`#sec-${pre} input, #sec-${pre} select`);
    inputs.forEach(i => i.value = "");
    document.getElementById(pre + 'Cancel').style.display = "none";
    const btnText = pre==='p' ? "Guardar Contrato" : pre==='e' ? "Registrar Batalla" : "Añadir al Lore";
    document.getElementById(pre + 'Btn').innerText = btnText;
}

// Inicializar carga si estamos en la página CRUD
if (document.getElementById('listaInv')) {
    window.onload = cargarTodo;
}