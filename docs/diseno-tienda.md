# Diseño de la tienda El Tornillo

La portada sirve para comprar: buscador, categorías, productos, precio y carrito. El inventario y sus acciones se presentan en una sección exclusiva para administradores.

## Sistema visual

- Azul taller `#16324F`: cabecera, texto principal y botones de compra.
- Amarillo herramienta `#F5C542`: marca y portada, con texto azul oscuro.
- Blanco `#FFFFFF`: superficies de producto y formularios.
- Gris zinc `#F3F5F7`: fondo de la tienda y escenarios de las ilustraciones.
- Gris acero `#526171`: texto secundario.
- Verde disponibilidad `#246345`: estados con stock; los agotados también tienen texto explícito.
- Tipografía: Trebuchet MS para títulos y marca, sistema sans-serif para lectura. Fuentes locales para funcionar sin servicios externos.
- Contenido alineado a la izquierda, ancho máximo de 1280 px, catálogo de cuatro columnas que pasa a dos y luego una en pantallas pequeñas.

```text
Marca       Buscar productos          Mi cuenta / Carrito
Tienda      Categorías de ferretería
Mensaje de tienda + acción            Ilustraciones de herramientas
Categorías / disponibilidad | Productos en tarjetas / ordenar
Pie de tienda
```

La búsqueda de la habilidad UI/UX devolvió recomendaciones de otros sectores incluso tras acotar la consulta. Se toman sus reglas generales de interacción como respaldo, conservando una dirección propia para la ferretería. Se descartan el patrón comercial B2B y la paleta de farmacia sugeridos: las acciones principales son explorar productos y añadir al carrito. Las ilustraciones vectoriales son referenciales y se identifican como tales en el detalle.

## Flujos

- Un visitante puede explorar y armar su carrito; al confirmar un pedido inicia sesión o crea su cuenta.
- Un mismo acceso autentica clientes y administradores. Los permisos reales del usuario determinan el acceso a gestión.
- El administrador crea, edita y elimina productos, modifica stock y revisa pedidos.
- El pedido es una demostración sin cobros; comprueba stock, registra el pedido y descuenta existencias.
- ES1 conserva el JSON original con 40 productos. La administración solicitada utiliza un archivo local separado; las credenciales y roles se leen desde `data/usuarios.json`; Django conserva IDs de usuario y sesiones en SQLite, ampliación respecto del PDF.
