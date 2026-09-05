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
        aviso.querySelector('[data-mensaje]').textContent = mensaje;
        aviso.classList.toggle('error', error);
        aviso.hidden = false;
    };
    aviso?.querySelector('button').addEventListener('click', () => { aviso.hidden = true; });

    document.querySelectorAll('[data-auto-submit]').forEach(select => {
        select.addEventListener('change', () => select.form.requestSubmit());
    });

    document.querySelectorAll('[data-agregar-carrito]').forEach(form => {
        form.addEventListener('submit', async event => {
            event.preventDefault();
            const boton = form.querySelector('button[type="submit"]');
            if (boton.disabled) return;
            boton.disabled = true;
            boton.setAttribute('aria-busy', 'true');
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
            } catch {
                mostrarAviso('No pudimos confirmar la actualización. Revisa tu carrito antes de volver a agregar.', true);
            } finally {
                boton.disabled = false;
                boton.removeAttribute('aria-busy');
            }
        });
    });

    document.querySelector('[data-error-formulario]')?.focus();
    document.querySelector('#form-pedido')?.addEventListener('submit', event => {
        if (event.target.checkValidity()) {
            const boton = event.target.querySelector('[data-confirmar-pedido]');
            boton.disabled = true;
            boton.textContent = 'Registrando pedido…';
        }
    });
})();
