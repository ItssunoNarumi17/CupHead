document.addEventListener('DOMContentLoaded', () => {
    

    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;

 
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-theme');
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            body.classList.toggle('dark-theme');
            const mode = body.classList.contains('dark-theme') ? 'dark' : 'light';
            localStorage.setItem('theme', mode);
        });
    }


    const likeBtn = document.getElementById('like-btn');
    const likeCountDisp = document.getElementById('like-count');
    let totalLikes = localStorage.getItem('likes-count') || 0;

    if (likeCountDisp) likeCountDisp.textContent = totalLikes;

    if (likeBtn) {
        likeBtn.addEventListener('click', () => {
            totalLikes++;
            localStorage.setItem('likes-count', totalLikes);
            likeCountDisp.textContent = totalLikes;
        });
    }


    const form = document.getElementById('cuphead-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            const nombre = document.getElementById('nom').value;
            const email = document.getElementById('mail').value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (nombre.trim() === "" || !emailRegex.test(email)) {
                e.preventDefault(); 
                alert("¡Alto ahí! El nombre es obligatorio y el email debe ser válido.");
            } else {
                alert("¡Contrato firmado! El Diablo ha recibido tus datos.");
            }
        });
    }

   
    const btnAdd = document.getElementById('add-btn');
    const inputAdd = document.getElementById('new-item');
    const listContainer = document.getElementById('dynamic-list');

    if (btnAdd && inputAdd) {
        btnAdd.addEventListener('click', () => {
            if (inputAdd.value.trim() !== "") {
                const nuevoItem = document.createElement('li');
                nuevoItem.textContent = inputAdd.value;
                listContainer.appendChild(nuevoItem);
                inputAdd.value = ""; 
            }
        });
    }

    // 5. CONFIRMAR SALIDA A ENLACES EXTERNOS
    const linksExternos = document.querySelectorAll('a[target="_blank"]');
    linksExternos.forEach(link => {
        link.addEventListener('click', (evento) => {
            const respuesta = confirm("¿Estás seguro de que deseas salir de Inkwell Isle hacia un sitio externo?");
            if (!respuesta) {
                evento.preventDefault();
            }
        });
    });

   
    const opcionesQuiz = document.querySelectorAll('.quiz-check');
    const contadorQuiz = document.getElementById('quiz-counter');

    if (opcionesQuiz.length > 0) {
        opcionesQuiz.forEach(opcion => {
            opcion.addEventListener('change', () => {
                const seleccionadas = document.querySelectorAll('.quiz-check:checked').length;
                contadorQuiz.textContent = seleccionadas;
            });
        });
    }

    // 7. BOTÓN VOLVER ARRIBA
    const btnArriba = document.getElementById('btn-top');

    // Agregamos esta condición para evitar errores en páginas donde no exista el botón
    if (btnArriba) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btnArriba.style.display = "block";
        } else {
            btnArriba.style.display = "none";
        }
    });
}

    if (btnArriba) {
        btnArriba.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

let slideIndex = 0;
function carruselAnimado() {
    const imagenes = document.getElementsByClassName("slide");
    if (imagenes.length > 0) {
        for (let i = 0; i < imagenes.length; i++) {
            imagenes[i].style.display = "none";
        }
        slideIndex++;
        if (slideIndex > imagenes.length) slideIndex = 1;
        imagenes[slideIndex - 1].style.display = "block";
        setTimeout(carruselAnimado, 3000);
    }
}
carruselAnimado();