(() => {
    const filtros = document.querySelector('.filtros-desplegable');
    if (filtros) {
        const pantallaMovil = window.matchMedia('(max-width: 640px)');
        const ajustarFiltros = () => { filtros.open = !pantallaMovil.matches; };
        ajustarFiltros();
        pantallaMovil.addEventListener('change', ajustarFiltros);
    }

    const aviso = document.querySelector('#notificacion');
    const mostrarAviso = (mensaje, error = false) => {
        if (!aviso) return;
        aviso.querySelector('[data-mensaje]').textContent = mensaje;
        aviso.classList.toggle('error', error);
        aviso.querySelector('[data-aviso-icono]')?.toggleAttribute('hidden', error);
        aviso.hidden = false;
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
                    contador.textContent = datos.cantidad;
                });
                mostrarAviso(datos.mensaje, !datos.ok);
                if (datos.ok) {
                    boton.setAttribute('data-agregado', '');
                    if (etiqueta) etiqueta.textContent = 'Agregado';
                    if (icono) icono.setAttribute('href', '#i-check');
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
