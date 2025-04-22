import { validateForm, initStateDistrictDropdowns, showNotification } from './global/utils.js';
import { stateDistricts } from './global/data.js';

export function initPostJob() {
  const cleanupFunctions = [];

  // Initialize form validation
  const form = document.getElementById('post-job-form');
  if (form) {
    cleanupFunctions.push(
      validateForm(form, {
        successMessage: 'Job posted successfully! It will be reviewed soon.',
        errorMessage: 'Failed to post job. Please try again.'
      })
    );
    
    // Custom validation for multiple select (gradeLevel)
    const gradeLevelSelect = document.getElementById('gradeLevel');
    if (gradeLevelSelect) {
      const handleGradeLevelChange = () => {
        const selectedOptions = Array.from(gradeLevelSelect.selectedOptions).map(option => option.value);
        if (selectedOptions.length === 0 || selectedOptions.includes('')) {
          gradeLevelSelect.classList.add('is-invalid');
          gradeLevelSelect.nextElementSibling.textContent = 'Please select at least one grade level';
        } else {
          gradeLevelSelect.classList.remove('is-invalid');
        }
      };
      gradeLevelSelect.addEventListener('change', handleGradeLevelChange);
      cleanupFunctions.push(() => gradeLevelSelect.removeEventListener('change', handleGradeLevelChange));
    }

    // Custom validation for state and district
    const stateSelect = document.getElementById('state');
    const districtSelect = document.getElementById('district');
    if (stateSelect && districtSelect) {
      const handleStateChange = () => {
        if (!stateSelect.value) {
          stateSelect.classList.add('is-invalid');
          stateSelect.nextElementSibling.textContent = 'Please select a state';
        } else {
          stateSelect.classList.remove('is-invalid');
        }
      };
      const handleDistrictChange = () => {
        if (!districtSelect.value) {
          districtSelect.classList.add('is-invalid');
          districtSelect.nextElementSibling.textContent = 'Please select a district';
        } else {
          districtSelect.classList.remove('is-invalid');
        }
      };
      stateSelect.addEventListener('change', handleStateChange);
      districtSelect.addEventListener('change', handleDistrictChange);
      cleanupFunctions.push(() => stateSelect.removeEventListener('change', handleStateChange));
      cleanupFunctions.push(() => districtSelect.removeEventListener('change', handleDistrictChange));
    }
  }
  
  // Initialize state/district dropdowns with error handling
  if (!stateDistricts || Object.keys(stateDistricts).length === 0) {
    console.error('stateDistricts data is empty or undefined');
    showNotification('Failed to load state/district data. Please try again.', 'error');
  } else {
    cleanupFunctions.push(initStateDistrictDropdowns('state', 'district', stateDistricts));
  }
  
  // Initialize particles animation
  initParticles();

  return () => cleanupFunctions.forEach(fn => fn());
}

// Particles Animation - Consistent with job-detail.js
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
      
      // Wrap around edges
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

  // Handle window resize
  const handleResize = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };
  window.addEventListener('resize', handleResize);
  cleanupFunctions.push(() => window.removeEventListener('resize', handleResize));
}