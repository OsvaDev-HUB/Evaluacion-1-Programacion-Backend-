from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import get_user_model
from django.db import transaction

from .usuarios import agregar_usuario, buscar_usuario, editar_usuarios


class RegistroForm(UserCreationForm):
    first_name = forms.CharField(label="Nombre", max_length=150)
    email = forms.EmailField(label="Correo electrónico")

    class Meta(UserCreationForm.Meta):
        model = get_user_model()
        fields = ("first_name", "email", "username", "password1", "password2")

    def clean_username(self):
        username = super().clean_username()
        if username and buscar_usuario(username):
            raise forms.ValidationError("Ya existe una cuenta con ese nombre de usuario.")
        return username

    def save(self, commit=True):
        usuario = super().save(commit=False)
        usuario.is_staff = False
        usuario.is_superuser = False
        if commit:
            with transaction.atomic():
                with editar_usuarios() as datos:
                    agregar_usuario(datos, usuario, self.cleaned_data["password1"])
                    usuario.save()
        return usuario


class ProductoForm(forms.Form):
    nombre = forms.CharField(label="Nombre del producto", max_length=120)
    categoria = forms.CharField(label="Categoría", max_length=60, widget=forms.TextInput(attrs={"list": "categorias"}))
    precio = forms.IntegerField(label="Precio en pesos chilenos", min_value=1, max_value=999999999)
    stock = forms.IntegerField(label="Stock disponible", min_value=0, max_value=999999)
    descripcion = forms.CharField(label="Descripción", max_length=1500, widget=forms.Textarea(attrs={"rows": 4}))
    ilustracion = forms.ChoiceField(label="Ilustración referencial", choices=[
        ("caja", "Producto / caja"), ("martillo", "Martillo"), ("destornillador", "Destornilladores"),
        ("alicate", "Alicate"), ("llave", "Llave ajustable"), ("huincha", "Huincha de medir"),
        ("taladro", "Taladro / atornillador"), ("sierra", "Sierra circular"),
        ("tornillos", "Fijaciones"), ("pintura", "Tarro de pintura"), ("rodillo", "Rodillo"),
        ("brocha", "Brocha"), ("cinta", "Cinta"), ("cable", "Cable eléctrico"),
        ("ampolleta", "Ampolleta"), ("tuberia", "Gasfitería"), ("saco", "Saco de construcción"),
        ("silicona", "Sellador"), ("guantes", "Guantes"), ("lentes", "Lentes de seguridad"),
        ("casco", "Casco"), ("protector", "Protección personal"),
    ])


class PedidoForm(forms.Form):
    nombre = forms.CharField(label="Nombre de quien retira", max_length=150)
    email = forms.EmailField(label="Correo electrónico")
    telefono = forms.RegexField(label="Teléfono de contacto", regex=r"^\+?[\d\s()-]{8,20}$", error_messages={"invalid": "Ingresa un teléfono válido de 8 a 20 caracteres."})
