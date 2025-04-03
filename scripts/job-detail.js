import { jobs, stateDistricts } from './global/data.js';
import { populateDropdown, validateForm } from './global/utils.js';

export function initJobDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const jobId = parseInt(urlParams.get('id'));
  const job = jobs.find(j => j.id === jobId);

  // Populate job details
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
      <div class="salary">₹${job.salary}/month</div>
    `;
    jobTitleBreadcrumb.textContent = job.title;
  } else {
    jobDetails.innerHTML = '<p class="no-job">Job not found.</p>';
    jobTitleBreadcrumb.textContent = 'Job Not Found';
  }

  // Populate state dropdown
  const stateSelect = document.getElementById('state');
  const districtSelect = document.getElementById('district');
  Object.keys(stateDistricts).forEach(state => {
    const option = document.createElement('option');
    option.value = state;
    option.textContent = state;
    stateSelect.appendChild(option);
  });

  // Update district dropdown based on state selection
  stateSelect.addEventListener('change', (e) => {
    const selectedState = e.target.value;
    districtSelect.innerHTML = '<option value="">Select District</option>';
    if (selectedState && stateDistricts[selectedState]) {
      stateDistricts[selectedState].forEach(district => {
        const option = document.createElement('option');
        option.value = district;
        option.textContent = district;
        districtSelect.appendChild(option);
      });
    }
  });

  // Form validation and submission
  const form = document.getElementById('job-application');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add('was-validated');
    } else {
      // Simulate form submission (replace with actual backend logic)
      const formData = new FormData(form);
      console.log('Application Submitted:', Object.fromEntries(formData));
      alert('Application submitted successfully!'); // Placeholder feedback
      form.reset();
      form.classList.remove('was-validated');
    }
  });
}


