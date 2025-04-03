import { jobs } from './global/data.js';

export function initJobs() {
  const jobListings = document.getElementById('job-listings');
  if (jobListings) {
    if (jobs && jobs.length > 0) {
      jobListings.innerHTML = jobs.map((job, index) => `
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
            <span class="salary">₹${job.salary}/month</span>
            <a href="job-detail.html?id=${job.id}" class="btn btn-primary">Apply Now</a>
          </div>
        </div>
      `).join('');
    } else {
      jobListings.innerHTML = '<p class="no-jobs">No jobs available at the moment.</p>';
    }
  }
}


