AutopartesWeb
Plataforma full-stack diseñada para la gestión integral de un e-commerce de autopartes. Este proyecto abarca desde la visualización de productos y lógica de carrito, hasta la autenticación segura y procesamiento de pagos.

Tecnologías utilizadas
Backend: Node.js, Express.

Base de Datos: MySQL (gestionada a través de Aiven).

ORM: Sequelize.

Autenticación: Google OAuth.

Pagos: PayPal SDK.

Despliegue: Render.

Funcionalidades Principales
Gestión de Usuarios: Registro e inicio de sesión mediante Google Auth.

Catálogo de Productos: Visualización dinámica de autopartes.

Carrito de Compras: Lógica de persistencia y gestión de ítems.

Pasarela de Pagos: Integración funcional con PayPal para la creación y captura de órdenes.

Panel de Control: Gestión de base de datos poblada mediante scripts de inicialización.

Despliegue en Producción
La aplicación se encuentra desplegada y operativa en Render:
https://autopartesweb.onrender.com

Instalación Local
Para levantar el proyecto en tu entorno local:

Cloná el repositorio: git clone https://github.com/Osval88/AutopartesWeb

Instalá las dependencias:

Bash
npm install
Configurá tus variables de entorno creando un archivo .env en la raíz con las siguientes claves:

PORT, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET

DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_DIALECT

GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL

Iniciá el servidor:

Bash
npm start