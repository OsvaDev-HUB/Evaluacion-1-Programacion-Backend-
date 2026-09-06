# Diseño de la tienda El Tornillo

La portada sirve para comprar: buscador, categorías, productos, precio y carrito. El inventario y sus acciones se presentan en una sección exclusiva para administradores.

## Sistema visual

La dirección elegida por el usuario es «A medida»: un catálogo de taller con grafito, aluminio claro, blanco y naranja. El sistema normativo de colores, tipografía y componentes está en [DESIGN.md](../.impeccable/DESIGN.md), extraído del CSS implementado. [El sidecar de Impeccable](../.impeccable/design.json) contiene estados, cortes de pantalla y ejemplos de componentes; sus rampas de color sirven únicamente para previsualización.

- Grafito para cabecera, pie y texto principal; blanco para productos y formularios; aluminio para el fondo y los paneles.
- Naranja para acciones y selección. Verde para disponibilidad y confirmación; rojo para errores, agotados y acciones destructivas, siempre acompañado por texto.
- League Gothic Regular para marca y titulares expresivos; Barlow Condensed Medium/SemiBold para encabezados; Arial, Segoe UI y sans-serif para lectura. Las dos familias condensadas se sirven localmente con sus licencias OFL.
- Celdas de producto contiguas con bordes finos y esquinas rectas. Los controles tienen radio de 2px y altura mínima de 44px. La notificación flotante es la única superficie con sombra.
- Contenedor de hasta 1552px. El catálogo pasa de cuatro columnas a tres hasta 1100px, dos hasta 850px y una hasta 359px. A 640px, los filtros se convierten en un desplegable sobre los resultados y los márgenes laterales son de 16px.

La cabecera agrupa marca, búsqueda y cuenta/carrito; la navegación de categorías ocupa una franja inferior. En escritorio, el índice lateral acompaña al titular «Manos a la obra.», el resumen, el orden y la retícula de productos. Su ancho real es 264px, con ajustes a 220px y 194px; los 240px de la referencia inicial no son una constante del código final.

Se conservan las fotografías referenciales existentes y sus originales en `Public/Products/`; el rediseño no generó nuevas fotografías de producto con IA. Las imágenes se contienen completas sobre blanco. El SVG existente actúa como respaldo cuando no hay foto y la ficha identifica el carácter referencial de la imagen. Los colores propios de esos recursos no definen la paleta de la interfaz.

## Interacción y adaptación

Agregar al carrito conserva el formulario y añade confirmación mediante JavaScript: estado «Agregando…», resultado «Agregado» en verde durante 1600ms, contador actualizado y aviso accesible con enlace al carrito. Los errores muestran una explicación y restauran el botón. La interfaz mantiene foco visible, salto al contenido, etiquetas y navegación semántica. El movimiento es breve y se desactiva cuando el usuario pide reducirlo.

Compra se apila a 850px; ficha y acceso, a 640px. En acceso móvil aparece primero el formulario. Inventario mantiene tabla con desplazamiento horizontal local y un resumen de dos columnas en móvil. Estas adaptaciones comparten el mismo CSS que la tienda.

## Flujos

- Un visitante puede explorar y armar su carrito; al confirmar un pedido inicia sesión o crea su cuenta.
- Un mismo acceso autentica clientes y administradores. Los permisos reales del usuario determinan el acceso a gestión.
- El administrador crea, edita y elimina productos, modifica stock y revisa pedidos.
- El pedido es una demostración sin cobros; comprueba stock, registra el pedido y descuenta existencias.
- ES1 conserva el JSON original con 40 productos. La administración solicitada utiliza un archivo local separado; las credenciales y roles se leen desde `data/usuarios.json`; Django conserva IDs de usuario y sesiones en SQLite, ampliación respecto del PDF.
