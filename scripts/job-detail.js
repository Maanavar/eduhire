import { validateForm, initStateDistrictDropdowns, showNotification, formatINR } from './global/utils.js';
import { stateDistricts, jobs } from './global/data.js';

export function initJobDetail() {
  const cleanupFunctions = [];

  // Initialize form validation
  const form = document.getElementById('job-application');
  if (form) {
    cleanupFunctions.push(
      validateForm(form, {
        successMessage: 'Application submitted successfully!',
        errorMessage: 'Failed to submit application. Please try again.'
      })
    );
  }

  // Initialize state/district dropdowns
  cleanupFunctions.push(initStateDistrictDropdowns('state', 'district', stateDistricts));

  // Get job ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get('id');

  if (!jobId) {
    showNotification('No job ID provided.', 'error');
    return () => cleanupFunctions.forEach(fn => fn());
  }

  // Load job details
  const jobDetailsContainer = document.getElementById('job-details');
  const breadcrumbTitle = document.getElementById('job-title-breadcrumb');
  const relatedJobsGrid = document.getElementById('relatedJobsGrid');

  if (!jobDetailsContainer || !breadcrumbTitle || !relatedJobsGrid) {
    showNotification('Required elements not found.', 'error');
    return () => cleanupFunctions.forEach(fn => fn());
  }

  try {
    // Convert jobId to number and find job in static data
    const jobIdNum = parseInt(jobId, 10);
    const job = jobs.find(j => j.id === jobIdNum);
    if (!job) {
      throw new Error(`Job with ID ${jobId} not found`);
    }

    // Populate job details
    jobDetailsContainer.innerHTML = `
      <h2>${job.title}</h2>
      <p><strong>Institution:</strong> ${job.institution}</p>
      <p><strong>Location:</strong> ${job.location}</p>
      <p><strong>Salary:</strong> ${formatINR(job.salary)} per month</p>
      <p><strong>Job Type:</strong> ${job.type}</p>
      <p><strong>Description:</strong> ${job.description}</p>
    `;
    breadcrumbTitle.textContent = job.title;

    // Populate hidden inputs for job details
    const hiddenInputs = {
      jobTitle: job.title,
      company: job.institution,
      location: job.location,
      salary: formatINR(job.salary),
      jobType: job.type,
      description: job.description
    };

    Object.entries(hiddenInputs).forEach(([key, value]) => {
      const input = document.getElementById(`${key}Hidden`);
      if (input) {
        input.value = value || '';
      } else {
        console.warn(`Hidden input #${key}Hidden not found`);
      }
    });

    // Load related jobs (exclude current job by ID)
    const relatedJobs = jobs.filter(j => j.id !== jobIdNum).slice(0, 3);
    relatedJobsGrid.innerHTML = relatedJobs.length ? relatedJobs.map((job, index) => `
      <div class="job-card" data-aos="fade-up" data-aos-delay="${index * 100}">
        <div class="job-card-header">
          <h3 class="job-card-title">${job.title}</h3>
          <div class="job-card-meta">
            <span><i class="fas fa-building"></i> ${job.institution}</span>
            <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
          </div>
        </div>
        <div class="job-card-body">
          <p>${job.description.substring(0, 120)}...</p>
        </div>
        <div class="job-card-footer">
          <span class="salary">${formatINR(job.salary)}/month</span>
          <a href="job-detail.html?id=${job.id}" class="btn btn-primary">Apply Now</a>
        </div>
      </div>
    `).join('') : '<p>No related jobs found.</p>';

  } catch (error) {
    jobDetailsContainer.innerHTML = '<p class="error">Failed to load job details.</p>';
    showNotification('Failed to load job details.', 'error');
    console.error('Error loading job details:', error.message, error.stack);
  }

  // Initialize particles animation
  initParticles();

  return () => cleanupFunctions.forEach(fn => fn());
}

// Particles Animation
function initParticles() {
  const canvas = document.querySelector(".job-particles");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const particlesArray = [];
  const numberOfParticles = window.innerWidth < 768 ? 20 : 50;

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