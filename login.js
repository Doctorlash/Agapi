document.getElementById('authForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // For now, just log the values
    console.log('Email:', email);
    console.log('Password:', password);

    // Implement authentication logic here (e.g., form submission to Node.js backend)
});

document.getElementById('toggleAuth').addEventListener('click', function(e) {
    e.preventDefault();

    const isLogin = document.getElementById('submitButton').textContent === 'Login';
    
    // Toggle between Login and Register
    document.getElementById('submitButton').textContent = isLogin ? 'Register' : 'Login';
    document.getElementById('toggle').innerHTML = isLogin
        ? 'Already have an account? <a href="#" id="toggleAuth">Login</a>'
        : "Don't have an account? <a href='#' id='toggleAuth'>Register</a>";
});
fetch('/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
})
.then(response => response.json())
.then(data => {
    console.log(data);
})
.catch(error => {
    console.error('Error:', error);
});