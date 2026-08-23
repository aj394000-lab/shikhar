'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppImage from '@/components/ui/AppImage';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, remember: rememberMe }),
      });
      if (response.ok) {
        setPassword('');
        router.replace('/admin');
        return;
      }
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setError(data.error || 'Incorrect username or password.');
    } catch {
      setError('Could not reach the server. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: '#050508', color: '#F5F5F7' }}
    >
      <div
        className="w-full max-w-md rounded-3xl border p-8 shadow-2xl"
        style={{
          background: 'rgba(19,20,40,0.95)',
          borderColor: 'rgba(42,43,69,0.7)',
          boxShadow: '0 0 60px rgba(123,47,190,0.18)',
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 relative">
            <AppImage
              src="/assets/images/image-1785475268438.png"
              alt="Creativva logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-[0.3em]"
              style={{ color: 'rgba(245,245,247,0.45)' }}
            >
              Restricted Area
            </p>
            <h1 className="text-xl font-extrabold" style={{ color: '#F5F5F7' }}>
              Admin Access
            </h1>
          </div>
        </div>

        <p className="text-sm leading-6 mb-6" style={{ color: 'rgba(245,245,247,0.65)' }}>
          Sign in to view lead submissions and manage entries.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-username"
              className="block text-xs font-semibold uppercase tracking-[0.2em] mb-2"
              style={{ color: 'rgba(245,245,247,0.45)' }}
            >
              Username
            </label>
            <input
              id="admin-username"
              name="username"
              type="text"
              autoComplete="username"
              maxLength={120}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter username"
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none"
              style={{
                background: 'rgba(30,31,53,0.8)',
                borderColor: 'rgba(42,43,69,0.8)',
                color: '#F5F5F7',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-semibold uppercase tracking-[0.2em] mb-2"
              style={{ color: 'rgba(245,245,247,0.45)' }}
            >
              Password
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              maxLength={200}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter password"
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none"
              style={{
                background: 'rgba(30,31,53,0.8)',
                borderColor: 'rgba(42,43,69,0.8)',
                color: '#F5F5F7',
              }}
            />
          </div>

          <label
            className="flex items-center gap-2 text-sm cursor-pointer"
            style={{ color: 'rgba(245,245,247,0.7)' }}
          >
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-gray-600 bg-transparent accent-purple-500"
            />
            Keep me signed in for 14 days
          </label>

          {error && (
            <p className="text-sm" style={{ color: '#F97316' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl px-4 py-3 font-bold text-sm transition-transform duration-200 hover:scale-[1.01] disabled:opacity-60 disabled:hover:scale-100"
            style={{ background: 'linear-gradient(135deg, #7B2FBE, #F97316)', color: '#FFFFFF' }}
          >
            {isSubmitting ? 'Signing in…' : 'Unlock Admin Panel'}
          </button>
        </form>
      </div>
    </div>
  );
}
