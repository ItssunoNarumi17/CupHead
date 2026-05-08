document.addEventListener('DOMContentLoaded', () => {
    // URL de tu API en Render (Cambia esto por tu link real de Render)
    const API_BASE_URL = "https://cuphead-8l18.onrender.com/api";

    // --- 1. MODO OSCURO PERSISTENTE ---
    const themeBtn = document.getElementById('theme-toggle');
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const mode = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
            localStorage.setItem('theme', mode);
        });
    }

    // --- 2. LÓGICA DEL CRUD (Tienda y Batallas) ---
    const formCuphead = document.getElementById('cuphead-form');
    if (formCuphead) {
        formCuphead.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nombre = document.getElementById('nom').value;
            const email = document.getElementById('mail').value;

            // Ejemplo enviando a la colección 'experiencias'
            try {
                const response = await fetch(`${API_BASE_URL}/experiencias`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ jugador: nombre, email: email, fecha: new Date() })
                });
                if (response.ok) alert("¡Contrato firmado con el Diablo!");
            } catch (err) { console.error("Error al conectar con la isla:", err); }
        });
    }

    // --- 3. CONTADOR DE LIKES ---
    const likeBtn = document.getElementById('like-btn');
    const likeCountDisp = document.getElementById('like-count');
    let totalLikes = parseInt(localStorage.getItem('likes-count')) || 0;

    if (likeCountDisp) {
        likeCountDisp.textContent = totalLikes;
        if (likeBtn) {
            likeBtn.addEventListener('click', () => {
                totalLikes++;
                localStorage.setItem('likes-count', totalLikes);
                likeCountDisp.textContent = totalLikes;
            });
        }
    }

    // --- 4. BOTÓN VOLVER ARRIBA ---
    const btnArriba = document.getElementById('btn-top');
    if (btnArriba) {
        window.addEventListener('scroll', () => {
            btnArriba.style.display = window.scrollY > 300 ? "block" : "none";
        });
        btnArriba.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

// --- 5. CARRUSEL ANIMADO ---
let slideIndex = 0;
function carruselAnimado() {
    const imagenes = document.getElementsByClassName("slide");
    if (imagenes.length > 0) {
        for (let i = 0; i < imagenes.length; i++) { imagenes[i].style.display = "none"; }
        slideIndex++;
        if (slideIndex > imagenes.length) slideIndex = 1;
        imagenes[slideIndex - 1].style.display = "block";
        setTimeout(carruselAnimado, 3000);
    }
}
carruselAnimado();