document.addEventListener('DOMContentLoaded', () => {
    const signInForm = document.getElementById('loginForm');

    if (!signInForm) {
        console.error('Sign-in form (loginForm) not found!');
        return;
    }

    signInForm.addEventListener('submit', function(event) {
        event.preventDefault();
        console.log('Sign-in form submitted');

        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        if (!emailInput || !passwordInput) {
            console.error('Email or password input not found!');
            alert('Internal error: form inputs missing.');
            return;
        }

        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;

        if (!email || !password) {
            alert('Please enter both email and password.');
            return;
        }

        // Get users from localStorage
        let users = {};
        try {
            users = JSON.parse(localStorage.getItem('avra-users')) || {};
            console.log('Loaded users from localStorage:', users);
        } catch (e) {
            console.error('Error parsing users from localStorage:', e);
            alert('Internal error: failed to read user data.');
            return;
        }

        if (!users[email]) {
            alert('No account found with this email. Please sign up.');
            return;
        }

        if (users[email].password !== password) {
            alert('Incorrect password.');
            return;
        }

        // Successful login
        localStorage.setItem('avra-current-user', email);
        console.log('Sign-in successful. Redirecting to dashboard...');

        // Update this path as needed relative to your sign-in page
        window.location.href = '../dashboard/dashboard.html';
    });
});
