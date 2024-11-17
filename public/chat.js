document.getElementById('sendMessage').addEventListener('click', function() {
    const message = document.getElementById('chatInput').value;
    
    if (message) {
        const chatWindow = document.getElementById('chatWindow');
        const newMessage = document.createElement('p');
        newMessage.textContent = `You: ${message}`;
        chatWindow.appendChild(newMessage);

        // Clear input field
        document.getElementById('chatInput').value = '';
    }
});
