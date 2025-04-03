/**
 * Initializes an Intersection Observer for elements
 * @param {Function} callback - Callback when element is observed
 * @param {Object} options - Intersection Observer options
 */
export function initObserver(callback, options = { 
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
}) {
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target);
        if (!entry.target.hasAttribute('data-observe-persist')) {
          observer.unobserve(entry.target);
        }
      }
    });
  }, options);
  
  // Observe all elements with data-observe attribute
  document.querySelectorAll('[data-observe]').forEach(el => {
    observer.observe(el);
  });
  
  // Return observer instance for manual control
  return observer;
}

/**
 * Creates scroll-triggered animations using GSAP
 */
export function initScrollAnimations() {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate all elements with data-animate attribute
    gsap.utils.toArray('[data-animate]').forEach(element => {
      const animationType = element.getAttribute('data-animate') || 'fadeIn';
      const delay = element.getAttribute('data-delay') || 0;
      const duration = element.getAttribute('data-duration') || 0.8;
      
      let animation;
      switch(animationType) {
        case 'fadeIn':
          animation = gsap.from(element, { 
            opacity: 0, 
            y: 30, 
            duration, 
            delay: parseFloat(delay),
            ease: 'power2.out'
          });
          break;
        case 'slideInLeft':
          animation = gsap.from(element, { 
            x: -100, 
            opacity: 0, 
            duration, 
            delay: parseFloat(delay),
            ease: 'back.out(1)'
          });
          break;
        case 'scaleIn':
          animation = gsap.from(element, { 
            scale: 0.8, 
            opacity: 0, 
            duration, 
            delay: parseFloat(delay),
            ease: 'elastic.out(1, 0.5)'
          });
          break;
      }
      
      ScrollTrigger.create({
        trigger: element,
        start: 'top 80%',
        animation,
        toggleActions: 'play none none none'
      });
    });
  }
}