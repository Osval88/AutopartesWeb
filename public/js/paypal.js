
function mostrarBotonPago() {
    const botonPagoExistente = document.getElementById("paypal-button-container");
    
    if (botonPagoExistente) {
        botonPagoExistente.innerHTML = "";
    }
    if (carrito.length === 0) 
        return;
    
    inicializarPayPal();
}


function inicializarPayPal() {
    if (typeof paypal === 'undefined') {
        console.error("PayPal SDK no está cargado. Verifica tu HTML.");
        return;
    }

const total = calcularTotal();


    const items = carrito.map(producto => ({
        name: producto.nombre,
        unit_amount: {
            currency_code: "USD", 
            value: producto.precio.toFixed(2).toString()
        },
        quantity: producto.cantidad.toString()
    }));
    

    paypal.Buttons({
        createOrder: (data, actions) => {
            return actions.order.create({
                intent: "CAPTURE",
                purchase_units: [
                {
                amount: {
                currency_code: "USD", 
                value: total.toFixed(2).toString(),
                breakdown: {
                item_total: {
                currency_code: "USD", 
                value: total.toFixed(2).toString()
                }
                }
                },
                                    items: items
                                    }
                                ]
            });
        },

        onApprove: (data, actions) => {
            return actions.order.capture().then((details) => {
                console.log("Detalles de la transacción:", details);
                alert(`¡Pago exitoso! Tu ID de transacción es: ${details.id}`);
                
                carrito = [];
                localStorage.removeItem("carrito");
                mostrarCarrito();
            });
        },

        onError: (err) => {
            console.error("Error en el pago:", err);
            alert("Hubo un error al procesar tu pago. Por favor, intenta de nuevo.");
        },

        onCancel: (data) => {
            console.log("Pago cancelado por el usuario");
            alert("Has cancelado el pago.");
        }
    }).render("#paypal-button-container");
}