document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("table-body");
    const dogForm = document.getElementById("dog-form");
    const apiUrl = "http://localhost:3000/dogs";
    let editingDogId = null;  // To store the dog being edited

    // Fetch and display all dogs
    function fetchDogs() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(dogs => {
                tableBody.innerHTML = "";  // Clear table before re-rendering
                dogs.forEach(dog => renderDogRow(dog));
            })
            .catch(error => console.error("Error fetching dogs:", error));
    }

    // Render a single dog row
    function renderDogRow(dog) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${dog.name}</td>
            <td>${dog.breed}</td>
            <td>${dog.sex}</td>
            <td><button class="edit-btn" data-id="${dog.id}">Edit</button></td>
        `;
        tableBody.appendChild(row);
    }

    // Handle Edit button click
    tableBody.addEventListener("click", (event) => {
        if (event.target.classList.contains("edit-btn")) {
            const dogId = event.target.dataset.id;

            fetch(`${apiUrl}/${dogId}`)
                .then(response => response.json())
                .then(dog => {
                    dogForm.name.value = dog.name;
                    dogForm.breed.value = dog.breed;
                    dogForm.sex.value = dog.sex;
                    editingDogId = dog.id;  // Store the dog ID being edited
                })
                .catch(error => console.error("Error fetching dog details:", error));
        }
    });

    // Handle form submission for updating dog details
    dogForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!editingDogId) return;  // Ensure an edit is in progress

        const updatedDog = {
            name: dogForm.name.value,
            breed: dogForm.breed.value,
            sex: dogForm.sex.value
        };

        fetch(`${apiUrl}/${editingDogId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(updatedDog)
        })
        .then(response => response.json())
        .then(() => {
            fetchDogs();  // Refresh the table after updating
            dogForm.reset();  // Clear the form
            editingDogId = null;  // Reset editing state
        })
        .catch(error => console.error("Error updating dog:", error));
    });

    // Initial fetch of dogs when page loads
    fetchDogs();
});
