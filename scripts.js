document.getElementById('scheduleForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form from submitting to the server

    const therapist = document.getElementById('therapist').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const clientName = document.getElementById('clientName').value;
    const clientEmail = document.getElementById('clientEmail').value;

    // Validate that all fields are filled
    if (therapist && date && time && clientName && clientEmail) {
        try {
            const response = await fetch('/schedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    therapist,
                    date,
                    time,
                    clientName,
                    clientEmail
                })
            });

            const result = await response.json();
            if (response.status === 200) {
                document.getElementById('confirmationMessage').textContent = result.message;
            } else {
                document.getElementById('confirmationMessage').textContent = result.message;
            }
        } catch (error) {
            document.getElementById('confirmationMessage').textContent = 'Failed to schedule appointment. Try again later.';
        }
    } else {
        alert('Please fill out all the fields.');
    }
});
document.getElementById('userType').addEventListener('change', function() {
    const specializationContainer = document.getElementById('specializationContainer');
    if (this.value === 'therapist') {
        specializationContainer.style.display = 'block';
    } else {
        specializationContainer.style.display = 'none';
    }
});