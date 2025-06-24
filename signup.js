document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.querySelector('.signup-form');

    signupForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission

        const username = document.querySelector('input[placeholder="Username*"]').value.trim();
        const email = document.querySelector('input[placeholder="Email ID*"]').value.trim().toLowerCase();
        const password = document.querySelector('input[placeholder="Password*"]').value;
        const phoneNumber = document.querySelector('input[placeholder="Phone Number*"]').value.trim();

        // Basic validation
        if (!username || !email || !password || !phoneNumber) {
            alert("Please fill in all fields.");
            return;
        }

        // Save user data locally
        const users = JSON.parse(localStorage.getItem('avra-users')) || {};
        if (users[email]) {
            alert("Email already registered. Please sign in.");
            return;
        }

        users[email] = { username, password, phoneNumber };
        localStorage.setItem('avra-users', JSON.stringify(users));

        // Redirect to dashboard
        window.location.href = '../dashboard/dashboard.html'; // Adjust the path if needed
    });
});
