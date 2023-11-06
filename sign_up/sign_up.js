  // JavaScript for form validation
  const signupForm = document.getElementById('signupForm');
  signupForm.addEventListener('submit', function(event) {
    // Validate email
    const email = document.getElementById('email').value;
    const emailError = document.getElementById('emailError');
    if (!isValidEmail(email)) {
      emailError.textContent = 'Invalid email format';
      event.preventDefault();
    } else {
      emailError.textContent = '';
    }

    // Validate password
    const password = document.getElementById('password').value;
    const passwordError = document.getElementById('passwordError');
    if (!isValidPassword(password)) {
      passwordError.textContent = 'Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one digit';
      event.preventDefault();
    } else {
      passwordError.textContent = '';
    }

    // Validate confirm password
    const cPassword = document.getElementById('cPassword').value;
    const cPasswordError = document.getElementById('cPasswordError');
    if (cPassword !== password) {
      cPasswordError.textContent = 'Passwords do not match';
      event.preventDefault();
    } else {
      cPasswordError.textContent = '';
    }

    // Validate mobile number
    const mobile_no = document.getElementById('mobile_no').value;
    const mobileError = document.getElementById('mobileError');
    if (!isValidMobileNumber(mobile_no)) {
      mobileError.textContent = 'Invalid mobile number format (10 digits)';
      event.preventDefault();
    } else {
      mobileError.textContent = '';
    }
  });

  // Function to validate email format
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Function to validate strong password (at least 8 characters, one uppercase, one lowercase, and one digit)
  function isValidPassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  }

  // Function to validate mobile number format (10 digits)
  function isValidMobileNumber(mobile_no) {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile_no);
  }
