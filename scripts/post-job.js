import { showNotification } from './global/utils.js';

export function initPostJob() {
  const cleanupFunctions = [];

  // Initialize particles animation
  initParticles();

  // Handle iframe load and errors
  const iframe = document.querySelector('.google-form-iframe');
  if (iframe) {
    iframe.addEventListener('load', () => {
      console.log('Google Form loaded successfully');
      gtag('event', 'form_load', { event_category: 'Post Job', event_label: 'Google Form' });
      adjustIframeHeight();
    });
    iframe.addEventListener('error', () => {
      showNotification(
        'Failed to load the job posting form. Please try again or contact support.',
        'error'
      );
      iframe.style.display = 'none';
      const errorMessage = document.createElement('div');
      errorMessage.className = 'form-error';
      errorMessage.innerHTML = `
        <p class="text-danger">Unable to load the form. Please <a href="mailto:support@eduhire.in">contact support</a>.</p>
      `;
      iframe.parentElement.appendChild(errorMessage);
    });

    // Handle form submission and height updates
    window.addEventListener('message', (event) => {
      if (event.origin.includes('docs.google.com')) {
        if (event.data.submitted) {
          showNotification('Job posted successfully!', 'success');
        }
        if (event.data.height) {
          iframe.style.height = `${event.data.height}px`;
        }
      }
    });
  }

  // Dynamic iframe height adjustment
  function adjustIframeHeight() {
    if (!iframe) return;
    const minHeight =
      window.innerWidth < 576 ? 1800 :
      window.innerWidth < 768 ? 1600 :
      window.innerWidth < 992 ? 1400 : 1200;
    iframe.style.height = `${minHeight}px`;
  }

  window.addEventListener('load', adjustIframeHeight);
  window.addEventListener('resize', adjustIframeHeight);
  cleanupFunctions.push(() => window.removeEventListener('resize', adjustIframeHeight));

  return () => cleanupFunctions.forEach(fn => fn());
}

// Particles Animation (unchanged)
function initParticles() {
  const canvas = document.querySelector(".job-particles");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const particlesArray = [];
  const numberOfParticles = window.innerWidth < 768 ? 20 : 30;

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 1 - 0.5;
      this.speedY = Math.random() * 1 - 0.5;
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }
    
    draw() {
      ctx.fillStyle = "rgba(107, 72, 255, 0.3)";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function init() {
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    requestAnimationFrame(animate);
  }

  init();
  animate();

  const handleResize = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };
  window.addEventListener('resize', handleResize);
  cleanupFunctions.push(() => window.removeEventListener('resize', handleResize));
}