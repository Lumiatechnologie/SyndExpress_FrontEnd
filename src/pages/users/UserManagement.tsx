import React, { useEffect, useMemo, useState } from 'react';
import axiosInstance from '../../auth/api/axios';

// ---------- Types ----------
type UserDto = {
  id?: number;
  username?: string;
  email?: string;
  roles?: unknown;
  matricule?: string;
  startActivity?: string;
};

// ---------- Helpers rôles ----------
function toRoleString(r: unknown): string {
  if (typeof r === 'string') return r;
  if (r && typeof r === 'object') {
    const o = r as Record<string, unknown>;
    return String(o.name ?? o.role ?? o.authority ?? o.value ?? '');
  }
  return '';
}

function normalizeRole(roles?: unknown): string[] {
  const arr: unknown[] = Array.isArray(roles) ? roles : roles != null ? [roles] : [];
  return arr
    .map((it) => toRoleString(it))
    .filter((s): s is string => Boolean(s))
    .map((s) => s.replace(/^ROLE_/, ''))
    .map((s) => s.toUpperCase());
}

// ✅ CORRECTION : Retourne un string au lieu d'un array
function mapRole(value: 'user' | 'moderator'): string {
  return value === 'moderator' ? 'moderator' : 'user';
}

// ---------- API ----------
const API = {
  list: '/api/auth/users',
  add: '/api/auth/add-user',
  update: '/api/auth/update-user',
  remove: (username: string) => `/api/auth/delete/${encodeURIComponent(username)}`,
};

// ---------- Page ----------
const UserManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserDto[]>([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<UserDto | null>(null);
  const [form, setForm] = useState({
    username: '',
    email: '',
    role: 'user' as 'user' | 'moderator',
    password: '',
    matricule: '',
    startActivity: '',
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      [u.username, u.email, u.matricule].filter(Boolean).join(' ').toLowerCase().includes(q),
    );
  }, [users, query]);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get(API.list);

      const list: UserDto[] = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.content)
        ? res.data.content
        : [];

      setUsers(list);
    } catch (e: any) {
      console.error(e);
      setError(e?.response?.data?.message || e.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm({
      username: '',
      email: '',
      role: 'user',
      password: '',
      matricule: '',
      startActivity: '',
    });
    setFormOpen(true);
  }

  function openEdit(u: UserDto) {
    const rolesNorm = normalizeRole(u.roles);
    setEditing(u);
    setForm({
      username: u.username || '',
      email: u.email || '',
      role: rolesNorm.includes('MODERATOR') ? 'moderator' : 'user',
      password: '',
      matricule: u.matricule || '',
      startActivity: (u.startActivity || '').slice(0, 10),
    });
    setFormOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const payload = {
      id: editing?.id,
      username: form.username,
      email: form.email,
      role: mapRole(form.role),
      password: form.password || undefined,
      matricule: form.matricule,
      startActivity: form.startActivity,
    };

    console.log('Payload envoyé:', payload);

    try {
      setLoading(true);
      if (editing?.id) {
        await axiosInstance.put(API.update, payload);
      } else {
        await axiosInstance.post(API.add, payload);
      }
      setFormOpen(false);
      await fetchUsers();
    } catch (e: any) {
      console.error('Erreur:', e);
      setError(e?.response?.data?.message || e.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  }

  async function removeUser(u?: UserDto) {
    const username = u?.username?.trim();
    if (!username) return;
    if (!confirm(`Supprimer l'utilisateur « ${username} » ?`)) return;

    try {
      setLoading(true);
      setError(null);

      await axiosInstance.delete(API.remove(username));

      setUsers((prev) => prev.filter((x) => x.username !== username));
      await fetchUsers();
    } catch (e: any) {
      console.error(e);
      setError(e?.response?.data?.message || e.message || 'Suppression impossible');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Gestion des utilisateurs</h1>
          <p className="text-sm text-gray-500">Réservé au Modérateur</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher (nom, email, matricule)"
            className="border rounded-xl px-3 py-2"
          />
          <button onClick={openCreate} className="px-4 py-2 rounded-xl bg-black text-white">
            Nouvel utilisateur
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700">{error}</div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-xl overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-2 border-b">#</th>
              <th className="text-left px-4 py-2 border-b">Username</th>
              <th className="text-left px-4 py-2 border-b">Email</th>
              <th className="text-left px-4 py-2 border-b">Rôle</th>
              <th className="text-left px-4 py-2 border-b">Matricule</th>
              <th className="text-left px-4 py-2 border-b">Début activité</th>
              <th className="text-left px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center">
                  Chargement…
                </td>
              </tr>
            )}
            {!loading &&
              filtered.map((u, idx) => {
                const rolesText = normalizeRole(u.roles).join(', ');
                return (
                  <tr key={u.id ?? idx} className="odd:bg-white even:bg-gray-50">
                    <td className="px-4 py-2 border-b">{idx + 1}</td>
                    <td className="px-4 py-2 border-b">{u.username}</td>
                    <td className="px-4 py-2 border-b">{u.email}</td>
                    <td className="px-4 py-2 border-b">{rolesText || '—'}</td>
                    <td className="px-4 py-2 border-b">{u.matricule ?? '—'}</td>
                    <td className="px-4 py-2 border-b">{(u.startActivity ?? '').slice(0, 10)}</td>
                    <td className="px-4 py-2 border-b">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(u)} className="px-3 py-1 rounded-lg border">
                          Modifier
                        </button>
                        <button onClick={() => removeUser(u)} className="px-3 py-1 rounded-lg border">
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                  Aucun utilisateur
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {formOpen && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {editing ? 'Modifier' : 'Créer'} un utilisateur
              </h2>
              <button onClick={() => setFormOpen(false)} className="text-sm underline">
                Fermer
              </button>
            </div>
            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1">
                  <span className="text-sm">Username</span>
                  <input
                    required
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    className="border rounded-xl px-3 py-2"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-sm">Email</span>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="border rounded-xl px-3 py-2"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-sm">Rôle</span>
                  <select
                    value={form.role}
                    onChange={(e) =>
                      setForm({ ...form, role: e.target.value as 'user' | 'moderator' })
                    }
                    className="border rounded-xl px-3 py-2"
                  >
                    <option value="user">Utilisateur</option>
                    <option value="moderator">Modérateur</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-sm">
                    Mot de passe {editing && <em className="text-gray-400">(laisser vide)</em>}
                  </span>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="border rounded-xl px-3 py-2"
                    required={!editing}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-sm">Matricule</span>
                  <input
                    value={form.matricule}
                    onChange={(e) => setForm({ ...form, matricule: e.target.value })}
                    className="border rounded-xl px-3 py-2"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-sm">Début d'activité</span>
                  <input
                    type="date"
                    value={form.startActivity}
                    onChange={(e) => setForm({ ...form, startActivity: e.target.value })}
                    className="border rounded-xl px-3 py-2"
                  />
                </label>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2 rounded-xl border"
                >
                  Annuler
                </button>
                <button 
                  disabled={loading} 
                  type="submit" 
                  className="px-4 py-2 rounded-xl bg-black text-white disabled:opacity-50"
                >
                  {editing ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;