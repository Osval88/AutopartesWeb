
// Agregamos el fetch real para traer los productos desde la base de datos
fetch("/api/products")
    .then(res => {
        if (!res.ok) {
            throw new Error("Error en la respuesta del servidor");
        }
        return res.json();
    })
    .then(data => {
        console.log("Productos cargados desde MySQL:", data);
        mostrarProductos(data); // Le pasa las piezas a tu función que arma el HTML
    })
    .catch(error => console.error("Error al cargar el catálogo:", error));


function mostrarProductos(productos) {

    const contenedor = document.querySelector(".products__products-container");

    let html = "";
    productos.forEach(producto => { 
        html += `
            <div class="products__products">
                <img src="${producto.img}" alt="${producto.nombre}">
                <h2 class="products__products-name">${producto.nombre}</h2>
                <p>$${producto.precio}</p>
                <p class="producto-stock">Disponibles: <strong>${producto.stock} unidades</strong></p>
                <button class="btn-agregar" data-id="${producto.id}">
                    Agregar al carrito
                </button>
            </div>
        `;
    });
    contenedor.innerHTML = html;

    activarBotones(productos);

}



let carrito = JSON.parse(localStorage.getItem("carrito")) || [];



function activarBotones(productos) {

    const botones = document.querySelectorAll(".btn-agregar");

    botones.forEach(boton => {
        boton.addEventListener("click", (e) => {

            const id = parseInt(e.target.dataset.id);
            const productoSeleccionado = productos.find(p => p.id === id);
            const productoEnCarrito = carrito.find(p => p.id === productoSeleccionado.id);

            if (productoEnCarrito) {
                productoEnCarrito.cantidad++;
            } else {
                carrito.push({
                    ...productoSeleccionado,
                    cantidad: 1
                });
            }

            localStorage.setItem("carrito", JSON.stringify(carrito));
            mostrarCarrito();
            console.log("Carrito:", carrito);

        });
    });
}




function calcularTotal() {

    const total = carrito.reduce((acumulador, producto) => {
        return acumulador + (producto.precio * producto.cantidad);
    }, 0);

    const contenedorTotal = document.getElementById("total-carrito");
    contenedorTotal.textContent = `Total: $${total.toFixed(2)}`;
    
}


function mostrarCarrito() {
    const contenedor = document.getElementById("carrito-container");
    
    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>El carrito está vacío</p>";
    } else {
        let html = "";
        carrito.forEach((producto) => {
            html += `
                <div class="item-carrito">
                    <p>${producto.nombre} - $${producto.precio} x ${producto.cantidad}</p>
                    <p>Subtotal: $${(producto.precio * producto.cantidad).toFixed(2)}</p>
                    <button class="btn-eliminar" data-id="${producto.id}">Eliminar</button>
                </div>
            `;
        });
        contenedor.innerHTML = html;
    }

    activarBotonesEliminar();
    calcularTotal();

    if (typeof mostrarBotonPago === "function") mostrarBotonPago();
}

mostrarCarrito();


function activarBotonesEliminar() {
    const botonesEliminar = document.querySelectorAll(".btn-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", (e) => {
            const id = parseInt(e.target.dataset.id);
            carrito = carrito.filter(p => p.id !== id); 
            
            localStorage.setItem("carrito", JSON.stringify(carrito));
            mostrarCarrito();
        });
    });
}


function vaciarCarrito() {

    const confirmar = confirm("¿Seguro que querés vaciar el carrito?");

    if (confirmar) {
        carrito = [];
        localStorage.removeItem("carrito");
        mostrarCarrito();
    }
}

document.getElementById("btn-vaciar")
        .addEventListener("click", vaciarCarrito);