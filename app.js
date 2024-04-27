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
        purchase_price: parseFloat(document.getElementById('purchasePrice').value)
    };

    fetch('https://panel.stockbalance.nl:3001/calculate-eoq', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        document.getElementById('results').innerHTML = `
            <p>EOQ: ${result.eoq.toFixed(2)}</p>
            <p>Reorder Point: ${result.reorderPoint.toFixed(2)}</p>
            <p>Safety Stock: ${result.safetyStock.toFixed(2)}</p>
        `;
    })
    .catch(error => console.error('Error:', error));
}
