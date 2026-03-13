// Variables de elementos del DOM
const sectionSeleccionarAtaque = document.getElementById('seleccionar-ataque')
const botonReiniciar = document.getElementById('boton-reiniciar')
const botonMascotaJugador = document.getElementById('boton-mascota')
const sectionReiniciar = document.getElementById('reiniciar')
const sectionSeleccionarMascota = document.getElementById('seleccionar-mascota')
const spanMascotaJugador = document.getElementById('mascota-jugador')
const spanMascotaEnemigo = document.getElementById('mascota-enemigo')
const spanVidasJugador = document.getElementById('vidas-jugador')
const spanVidasEnemigo = document.getElementById('vidas-enemigo')
const sectionMensajes = document.getElementById('resultado')
const ataquesDelJugador = document.getElementById('ataques-del-jugador')
const ataquesDelEnemigo = document.getElementById('ataques-del-enemigo')
const contenedorTarjetas = document.getElementById('contenedorTarjetas')
const contenedorAtaques = document.getElementById('contenedorAtaques')

// Estado del juego
let mokepones = []
let ataqueJugador = []
let ataqueEnemigo = []
let mascotaJugador
let ataquesMokeponEnemigo
let botones = []
let vidasJugador = 3
let vidasEnemigo = 3

// Mapa de fortalezas (Lógica de combate centralizada)
const FORTALEZAS = {
    'FUEGO': 'TIERRA',
    'AGUA': 'FUEGO',
    'TIERRA': 'AGUA'
}

class Mokepon {
    constructor(nombre, foto, vida) {
        this.nombre = nombre
        this.foto = foto
        this.vida = vida
        this.ataques = []
    }
}

// Inicialización de criaturas
let hipodoge = new Mokepon('Hipodoge', './imagenes/mokepons_mokepon_hipodoge_attack.png', 5)
let capipepo = new Mokepon('Capipepo', './imagenes/mokepons_mokepon_capipepo_attack.png', 5)
let ratigueya = new Mokepon('Ratigueya', './imagenes/mokepons_mokepon_ratigueya_attack.png', 5)

const ATAQUES_BASE = [
    { nombre: '💧', id: 'boton-agua', tipo: 'AGUA' },
    { nombre: '🔥', id: 'boton-fuego', tipo: 'FUEGO' },
    { nombre: '🌱', id: 'boton-tierra', tipo: 'TIERRA' }
]

// Asignación de ataques
hipodoge.ataques.push(ATAQUES_BASE[0], ATAQUES_BASE[0], ATAQUES_BASE[0], ATAQUES_BASE[1], ATAQUES_BASE[2])
capipepo.ataques.push(ATAQUES_BASE[2], ATAQUES_BASE[2], ATAQUES_BASE[2], ATAQUES_BASE[0], ATAQUES_BASE[1])
ratigueya.ataques.push(ATAQUES_BASE[1], ATAQUES_BASE[1], ATAQUES_BASE[1], ATAQUES_BASE[0], ATAQUES_BASE[2])

mokepones.push(hipodoge, capipepo, ratigueya)

function iniciarJuego() {
    // Ocultamos la sección de ataque al inicio
    sectionSeleccionarAtaque.style.display = 'none'
    sectionReiniciar.style.display = 'none'

    // Inyectamos las tarjetas de los mokepones en el HTML
    mokepones.forEach((mokepon) => {
        let opcionDeMokepones = `
        <input type="radio" name="mascota" id="${mokepon.nombre}">
        <label class="tarjeta-de-mokepon" for="${mokepon.nombre}">
            <p>${mokepon.nombre}</p>
            <img src="${mokepon.foto}" alt="${mokepon.nombre}">
        </label>
        `
        contenedorTarjetas.innerHTML += opcionDeMokepones
    })
    
    botonMascotaJugador.addEventListener('click', seleccionarMascotaJugador)
    botonReiniciar.addEventListener('click', reiniciarJuego)
}

function seleccionarMascotaJugador() {
    // Buscamos cuál input tipo radio está marcado
    const inputs = mokepones.map(m => document.getElementById(m.nombre))
    const seleccionado = inputs.find(input => input.checked)

    if (seleccionado) {
        spanMascotaJugador.innerHTML = seleccionado.id
        mascotaJugador = seleccionado.id
        
        sectionSeleccionarMascota.style.display = 'none'
        sectionSeleccionarAtaque.style.display = 'flex'
        
        extraerAtaques(mascotaJugador)
        seleccionarMascotaEnemigo()
    } else {
        alert('Por favor, selecciona una mascota para comenzar.')
    }
}

function extraerAtaques(nombreMascota) {
    let ataques = mokepones.find(m => m.nombre === nombreMascota).ataques
    mostrarAtaques(ataques)
}

function mostrarAtaques(ataques) {
    contenedorAtaques.innerHTML = '' // Limpiamos ataques previos
    ataques.forEach((ataque) => {
        let botonAtaque = `
            <button id="${ataque.id}" class="boton-ataque BAtaque" data-tipo="${ataque.tipo}">${ataque.nombre}</button>
        `
        contenedorAtaques.innerHTML += botonAtaque
    })

    botones = document.querySelectorAll('.BAtaque')
    secuenciaAtaque()
}

function seleccionarMascotaEnemigo() {
    let mascotaAleatoria = aleatorio(0, mokepones.length - 1)
    spanMascotaEnemigo.innerHTML = mokepones[mascotaAleatoria].nombre
    ataquesMokeponEnemigo = mokepones[mascotaAleatoria].ataques
}

function secuenciaAtaque() {
    botones.forEach((boton) => {
        boton.addEventListener('click', (e) => {
            // Usamos currentTarget para asegurarnos de capturar el botón aunque se haga click en el emoji
            let tipoAtaque = e.currentTarget.dataset.tipo
            ataqueJugador.push(tipoAtaque)
            
            e.currentTarget.style.background = '#112f58'
            e.currentTarget.disabled = true 
            
            ataqueAleatorioEnemigo()
        })
    })
}

function ataqueAleatorioEnemigo() {
    let indexAleatorio = aleatorio(0, ataquesMokeponEnemigo.length - 1)
    let tipoAtaqueEnemigo = ataquesMokeponEnemigo[indexAleatorio].tipo
    
    ataqueEnemigo.push(tipoAtaqueEnemigo)
    combate()
}

function combate() {
    let ultimoJugador = ataqueJugador[ataqueJugador.length - 1]
    let ultimoEnemigo = ataqueEnemigo[ataqueEnemigo.length - 1]
    let resultado

    if (ultimoJugador === ultimoEnemigo) {
        resultado = "EMPATE"
    } else if (FORTALEZAS[ultimoJugador] === ultimoEnemigo) {
        resultado = "GANASTE"
        vidasEnemigo--
        spanVidasEnemigo.innerHTML = vidasEnemigo
    } else {
        resultado = "PERDISTE"
        vidasJugador--
        spanVidasJugador.innerHTML = vidasJugador
    }

    crearMensaje(resultado, ultimoJugador, ultimoEnemigo)
    revisarVidas()
}

function revisarVidas() {
    if (vidasEnemigo === 0) {
        crearMensajeFinal("¡FELICITACIONES! Has ganado :)")
    } else if (vidasJugador === 0) {
        crearMensajeFinal('Lo siento, has perdido :(')
    }
}

function crearMensaje(resultado, ataqueJ, ataqueE) {
    let nuevoAtaqueDelJugador = document.createElement('p')
    let nuevoAtaqueDelEnemigo = document.createElement('p')

    sectionMensajes.innerHTML = resultado
    
    nuevoAtaqueDelJugador.innerHTML = ataqueJ
    nuevoAtaqueDelEnemigo.innerHTML = ataqueE

    ataquesDelJugador.appendChild(nuevoAtaqueDelJugador)
    ataquesDelEnemigo.appendChild(nuevoAtaqueDelEnemigo)
}

function crearMensajeFinal(resultadoFinal) {
    sectionMensajes.innerHTML = resultadoFinal
    botones.forEach(boton => boton.disabled = true)
    sectionReiniciar.style.display = 'block'
}

function reiniciarJuego() {
    location.reload()
}

function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

window.addEventListener('load', iniciarJuego)