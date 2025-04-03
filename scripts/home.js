import { jobs } from './global/data.js';

export function initHome() {
  // Initialize jobs grid
// Initialize Featured Jobs Grid
const jobsSection = document.getElementById('featured-jobs');
if (jobsSection) {
  const jobsGrid = document.getElementById('jobGrid');
  const featuredJobs = jobs.slice(0, 3); // Limit to 3 jobs

  if (featuredJobs.length > 0) {
    jobsGrid.innerHTML = featuredJobs.map((job, index) => `
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
    jobsGrid.innerHTML = '<p class="no-jobs">No featured jobs available.</p>';
  }
}

  // Initialize FAQ accordion
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const answer = question.nextElementSibling;
      const isOpen = question.classList.contains('active');

      // Close all other FAQs
      faqQuestions.forEach(q => {
        if (q !== question) {
          q.classList.remove('active');
          q.nextElementSibling.style.maxHeight = null;
        }
      });

      // Toggle current FAQ
      question.classList.toggle('active');
      answer.style.maxHeight = isOpen ? null : `${answer.scrollHeight}px`;
    });
  });

  // Initialize testimonials slider
  const testimonials = [
    {
      quote: "EduHire helped me find my perfect teaching position in just 2 weeks!",
      name: "Priya K.",
      role: "Math Teacher, Delhi",
      image: "assets/images/sarah.webp"
    },
    {
      quote: "The application process was so simple. I got 3 interview calls within a week!",
      name: "Rahul M.",
      role: "Science Teacher, Bangalore",
      image: "assets/images/sarah.webp"
    },
    {
      quote: "Finally a platform that understands the needs of Indian educators.",
      name: "Anjali S.",
      role: "English Teacher, Mumbai",
      image: "assets/images/sarah.webp"
    }
  ];

  const testimonialSlider = document.querySelector('.testimonial-slider');
  if (testimonialSlider) {
    testimonialSlider.innerHTML = `
      <div class="testimonial-container">
        ${testimonials.map((t, index) => `
          <div class="testimonial ${index === 0 ? 'active' : ''}">
            <div class="quote">${t.quote}</div>
            <div class="author">
              <img src="${t.image}" alt="${t.name}" loading="lazy">
              <div>
                <h4>${t.name}</h4>
                <p>${t.role}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="slider-controls">
        <button class="slider-arrow prev" aria-label="Previous testimonial">
          <i class="fas fa-chevron-left"></i>
        </button>
        <div class="slider-dots"></div>
        <button class="slider-arrow next" aria-label="Next testimonial">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    `;

    let currentIndex = 0;
    const items = testimonialSlider.querySelectorAll('.testimonial');
    const dotsContainer = testimonialSlider.querySelector('.slider-dots');
    let interval;
    
    // Create dots
    items.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('slider-dot');
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.addEventListener('click', () => goToTestimonial(i));
      dotsContainer.appendChild(dot);
    });

    const dots = testimonialSlider.querySelectorAll('.slider-dot');
    const prevBtn = testimonialSlider.querySelector('.prev');
    const nextBtn = testimonialSlider.querySelector('.next');

    function goToTestimonial(index) {
      currentIndex = index;
      updateTestimonial();
    }

    function updateTestimonial() {
      items.forEach((item, i) => {
        item.classList.toggle('active', i === currentIndex);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    function nextTestimonial() {
      currentIndex = (currentIndex + 1) % items.length;
      updateTestimonial();
    }

    function prevTestimonial() {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      updateTestimonial();
    }

    prevBtn.addEventListener('click', prevTestimonial);
    nextBtn.addEventListener('click', nextTestimonial);

    function startInterval() {
      interval = setInterval(nextTestimonial, 5000);
    }

    function stopInterval() {
      clearInterval(interval);
    }

    testimonialSlider.addEventListener('mouseenter', stopInterval);
    testimonialSlider.addEventListener('mouseleave', startInterval);

    startInterval();
  }

  const exploreSection = document.querySelector('.explore-opportunities');
  if (exploreSection) {
    const container = exploreSection.querySelector('.explore-carousel-container');
    const carousel = exploreSection.querySelector('.explore-carousel');
    const cards = Array.from(carousel.querySelectorAll('.explore-card'));
    const dotsContainer = exploreSection.querySelector('.carousel-dots');
    const prevBtn = exploreSection.querySelector('.prev');
    const nextBtn = exploreSection.querySelector('.next');
    const controls = exploreSection.querySelector('.carousel-controls');
  
    let slidesPerView = 1;
    let cardWidth = 0;
    let gap = 0;
    let currentIndex = 0;
    let isTouchDevice = false;
  
    // Detect touch device
    function detectTouch() {
      isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
      if (isTouchDevice) {
        container.style.overflowX = 'auto';
        carousel.style.transform = 'none';
      } else {
        container.style.overflowX = 'hidden';
      }
    }
  
    function initCarousel() {
      detectTouch();
      if (isTouchDevice) return; // Let native scrolling handle it
  
      gap = parseInt(getComputedStyle(carousel).gap) || 24;
      cardWidth = cards[0].offsetWidth;
      const containerWidth = container.offsetWidth;
      
      slidesPerView = Math.min(
        Math.floor((containerWidth + gap) / (cardWidth + gap)),
        5
      );
      
      updateDots();
      updateCarousel();
    }
  
    function updateDots() {
      dotsContainer.innerHTML = '';
      const dotCount = Math.ceil(cards.length / slidesPerView);
      
      for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (i === currentIndex) dot.classList.add('active');
        dot.addEventListener('click', () => goToIndex(i));
        dotsContainer.appendChild(dot);
      }
    }
  
    function updateCarousel() {
      const translateX = -currentIndex * slidesPerView * (cardWidth + gap);
      carousel.style.transform = `translateX(${translateX}px)`;
      
      dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }
  
    function goToIndex(index) {
      currentIndex = Math.max(0, Math.min(index, Math.ceil(cards.length / slidesPerView) - 1));
      updateCarousel();
    }
  
    function nextSlide() {
      goToIndex(currentIndex + 1);
    }
  
    function prevSlide() {
      goToIndex(currentIndex - 1);
    }
  
    // Event listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
  
    // Handle native scroll on touch devices
    if ('ontouchstart' in window) {
      container.addEventListener('scroll', () => {
        if (!isTouchDevice) return;
        
        const scrollPos = container.scrollLeft;
        const newIndex = Math.round(scrollPos / (cardWidth + gap));
        
        if (newIndex !== currentIndex) {
          currentIndex = newIndex;
          updateDots();
        }
      });
    }
  
    // Resize handler
    window.addEventListener('resize', () => {
      initCarousel();
    });
  
    // Initialize
    initCarousel();
  }

// Stats counter animation
function animateCounter(element, target) {
  let start = 0;
  const duration = 2000; // 2 seconds
  const increment = target / (duration / 16); // 60 FPS approximation
  const startTime = Date.now();

  function update() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.floor(progress * target);
    
    element.textContent = value.toLocaleString('en-IN');
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target.toLocaleString('en-IN');
    }
  }
  
  requestAnimationFrame(update);
}

const statsCluster = document.querySelector('.stats-cluster');
if (statsCluster) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statValues = statsCluster.querySelectorAll('.stat-value');
        statValues.forEach(value => {
          const target = parseInt(value.getAttribute('data-target'), 10);
          animateCounter(value, target);
        });

        // Entrance animation for stat orbs
        const statOrbs = statsCluster.querySelectorAll('.stat-orb');
        statOrbs.forEach((orb, index) => {
          orb.style.opacity = '0';
          orb.style.transform = 'translateY(20px)';
          setTimeout(() => {
            orb.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            orb.style.opacity = '1';
            orb.style.transform = 'translateY(0)';
          }, index * 200); // Staggered entrance
        });

        observer.unobserve(entry.target); // Stop observing after animation
      }
    });
  }, { threshold: 0.5 });

  observer.observe(statsCluster);
}

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Initialize Hero Particles
  initHeroParticles();
}

// Hero Particles Animation
function initHeroParticles() {
  const canvas = document.querySelector(".hero-particles");
  if (!canvas) return; // Exit if canvas isn’t found

  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particlesArray = [];
  const numberOfParticles = 50;

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 5 + 1;
      this.speedX = Math.random() * 1 - 0.5;
      this.speedY = Math.random() * 1 - 0.5;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.size > 0.2) this.size -= 0.05;
      // Wrap around edges
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }
    draw() {
      ctx.fillStyle = "rgba(107, 72, 255, 0.5)";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
      if (particlesArray[i].size <= 0.2) {
        particlesArray.splice(i, 1);
        i--;
        particlesArray.push(new Particle());
      }
    }
    requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();

  // Resize handler
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}