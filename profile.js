
document.getElementById('saveProfile').addEventListener('click', function() {
    const name = document.getElementById('name').value;
    const bio = document.getElementById('bio').value;

    // Simulate saving the profile data
    console.log('Profile saved:', { name, bio });
});
