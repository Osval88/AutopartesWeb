let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let usuarioLogueado = false;
let tieneDireccion = false;

document.addEventListener("DOMContentLoaded", async () => {
    const loginItem = document.getElementById("login-item");
    const logoutItem = document.getElementById("logout-item");
    const userGreetingItem = document.getElementById("user-greeting-item");
    const ordersItem = document.getElementById("orders-item");
    const userNameSpan = document.getElementById("user-name");
    const btnVerPedidos = document.getElementById("btn-ver-pedidos");
    const seccionPedidos = document.getElementById("mis-pedidos");
    const tablaPedidosBody = document.getElementById("tabla-pedidos-body");
    
    try {
        const respuesta = await fetch('/api/auth/status', { credentials: 'include' });
        const data = await respuesta.json();

        if (data.loggedIn) {
            usuarioLogueado = true;
            if (loginItem) loginItem.style.display = "none";
            if (logoutItem) logoutItem.style.display = "block";
            if (userGreetingItem) userGreetingItem.style.display = "block";
            if (ordersItem) ordersItem.style.display = "block";
            if (userNameSpan) userNameSpan.textContent = `Hola, ${data.user.nombre.split(' ')[0]}`;

            try {
                const resPerfil = await fetch('/api/auth/perfil', { credentials: 'include' });
                const perfil = await resPerfil.json();
                tieneDireccion = !!(perfil.direccion && perfil.ciudad);
            } catch (e) {
                tieneDireccion = false;
            }

            if (btnVerPedidos) {
                btnVerPedidos.addEventListener("click", async (e) => {
                    e.preventDefault();
                    if (seccionPedidos) {
                        seccionPedidos.style.display = "flex";
                        seccionPedidos.scrollIntoView({ behavior: 'smooth' });
                    }

                    try {
                        const resOrdenes = await fetch('/api/auth/mis-ordenes', { credentials: 'include' });
                        const ordenes = await resOrdenes.json();

                        if (!tablaPedidosBody) return;
                        tablaPedidosBody.innerHTML = "";

                        if (!Array.isArray(ordenes)) {
                            console.error("La respuesta no es un array:", ordenes);
                            return;
                        }

                        if (ordenes.length === 0) {
                            tablaPedidosBody.innerHTML = `<tr><td colspan="4" style="padding: 15px; text-align: center;">Todavía no realizaste ninguna compra.</td></tr>`;
                            return;
                        }

                        ordenes.forEach(orden => {
                            const fecha = new Date(orden.createdAt).toLocaleDateString('es-AR');
                            const fila = document.createElement("tr");
                            fila.style.borderBottom = "1px solid rgba(255,255,255,0.2)";
                            fila.innerHTML = `
                                <td style="padding: 12px;">#${orden.id}</td>
                                <td style="padding: 12px;">${fecha}</td>
                                <td style="padding: 12px; font-weight: bold;">$${orden.total || 0}</td>
                                <td style="padding: 12px;"><span style="color: ${orden.estado === 'completado' ? '#00ff00' : '#ffcc00'}">${orden.estado || 'Pendiente'}</span></td>
                            `;
                            tablaPedidosBody.appendChild(fila);
                        });
                    } catch (err) {
                        console.error("Error al cargar las órdenes:", err);
                    }
                });
            }
        } else {
            usuarioLogueado = false;
            tieneDireccion = false;
            if (loginItem) loginItem.style.display = "block";
            if (logoutItem) logoutItem.style.display = "none";
            if (userGreetingItem) userGreetingItem.style.display = "none";
            if (ordersItem) ordersItem.style.display = "none";
            if (seccionPedidos) seccionPedidos.style.display = "none";
        }
    } catch (error) {
        console.error("Error al comprobar la sesión:", error);
    }

    fetch("/api/products")
        .then(res => {
            if (!res.ok) throw new Error("Error en la respuesta del servidor");
            return res.json();
        })
        .then(data => {
            mostrarProductos(data);
        })
        .catch(error => console.error("Error al cargar el catálogo:", error));

    function mostrarProductos(productos) {
        const contenedor = document.querySelector(".products__products-container");
        if (!contenedor) return;
        
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
                
                const seccionCarrito = document.querySelector(".carrito");
                if (seccionCarrito) {
                    seccionCarrito.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    function calcularTotal() {
        const total = carrito.reduce((acumulador, producto) => {
            return acumulador + (producto.precio * producto.cantidad);
        }, 0);

        const contenedorTotal = document.getElementById("total-carrito");
        if (contenedorTotal) contenedorTotal.textContent = `Total: $${total.toFixed(2)}`;
    }

    function mostrarCarrito() {
        const contenedor = document.getElementById("carrito-container");
        const authWarningContainer = document.getElementById("auth-warning-container");
        const addressContainer = document.getElementById("shipping-address-container");
        const paypalButtonContainer = document.getElementById("paypal-button-container");

        if (!contenedor) return;
        
        if (carrito.length === 0) {
            contenedor.innerHTML = "<p>El carrito está vacío</p>";
            if (authWarningContainer) authWarningContainer.style.display = "none";
            if (addressContainer) addressContainer.style.display = "none";
            if (paypalButtonContainer) paypalButtonContainer.style.display = "none";
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

            if (!usuarioLogueado) {
                if (authWarningContainer) {
                    authWarningContainer.innerHTML = `
                        <p style="background: rgba(217, 83, 79, 0.2); border: 1px solid #d9534f; color: #fff; padding: 12px; border-radius: 5px; font-size: 0.95rem; text-align: center; margin: 15px 0;">
                            Inicia sesión con Google para comprar
                        </p>`;
                    authWarningContainer.style.display = "block";
                }
                if (addressContainer) addressContainer.style.display = "none";
                if (paypalButtonContainer) paypalButtonContainer.style.display = "none";
            } else if (!tieneDireccion) {
                if (authWarningContainer) authWarningContainer.style.display = "none";
                if (addressContainer) addressContainer.style.display = "block";
                if (paypalButtonContainer) paypalButtonContainer.style.display = "none";
            } else {
                if (authWarningContainer) authWarningContainer.style.display = "none";
                if (addressContainer) addressContainer.style.display = "none";
                if (paypalButtonContainer) paypalButtonContainer.style.display = "block";
                if (typeof mostrarBotonPago === "function") mostrarBotonPago();
            }
        }

        activarBotonesEliminar();
        calcularTotal();
    }

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

    const btnVaciar = document.getElementById("btn-vaciar");
    if (btnVaciar) btnVaciar.addEventListener("click", vaciarCarrito);

    const btnSeguirComprando = document.getElementById("btn-seguir-comprando");
    if (btnSeguirComprando) {
        btnSeguirComprando.addEventListener("click", () => {
            const seccionProductos = document.querySelector(".products");
            if (seccionProductos) seccionProductos.scrollIntoView({ behavior: 'smooth' });
        });
    }

    const addressForm = document.getElementById("address-form");
    if (addressForm) {
        addressForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const calle = document.getElementById("calle").value;
            const ciudad = document.getElementById("ciudad").value;
            const codigoPostal = document.getElementById("codigo-postal").value;

            try {
                const res = await fetch("/api/auth/direccion", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ calle, ciudad, codigoPostal })
                });

                const data = await res.json();
                if (res.ok) {
                    alert("¡Dirección guardada con éxito!");
                    tieneDireccion = true;
                    mostrarCarrito();
                } else {
                    alert(`Error: ${data.error || "No se pudo guardar la dirección"}`);
                }
            } catch (error) {
                console.error("Error de red:", error);
                alert("Hubo un error al conectar con el servidor.");
            }
        });
    }

    mostrarCarrito();

    const formularioContacto = document.getElementById("contacto-form");
    if (formularioContacto) {
        formularioContacto.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nombre = document.getElementById("contacto-nombre").value;
            const apellido = document.getElementById("contacto-apellido").value;
            const mail = document.getElementById("contacto-mail").value;
            const mensaje = document.getElementById("contacto-mensaje").value;

            try {
                const respuesta = await fetch("/api/contacto", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nombre, apellido, mail, mensaje })
                });

                const resultado = await respuesta.json();

                if (respuesta.ok) {
                    alert("¡Mensaje enviado con éxito! Gracias por contactarte.");
                    formularioContacto.reset();
                } else {
                    alert(`Error: ${resultado.error || "No se pudo enviar el mensaje."}`);
                }
            } catch (error) {
                console.error("Error al enviar el formulario:", error);
                alert("Hubo un problema de conexión con el servidor.");
            }
        });
    }
});