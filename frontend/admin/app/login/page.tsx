"use client";

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { authApi } from '@/lib/api';
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await authApi.login({ email, password });
      if (res && res.data && res.data.accessToken) {
        login(res.data.accessToken, res.data.user || { id: '1', email, role: 'SUPER_ADMIN' });
      } else {
        setErrorMsg('Invalid authentication response from server');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md space-y-8 rounded-3xl bg-zinc-900 border border-zinc-800 p-8 sm:p-10 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white font-black text-2xl shadow-xl shadow-red-600/30">
            U
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            Admin Portal
          </h2>
          <p className="text-sm text-zinc-400">
            Sign in to access Udan Cabs dispatch and inventory
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-500">
            <AlertCircle size={18} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@udancabs.com"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 pl-11 pr-4 py-3 text-sm text-zinc-100 outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all placeholder:text-zinc-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 pl-11 pr-4 py-3 text-sm text-zinc-100 outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all placeholder:text-zinc-600"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3.5 text-sm font-bold text-white hover:bg-red-500 transition-all shadow-lg shadow-red-600/25 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
