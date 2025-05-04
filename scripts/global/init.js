import { loadComponent, initActiveNavLink } from './components.js';
import { initObserver } from './observer.js';
import { initHome } from '../home.js';
import { initJobs } from '../jobs.js';
import { initJobDetail } from '../job-detail.js';
import { initPostJob } from '../post-job.js';

// Map page-specific initialization functions
const pageInits = {
  'index.html': initHome,
  'jobs.html': initJobs,
  'job-detail.html': initJobDetail,
  'post-job.html': initPostJob
};

// Main initialization function
async function initializeSite() {
  await Promise.all([
    loadComponent('header', 'components/header.html'),
    loadComponent('footer', 'components/footer.html')
  ]);

  initActiveNavLink();
  initObserver((el) => {});

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const initPage = pageInits[currentPage];
  if (initPage) initPage();
}

document.addEventListener('DOMContentLoaded', initializeSite);

export { initializeSite };