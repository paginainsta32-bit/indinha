/* ==========================================================================
   ÁREA DE EDIÇÃO FÁCIL - ALTERE OS DADOS DO SEU CASAL AQUI
   ========================================================================== */
const CONFIG = {
    nomesCasal: "Indinha & Matheus",                  // Nome dos dois
    dataInicio: "2012-07-14 20:30:00",           // Formato exato: AAAA-MM-DD HH:MM:SS
    totalFotos: 12,                               // Quantidade de fotos na pasta /imag
    tituloCarta: "Para o amor da minha vida",    // Título dentro da cartinha inicial
    resumoCarta: "Clique aqui, preparei uma surpresa para você... ❤️", 
    
    // ===== CONFIGURAÇÃO DE MÚSICA DO YOUTUBE =====
    nomeMusica: "Vanessa Da Mata - Ainda Bem", // Nome que aparecerá no player
    youtubeId: "h9-LLQqAOXQ",                     // ID do vídeo (letras/números após o v= no link)
    // =============================================

    // Texto romântico principal da página
    textoApaixonante: "Cada momento ao seu lado transforma minha vida em algo completamente mágico. Olhar para trás e ver tudo o que já construímos me dá a certeza de que fomos feitos um para o outro. Obrigado(a) por ser meu porto seguro, meu sorriso diário e minha melhor escolha todos os dias. Que o nosso 'para sempre' continue sendo escrito com todo o carinho e cumplicidade do mundo. Te amo infinitamente!"
};

/* ==========================================================================
   INICIALIZAÇÃO E MONTAGEM DO CONTEÚDO
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    // Injetar dados da CONFIG no HTML
    document.getElementById("card-title").innerText = CONFIG.tituloCarta;
    document.getElementById("card-short-text").innerText = CONFIG.resumoCarta;
    document.getElementById("couple-names").innerText = CONFIG.nomesCasal;
    document.getElementById("main-love-text").innerText = CONFIG.textoApaixonante;

    gerarEstruturaImagens();
    initSlider();
    initCoraçõesFundo();
    setInterval(atualizarContador, 1); // Atualiza em tempo real de alta precisão
    initScrollReveal();
});

/* ==========================================================================
   GERADOR DINÂMICO DE IMAGENS (SLIDER E GALERIA HORIZONTAL)
   ========================================================================== */
function gerarEstruturaImagens() {
    const mainSlider = document.getElementById("main-slider");
    const sliderDots = document.getElementById("slider-dots");
    const horizontalGallery = document.getElementById("horizontal-gallery");

    for (let i = 1; i <= CONFIG.totalFotos; i++) {
        const caminhoImagem = `./imag/foto${i}.jpg`;

        // 1. Montar Slider Superior
        const slideItem = document.createElement("div");
        slideItem.className = `slide-item ${i === 1 ? 'active' : ''}`;
        slideItem.innerHTML = `<img src="${caminhoImagem}" alt="Foto ${i} do casal">`;
        mainSlider.appendChild(slideItem);

        // 2. Montar Indicadores (Bolinhas)
        const dot = document.createElement("div");
        dot.className = `dot ${i === 1 ? 'active' : ''}`;
        dot.setAttribute("onclick", `goToSlide(${i - 1})`);
        sliderDots.appendChild(dot);

        // 3. Montar Galeria Horizontal Inferior
        const galleryItem = document.createElement("div");
        galleryItem.className = "gallery-item";
        galleryItem.innerHTML = `<img src="${caminhoImagem}" alt="Momento ${i}">`;
        horizontalGallery.appendChild(galleryItem);
    }
}

/* ==========================================================================
   ANIMAÇÃO DE ABERTURA DA CARTA E AUDIO AUTO-PLAY
   ========================================================================== */
function openEnvelope() {
    const wrapper = document.querySelector('.envelope-wrapper');
    wrapper.classList.add('open');

    // Transição cinematográfica após a abertura
    setTimeout(() => {
        const welcomeScreen = document.getElementById('welcome-screen');
        const mainContent = document.getElementById('main-content');
        
        welcomeScreen.classList.add('fade-out');
        mainContent.classList.remove('hidden');
        
        window.dispatchEvent(new Event('resize'));

        // Dispara o som automaticamente aproveitando o clique de abrir a carta
        if(playerYT && typeof playerYT.playVideo === 'function' && !musicaTocando) {
            toggleMúsica();
        }
    }, 1200);
}

/* ==========================================================================
   LÓGICA DO SLIDER AUTOMÁTICO
   ========================================================================== */
let currentSlide = 0;
let sliderInterval;

function initSlider() {
    sliderInterval = setInterval(() => moveSlide(1), 4000);
}

function showSlide(index) {
    const slides = document.querySelectorAll('.slide-item');
    const dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0) return;

    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;

    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function moveSlide(direction) {
    clearInterval(sliderInterval);
    showSlide(currentSlide + direction);
    sliderInterval = setInterval(() => moveSlide(1), 4000);
}

function goToSlide(index) {
    clearInterval(sliderInterval);
    showSlide(index);
    sliderInterval = setInterval(() => moveSlide(1), 4000);
}

/* ==========================================================================
   CONTADOR DE TEMPO EM REAL-TIME (PRECISÃO ABSOLUTA)
   ========================================================================== */
function atualizarContador() {
    const dataPassada = new Date(CONFIG.dataInicio);
    const dataAtual = new Date();
    
    let diferencaMs = dataAtual - dataPassada;
    if (diferencaMs < 0) diferencaMs = 0;

    let anos = dataAtual.getFullYear() - dataPassada.getFullYear();
    let meses = dataAtual.getMonth() - dataPassada.getMonth();
    let dias = dataAtual.getDate() - dataPassada.getDate();

    if (dias < 0) {
        meses--;
        const copiaData = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 0);
        dias += copiaData.getDate();
    }
    if (meses < 0) {
        anos--;
        meses += 12;
    }

    const horas = dataAtual.getHours() - dataPassada.getHours();
    const minutos = dataAtual.getMinutes() - dataPassada.getMinutes();
    const segundos = dataAtual.getSeconds() - dataPassada.getSeconds();
    const milisegundos = dataAtual.getMilliseconds();

    let hrsMod = horas;
    let minMod = minutos;
    let segMod = segundos;

    if (segMod < 0) { segMod += 60; minMod--; }
    if (minMod < 0) { minMod += 60; hrsMod--; }
    if (hrsMod < 0) { hrsMod += 24; }

    document.getElementById("years").innerText = String(anos).padStart(2, '0');
    document.getElementById("months").innerText = String(meses).padStart(2, '0');
    document.getElementById("days").innerText = String(dias).padStart(2, '0');
    document.getElementById("hours").innerText = String(hrsMod).padStart(2, '0');
    document.getElementById("minutes").innerText = String(minMod).padStart(2, '0');
    document.getElementById("seconds").innerText = String(segMod).padStart(2, '0');
    document.getElementById("milliseconds").innerText = String(milisegundos).padStart(3, '0');
}

/* ==========================================================================
   SISTEMA DE PARTÍCULAS (CORAÇÕES CAINDO DE FORMA LEVE)
   ========================================================================== */
function initCoraçõesFundo() {
    const canvas = document.getElementById("heartCanvas");
    const ctx = canvas.getContext("2d");
    let arrCorações = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class Coração {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height;
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -20;
            this.tamanho = Math.random() * 8 + 6;
            this.velocidadeY = Math.random() * 1 + 0.5;
            this.oscilação = Math.random() * 0.02;
            this.velocidadeOscilação = Math.random() * 2;
            this.opacidade = Math.random() * 0.4 + 0.3;
        }
        update() {
            this.y += this.velocidadeY;
            this.velocidadeOscilação += this.oscilação;
            this.x += Math.sin(this.velocidadeOscilação) * 0.4;
            if (this.y > canvas.height + 20) this.reset();
        }
        draw() {
            ctx.fillStyle = `rgba(255, 42, 75, ${this.opacidade})`;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + this.tamanho / 4);
            ctx.bezierCurveTo(this.x - this.tamanho/2, this.y - this.tamanho/2, this.x - this.tamanho, this.y - this.tamanho/3, this.x - this.tamanho, this.y + this.tamanho/3);
            ctx.bezierCurveTo(this.x - this.tamanho, this.y + this.tamanho, this.x, this.y + this.tamanho * 1.4, this.x, this.y + this.tamanho * 1.5);
            ctx.bezierCurveTo(this.x, this.y + this.tamanho * 1.4, this.x + this.tamanho, this.y + this.tamanho, this.x + this.tamanho, this.y + this.tamanho/3);
            ctx.bezierCurveTo(this.x + this.tamanho, this.y - this.tamanho/3, this.x + this.tamanho/2, this.y - this.tamanho/2, this.x, this.y + this.tamanho/4);
            ctx.closePath();
            ctx.fill();
        }
    }

    const maxParticulas = window.innerWidth < 600 ? 25 : 60;
    for (let i = 0; i < maxParticulas; i++) arrCorações.push(new Coração());

    function animar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        arrCorações.forEach(coração => {
            coração.update();
            coração.draw();
        });
        requestAnimationFrame(animar);
    }
    animar();
}

/* ==========================================================================
   SCROLL REVEAL (SURGIMENTO DOS ELEMENTOS AO ROLAR)
   ========================================================================== */
function initScrollReveal() {
    const elementosParaRevelar = document.querySelectorAll('.scroll-reveal');
    const verificarScroll = () => {
        const gatilhoAtivacao = window.innerHeight * 0.85;
        elementosParaRevelar.forEach(el => {
            const topoElemento = el.getBoundingClientRect().top;
            if (topoElemento < gatilhoAtivacao) el.classList.add('active');
        });
    };
    window.addEventListener('scroll', verificarScroll);
    setTimeout(verificarScroll, 200);
}

/* ==========================================================================
   INTERAÇÃO DE ARRASTAR A GALERIA HORIZONTAL
   ========================================================================== */
const sliderGaleria = document.getElementById('horizontal-gallery');
let isDown = false;
let startX;
let scrollLeft;

sliderGaleria.addEventListener('mousedown', (e) => {
    isDown = true;
    sliderGaleria.style.cursor = 'grabbing';
    startX = e.pageX - sliderGaleria.offsetLeft;
    scrollLeft = sliderGaleria.scrollLeft;
});
sliderGaleria.addEventListener('mouseleave', () => {
    isDown = false;
    sliderGaleria.style.cursor = 'grab';
});
sliderGaleria.addEventListener('mouseup', () => {
    isDown = false;
    sliderGaleria.style.cursor = 'grab';
});
sliderGaleria.addEventListener('mousemove', (e) => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - sliderGaleria.offsetLeft;
    const walk = (x - startX) * 2;
    sliderGaleria.scrollLeft = scrollLeft - walk;
});

/* ==========================================================================
   CONTROLE DO PLAYER DE ÁUDIO INTEGRADO AO YOUTUBE
   ========================================================================== */
let playerYT;
let musicaTocando = false;

function onYouTubeIframeAPIReady() {
    playerYT = new YT.Player('youtube-audio-player', {
        videoId: CONFIG.youtubeId,
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'loop': 1,
            'playlist': CONFIG.youtubeId,
            'modestbranding': 1,
            'rel': 0
        },
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    document.getElementById("music-title").innerText = CONFIG.nomeMusica;
}

function toggleMúsica() {
    if (!playerYT || typeof playerYT.playVideo !== 'function') return;
    const btn = document.getElementById("play-pause-btn");

    if (!musicaTocando) {
        playerYT.playVideo();
        btn.innerText = "⏸";
        btn.classList.add("pausado");
        musicaTocando = true;
    } else {
        playerYT.pauseVideo();
        btn.innerText = "▶";
        btn.classList.remove("pausado");
        musicaTocando = false;
    }
}
