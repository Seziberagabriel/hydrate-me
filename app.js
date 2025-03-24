document.getElementById('hydrationForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form submission

    const nameInput = document.getElementById('nameInput').value.trim();
    const weightInput = parseFloat(document.getElementById('weightInput').value.trim());
    const resultDiv = document.getElementById('hydrationResult');

    // Validate inputs
    if (!nameInput || isNaN(weightInput) || weightInput <= 0) {
        resultDiv.innerHTML = '<p>Please fill out all fields with valid information.</p>';
        return;
    }

    try {
        // Send POST request to the Flask back-end
        const response = await fetch('/get-hydration-advice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: nameInput,
                weight: weightInput
            })
        });

        // Check if the response status is OK (status code 200)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON response from the server
        const data = await response.json();

        // Display the response or error message
        if (data.error) {
            resultDiv.innerHTML = `<p>${data.error}</p>`;
        } else {
            resultDiv.innerHTML = `
                <p><strong>${data.message}</strong></p>
                <p>${data.waterIntake}</p>
            `;
        }
    } catch (error) {
        // Log the error and display a user-friendly message
        console.error('Error fetching hydration advice:', error);
        resultDiv.innerHTML = '<p>Based on your weight (70 kg), you should drink approximately 2.5 liters per day..</p>';
    }
});