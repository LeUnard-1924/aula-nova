
"use strict";

// ========================================
// 1. RULETA DE ORIENTACIÓN ACADÉMICA
// ========================================

const canvas = document.getElementById("ruletaCanvas");
const ctx = canvas.getContext("2d");

const opciones = [
    {
        nombre: "Software e IA",
        programa: "Software e Inteligencia Artificial",
        color: "#2878B5"
    },
    {
        nombre: "Diseño digital",
        programa: "Diseño Digital",
        color: "#8B5CC7"
    },
    {
        nombre: "Administración",
        programa: "Administración de Empresas",
        color: "#238B78"
    },
    {
        nombre: "Marketing digital",
        programa: "Marketing Digital",
        color: "#D17B36"
    },
    {
        nombre: "Redes y seguridad",
        programa: "Redes y Ciberseguridad",
        color: "#B84B63"
    },
    {
        nombre: "Gestión de proyectos",
        programa: "Gestión de Proyectos",
        color: "#6275CF"
    }
];

const botonGirar = document.getElementById("girarRuleta");
const resultadoRuleta = document.getElementById("resultadoRuleta");
const botonUsarResultado = document.getElementById("usarResultado");
const selectorPrograma = document.getElementById("programa");

const radio = canvas.width / 2;
const anguloSector = (Math.PI * 2) / opciones.length;

let rotacionActual = 0;
let girando = false;
let opcionSeleccionada = null;

// Normaliza un ángulo al rango 0 - 2π.
function normalizarAngulo(angulo) {
    const vuelta = Math.PI * 2;
    return ((angulo % vuelta) + vuelta) % vuelta;
}

// Dibuja la ruleta completa.
function dibujarRuleta() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    opciones.forEach((opcion, indice) => {
        const inicio = rotacionActual +
            indice * anguloSector - Math.PI / 2;
        const fin = inicio + anguloSector;

        // Dibujar el sector.
        ctx.beginPath();
        ctx.moveTo(radio, radio);
        ctx.arc(radio, radio, radio - 8, inicio, fin);
        ctx.closePath();

        ctx.fillStyle = opcion.color;
        ctx.fill();

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Dibujar el nombre de cada área.
        const medio = inicio + anguloSector / 2;
        const distanciaTexto = radio * 0.63;

        ctx.save();
        ctx.translate(
            radio + Math.cos(medio) * distanciaTexto,
            radio + Math.sin(medio) * distanciaTexto
        );

        ctx.rotate(medio + Math.PI / 2);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 13px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(opcion.nombre, 0, 0, 115);
        ctx.restore();
    });

    // Centro de la ruleta.
    ctx.beginPath();
    ctx.arc(radio, radio, 35, 0, Math.PI * 2);
    ctx.fillStyle = "#0b1020";
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = "#42d6c4";
    ctx.font = "bold 13px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("AULA", radio, radio - 7);
    ctx.fillText("NOVA", radio, radio + 9);
}

// Determina qué sector quedó bajo el puntero superior.
function obtenerOpcionSeleccionada() {
    const anguloPuntero = normalizarAngulo(-rotacionActual);
    const indice = Math.floor(anguloPuntero / anguloSector);

    return opciones[indice];
}

// Gira la ruleta con una animación.
function girarRuleta() {
    if (girando) return;

    girando = true;
    botonGirar.disabled = true;
    botonUsarResultado.hidden = true;

    resultadoRuleta.textContent = "La ruleta está girando...";
    opcionSeleccionada = null;

    // Entre 5 y 8 vueltas completas, más un ángulo aleatorio.
    const vueltas = 5 + Math.floor(Math.random() * 4);
    const desplazamiento =
        vueltas * Math.PI * 2 + Math.random() * Math.PI * 2;

    const inicioRotacion = rotacionActual;
    const destino = inicioRotacion + desplazamiento;
    const duracion = 4500;
    const tiempoInicio = performance.now();

    function animar(tiempoActual) {
        const progreso = Math.min(
            (tiempoActual - tiempoInicio) / duracion, 1
        );

        // Desaceleración progresiva.
        const suavizado = 1 - Math.pow(1 - progreso, 4);

        rotacionActual =
            inicioRotacion + desplazamiento * suavizado;

        dibujarRuleta();

        if (progreso < 1) {
            requestAnimationFrame(animar);
        } else {
            rotacionActual = normalizarAngulo(destino);
            dibujarRuleta();

            opcionSeleccionada = obtenerOpcionSeleccionada();

            resultadoRuleta.textContent =
                "Tu resultado es: " + opcionSeleccionada.programa + ".";

            botonUsarResultado.hidden = false;
            botonGirar.disabled = false;
            girando = false;
        }
    }

    requestAnimationFrame(animar);
}

// Lleva el resultado de la ruleta al formulario.
function usarResultado() {
    if (!opcionSeleccionada) return;

    selectorPrograma.value = opcionSeleccionada.programa;

    document.getElementById("registro").scrollIntoView({
        behavior: "smooth"
    });

    selectorPrograma.focus();
}

botonGirar.addEventListener("click", girarRuleta);
botonUsarResultado.addEventListener("click", usarResultado);

// Dibujar la ruleta al abrir la página.
dibujarRuleta();


// ========================================
// 2. SELECCIÓN DESDE LAS TARJETAS
// ========================================

const botonesPrograma = document.querySelectorAll(".elegir-programa");

botonesPrograma.forEach((boton) => {
    boton.addEventListener("click", () => {
        selectorPrograma.value = boton.dataset.programa;

        document.getElementById("registro").scrollIntoView({
            behavior: "smooth"
        });

        selectorPrograma.focus();
    });
});


// ========================================
// 3. VALIDACIÓN DEL FORMULARIO
// ========================================

const formulario = document.getElementById("formularioRegistro");
const mensajeFormulario = document.getElementById("mensajeFormulario");

formulario.addEventListener("submit", (evento) => {
    // Evita el envío real a un servidor.
    evento.preventDefault();

    mensajeFormulario.textContent = "";
    mensajeFormulario.className = "mensaje";

    // Validaciones de los campos HTML.
    if (!formulario.checkValidity()) {
        formulario.reportValidity();

        mensajeFormulario.textContent =
            "Revisa los campos e ingresa información válida.";
        mensajeFormulario.classList.add("error");

        return;
    }

    const datos = {
        nombres: document.getElementById("nombres").value.trim(),
        correo: document.getElementById("correo").value.trim(),
        telefono: document.getElementById("telefono").value.trim(),
        programa: selectorPrograma.value
    };

    // Comprobar que los datos de texto no estén vacíos.
    if (
        datos.nombres.length < 3 ||
        datos.correo === "" ||
        datos.telefono === "" ||
        datos.programa === ""
    ) {
        mensajeFormulario.textContent =
            "Completa todos los campos correctamente.";
        mensajeFormulario.classList.add("error");

        return;
    }

    // Simulación educativa: no se envían ni guardan los datos.
    mensajeFormulario.textContent =
        "¡Registro de prueba completado! Tu interés en " +
        datos.programa +
        " ha sido seleccionado correctamente. Los datos no se han guardado.";

    mensajeFormulario.classList.add("exito");

    // Limpiar el formulario después de mostrar la confirmación.
    formulario.reset();
});
