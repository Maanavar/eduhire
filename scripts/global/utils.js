/**
 * Utilities for the EduHire website
 */

/**
 * Populates a dropdown/select element with options
 * @param {HTMLSelectElement} select - The select element to populate
 * @param {Array} options - Array of options (value/text pairs or strings)
 * @param {string} defaultText - Default option text
 */
export const populateDropdown = (select, options, defaultText = 'Select') => {
  select.innerHTML = `<option value="" disabled selected>${defaultText}</option>`;
  options.forEach(opt => {
    const option = new Option(
      typeof opt === 'object' ? opt.text : opt,
      typeof opt === 'object' ? opt.value : opt
    );
    select.add(option);
  });
};

/**
 * Initializes state and district dropdowns with cascading logic
 * @param {string} stateId - ID of the state select element
 * @param {string} districtId - ID of the district select element
 * @param {Object} stateDistricts - Object mapping states to district arrays
 * @returns {Function} Cleanup function to remove event listeners
 */
export const initStateDistrictDropdowns = (stateId, districtId, stateDistricts) => {
  const stateSelect = document.getElementById(stateId);
  const districtSelect = document.getElementById(districtId);

  if (!stateSelect || !districtSelect) {
    console.error(`State or district select element not found: stateId=${stateId}, districtId=${districtId}`);
    return () => {};
  }

  populateDropdown(stateSelect, Object.keys(stateDistricts), 'Select State');

  const handleStateChange = () => {
    const selectedState = stateSelect.value;
    districtSelect.innerHTML = '<option value="" disabled selected>Select District</option>';
    if (selectedState && stateDistricts[selectedState]) {
      populateDropdown(districtSelect, stateDistricts[selectedState], 'Select District');
    }
  };

  stateSelect.addEventListener('change', handleStateChange);
  return () => stateSelect.removeEventListener('change', handleStateChange);
};

/**
 * Displays a Bootstrap toast notification
 * @param {string} message - The message to display
 * @param {string} type - 'success' or 'error'
 */
export const showNotification = (message, type = 'success') => {
  const toastElement = document.getElementById('notificationToast');
  const toastBody = toastElement?.querySelector('.toast-body');
  if (toastElement && toastBody) {
    toastBody.textContent = message;
    toastElement.classList.remove('bg-success', 'bg-danger');
    toastElement.classList.add(type === 'success' ? 'bg-success' : 'bg-danger');
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
  } else {
    console.warn('Toast element not found, falling back to alert');
    alert(message);
  }
};

/**
 * Handles errors with logging and user feedback
 * @param {Error} error - The error object
 * @param {string} context - Context of the error
 * @param {HTMLElement} [element] - Optional element to display error
 */
export const handleError = (error, context, element = null) => {
  console.error(`Error in ${context}:`, error);
  if (element) {
    element.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
  showNotification(`An error occurred: ${error.message}`, 'error');
};

/**
 * Validates a form and handles direct submission
 * @param {HTMLFormElement} form - The form to validate
 * @param {Object} options - Configuration options
 * @param {string} options.successMessage - Message on successful submission
 * @param {string} options.errorMessage - Message on failed submission
 * @returns {Function} Cleanup function to remove event listeners
 */
export const validateForm = (form, { successMessage, errorMessage }) => {
  const inputs = form.querySelectorAll('input, select, textarea');
  const fileInputs = form.querySelectorAll('input[type="file"]');
  const selectInputs = form.querySelectorAll('select');
  const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes
  let isSubmitting = false; // Prevent multiple submissions
  const cleanupFunctions = [];

  // Real-time validation
  const handleInput = (input) => {
    if (input.tagName === 'SELECT') {
      if (!input.value || input.value === '') {
        input.classList.add('is-invalid');
        const feedback = input.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
          feedback.textContent = `Please select a ${input.name}`;
        }
      } else {
        input.classList.remove('is-invalid');
      }
    } else if (!input.checkValidity()) {
      input.classList.add('is-invalid');
      const feedback = input.nextElementSibling;
      if (feedback && feedback.classList.contains('invalid-feedback')) {
        feedback.textContent = input.validationMessage || feedback.textContent;
      }
    } else {
      input.classList.remove('is-invalid');
    }
  };

  inputs.forEach(input => {
    input.addEventListener('input', () => handleInput(input));
    input.addEventListener('change', () => handleInput(input));
    cleanupFunctions.push(() => input.removeEventListener('input', () => handleInput(input)));
    cleanupFunctions.push(() => input.removeEventListener('change', () => handleInput(input)));
  });

  // File size and type validation
  const validateFile = (fileInput) => {
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      if (file.size > maxFileSize) {
        fileInput.classList.add('is-invalid');
        const feedback = fileInput.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
          feedback.textContent = 'File size must be under 5MB';
        }
        return false;
      }
      if (fileInput.accept && !file.type.match(fileInput.accept.replace('.', ''))) {
        fileInput.classList.add('is-invalid');
        const feedback = fileInput.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
          feedback.textContent = 'File must be a PDF';
        }
        return false;
      }
    }
    return true;
  };

  fileInputs.forEach(fileInput => {
    fileInput.addEventListener('change', () => {
      validateFile(fileInput);
    });
    cleanupFunctions.push(() => fileInput.removeEventListener('change', () => validateFile(fileInput)));
  });

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    let isValid = form.checkValidity();
    inputs.forEach(input => {
      handleInput(input);
      if (input.tagName === 'SELECT' && (!input.value || input.value === '')) {
        isValid = false;
      }
    });

    if (!isValid) {
      form.classList.add('was-validated');
      return;
    }

    for (const fileInput of fileInputs) {
      if (!validateFile(fileInput)) {
        form.classList.add('was-validated');
        return;
      }
    }

    if (isSubmitting) return; // Prevent multiple submissions
    isSubmitting = true;

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...`;

    // Direct form submission
    try {
      form.submit(); // Trigger native form submission
      showNotification(successMessage, 'success');
      form.reset();
      form.classList.remove('was-validated');
      // Reset dropdowns
      selectInputs.forEach(select => {
        select.selectedIndex = 0;
        handleInput(select);
      });
    } catch (error) {
      handleError(error, 'form submission');
      showNotification(errorMessage, 'error');
    } finally {
      isSubmitting = false;
      submitButton.disabled = false;
      submitButton.innerHTML = 'Post Job <i class="fas fa-paper-plane"></i>';
    }
  };

  form.addEventListener('submit', handleSubmit);
  cleanupFunctions.push(() => form.removeEventListener('submit', handleSubmit));

  return () => cleanupFunctions.forEach(fn => fn());
};

/**
 * Formats a number to Indian currency format
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
export const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Debounces a function for performance optimization
 * @param {Function} func - The function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
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