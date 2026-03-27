// 1. Esta función LIMPIA y decide si mostrar el botón
function mostrarBotonPago() {
    const contenedor = document.getElementById("paypal-button-container");
    
    if (!contenedor) return;

    // Limpiamos botones viejos para que no se dupliquen
    contenedor.innerHTML = "";

    // Si el carrito tiene productos, inicializamos el botón
    if (carrito.length > 0) {
        inicializarPayPal();
    }
}

// 2. Esta función DIBUJA el botón y gestiona el pago
function inicializarPayPal() {
    if (typeof paypal === 'undefined') {
        console.error("PayPal SDK no está cargado.");
        return;
    }

    paypal.Buttons({
        // CREAR LA ORDEN
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

        // CAPTURAR EL PAGO
        onApprove: async (data) => {
            try {
                const response = await fetch('/api/paypal/capture-order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orderID: data.orderID })
                });
                const detalles = await response.json();

                if (detalles.status === "COMPLETED") {
                    alert("¡Gracias por tu compra en AutopartesWeb!");
                    carrito = [];
                    localStorage.removeItem("carrito");
                    mostrarCarrito(); // Esto actualizará el carrito y ocultará el botón
                }
            } catch (err) {
                alert("Error al confirmar el pago.");
            }
        }
    }).render("#paypal-button-container");
}