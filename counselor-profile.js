document.getElementById('saveProfile').addEventListener('click', function() {
    const bio = document.getElementById('bio').value;
    const availability = document.getElementById('availability').value;

    // Simulate saving the counselor's profile
    console.log('Counselor profile saved:', { bio, availability });
});
