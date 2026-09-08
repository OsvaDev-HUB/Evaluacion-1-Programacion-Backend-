# Diseño de la tienda El Tornillo

La portada `/` presenta la ferretería y orienta al cliente con ideas de proyectos, una sección Nuestra historia, una guía breve, una sección Contacto y el botón «Ver catálogo». Ese botón abre `/catalogo/`, una página independiente con productos, precios, búsqueda, filtros y orden. El hero usa la imagen aportada en `Public/LandingPage/depositphotos_426512230-stock-photo-impulse-for-changes-essential-tips.jpg`, copiada como `catalogo/static/catalogo/img/landing/deposit-hero.webp` para servirla con Django. El inventario y sus acciones se presentan en una sección exclusiva para administradores.

## Sistema visual

La dirección elegida por el usuario es «A medida»: un catálogo de taller con grafito, aluminio claro, blanco y naranja. El sistema normativo de colores, tipografía y componentes está en [DESIGN.md](../.impeccable/DESIGN.md), extraído del CSS implementado. [El sidecar de Impeccable](../.impeccable/design.json) contiene estados, cortes de pantalla y ejemplos de componentes; sus rampas de color sirven únicamente para previsualización.

- Grafito para cabecera, pie y texto principal; blanco para productos y formularios; aluminio para el fondo y los paneles.
- Naranja para acciones y selección. Verde para disponibilidad y confirmación; rojo para errores, agotados y acciones destructivas, siempre acompañado por texto.
- League Gothic Regular para marca y titulares expresivos; Barlow Condensed Medium/SemiBold para encabezados; Arial, Segoe UI y sans-serif para lectura. Las dos familias condensadas se sirven localmente con sus licencias OFL.
- Celdas de producto contiguas con bordes finos y esquinas rectas. Los controles tienen radio de 2px y altura mínima de 44px. La notificación flotante es la única superficie con sombra.
- Contenedor de hasta 1552px. El catálogo pasa de cuatro columnas a tres hasta 1100px, dos hasta 850px y una hasta 359px. A 640px, los filtros se convierten en un desplegable sobre los resultados y los márgenes laterales son de 16px.

La landing tiene una cabecera simple con Inicio, Nuestra historia, Cómo comprar, Contacto y Catálogo, además de cuenta y carrito. Su presentación combina texto y fotografía en dos columnas, apiladas hasta 640px. Conserva la paleta y las fuentes locales, con titular de hasta 96px. Nuestra historia usa una banda de grafito amplia, con tres párrafos de contexto. Las ideas de proyectos enlazan a tres categorías; la guía explica la compra en tres pasos; Contacto usa dos párrafos y tres rutas de ayuda antes de sus acciones. Estas secciones se apilan en móvil con espacios generosos y lectura lineal.

Dentro del catálogo, la cabecera incorpora búsqueda y navegación de categorías. El índice lateral acompaña al titular «Nuestro catálogo.», el resumen, el orden y la retícula de productos. Su ancho real es 264px, con ajustes a 220px y 194px; los 240px de la referencia inicial no son una constante del código final.

Se conservan las fotografías referenciales existentes y sus originales en `Public/Products/`; el rediseño no generó nuevas fotografías de producto con IA. Las imágenes se contienen completas sobre blanco. El SVG existente actúa como respaldo cuando no hay foto y la ficha identifica el carácter referencial de la imagen. Los colores propios de esos recursos no definen la paleta de la interfaz.

## Interacción y adaptación

La marca y los enlaces Inicio llevan a `/`; «Ver catálogo» lleva a `/catalogo/`. Nuestra historia, la guía y Contacto se encuentran en `/#historia`, `/#como-comprar` y `/#contacto`. Búsquedas, filtros, orden y enlaces «Seguir comprando» permanecen dentro de `/catalogo/`, con `#productos` cuando corresponde. Los enlaces nativos funcionan sin JavaScript y los saltos respetan la cabecera fija y el movimiento reducido.

Agregar al carrito conserva el formulario y añade confirmación mediante JavaScript: estado «Agregando…», resultado «Agregado» en verde durante 1600ms, contador actualizado y aviso accesible con enlace al carrito. Los errores muestran una explicación y restauran el botón. La interfaz mantiene foco visible, salto al contenido, etiquetas y navegación semántica. El movimiento es breve y se desactiva cuando el usuario pide reducirlo.

Compra se apila a 850px; ficha y acceso, a 640px. En acceso móvil aparece primero el formulario. Inventario mantiene tabla con desplazamiento horizontal local y un resumen de dos columnas en móvil. Estas adaptaciones comparten el mismo CSS que la tienda.

## Flujos

- La presentación invita a explorar; las tarjetas de producto y sus controles de compra se muestran exclusivamente en el catálogo y las páginas de compra.
- Un visitante puede explorar y armar su carrito; al confirmar un pedido inicia sesión o crea su cuenta.
- Un mismo acceso autentica clientes y administradores. Los permisos reales del usuario determinan el acceso a gestión.
- El administrador crea, edita y elimina productos, modifica stock y revisa pedidos.
- El pedido es una demostración sin cobros; comprueba stock, registra el pedido y descuenta existencias.
- ES1 conserva el JSON original con 40 productos. La administración solicitada utiliza un archivo local separado; las credenciales y roles se leen desde `data/usuarios.json`; Django conserva IDs de usuario y sesiones en SQLite, ampliación respecto del PDF.

## Psicología aplicada a la landing

La skill `marketing-psychology` guía tres decisiones. Jobs to Be Done orienta el texto y los accesos a reparar, renovar y construir. La ley de Hick reduce las opciones iniciales a una acción principal, «Ver catálogo», y reserva los filtros para el momento de explorar. La reducción de fricción explica que consultar precios, revisar stock y preparar el carrito no exige registrarse; la cuenta se solicita al confirmar.

La secuencia sigue AIDA: presentar el beneficio, mostrar proyectos posibles, explicar el siguiente paso y cerrar con la misma acción. Solo se comunican capacidades existentes; el pedido se identifica como demostración. Estas son hipótesis de diseño, no resultados medidos de conversión ni de pruebas con clientes.
