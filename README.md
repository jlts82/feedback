# FeedBack Personalizados - versión segura

Proyecto estático preparado para probarse localmente, en GitHub Pages o Vercel.

## Archivos

- `index.html`: estructura principal.
- `styles.css`: estilos separados.
- `auth.js`: conexión Supabase, login, logout y roles.
- `app.js`: lógica de la aplicación.
- `supabase_setup.sql`: tablas, trigger de perfiles, RLS y comandos de verificación.

## Probar local

```bash
cd feedback_personalizado_seguro
python3 -m http.server 8080
```

Abrir:

```text
http://localhost:8080
```

## Supabase

1. Abre Supabase > SQL Editor.
2. Ejecuta completo `supabase_setup.sql`.
3. Crea usuarios en Authentication > Users.
4. Para hacer administrador a un usuario, ejecuta:

```sql
update public.profiles
set role = 'administrador'
where id = (
  select id from auth.users where email = 'TU_CORREO@DOMINIO.COM'
);
```

## Roles

- `administrador`: ve todo, incluyendo Finanzas.
- `usuario`: no ve Finanzas y no puede entrar a esa ruta desde el frontend.

## Nota importante

El correo del usuario está en `auth.users`, no en `public.profiles`. El frontend toma el correo desde la sesión de Supabase y usa `profiles` solo para `full_name` y `role`.


## V3 - Administración de usuarios

Se agregó el módulo **Usuarios**, visible solo para administradores. Ejecuta nuevamente `supabase_setup.sql` en Supabase para crear las funciones RPC `admin_list_users` y `admin_update_user_profile`.

Desde el módulo puedes cambiar `full_name` y `role`. Los usuarios se siguen creando desde Supabase Authentication.
