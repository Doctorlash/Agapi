
document.getElementById('registrationForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const userType = document.getElementById('userType').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const specialization = document.getElementById('specialization').value;

    const response = await POST('register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userType,
            name,
            email,
            password,
            specialization: userType === 'therapist' ? specialization : null
        })
    });

    const result = await response.json();
    document.getElementById('message').textContent = result.message;
});

fetch('/register', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
})
.then(response => response.json())
.then(data => {
    console.log(data);
})
.catch(error => {
    console.error('Error:', error);
});