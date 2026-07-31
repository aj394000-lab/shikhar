'use client';
import React, { useEffect, useState } from 'react';
import AppImage from '@/components/ui/AppImage';

interface Lead {
  id?: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message?: string;
  timestamp: string;
  // If true, admin UI should not display message or timestamp for this lead
  hideDetails?: boolean;
}

const SERVICE_LABELS: Record<string, string> = {
  'social-media': 'Social Media Marketing',
  'content-creation': 'Content Creation',
  'paid-ads': 'Paid Advertising',
  'seo': 'SEO & Analytics',
  'brand-identity': 'Brand Identity & Strategy',
  'performance': 'Performance Marketing',
  'video-editing': 'Video Editing',
};

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const createLeadId = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  };

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('creativva_leads');
      if (stored) {
        const parsed = JSON.parse(stored) as Lead[];
        const normalized = parsed.map((lead) => ({ ...lead, id: lead.id || createLeadId() }));
        const sorted = [...normalized].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setLeads(sorted);
        if (normalized.some((lead, idx) => !parsed[idx]?.id)) {
          localStorage.setItem('creativva_leads', JSON.stringify(sorted));
        }
      }
    } catch {
      setLeads([]);
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
    if (!window.confirm(`Delete ${selected.size} selected lead${selected.size === 1 ? '' : 's'}? This cannot be undone.`)) {
      return;
    }
    const remaining = leads.filter((lead) => lead.id && !selected.has(lead.id));
    setLeads(remaining);
    setSelected(new Set());
    localStorage.setItem('creativva_leads', JSON.stringify(remaining));
  };

  const deleteLead = (leadId: string) => {
    if (!window.confirm('Delete this lead? This action cannot be undone.')) {
      return;
    }
    const remaining = leads.filter((lead) => lead.id !== leadId);
    setLeads(remaining);
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(leadId);
      return next;
    });
    localStorage.setItem('creativva_leads', JSON.stringify(remaining));
  };

  const exportCSV = () => {
    const toExport = selected.size > 0
      ? filteredLeads.filter((lead) => lead.id ? selected.has(lead.id) : false)
      : filteredLeads;

    if (toExport.length === 0) return;

    const headers = ['Name', 'Email', 'Phone', 'Service', 'Message', 'Submitted At'];
    const rows = toExport.map((lead) => {
      const messageValue = lead.hideDetails ? '' : (lead.message || '').replace(/"/g, '""');
      const tsValue = lead.hideDetails ? '' : (lead.timestamp ? new Date(lead.timestamp).toLocaleString() : '');
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
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `creativva-leads-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (ts: string) => {
    try {
      const d = new Date(ts);
      return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
        ' · ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return ts;
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen" style={{ background: '#050508', color: '#F5F5F7' }}>
      {/* Top bar */}
      <header className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'rgba(42,43,69,0.8)', background: 'rgba(19,20,40,0.95)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
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
            <span className="font-extrabold text-lg tracking-tight" style={{ color: '#F5F5F7' }}>creativ</span>
            <span className="font-extrabold text-lg tracking-tight" style={{ background: 'linear-gradient(135deg, #7B2FBE, #F97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>va</span>
            <span className="text-xs font-semibold ml-2 px-2 py-0.5 rounded-full" style={{ background: 'rgba(123,47,190,0.15)', border: '1px solid rgba(123,47,190,0.3)', color: '#A855F7' }}>Admin</span>
          </div>
        </div>
        <a href="/" className="text-xs font-semibold tracking-wide transition-colors" style={{ color: 'rgba(245,245,247,0.5)' }}>
          ← Back to Site
        </a>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: '#F5F5F7' }}>Lead Submissions</h1>
          <p className="mt-1 text-sm" style={{ color: 'rgba(245,245,247,0.45)' }}>
            All leads captured from the website popup form.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Leads', value: leads.length },
            { label: 'This Week', value: leads.filter(l => new Date(l.timestamp) > new Date(Date.now() - 7 * 86400000)).length },
            { label: 'Selected', value: selected.size },
            { label: 'Services', value: new Set(leads.map(l => l.service)).size },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl p-5" style={{ background: 'rgba(19,20,40,0.8)', border: '1px solid rgba(42,43,69,0.6)' }}>
              <p className="text-2xl font-extrabold" style={{ background: 'linear-gradient(135deg, #A855F7, #F97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{stat.value}</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(245,245,247,0.45)' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(245,245,247,0.3)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-colors"
              style={{ background: 'rgba(30,31,53,0.8)', border: '1px solid rgba(42,43,69,0.8)', color: '#F5F5F7' }}
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {selected.size > 0 && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: 'rgba(123,47,190,0.15)', border: '1px solid rgba(123,47,190,0.3)', color: '#A855F7' }}>
                {selected.size} selected
              </span>
            )}
            <button
              onClick={deleteSelected}
              disabled={selected.size === 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ background: selected.size > 0 ? 'linear-gradient(135deg, #F97316, #C026D3)' : 'rgba(60,60,80,0.8)', color: selected.size > 0 ? '#FFFFFF' : 'rgba(245,245,247,0.55)', boxShadow: selected.size > 0 ? '0 0 20px rgba(249,115,22,0.22)' : 'none' }}
            >
              Delete selected
            </button>
            <button
              onClick={exportCSV}
              disabled={filteredLeads.length === 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide text-white transition-all duration-200 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ background: 'linear-gradient(135deg, #7B2FBE, #F97316)', boxShadow: filteredLeads.length > 0 ? '0 0 20px rgba(123,47,190,0.3)' : 'none' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {selected.size > 0 ? `Export ${selected.size} Selected` : 'Export All CSV'}
            </button>
          </div>
        </div>

        {/* Table */}
        {filteredLeads.length === 0 ? (
          <div className="rounded-2xl py-20 text-center" style={{ background: 'rgba(19,20,40,0.6)', border: '1px solid rgba(42,43,69,0.5)' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(123,47,190,0.1)', border: '1px solid rgba(123,47,190,0.2)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: '#7B2FBE' }}>
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
              {searchQuery ? 'Try a different search term.' : 'Leads submitted via the website popup will appear here.'}
            </p>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(42,43,69,0.6)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'rgba(19,20,40,0.95)', borderBottom: '1px solid rgba(42,43,69,0.8)' }}>
                    <th className="px-4 py-4 text-left w-10">
                      <input
                        type="checkbox"
                        checked={selected.size === filteredLeads.length && filteredLeads.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded cursor-pointer accent-purple-500"
                      />
                    </th>
                    {['Name', 'Email', 'Phone', 'Service', 'Message', 'Submitted At', 'Actions'].map((h) => (
                      <th key={h} className={`px-4 py-4 ${h === 'Actions' ? 'text-right' : 'text-left'} font-bold text-xs tracking-widest uppercase`} style={{ color: 'rgba(245,245,247,0.4)' }}>
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
                        background: lead.id && selected.has(lead.id) ? 'rgba(123,47,190,0.08)' : idx % 2 === 0 ? 'rgba(19,20,40,0.5)' : 'rgba(13,14,30,0.5)',
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
                          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs" style={{ background: 'linear-gradient(135deg, rgba(123,47,190,0.3), rgba(249,115,22,0.2))', border: '1px solid rgba(123,47,190,0.3)', color: '#A855F7' }}>
                            {(lead.name || '?').charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold" style={{ color: '#F5F5F7' }}>{lead.name || '—'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4" style={{ color: 'rgba(245,245,247,0.7)' }}>
                        {lead.email || '—'}
                      </td>
                      <td className="px-4 py-4" style={{ color: 'rgba(245,245,247,0.7)' }}>
                        {lead.phone || '—'}
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(123,47,190,0.12)', border: '1px solid rgba(123,47,190,0.25)', color: '#A855F7' }}>
                          {SERVICE_LABELS[lead.service] || lead.service || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-4" style={{ color: 'rgba(245,245,247,0.7)' }}>
                        {lead.hideDetails ? '—' : (lead.message || '—')}
                      </td>
                      <td className="px-4 py-4 text-xs" style={{ color: 'rgba(245,245,247,0.45)', whiteSpace: 'nowrap' }}>
                        {lead.hideDetails ? '—' : (lead.timestamp ? formatDate(lead.timestamp) : '—')}
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
            <div className="px-6 py-3 flex items-center justify-between text-xs" style={{ background: 'rgba(19,20,40,0.95)', borderTop: '1px solid rgba(42,43,69,0.6)', color: 'rgba(245,245,247,0.35)' }}>
              <span>Showing {filteredLeads.length} of {leads.length} leads</span>
              {selected.size > 0 && (
                <button onClick={() => setSelected(new Set())} className="text-xs hover:text-white transition-colors" style={{ color: 'rgba(249,115,22,0.7)' }}>
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
