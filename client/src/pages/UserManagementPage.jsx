// src/pages/UserManagementPage.jsx â€” MVC View Layer
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { userService } from '../services/userService.js';
import { Badge } from '../components/common/Badge.jsx';
import { UserAvatar } from '../components/common/UserAvatar.jsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import { ErrorMessage } from '../components/common/ErrorMessage.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { ConfirmDialog } from '../components/common/ConfirmDialog.jsx';
import toast from 'react-hot-toast';

const createUserSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().email().max(254),
  password: z.string().min(8).max(128),
  role: z.enum(['admin', 'operator', 'viewer']),
});

export function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deactivateId, setDeactivateId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm({ resolver: zodResolver(createUserSchema), defaultValues: { role: 'viewer' } });

  async function loadUsers() {
    try { const r = await userService.list({ limit: 50 }); setUsers(r.data); }
    catch (err) { setError(err.message); }
    finally { setIsLoading(false); }
  }
  useEffect(() => { loadUsers(); }, []);

  async function onSubmit(data) {
    try { await userService.create(data); toast.success('User created'); reset(); setShowForm(false); loadUsers(); }
    catch (err) { toast.error(err.message); }
  }

  async function handleDeactivate() {
    try { await userService.deactivate(deactivateId); toast.success('User deactivated'); loadUsers(); }
    catch (err) { toast.error(err.message); }
    finally { setDeactivateId(null); }
  }

  async function handleDelete() {
    try { await userService.permanentlyDelete(deleteId); toast.success('User permanently deleted'); loadUsers(); }
    catch (err) { toast.error(err.message); }
    finally { setDeleteId(null); }
  }

  return (
    <div className="p-6 space-y-6 flex-1 min-h-screen" style={{ background: 'var(--neu-bg)' }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-main">User Management</h1>
          <p className="text-subtle text-sm mt-0.5">System accounts, avatars & access control</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="btn-accent px-4 py-2 text-sm font-semibold">
          {showForm ? 'âœ• Cancel' : '+ New User'}
        </button>
      </div>

      {showForm && (
        <div className="neu-flat p-6">
          <p className="text-xs text-subtle uppercase tracking-widest mb-4">Create User</p>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[['name','Name','text','Full name'],['email','Email','email','you@example.com'],['password','Password','password','â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢']].map(([field,label,type,ph]) => (
              <div key={field}>
                <label className="block text-xs text-subtle uppercase tracking-wider mb-1.5">{label}</label>
                <input type={type} {...register(field)} placeholder={ph}
                       className="neu-input w-full px-3 py-2.5 text-main text-sm" />
                {errors[field] && <p className="mt-1 text-red-500 text-xs">{errors[field].message}</p>}
              </div>
            ))}
            <div>
              <label className="block text-xs text-subtle uppercase tracking-wider mb-1.5">Role</label>
              <select {...register('role')} className="neu-input w-full px-3 py-2.5 text-main text-sm">
                <option value="viewer" style={{ background: 'var(--neu-surface)', color: 'var(--text-main)' }}>Viewer</option>
                <option value="operator" style={{ background: 'var(--neu-surface)', color: 'var(--text-main)' }}>Operator</option>
                <option value="admin" style={{ background: 'var(--neu-surface)', color: 'var(--text-main)' }}>Admin</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <button type="submit" disabled={isSubmitting}
                      className="btn-accent px-6 py-2.5 text-sm font-semibold disabled:opacity-50">
                {isSubmitting ? 'Creatingâ€¦' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? <LoadingSpinner className="mt-12" />
       : error ? <ErrorMessage message={error} />
       : users.length === 0 ? <EmptyState title="No users" description="Create the first user above." />
       : (
        <div className="neu-flat overflow-hidden">
          <table className="w-full text-sm text-main">
            <thead>
              <tr className="text-subtle text-xs border-b border-[var(--table-border)]">
                <th className="text-left px-4 py-3">User</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Verification</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Created</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-[var(--table-border)] hover:bg-[var(--table-hover)] transition-colors duration-200">
                  <td className="px-4 py-3 font-medium text-main flex items-center gap-3">
                    <UserAvatar user={u} size="md" />
                    <span>{u.name}</span>
                  </td>
                  <td className="px-4 py-3 text-subtle">{u.email}</td>
                  <td className="px-4 py-3">
                    <Badge
                      label={u.isEmailVerified !== false ? 'Verified' : 'Unverified'}
                      variant={u.isEmailVerified !== false ? 'running' : 'manual'}
                    />
                  </td>
                  <td className="px-4 py-3"><Badge label={u.role} variant={u.role} /></td>
                  <td className="px-4 py-3"><Badge label={u.isActive ? 'Active' : 'Inactive'} variant={u.isActive ? 'running' : 'failed'} /></td>
                  <td className="px-4 py-3 text-subtle">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {u.isActive && (
                        <button onClick={() => setDeactivateId(u._id)}
                                className="text-amber-500/90 hover:text-amber-500 text-xs font-semibold transition-colors">
                          Deactivate
                        </button>
                      )}
                      <button onClick={() => setDeleteId(u._id)}
                              className="text-red-500/90 hover:text-red-500 text-xs font-semibold transition-colors">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog isOpen={!!deactivateId} title="Deactivate User"
        message="This prevents the user from logging in."
        confirmLabel="Deactivate" danger
        onConfirm={handleDeactivate} onCancel={() => setDeactivateId(null)} />

      <ConfirmDialog isOpen={!!deleteId} title="Permanently Delete User"
        message="Are you sure? This user account will be permanently deleted from the database!"
        confirmLabel="Delete Permanently" danger
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}


