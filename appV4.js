function validateAndSubmit() {
    // List of all input IDs
    const inputs = [
        'salesData', 'currentStock', 'costPrice', 'orderCost', 
        'moq', 'uom', 'leadTime', 'stockCost', 'serviceLevel'
    ];

    let isValid = true;

    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');  // Add an error class for styling
        } else {
            input.classList.remove('error'); // Remove the error class if input is valid
        }
    });

    if (isValid) {
        submitEOQData();
    } else {
        alert('Please fill in all required fields.');
    }
}

function submitEOQData() {
    const data = {
        sales_data: document.getElementById('salesData').value.split(',').map(Number),
        current_stock: parseInt(document.getElementById('currentStock').value, 10),
        cost_price: parseFloat(document.getElementById('costPrice').value),
        order_cost: parseFloat(document.getElementById('orderCost').value),
        moq: parseInt(document.getElementById('moq').value, 10),
        uom: parseInt(document.getElementById('uom').value, 10),
        lead_time: parseInt(document.getElementById('leadTime').value, 10),
        stock_cost: parseFloat(document.getElementById('stockCost').value),
        service_level: parseFloat(document.getElementById('serviceLevel').value)
    };

    // Show loading text
    document.getElementById('loading').style.display = 'block';
    let dots = 0;
    const dotsInterval = setInterval(() => {
        dots = (dots + 1) % 5; // Reset after four cycles (., .., ..., ...., then reset)
        document.getElementById('loadingDots').textContent = '.'.repeat(dots);
    }, 500); // Update text every 500 milliseconds (0.5 seconds)

    document.getElementById('results').innerHTML = '';  // Clear previous results if any

    fetch('https://panel.stockbalance.nl:3001/calculate-eoq', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        // Set a delay of 3 seconds before displaying the results
        setTimeout(() => {
            clearInterval(dotsInterval); // Stop the loading animation
            document.getElementById('loading').style.display = 'none'; // Hide loading text

            // Display results
            document.getElementById('results').innerHTML = `
                <p>Optimale bestelhoeveelheid: ${result.eoq.toFixed(2)}</p>
                <p>Herbestelpunt: ${result.reorderPoint.toFixed(2)}</p>
                <p>Veiligheidsvoorraad: ${result.safetyStock.toFixed(2)}</p>
            `;
        }, 3000); // 3000 milliseconds = 3 seconds
    })
    .catch(error => {
        console.error('Error:', error);
        clearInterval(dotsInterval); // Stop the loading animation
        document.getElementById('loading').style.display = 'none'; // Hide loading text
    });
}
