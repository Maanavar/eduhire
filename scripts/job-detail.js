import { showNotification } from './global/utils.js';
import { jobs } from './global/data.js';

// Fallback job data for debugging
const fallbackJobs = [
  {
    id: 1,
    title: "Physics Lecturer",
    institution: "IIT Madras",
    location: "Coimbatore",
    salary: "60000",
    type: "Part-Time",
    description: "Conduct undergrad physics lectures. PhD preferred."
  }
];

export function initJobDetail() {
  const cleanupFunctions = [];

  // Ensure DOM is fully loaded
  console.log('initJobDetail: Script started');

  // Get job ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get('id');
  console.log('initJobDetail: Job ID from URL:', jobId);

  if (!jobId) {
    showNotification('No job ID provided.', 'error');
    console.error('initJobDetail: No job ID provided');
    return () => cleanupFunctions.forEach(fn => fn());
  }

  // Load job details
  const jobDetailsContainer = document.getElementById('job-details');
  const breadcrumbTitle = document.getElementById('job-title-breadcrumb');
  const relatedJobsGrid = document.getElementById('relatedJobsGrid');
  const iframe = document.querySelector('.google-form-iframe');

  console.log('initJobDetail: jobDetailsContainer:', jobDetailsContainer);
  console.log('initJobDetail: breadcrumbTitle:', breadcrumbTitle);
  console.log('initJobDetail: relatedJobsGrid:', relatedJobsGrid);
  console.log('initJobDetail: iframe:', iframe);

  if (!jobDetailsContainer || !breadcrumbTitle || !relatedJobsGrid) {
    showNotification('Required elements not found.', 'error');
    console.error('initJobDetail: Required elements not found');
    return () => cleanupFunctions.forEach(fn => fn());
  }

  try {
    // Use imported jobs, fallback to local data if empty
    const availableJobs = jobs && jobs.length > 0 ? jobs : fallbackJobs;
    console.log('initJobDetail: Available jobs:', availableJobs);

    // Convert jobId to number and find job
    const jobIdNum = parseInt(jobId, 10);
    console.log('initJobDetail: Job ID (parsed):', jobIdNum);

    const job = availableJobs.find(j => j.id === jobIdNum);
    console.log('initJobDetail: Found job:', job);

    if (!job) {
      throw new Error(`Job with ID ${jobId} not found`);
    }

    // Populate job details
    jobDetailsContainer.innerHTML = `
      <h2>${job.title}</h2>
      <p><strong>Job ID:</strong> ${job.id}</p>
      <p><strong>Institution:</strong> ${job.institution}</p>
      <p><strong>Location:</strong> ${job.location}</p>
      <p><strong>Salary:</strong> ${job.salary}/month</p>
      <p><strong>Job Type:</strong> ${job.type}</p>
      <p><strong>Description:</strong> ${job.description}</p>
    `;
    console.log('initJobDetail: Job details populated');

    breadcrumbTitle.textContent = job.title;
    console.log('initJobDetail: Breadcrumb updated');

    // Load related jobs
    const relatedJobs = availableJobs.filter(j => j.id !== jobIdNum).slice(0, 3);
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
          <span class="salary">${job.salary}/month</span>
          <a href="job-detail.html?id=${job.id}" class="btn btn-primary">Apply Now</a>
        </div>
      </div>
    `).join('') : '<p>No related jobs found.</p>';
    console.log('initJobDetail: Related jobs populated');

    // Handle iframe load and errors
    if (iframe) {
      iframe.addEventListener('load', () => {
        console.log('Google Form loaded successfully');
        gtag('event', 'form_load', { event_category: 'Job Application', event_label: 'Google Form' });
        adjustIframeHeight();
        try {
          const iframeDoc = iframe.contentWindow.document;
          if (iframeDoc) {
            iframeDoc.body.style.overflow = 'auto';
            iframeDoc.documentElement.style.overflow = 'auto';
          }
        } catch (e) {
          console.warn('Cannot modify iframe content due to cross-origin restrictions:', e);
        }
      });
      iframe.addEventListener('error', () => {
        showNotification(
          'Failed to load the application form. Please try again or contact support.',
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

      // Handle form submission feedback
      window.addEventListener('message', (event) => {
        if (event.origin.includes('docs.google.com')) {
          if (event.data.submitted) {
            showNotification('Application submitted successfully!', 'success');
          }
          if (event.data.height) {
            iframe.style.height = `${event.data.height}px`;
          }
        }
      });
    }

  } catch (error) {
    jobDetailsContainer.innerHTML = '<p class="error">Failed to load job details. Please try again later.</p>';
    showNotification('Failed to load job details.', 'error');
    console.error('Error loading job details:', error.message, error.stack);
  }

  // Dynamic iframe height adjustment
  function adjustIframeHeight() {
    if (!iframe) return;
    const minHeight =
      window.innerWidth < 576 ? 2100 :
      window.innerWidth < 768 ? 1900 :
      window.innerWidth < 992 ? 1700 :
      window.innerWidth < 1200 ? 1500 : 1300;
    iframe.style.height = `${minHeight}px`;
    iframe.setAttribute('scrolling', 'yes');
  }

  // Initialize particles animation
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

  initParticles();

  window.addEventListener('load', adjustIframeHeight);
  window.addEventListener('resize', adjustIframeHeight);
  cleanupFunctions.push(() => window.removeEventListener('resize', adjustIframeHeight));

  return () => cleanupFunctions.forEach(fn => fn());
}