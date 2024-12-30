const apiBaseUrl = "http://localhost:3300";

// Fetch all users
function fetchUsers() {
    fetch(`${apiBaseUrl}/users`)
        .then(response => response.json())
        .then(data => {
            
            const tableBody = document.querySelector("#usersTable tbody");
            tableBody.innerHTML = ""; // Clear existing rows
            data.forEach(user => {
                
                const row = `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.login}</td>
                        <td>${user.password}</td>
                        <td>${user.balance}</td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        })
        .catch(err => console.error("Error fetching users:", err));
}

// Fetch a user by ID
function fetchUserById() {
    const userId = document.getElementById("userId").value;
    fetch(`${apiBaseUrl}/users/${userId}`)
        .then(response => response.json())
        .then(data => {
            const userDetails = document.getElementById("userDetails");
            if (data.length > 0) {
                const user = data[0];
                userDetails.innerHTML = `
                    <p><strong>ID:</strong> ${user.id}</p>
                    <p><strong>Name:</strong> ${user.name}</p>
                    <p><strong>Login:</strong> ${user.login}</p>
                    <p><strong>Password:</strong> ${user.password}</p>
                    <p><strong>Balance:</strong> ${user.balance}</p>
                `;
            } else {
                userDetails.innerHTML = `<p>No user found with ID ${userId}</p>`;
            }
        })
        .catch(err => console.error("Error fetching user:", err));
}

// Add a new user
function addUser() {
    const user = {
        id: document.getElementById("newUserId").value,
        name: document.getElementById("newUserName").value,
        login: document.getElementById("newUserLogin").value,
        password: document.getElementById("newUserPassword").value,
        balance: document.getElementById("newUserBalance").value
    };

    fetch(`${apiBaseUrl}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    })
        .then(response => {
            if (response.ok) {
                alert("User added successfully!");
                document.getElementById("addUserForm").reset();
            } else {
                alert("Failed to add user.");
            }
        })
        .catch(err => console.error("Error adding user:", err));
}



