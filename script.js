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
        submitButton.textContent = 'Adding...';
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
            showMessage('Network error. Please try again.', 'error');
        } finally {
            // Re-enable button
            submitButton.disabled = false;
            submitButton.textContent = 'Join Waitlist';
        }
    });

    async function fetchUserCount() {
        try {
            const response = await fetch('/api/waitlist');
            const data = await response.json();
            
            if (response.ok) {
                userCountDiv.textContent = `${data.count || 0} people waiting`;
            } else {
                userCountDiv.textContent = '0 people waiting';
            }
        } catch (error) {
            userCountDiv.textContent = '0 people waiting';
        }
    }

    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = type;
        messageDiv.style.display = 'block';
    }

    function hideMessage() {
        messageDiv.style.display = 'none';
    }
});