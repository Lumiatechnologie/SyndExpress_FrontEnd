import React, { useEffect, useMemo, useState } from 'react'
import axios from '@/auth/api/axios'
import { Plus, Search, Trash2, Pencil, RefreshCcw, Home, Loader2 } from 'lucide-react'

// --- Types (calqués sur ton DTO backend)
export type HabitableUnitDTO = {
  id?: number
  registrationNumber: string
  address?: string | null
  matrisynd?: string | null
  startActivity: string // "YYYY-MM"
  totalCotisation?: number
  totalPrestation?: number
  fixedAmount: number
}

// --- UI helpers
const SectionTitle: React.FC<{ icon?: React.ReactNode; children: React.ReactNode }>=({icon,children})=> (
  <div className="flex items-center gap-2">
    {icon}
    <h2 className="text-lg font-semibold tracking-tight">{children}</h2>
  </div>
)

const EmptyState: React.FC<{ title: string; subtitle?: string; cta?: React.ReactNode }> = ({ title, subtitle, cta }) => (
  <div className="border rounded-2xl p-10 text-center bg-gradient-to-b from-white to-slate-50">
    <div className="mx-auto mb-4 grid place-items-center h-14 w-14 rounded-full bg-slate-100">
      <Home className="h-6 w-6 text-slate-500" />
    </div>
    <h3 className="text-xl font-medium">{title}</h3>
    {subtitle && <p className="text-slate-600 mt-1">{subtitle}</p>}
    {cta && <div className="mt-6">{cta}</div>}
  </div>
)

const LoadingOverlay: React.FC<{ label?: string }> = ({ label = 'Chargement…' }) => (
  <div className="absolute inset-0 grid place-items-center bg-white/60 backdrop-blur-sm rounded-2xl">
    <div className="flex items-center gap-2 text-slate-700">
      <Loader2 className="h-5 w-5 animate-spin" />
      <span>{label}</span>
    </div>
  </div>
)

// --- Modals ultra légers sans deps
const Modal: React.FC<{ open: boolean; onClose: () => void; title: string; children: React.ReactNode; footer?: React.ReactNode }>=({open,onClose,title,children,footer})=> {
  if(!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-base font-semibold">{title}</h3>
            <button onClick={onClose} className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100">✕</button>
          </div>
          <div className="p-4">{children}</div>
          {footer && <div className="p-4 border-t bg-slate-50 rounded-b-2xl">{footer}</div>}
        </div>
      </div>
    </div>
  )
}

// --- Page principale
const HabitatsAdminPage: React.FC = () => {
  const [items, setItems] = useState<HabitableUnitDTO[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Formulaire création/édition
  const [openForm, setOpenForm] = useState(false)
  const [editing, setEditing] = useState<HabitableUnitDTO | null>(null)
  const [form, setForm] = useState<HabitableUnitDTO>({
    registrationNumber: '',
    address: '',
    startActivity: new Date().toISOString().slice(0,7),
    totalCotisation: 0,
    totalPrestation: 0,
    fixedAmount: 0,
  })

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if(!q) return items
    return items.filter(it =>
      it.registrationNumber.toLowerCase().includes(q) ||
      (it.address ?? '').toLowerCase().includes(q)
    )
  }, [items, query])

  // Charger la liste
  const fetchAll = async () => {
    setLoading(true)
    setError(null)
    try {
      // NOTE: ton contrôleur expose GET /api/habitUnit/getHabitats
      const { data } = await axios.get<HabitableUnitDTO[]>(`/api/habitUnit/getHabitats`)
      setItems(data)
    } catch (e:any) {
      setError(e?.response?.data?.message || 'Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const onOpenCreate = () => {
    setEditing(null)
    setForm({ registrationNumber: '', address: '', startActivity: new Date().toISOString().slice(0,7), totalCotisation: 0, totalPrestation: 0, fixedAmount: 0 })
    setOpenForm(true)
  }

  const onOpenEdit = (row: HabitableUnitDTO) => {
    setEditing(row)
    setForm({
      registrationNumber: row.registrationNumber,
      address: row.address || '',
      startActivity: row.startActivity,
      totalCotisation: row.totalCotisation ?? 0,
      totalPrestation: row.totalPrestation ?? 0,
      fixedAmount: row.fixedAmount,
    })
    setOpenForm(true)
  }

  const submitForm = async () => {
    setBusy(true)
    setError(null)
    try {
      if(editing){
        // PATCH /api/habitUnit/update
        const { data } = await axios.patch<HabitableUnitDTO>(`/api/habitUnit/update`, form)
        setItems(prev => prev.map(it => it.registrationNumber===data.registrationNumber? data: it))
      } else {
        // POST /api/habitUnit/save
        const { data } = await axios.post<HabitableUnitDTO>(`/api/habitUnit/save`, form)
        setItems(prev => [data, ...prev])
      }
      setOpenForm(false)
    } catch (e:any) {
      setError(e?.response?.data?.message || 'Erreur lors de la sauvegarde')
    } finally {
      setBusy(false)
    }
  }

  const onDelete = async (registrationNumber: string) => {
    if(!confirm('Supprimer définitivement cette unité ?')) return
    setBusy(true)
    setError(null)
    try {
      // DELETE /api/habitUnit/delete/{registrationNumber}
      await axios.delete(`/api/habitUnit/delete/${registrationNumber}`)
      setItems(prev => prev.filter(it => it.registrationNumber !== registrationNumber))
    } catch (e:any) {
      setError(e?.response?.data?.message || 'Suppression impossible')
    } finally { setBusy(false) }
  }

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
        <div className="flex-1">
          <SectionTitle icon={<Home className="h-5 w-5 text-slate-500"/>}>Gestion des Habitats</SectionTitle>
          <p className="text-sm text-slate-600 mt-1">Crée, recherche et gère les unités habitables. Accès réservé aux administrateurs et modérateurs.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchAll} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border bg-white hover:bg-slate-50">
            <RefreshCcw className="h-4 w-4"/>
            Actualiser
          </button>
          <button onClick={onOpenCreate} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white shadow hover:shadow-md">
            <Plus className="h-4 w-4"/> Ajouter
          </button>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"/>
        <input
          value={query}
          onChange={(e)=>setQuery(e.target.value)}
          placeholder="Rechercher par numéro d\'immatriculation ou adresse…"
          className="w-full pl-10 pr-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
      </div>

      <div className="relative border rounded-2xl overflow-hidden">
        {loading && <LoadingOverlay />}    
        {error && (
          <div className="p-4 bg-red-50 text-red-700 border-b">{error}</div>
        )}
        {filtered.length === 0 && !loading ? (
          <EmptyState
            title="Aucune unité"
            subtitle="Ajoute ta première unité habitable pour commencer."
            cta={
              <button onClick={onOpenCreate} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white">
                <Plus className="h-4 w-4"/> Nouvelle unité
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-slate-600">
                  <th className="px-3 py-3">Registration</th>
                  <th className="px-3 py-3">Adresse</th>
                  <th className="px-3 py-3">Début activité</th>
                  <th className="px-3 py-3">Cotisation</th>
                  <th className="px-3 py-3">Prestation</th>
                  <th className="px-3 py-3">Montant fixe</th>
                  <th className="px-3 py-3 w-36">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((it) => (
                  <tr key={it.registrationNumber} className="border-t hover:bg-slate-50">
                    <td className="px-3 py-3 font-medium">{it.registrationNumber}</td>
                    <td className="px-3 py-3">{it.address || '—'}</td>
                    <td className="px-3 py-3">{it.startActivity}</td>
                    <td className="px-3 py-3">{(it.totalCotisation ?? 0).toFixed(2)}</td>
                    <td className="px-3 py-3">{(it.totalPrestation ?? 0).toFixed(2)}</td>
                    <td className="px-3 py-3">{it.fixedAmount.toFixed(2)}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={()=>onOpenEdit(it)} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border bg-white hover:bg-slate-100">
                          <Pencil className="h-4 w-4"/>
                        </button>
                        <button onClick={()=>onDelete(it.registrationNumber)} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4"/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal création / édition */}
      <Modal open={openForm} onClose={()=>!busy && setOpenForm(false)} title={editing? 'Modifier une unité':'Nouvelle unité'}
        footer={
          <div className="flex items-center justify-end gap-2">
            <button disabled={busy} onClick={()=>setOpenForm(false)} className="px-4 py-2 rounded-xl border bg-white hover:bg-slate-50">Annuler</button>
            <button disabled={busy} onClick={submitForm} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white">
              {busy && <Loader2 className="h-4 w-4 animate-spin"/>}
              {editing? 'Enregistrer':'Créer'}
            </button>
          </div>
        }
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Registration number">
            <input
              className="w-full border rounded-xl px-3 py-2"
              value={form.registrationNumber}
              onChange={(e)=>setForm({...form, registrationNumber: e.target.value})}
              disabled={!!editing}
              placeholder="I3X8JG5"
            />
          </Field>
          <Field label="Adresse">
            <input className="w-full border rounded-xl px-3 py-2" value={form.address ?? ''} onChange={(e)=>setForm({...form, address: e.target.value})} />
          </Field>
          <Field label="Début activité (YYYY-MM)">
            <input className="w-full border rounded-xl px-3 py-2" value={form.startActivity} onChange={(e)=>setForm({...form, startActivity: e.target.value})} />
          </Field>
          <Field label="Montant fixe">
            <input type="number" className="w-full border rounded-xl px-3 py-2" value={form.fixedAmount} onChange={(e)=>setForm({...form, fixedAmount: Number(e.target.value)})} />
          </Field>
          <Field label="Total cotisation">
            <input type="number" className="w-full border rounded-xl px-3 py-2" value={form.totalCotisation ?? 0} onChange={(e)=>setForm({...form, totalCotisation: Number(e.target.value)})} />
          </Field>
          <Field label="Total prestation">
            <input type="number" className="w-full border rounded-xl px-3 py-2" value={form.totalPrestation ?? 0} onChange={(e)=>setForm({...form, totalPrestation: Number(e.target.value)})} />
          </Field>
        </div>
      </Modal>
    </div>
  )
}

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="block">
    <span className="block text-sm text-slate-600 mb-1">{label}</span>
    {children}
  </label>
)

export default HabitatsAdminPage
