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
 * Initializes active state for navigation links and dynamic section links
 */
export function initActiveNavLink() {
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const isIndexPage = currentPath === 'index.html' || currentPath === '';

  // Adjust section links based on current page
  navLinks.forEach(link => {
    const section = link.getAttribute('data-section');
    if (section) {
      // If not on index.html, point to index.html#section
      if (!isIndexPage) {
        link.setAttribute('href', `index.html#${section}`);
      } else {
        link.setAttribute('href', `#${section}`);
      }
    }
  });

  
  // Set active state based on current page or section
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (isIndexPage && href.startsWith('#') && window.location.hash === href) {
      link.classList.add('active');
    } else if (href === currentPath) {
      link.classList.add('active');
    }
  });

  // Handle smooth scrolling for section links
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href.startsWith('#') && isIndexPage) {
        e.preventDefault();
        const sectionId = href.substring(1);
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
          // Update active state
          navLinks.forEach(l => l.classList.remove('active'));
          this.classList.add('active');
          // Update URL hash without jumping
          history.pushState(null, null, href);
        }
      }
    });
  });

  // Handle initial hash on page load
  if (isIndexPage && window.location.hash) {
    const targetSection = document.querySelector(window.location.hash);
    if (targetSection) {
      setTimeout(() => {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }

  // Update active state on scroll (for index.html only)
  if (isIndexPage) {
    window.addEventListener('scroll', debounce(() => {
      const scrollPosition = window.scrollY + 100;
      document.querySelectorAll('section[id]').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
              history.pushState(null, null, `#${sectionId}`);
            }
          });
        }
      });
    }, 100));
  }
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