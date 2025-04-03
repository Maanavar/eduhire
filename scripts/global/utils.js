/**
 * Populates a dropdown/select element with options
 * @param {HTMLSelectElement} select - The select element to populate
 * @param {Array} options - Array of options (value/text pairs)
 * @param {string} defaultText - Default option text
 */
export const populateDropdown = (select, options, defaultText = 'Select') => {
  select.innerHTML = `<option value="">${defaultText}</option>`;
  options.forEach(opt => {
    const option = new Option(
      typeof opt === 'object' ? opt.text : opt,
      typeof opt === 'object' ? opt.value : opt
    );
    select.add(option);
  });
};

/**
 * Validates a form and handles submission
 * @param {HTMLFormElement} form - The form to validate
 */
export const validateForm = (form) => {
  const inputs = form.querySelectorAll('input, select, textarea');
  
  // Real-time validation
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      if (!input.checkValidity()) {
        input.classList.add('is-invalid');
        const feedback = input.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
          feedback.textContent = input.validationMessage;
        }
      } else {
        input.classList.remove('is-invalid');
      }
    });
  });

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: form.method,
        body: form.enctype === 'multipart/form-data' ? formData : JSON.stringify(Object.fromEntries(formData)),
        headers: {
          'Content-Type': form.enctype === 'multipart/form-data' 
            ? 'multipart/form-data' 
            : 'application/json'
        }
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const result = await response.json();
      alert('Application submitted successfully!');
      form.reset();
      
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error submitting your application. Please try again.');
    }
  });
};

/**
 * Debounces a function for performance optimization
 * @param {Function} func - The function to debounce
 * @param {number} wait - Wait time in milliseconds
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

/**
 * Formats a number to Indian currency format
 * @param {number} amount - The amount to format
 */
export const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Toggles a loading state on an element
 * @param {HTMLElement} element - The element to show loading state on
 * @param {boolean} isLoading - Whether to show or hide loading state
 */
export const toggleLoading = (element, isLoading) => {
  if (isLoading) {
    element.setAttribute('data-original-text', element.textContent);
    element.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`;
    element.disabled = true;
  } else {
    element.textContent = element.getAttribute('data-original-text');
    element.disabled = false;
  }
};