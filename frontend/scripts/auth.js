// Register form
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent default form submission behavior

  // Fetching form values
  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  try {
      // Sending a POST request to the registration endpoint
      const response = await fetch("http://localhost:3000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }) // Matching keys with backend
      });

      const result = await response.json();

      if (response.ok) {
          alert("Registration successful! Please log in.");
          document.getElementById("registerForm").reset(); // Clear the form fields
      } else {
          alert("Error: " + (result.error || "Registration failed."));
      }
  } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
  }
});

// Login form
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent default form submission behavior

  // Fetching form values
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
      // Sending a POST request to the login endpoint
      const response = await fetch("http://localhost:3000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }) // Matching keys with backend
      });

      const result = await response.json();

      if (response.ok) {
          localStorage.setItem("token", result.token); // Store the JWT token
          alert("Login successful!");
          document.getElementById("loginForm").reset(); // Clear the form fields
          window.location.href = "dashboard.html"; // Redirect to dashboard
      } else {
          alert("Error: " + (result.error || "Login failed."));
      }
  } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
  }
});
