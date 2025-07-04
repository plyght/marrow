document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('waitlist-form');
    const emailInput = document.getElementById('email');
    const messageDiv = document.getElementById('message');
    const userCountDiv = document.getElementById('user-count');
    const submitButton = form.querySelector('button[type="submit"]');

    // Fetch user count on page load
    fetchUserCount();

    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        if (!email) return;

        // Disable button and show loading
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
        hideMessage();

        try {
            const response = await fetch('/api/waitlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                showMessage('Successfully added to waitlist!', 'success');
                emailInput.value = '';
                fetchUserCount(); // Update count
            } else {
                showMessage(data.error || 'Failed to join waitlist', 'error');
            }
        } catch (error) {
            console.error('Network error:', error);
            showMessage('Network error. Please try again.', 'error');
        } finally {
            // Re-enable button
            submitButton.disabled = false;
            submitButton.textContent = 'Submit';
        }
    });

    async function fetchUserCount() {
        try {
            const response = await fetch('/api/waitlist');
            const data = await response.json();
            
            if (response.ok) {
                const count = data.count || 0;
                userCountDiv.textContent = `${count} ${count === 1 ? 'person' : 'people'} waiting`;
            } else {
                userCountDiv.textContent = '0 people waiting';
            }
        } catch (error) {
            console.error('Error fetching user count:', error);
            userCountDiv.textContent = '0 people waiting';
        }
    }

    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            hideMessage();
        }, 5000);
    }

    function hideMessage() {
        messageDiv.style.display = 'none';
        messageDiv.className = 'message';
    }
});

// Whitepaper button handler
function handleWhitepaper() {
    // For now, just show an alert
    alert('Whitepaper coming soon! Join the waitlist to be notified when it\'s available.');
}