/**
 * Loads a component into a placeholder element
 * @param {string} placeholderId - ID of the placeholder element
 * @param {string} filePath - Path to the component HTML file
 * @param {Object} [props] - Optional props to pass to the component
 */
export async function loadComponent(placeholderId, filePath, props = {}) {
  try {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) {
      throw new Error(`Placeholder element with ID ${placeholderId} not found`);
    }
    
    // Show loading state
    placeholder.innerHTML = '<div class="spinner-border text-primary" role="status"></div>';
    
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    let content = await response.text();
    
    // Simple template rendering with props
    if (props && Object.keys(props).length > 0) {
      content = content.replace(/\{\{(\w+)\}\}/g, (match, key) => props[key] || '');
    }
    
    placeholder.innerHTML = content;
    
    // Dispatch event when component is loaded
    const event = new CustomEvent('componentLoaded', {
      detail: { placeholderId, filePath }
    });
    document.dispatchEvent(event);
    
  } catch (error) {
    console.error(`Error loading component ${placeholderId}:`, error);
    const placeholder = document.getElementById(placeholderId);
    if (placeholder) {
      placeholder.innerHTML = `
        <div class="alert alert-danger">
          Error loading component. Please try again later.
        </div>
      `;
    }
    
    // Dispatch error event
    const errorEvent = new CustomEvent('componentError', {
      detail: { placeholderId, error }
    });
    document.dispatchEvent(errorEvent);
  }
}

/**
 * Initializes active state for navigation links
 */
export function initActiveNavLink() {
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  
  // Set active state based on current page
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || 
        (currentPath === 'index.html' && href === '#home')) {
      link.classList.add('active');
    }
  });
  
  // Handle section scrolling for hash links
  if (window.location.hash) {
    const targetSection = document.querySelector(window.location.hash);
    if (targetSection) {
      setTimeout(() => {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }
  
  // Update active state on scroll
  window.addEventListener('scroll', debounce(() => {
    const scrollPosition = window.scrollY + 100;
    
    document.querySelectorAll('section[id]').forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && 
          scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, 100));
}

/**
 * Debounce function for scroll events
 */
function debounce(func, wait = 100) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Initializes dropdown menus
 */
export function initDropdowns() {
  document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const menu = toggle.nextElementSibling;
      menu.classList.toggle('show');
      
      // Close when clicking outside
      document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !menu.contains(e.target)) {
          menu.classList.remove('show');
        }
      }, { once: true });
    });
  });
}