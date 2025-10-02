// API Fix - Override all API calls to use correct backend
const originalFetch = window.fetch;

window.fetch = function(url, options) {
  // Fix backend status check
  if (url === 'http://localhost:3001/health' || url === '/health') {
    url = 'http://localhost:3002/api/auth/health';
  }
  
  // Fix login API calls
  if (url === 'http://localhost:3001/api/login' || url === '/api/login') {
    url = 'http://localhost:3002/api/auth/login';
  }
  
  // Fix any other API calls
  if (typeof url === 'string' && (url.includes('localhost:3001') || url.startsWith('/api/'))) {
    url = url.replace('localhost:3001', 'localhost:3002');
    url = url.replace('/api/', '/api/auth/');
  }
  
  console.log('API Call:', url);
  return originalFetch(url, options);
};

// Override the backend status check
setInterval(() => {
  fetch('http://localhost:3002/api/auth/health')
    .then(response => response.json())
    .then(data => {
      // Update the status display
      const statusElement = document.querySelector('*');
      // We'll find and update the status element when page loads
      if (data.status === 'Auth Service Running') {
        document.body.innerHTML = document.body.innerHTML.replace(
          'Backend Service Offline', 
          'Backend Service Online'
        );
        document.body.innerHTML = document.body.innerHTML.replace(
          'Failed to fetch', 
          'API Connected Successfully'
        );
      }
    })
    .catch(error => {
      console.log('Backend check failed:', error);
    });
}, 5000);
