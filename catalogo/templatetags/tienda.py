from django import template

register = template.Library()

ILUSTRACIONES = (
    "martillo", "destornillador", "alicate", "llave", "huincha",
    "taladro", "sierra", "sierra", "taladro", "caja",
    "tornillos", "tornillos", "tornillos", "tornillos", "tornillos",
    "pintura", "pintura", "rodillo", "brocha", "cinta",
    "cable", "caja", "caja", "ampolleta", "cable",
    "tuberia", "tuberia", "cinta", "tuberia", "pintura",
    "saco", "saco", "silicona", "silicona", "caja",
    "guantes", "lentes", "casco", "protector", "protector",
)


@register.filter
def ilustracion(producto):
    if producto.get("ilustracion"):
        return producto["ilustracion"]
    indice = producto["id"] - 1
    return ILUSTRACIONES[indice] if 0 <= indice < len(ILUSTRACIONES) else "caja"


@register.filter
def pesos(valor):
    return "$" + f"{int(valor):,}".replace(",", ".")
