(() => {
    const cabecera = document.querySelector('.encabezado-sitio');
    if (cabecera) {
        const ajustarEspacioCabecera = () => {
            document.documentElement.style.setProperty('--alto-cabecera', `${cabecera.offsetHeight}px`);
        };
        ajustarEspacioCabecera();
        if ('ResizeObserver' in window) {
            new ResizeObserver(ajustarEspacioCabecera).observe(cabecera);
        } else {
            window.addEventListener('resize', ajustarEspacioCabecera);
        }
    }

    const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animaciones = new Map();
    const animar = (elemento, cuadros, opciones = {}) => {
        if (!elemento) return;
        animaciones.get(elemento)?.cancel();
        if (movimientoReducido.matches || !elemento.animate) return;
        const animacion = elemento.animate(cuadros, {
            duration: 420, easing: 'cubic-bezier(.22, 1, .36, 1)', ...opciones,
        });
        animaciones.set(elemento, animacion);
        const limpiar = () => {
            if (animaciones.get(elemento) === animacion) animaciones.delete(elemento);
        };
        animacion.addEventListener('finish', limpiar, { once: true });
        animacion.addEventListener('cancel', limpiar, { once: true });
    };
    const entrada = [
        { opacity: 0, transform: 'translateY(18px)' },
        { opacity: 1, transform: 'translateY(0)' },
    ];
    let observador;
    if (!movimientoReducido.matches) {
        document.documentElement.classList.add('movimiento-activo');
        // El HTML permanece visible sin JavaScript o sin soporte de animaciones.
        // Cada tanda visible tiene su propia cascada, nunca una espera de 40 tarjetas.
        if ('IntersectionObserver' in window) {
            observador = new IntersectionObserver(entradas => {
                entradas.filter(item => item.isIntersecting).forEach((item, indice) => {
                    observador.unobserve(item.target);
                    if (!item.target.contains(document.activeElement)) {
                        animar(item.target, entrada, {
                            delay: Math.min(indice, 4) * 45, duration: 540, fill: 'backwards',
                        });
                    }
                });
            }, { threshold: 0.06 });
            document.querySelectorAll('.grilla-productos > .tarjeta-producto').forEach(tarjeta => {
                observador.observe(tarjeta);
            });

            // La portada usa la misma cascada que el catálogo, pero por bloques:
            // cada sección entra al acercarse al viewport y sus elementos se
            // espacian apenas para conservar el ritmo de lectura.
            const cascadasPresentacion = [
                '.historia-sello',
                '.historia-texto',
                '.proyectos-cabecera',
                '.proyectos-opciones > .proyecto-enlace',
                '.guia-compra-titulo',
                '.pasos-compra > li',
                '.contacto-interior > div',
                '.cierre-presentacion > *',
            ];
            cascadasPresentacion.flatMap(selector => [...document.querySelectorAll(selector)]).forEach(elemento => {
                observador.observe(elemento);
            });
        }
        document.querySelectorAll('.cabecera-seccion, .ficha-imagen, .ficha-contenido, .formulario-acceso, .presentacion-texto, .presentacion-imagen').forEach((elemento, indice) => {
            animar(elemento, entrada, { delay: indice * 70, fill: 'backwards' });
        });
    }
    // La interacción tiene prioridad: ningún control queda esperando su entrada.
    const terminarEntrada = event => {
        for (const [elemento, animacion] of animaciones) {
            if (elemento.contains(event.target)) animacion.cancel();
        }
    };
    document.addEventListener('focusin', terminarEntrada);
    document.addEventListener('pointerdown', terminarEntrada, { passive: true });
    movimientoReducido.addEventListener('change', () => {
        if (movimientoReducido.matches) {
            document.documentElement.classList.remove('movimiento-activo');
            observador?.disconnect();
            animaciones.forEach(animacion => animacion.cancel());
            animaciones.clear();
        }
    });

    const filtros = document.querySelector('.filtros-desplegable');
    if (filtros) {
        const pantallaMovil = window.matchMedia('(max-width: 640px)');
        const ajustarFiltros = () => { filtros.open = !pantallaMovil.matches; };
        ajustarFiltros();
        pantallaMovil.addEventListener('change', ajustarFiltros);
        filtros.addEventListener('toggle', () => {
            if (filtros.open && pantallaMovil.matches) {
                animar(filtros.querySelector('.filtros-interior'), [
                    { opacity: 0, transform: 'translateY(-6px)' },
                    { opacity: 1, transform: 'translateY(0)' },
                ], { duration: 240 });
            }
        });
    }

    const aviso = document.querySelector('#notificacion');
    const mostrarAviso = (mensaje, error = false) => {
        if (!aviso) return;
        aviso.querySelector('[data-mensaje]').textContent = mensaje;
        aviso.classList.toggle('error', error);
        aviso.querySelector('[data-aviso-icono]')?.toggleAttribute('hidden', error);
        const estabaOculto = aviso.hidden;
        aviso.hidden = false;
        if (estabaOculto) {
            animar(aviso, [
                { opacity: 0, transform: 'translate(-50%, 14px)' },
                { opacity: 1, transform: 'translate(-50%, 0)' },
            ], { duration: 280 });
        }
    };
    aviso?.querySelector('button').addEventListener('click', () => { aviso.hidden = true; });

    document.querySelectorAll('[data-auto-submit]').forEach(select => {
        select.addEventListener('change', () => select.form.requestSubmit());
    });

    document.querySelectorAll('[data-agregar-carrito]').forEach(form => {
        const boton = form.querySelector('button[type="submit"]');
        const etiqueta = boton.querySelector('[data-boton-texto]');
        const textoOriginal = etiqueta?.textContent;
        const icono = boton.querySelector('use');
        const iconoOriginal = icono?.getAttribute('href');
        let restauracion;
        const restaurarBoton = () => {
            boton.removeAttribute('data-agregado');
            if (etiqueta) etiqueta.textContent = textoOriginal;
            if (icono) icono.setAttribute('href', iconoOriginal);
        };
        form.addEventListener('submit', async event => {
            event.preventDefault();
            if (boton.disabled) return;
            clearTimeout(restauracion);
            restaurarBoton();
            boton.disabled = true;
            boton.setAttribute('aria-busy', 'true');
            if (etiqueta) etiqueta.textContent = 'Agregando…';
            try {
                const respuesta = await fetch(form.action, {
                    method: 'POST', body: new FormData(form),
                    headers: { Accept: 'application/json' }, credentials: 'same-origin',
                });
                if (!respuesta.headers.get('content-type')?.includes('application/json')) {
                    throw new Error('Respuesta inesperada');
                }
                const datos = await respuesta.json();
                document.querySelectorAll('[data-carrito-contador]').forEach(contador => {
                    const cambio = contador.textContent.trim() !== String(datos.cantidad);
                    contador.textContent = datos.cantidad;
                    if (cambio && datos.ok) animar(contador, [
                        { transform: 'scale(1)' },
                        { transform: 'scale(1.3)', offset: 0.4 },
                        { transform: 'scale(1)' },
                    ], { duration: 360 });
                });
                mostrarAviso(datos.mensaje, !datos.ok);
                if (datos.ok) {
                    boton.setAttribute('data-agregado', '');
                    if (etiqueta) etiqueta.textContent = 'Agregado';
                    if (icono) icono.setAttribute('href', '#i-check');
                    animar(boton.querySelector('.icono'), [
                        { transform: 'scale(.6)', opacity: 0 },
                        { transform: 'scale(1)', opacity: 1 },
                    ], { duration: 220 });
                    restauracion = setTimeout(restaurarBoton, 1600);
                } else {
                    restaurarBoton();
                }
            } catch {
                mostrarAviso('No pudimos confirmar la actualización. Revisa tu carrito antes de volver a agregar.', true);
                restaurarBoton();
            } finally {
                boton.disabled = false;
                boton.removeAttribute('aria-busy');
            }
        });
    });

    document.querySelector('[data-error-formulario]')?.focus();
    document.querySelector('#form-pedido')?.addEventListener('submit', event => {
        if (event.target.checkValidity()) {
            const boton = document.querySelector('[data-confirmar-pedido]');
            boton.disabled = true;
            boton.textContent = 'Registrando pedido…';
        }
    });
})();
