import { jobs, stateDistricts } from './global/data.js';
import { validateForm, initStateDistrictDropdowns, formatINR, handleError } from './global/utils.js';

export function initJobDetail() {
  const cleanupFunctions = [];

  // Populate job details
  const urlParams = new URLSearchParams(window.location.search);
  const jobId = parseInt(urlParams.get('id'));
  const job = jobs.find(j => j.id === jobId);

  const jobDetails = document.getElementById('job-details');
  const jobTitleBreadcrumb = document.getElementById('job-title-breadcrumb');
  if (job) {
    jobDetails.innerHTML = `
      <h2>${job.title}</h2>
      <div class="job-meta">
        <span><i class="fas fa-building"></i> ${job.institution}</span>
        <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
        <span><i class="fas fa-clock"></i> ${job.type}</span>
      </div>
      <p>${job.description}</p>
      <div class="salary">${formatINR(parseInt(job.salary))}/month</div>
    `;
    jobTitleBreadcrumb.textContent = job.title;
  } else {
    handleError(new Error('Job not found'), 'loading job details', jobDetails);
    jobDetails.innerHTML = '<p class="no-job">Job not found.</p>';
    jobTitleBreadcrumb.textContent = 'Job Not Found';
  }

  // Populate related jobs
  const relatedJobsGrid = document.getElementById('relatedJobsGrid');
  if (relatedJobsGrid) {
    const relatedJobs = jobs
      .filter(j => j.id !== jobId && (!job || j.type === job.type))
      .slice(0, 3);
    if (relatedJobs.length > 0) {
      relatedJobsGrid.innerHTML = relatedJobs.map(job => `
        <div class="job-card" data-aos="fade-up">
          <h3>${job.title}</h3>
          <div class="job-meta">
            <span><i class="fas fa-building"></i> ${job.institution}</span>
            <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
            <span><i class="fas fa-clock"></i> ${job.type}</span>
          </div>
          <p>${job.description}</p>
          <div class="salary">${formatINR(parseInt(job.salary))}/month</div>
          <a href="job-detail.html?id=${job.id}" class="btn btn-primary">Apply Now</a>
        </div>
      `).join('');
    } else {
      relatedJobsGrid.innerHTML = '<p class="no-jobs">No related jobs available.</p>';
    }
  }

  // Initialize state/district dropdowns
  cleanupFunctions.push(initStateDistrictDropdowns('state', 'district', stateDistricts));

  // Initialize form validation
  const form = document.getElementById('job-application');
  if (form) {
    cleanupFunctions.push(
      validateForm(form, {
        successMessage: 'Application submitted successfully! You will hear from us soon.',
        errorMessage: 'Failed to submit application. Please try again.'
      })
    );
  }

  return () => cleanupFunctions.forEach(fn => fn());
}