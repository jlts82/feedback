// Configuración Supabase
// IMPORTANTE: la anon key puede ir en frontend siempre que RLS esté activo.
const SUPABASE_URL = 'https://pohwjytlofffhbcxbmso.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvaHdqeXRsb2ZmZmhiY3hibXNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MTQ4MTksImV4cCI6MjA5NDA5MDgxOX0.gFT_ekR54S54K7xghSHuoMNSlqpeD5GGj7igFsvzUnY';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const VALID_ROLES = ['administrador', 'usuario'];

function cleanText(value, fallback = '') {
  const text = String(value || fallback).trim();
  if (window.DOMPurify) return DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  return text.replace(/[<>]/g, '');
}

const auth = {
  user: null,
  profile: null,
  role: 'usuario',

  async init() {
    this.bindLogin();

    const { data, error } = await supabaseClient.auth.getSession();
    if (error) console.warn('No se pudo leer la sesión:', error.message);

    if (data?.session?.user) {
      this.user = data.session.user;
      await this.loadProfile();
      this.showApp();
      this.applyRoleUI();
      return;
    }

    this.showLogin();
  },

  bindLogin() {
    const form = document.getElementById('login-form');
    if (!form || form.dataset.bound === 'true') return;

    form.dataset.bound = 'true';
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const email = cleanText(document.getElementById('login-email')?.value || '').toLowerCase();
      const password = document.getElementById('login-password')?.value || '';
      const btn = document.getElementById('login-submit');
      const errorBox = document.getElementById('login-error');

      if (!email || !password) {
        this.showLoginError('Ingresa correo y contraseña.');
        return;
      }

      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Validando...';
      }
      errorBox?.classList.add('hidden');

      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Iniciar sesión';
      }

      if (error || !data?.user) {
        this.showLoginError('Correo o contraseña incorrectos.');
        return;
      }

      this.user = data.user;
      await this.loadProfile();
      this.showApp();
      this.applyRoleUI();

      if (window.router) router.navigate('dashboard');
    });
  },

  showLoginError(message) {
    const errorBox = document.getElementById('login-error');
    if (!errorBox) return;
    errorBox.textContent = message;
    errorBox.classList.remove('hidden');
  },

  async loadProfile() {
    this.profile = null;
    this.role = 'usuario';

    if (!this.user?.id) return;

    // El email NO vive en public.profiles; viene desde auth/session.
    const fallbackName = this.user.user_metadata?.full_name || this.user.email || 'Usuario';

    const { data, error } = await supabaseClient
      .from('profiles')
      .select('id, full_name, role, created_at, updated_at')
      .eq('id', this.user.id)
      .maybeSingle();

    if (!error && data) {
      this.profile = data;
      this.role = VALID_ROLES.includes(data.role) ? data.role : 'usuario';
      return;
    }

    // Si el usuario existe en Auth pero todavía no tiene perfil, se crea como usuario general.
    // Para convertirlo en administrador, se actualiza desde SQL usando el correo en auth.users.
    const { data: insertedProfile, error: insertError } = await supabaseClient
      .from('profiles')
      .insert({
        id: this.user.id,
        full_name: cleanText(fallbackName),
        role: 'usuario'
      })
      .select('id, full_name, role, created_at, updated_at')
      .single();

    if (!insertError && insertedProfile) {
      this.profile = insertedProfile;
      this.role = insertedProfile.role;
      return;
    }

    console.warn('No se pudo cargar/crear profile:', error?.message || insertError?.message);
    this.profile = {
      id: this.user.id,
      full_name: cleanText(fallbackName),
      role: 'usuario'
    };
    this.role = 'usuario';
  },

  canAccessRoute(route) {
    if (route === 'finanzas' && this.role !== 'administrador') return false;
    return true;
  },

  applyRoleUI() {
    const isAdmin = this.role === 'administrador';

    document.querySelectorAll('.admin-only, [data-admin-only="true"]').forEach(el => {
      el.classList.toggle('hidden', !isAdmin);
    });

    const displayName = this.profile?.full_name || this.user?.email || 'Usuario';
    const roleLabel = isAdmin ? 'Administrador' : 'Usuario general';

    const nameEl = document.getElementById('current-user-name');
    const roleEl = document.getElementById('current-user-role');

    if (nameEl) nameEl.textContent = cleanText(displayName);
    if (roleEl) roleEl.textContent = roleLabel;
  },

  showLogin() {
    document.getElementById('login-screen')?.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  },

  showApp() {
    document.getElementById('login-screen')?.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  },

  async logout() {
    await supabaseClient.auth.signOut();
    location.reload();
  }
};

window.auth = auth;
window.supabaseClient = supabaseClient;
