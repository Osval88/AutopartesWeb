
function mostrarBotonPago() {
    const contenedor = document.getElementById("paypal-button-container");
    
    if (!contenedor) return;

    contenedor.innerHTML = "";

    if (carrito.length > 0) {
        inicializarPayPal();
    }
}

function inicializarPayPal() {
    if (typeof paypal === 'undefined') {
        console.error("PayPal SDK no está cargado.");
        return;
    }

    paypal.Buttons({

        createOrder: async () => {
            try {
                const response = await fetch('/api/paypal/create-order', { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ carrito: carrito }) 
                });
                const data = await response.json();
                return data.id; 
            } catch (err) {
                console.error("Error al contactar al servidor:", err);
            }
        },


        onApprove: async (data) => {
            try {
                const response = await fetch('/api/paypal/capture-order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        orderID: data.orderID,
                        carrito: carrito 
    })
});
                const detalles = await response.json();

                if (detalles.status === "COMPLETED") {
                    alert("¡Gracias por tu compra en AutopartesWeb!");
                    carrito = [];
                    localStorage.removeItem("carrito");
                    mostrarCarrito();
                }
            } catch (err) {
                alert("Error al confirmar el pago.");
            }
        }
    }).render("#paypal-button-container");
}