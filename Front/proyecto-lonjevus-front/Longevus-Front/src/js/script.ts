import { data } from '../data/data';
import type { Slide } from '../data/data';


// Obtener los elementos del DOM
const slideContainer = document.getElementById('slide-container') as HTMLElement;
const dotsContainer = document.getElementById('dots') as HTMLElement;
const scrollToTopBtn = document.getElementById('scrollToTop') as HTMLButtonElement;

let slideIndex = 0;

// Crear las imágenes dinámicamente
data.forEach((item: Slide) => {
  const img = document.createElement('img');
  img.src = item.imgUrl;
  img.alt = `Imagen ${item.id}`;
  img.className = 'slide';
  slideContainer.appendChild(img);
});

// Crear los puntos (dots)
data.forEach((_, index: number) => {
  const dot = document.createElement('span');
  dot.addEventListener('click', () => showSlide(index));
  dotsContainer.appendChild(dot);
});

const slides = document.querySelectorAll<HTMLImageElement>('.slide');
const dots = dotsContainer.querySelectorAll<HTMLSpanElement>('span');

// Mostrar una imagen según el índice
function showSlide(index: number): void {
  slideIndex = index;
  const offset = -index * 100;
  slideContainer.style.transform = `translateX(${offset}%)`;
  dots.forEach(dot => dot.classList.remove('active'));
  if (dots[index]) dots[index].classList.add('active');
}

// Cambiar de imagen automáticamente
function autoSlide(): void {
  slideIndex = (slideIndex + 1) % slides.length;
  showSlide(slideIndex);
}

showSlide(0);
setInterval(autoSlide, 5000);

// Mostrar el botón de scroll al hacer scroll
window.addEventListener('scroll', () => {
  if (window.pageYOffset > 200) {
    scrollToTopBtn.style.display = 'block';
  } else {
    scrollToTopBtn.style.display = 'none';
  }
});

// Volver al inicio de la página al hacer clic
scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

