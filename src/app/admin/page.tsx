'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { clearAdminSession, persistAdminSession, readAdminSession } from '@/lib/admin-session';
import { readLeads, writeLeads, type Lead } from '@/lib/leads';

const DEFAULT_ADMIN_USERNAME = 'ShikharBoss';
const DEFAULT_ADMIN_PASSWORD = 'creativva2006';

const resolveAdminCredentials = () => {
  const configuredUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME?.trim();
  const configuredPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD?.trim();

  return {
    username: configuredUsername || DEFAULT_ADMIN_USERNAME,
    password: configuredPassword || DEFAULT_ADMIN_PASSWORD,
  };
};

const SERVICE_LABELS: Record<string, string> = {
  'social-media': 'Social Media Marketing',
  'content-creation': 'Content Creation',
  'paid-ads': 'Paid Advertising',
  seo: 'SEO & Analytics',
  'brand-identity': 'Brand Identity & Strategy',
  performance: 'Performance Marketing',
  'video-editing': 'Video Editing',
};

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [sessionNotice, setSessionNotice] = useState('');
  const [leadError, setLeadError] = useState('');
  const [leadWarning, setLeadWarning] = useState('');
  const [loadFailed, setLoadFailed] = useState(false);

  const createLeadId = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  };

  const reportLeadError = (message: string, cause: unknown) => {
    setLeadError(message);
    console.error(message, cause);
  };

  const timestampValue = (timestamp: string) => {
    const value = new Date(timestamp).getTime();
    return Number.isNaN(value) ? 0 : value;
  };

  useEffect(() => {
    setMounted(true);
    const sessionResult = readAdminSession();
    if (!sessionResult.ok) {
      setSessionNotice("This browser couldn't access admin session preferences.");
      console.error('Admin session storage is unavailable:', sessionResult.cause);
    } else if (sessionResult.value.remembered || sessionResult.value.active) {
      setIsUnlocked(true);
    }

    const result = readLeads();
    if (!result.ok) {
      setLoadFailed(true);
      setLeadWarning('');
      reportLeadError(result.error.message, result.error.cause);
      return;
    }

    setLeadError('');
    setLoadFailed(false);
    const { leads: storedLeads, skippedCount } = result.value;
    setLeadWarning(
      skippedCount > 0
        ? `${skippedCount} saved ${skippedCount === 1 ? 'entry is' : 'entries are'} unreadable and not shown.`
        : ''
    );
    const needsIdBackfill = storedLeads.some((lead) => !lead.id);
    const normalized = storedLeads.map((lead) => ({ ...lead, id: lead.id || createLeadId() }));
    const sorted = [...normalized].sort(
      (a, b) => timestampValue(b.timestamp) - timestampValue(a.timestamp)
    );
    setLeads(sorted);
    if (needsIdBackfill) {
      const writeResult = writeLeads(sorted);
      if (!writeResult.ok) {
        reportLeadError(
          'Lead IDs could not be saved. The list remains available for this session.',
          writeResult.error.cause
        );
      }
    }
  }, []);

  const filteredLeads = leads.filter((lead) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      lead.name?.toLowerCase().includes(q) ||
      lead.email?.toLowerCase().includes(q) ||
      lead.phone?.toLowerCase().includes(q) ||
      (SERVICE_LABELS[lead.service] || lead.service)?.toLowerCase().includes(q) ||
      (lead.message || '').toLowerCase().includes(q)
    );
  });

  const handleUnlock = (event: React.FormEvent) => {
    event.preventDefault();
    const credentials = resolveAdminCredentials();

    if (username === credentials.username && password === credentials.password) {
      const sessionResult = persistAdminSession(rememberMe);
      if (!sessionResult.ok) {
        setSessionNotice("This browser couldn't remember your admin session.");
        console.error('Admin session could not be saved:', sessionResult.cause);
      } else {
        setSessionNotice('');
      }
      setIsUnlocked(true);
      setPasswordError('');
    } else {
      setPasswordError('Incorrect username or password. Try again.');
    }
  };

  const lockAdmin = () => {
    const sessionResult = clearAdminSession();
    setIsUnlocked(false);
    setUsername('');
    setPassword('');
    setRememberMe(false);
    setPasswordError('');
    if (!sessionResult.ok) {
      setSessionNotice("This browser couldn't clear the saved admin session.");
      console.error('Admin session could not be cleared:', sessionResult.cause);
    } else {
      setSessionNotice('');
    }
  };

  const toggleSelect = (leadId: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(leadId)) next.delete(leadId);
      else next.add(leadId);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === filteredLeads.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filteredLeads.map((lead) => lead.id || '')));
    }
  };

  const deleteSelected = () => {
    if (selected.size === 0) return;
    if (
      !window.confirm(
        `Delete ${selected.size} selected lead${selected.size === 1 ? '' : 's'}? This cannot be undone.`
      )
    ) {
      return;
    }
    const remaining = leads.filter((lead) => !lead.id || !selected.has(lead.id));
    const result = writeLeads(remaining);
    if (!result.ok) {
      reportLeadError("Selected lead deletion couldn't be saved.", result.error.cause);
      return;
    }
    setLeadError('');
    setLeads(remaining);
    setSelected(new Set());
  };

  const deleteLead = (leadId: string) => {
    if (!window.confirm('Delete this lead? This action cannot be undone.')) {
      return;
    }
    const remaining = leads.filter((lead) => lead.id !== leadId);
    const result = writeLeads(remaining);
    if (!result.ok) {
      reportLeadError("Lead deletion couldn't be saved.", result.error.cause);
      return;
    }
    setLeadError('');
    setLeads(remaining);
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(leadId);
      return next;
    });
  };

  const exportCSV = () => {
    const toExport =
      selected.size > 0
        ? filteredLeads.filter((lead) => (lead.id ? selected.has(lead.id) : false))
        : filteredLeads;

    if (toExport.length === 0) return;

    const headers = ['Name', 'Email', 'Phone', 'Service', 'Message', 'Submitted At'];
    const rows = toExport.map((lead) => {
      const messageValue = lead.hideDetails ? '' : (lead.message || '').replace(/"/g, '""');
      const parsedTimestamp = new Date(lead.timestamp);
      const tsValue = lead.hideDetails
        ? ''
        : lead.timestamp
          ? Number.isNaN(parsedTimestamp.getTime())
            ? lead.timestamp
            : parsedTimestamp.toLocaleString()
          : '';
      return [
        `"${lead.name || ''}"`,
        `"${lead.email || ''}"`,
        `"${lead.phone || ''}"`,
        `"${SERVICE_LABELS[lead.service] || lead.service || ''}"`,
        `"${messageValue}"`,
        `"${tsValue}"`,
      ];
    });

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    let url: string | null = null;
    try {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `creativva-leads-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      setLeadError('');
    } catch (cause) {
      reportLeadError('Leads could not be exported. Please try again.', cause);
    } finally {
      if (url) {
        try {
          URL.revokeObjectURL(url);
        } catch (cause) {
          console.error('The exported leads file could not be cleaned up:', cause);
        }
      }
    }
  };

  const formatDate = (ts: string) => {
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return ts;
    return (
      d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ' · ' +
      d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    );
  };

  if (!mounted) return null;

  if (!isUnlocked) {
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
            Enter the admin password to view lead submissions and manage entries.
          </p>

          {sessionNotice && (
            <p className="mb-4 text-sm" style={{ color: '#FDBA74' }}>
              {sessionNotice}
            </p>
          )}

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-[0.2em] mb-2"
                style={{ color: 'rgba(245,245,247,0.45)' }}
              >
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (passwordError) setPasswordError('');
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
                className="block text-xs font-semibold uppercase tracking-[0.2em] mb-2"
                style={{ color: 'rgba(245,245,247,0.45)' }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError('');
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
              Remember me on this browser
            </label>

            {passwordError && (
              <p className="text-sm" style={{ color: '#F97316' }}>
                {passwordError}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl px-4 py-3 font-bold text-sm transition-transform duration-200 hover:scale-[1.01]"
              style={{ background: 'linear-gradient(135deg, #7B2FBE, #F97316)', color: '#FFFFFF' }}
            >
              Unlock Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#050508', color: '#F5F5F7' }}>
      {/* Top bar */}
      <header
        className="border-b px-6 py-4 flex items-center justify-between"
        style={{
          borderColor: 'rgba(42,43,69,0.8)',
          background: 'rgba(19,20,40,0.95)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 relative">
            <AppImage
              src="/assets/images/image-1785475268438.png"
              alt="Creativva logo"
              width={36}
              height={36}
              className="object-contain"
            />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight" style={{ color: '#F5F5F7' }}>
              creativ
            </span>
            <span
              className="font-extrabold text-lg tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #7B2FBE, #F97316)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              va
            </span>
            <span
              className="text-xs font-semibold ml-2 px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(123,47,190,0.15)',
                border: '1px solid rgba(123,47,190,0.3)',
                color: '#A855F7',
              }}
            >
              Admin
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={lockAdmin}
            className="text-xs font-semibold tracking-wide transition-colors"
            style={{ color: 'rgba(245,245,247,0.5)' }}
          >
            Lock Admin
          </button>
          <Link
            href="/"
            className="text-xs font-semibold tracking-wide transition-colors"
            style={{ color: 'rgba(245,245,247,0.5)' }}
          >
            ← Back to Site
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: '#F5F5F7' }}>
            Lead Submissions
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'rgba(245,245,247,0.45)' }}>
            All leads captured from the website popup form.
          </p>
        </div>

        {sessionNotice && (
          <div
            role="status"
            className="mb-8 rounded-2xl border px-5 py-4 text-sm"
            style={{
              background: 'rgba(249,115,22,0.08)',
              borderColor: 'rgba(249,115,22,0.3)',
              color: '#FDBA74',
            }}
          >
            {sessionNotice}
          </div>
        )}

        {leadError && (
          <div
            role="alert"
            className="mb-8 rounded-2xl border px-5 py-4 text-sm"
            style={{
              background: 'rgba(249,115,22,0.1)',
              borderColor: 'rgba(249,115,22,0.35)',
              color: '#FDBA74',
            }}
          >
            {leadError}
          </div>
        )}

        {leadWarning && (
          <div
            role="status"
            className="mb-8 rounded-2xl border px-5 py-4 text-sm"
            style={{
              background: 'rgba(234,179,8,0.08)',
              borderColor: 'rgba(234,179,8,0.3)',
              color: '#FDE68A',
            }}
          >
            {leadWarning}
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Leads', value: leads.length },
            {
              label: 'This Week',
              value: leads.filter(
                (lead) => timestampValue(lead.timestamp) > Date.now() - 7 * 86400000
              ).length,
            },
            { label: 'Selected', value: selected.size },
            { label: 'Services', value: new Set(leads.map((l) => l.service)).size },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl p-5"
              style={{ background: 'rgba(19,20,40,0.8)', border: '1px solid rgba(42,43,69,0.6)' }}
            >
              <p
                className="text-2xl font-extrabold"
                style={{
                  background: 'linear-gradient(135deg, #A855F7, #F97316)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {stat.value}
              </p>
              <p className="text-xs mt-1" style={{ color: 'rgba(245,245,247,0.45)' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: 'rgba(245,245,247,0.3)' }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-colors"
              style={{
                background: 'rgba(30,31,53,0.8)',
                border: '1px solid rgba(42,43,69,0.8)',
                color: '#F5F5F7',
              }}
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {selected.size > 0 && (
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{
                  background: 'rgba(123,47,190,0.15)',
                  border: '1px solid rgba(123,47,190,0.3)',
                  color: '#A855F7',
                }}
              >
                {selected.size} selected
              </span>
            )}
            <button
              onClick={deleteSelected}
              disabled={selected.size === 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                background:
                  selected.size > 0
                    ? 'linear-gradient(135deg, #F97316, #C026D3)'
                    : 'rgba(60,60,80,0.8)',
                color: selected.size > 0 ? '#FFFFFF' : 'rgba(245,245,247,0.55)',
                boxShadow: selected.size > 0 ? '0 0 20px rgba(249,115,22,0.22)' : 'none',
              }}
            >
              Delete selected
            </button>
            <button
              onClick={exportCSV}
              disabled={filteredLeads.length === 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide text-white transition-all duration-200 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                background: 'linear-gradient(135deg, #7B2FBE, #F97316)',
                boxShadow: filteredLeads.length > 0 ? '0 0 20px rgba(123,47,190,0.3)' : 'none',
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {selected.size > 0 ? `Export ${selected.size} Selected` : 'Export All CSV'}
            </button>
          </div>
        </div>

        {/* Table */}
        {loadFailed ? (
          <div
            className="rounded-2xl py-20 text-center"
            style={{
              background: 'rgba(249,115,22,0.06)',
              border: '1px solid rgba(249,115,22,0.3)',
            }}
          >
            <p className="font-bold text-lg" style={{ color: '#F5F5F7' }}>
              Leads couldn&apos;t be read
            </p>
            <p className="text-sm mt-1" style={{ color: 'rgba(245,245,247,0.55)' }}>
              Fix the browser storage issue and reload this page to try again.
            </p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div
            className="rounded-2xl py-20 text-center"
            style={{ background: 'rgba(19,20,40,0.6)', border: '1px solid rgba(42,43,69,0.5)' }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{
                background: 'rgba(123,47,190,0.1)',
                border: '1px solid rgba(123,47,190,0.2)',
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                style={{ color: '#7B2FBE' }}
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <p className="font-bold text-lg" style={{ color: '#F5F5F7' }}>
              {searchQuery ? 'No leads match your search' : 'No leads yet'}
            </p>
            <p className="text-sm mt-1" style={{ color: 'rgba(245,245,247,0.4)' }}>
              {searchQuery
                ? 'Try a different search term.'
                : 'Leads submitted via the website popup will appear here.'}
            </p>
          </div>
        ) : (
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(42,43,69,0.6)' }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    style={{
                      background: 'rgba(19,20,40,0.95)',
                      borderBottom: '1px solid rgba(42,43,69,0.8)',
                    }}
                  >
                    <th className="px-4 py-4 text-left w-10">
                      <input
                        type="checkbox"
                        checked={selected.size === filteredLeads.length && filteredLeads.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded cursor-pointer accent-purple-500"
                      />
                    </th>
                    {[
                      'Name',
                      'Email',
                      'Phone',
                      'Service',
                      'Message',
                      'Submitted At',
                      'Actions',
                    ].map((h) => (
                      <th
                        key={h}
                        className={`px-4 py-4 ${h === 'Actions' ? 'text-right' : 'text-left'} font-bold text-xs tracking-widest uppercase`}
                        style={{ color: 'rgba(245,245,247,0.4)' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead, idx) => (
                    <tr
                      key={lead.id || idx}
                      onClick={() => lead.id && toggleSelect(lead.id)}
                      className="cursor-pointer transition-colors"
                      style={{
                        background:
                          lead.id && selected.has(lead.id)
                            ? 'rgba(123,47,190,0.08)'
                            : idx % 2 === 0
                              ? 'rgba(19,20,40,0.5)'
                              : 'rgba(13,14,30,0.5)',
                        borderBottom: '1px solid rgba(42,43,69,0.3)',
                      }}
                    >
                      <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={lead.id ? selected.has(lead.id) : false}
                          onChange={() => lead.id && toggleSelect(lead.id)}
                          className="w-4 h-4 rounded cursor-pointer accent-purple-500"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs"
                            style={{
                              background:
                                'linear-gradient(135deg, rgba(123,47,190,0.3), rgba(249,115,22,0.2))',
                              border: '1px solid rgba(123,47,190,0.3)',
                              color: '#A855F7',
                            }}
                          >
                            {(lead.name || '?').charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold" style={{ color: '#F5F5F7' }}>
                            {lead.name || '—'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4" style={{ color: 'rgba(245,245,247,0.7)' }}>
                        {lead.email || '—'}
                      </td>
                      <td className="px-4 py-4" style={{ color: 'rgba(245,245,247,0.7)' }}>
                        {lead.phone || '—'}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{
                            background: 'rgba(123,47,190,0.12)',
                            border: '1px solid rgba(123,47,190,0.25)',
                            color: '#A855F7',
                          }}
                        >
                          {SERVICE_LABELS[lead.service] || lead.service || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-4" style={{ color: 'rgba(245,245,247,0.7)' }}>
                        {lead.hideDetails ? '—' : lead.message || '—'}
                      </td>
                      <td
                        className="px-4 py-4 text-xs"
                        style={{ color: 'rgba(245,245,247,0.45)', whiteSpace: 'nowrap' }}
                      >
                        {lead.hideDetails ? '—' : lead.timestamp ? formatDate(lead.timestamp) : '—'}
                      </td>
                      <td className="px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        {lead.id && (
                          <button
                            onClick={() => deleteLead(lead.id!)}
                            className="text-xs font-semibold px-3 py-1 rounded-full transition-colors hover:bg-red-600/10"
                            style={{ color: '#F97316', border: '1px solid rgba(249,115,22,0.3)' }}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer row */}
            <div
              className="px-6 py-3 flex items-center justify-between text-xs"
              style={{
                background: 'rgba(19,20,40,0.95)',
                borderTop: '1px solid rgba(42,43,69,0.6)',
                color: 'rgba(245,245,247,0.35)',
              }}
            >
              <span>
                Showing {filteredLeads.length} of {leads.length} leads
              </span>
              {selected.size > 0 && (
                <button
                  onClick={() => setSelected(new Set())}
                  className="text-xs hover:text-white transition-colors"
                  style={{ color: 'rgba(249,115,22,0.7)' }}
                >
                  Clear selection
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
