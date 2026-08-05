"use client";

import React, { useEffect, useState } from 'react';
import { auditApi } from '@/lib/api';
import { ShieldAlert, Search, RefreshCw, Eye } from 'lucide-react';

export default function AuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await auditApi.getAll({ limit: 50 });
      setLogs(Array.isArray(res.data) ? res.data : (res.data?.data || []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(search.toLowerCase()) || 
    log.entityType.toLowerCase().includes(search.toLowerCase()) ||
    (log.admin?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground">Monitor administrative actions and system events securely.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchLogs} className="px-4 py-2 border rounded-lg hover:bg-secondary flex items-center gap-2 text-sm font-medium">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm">
        <div className="p-4 border-b border-border flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text" 
              placeholder="Search actions, entities, admins..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/50">
              <tr>
                <th className="px-6 py-4 font-semibold">Timestamp</th>
                <th className="px-6 py-4 font-semibold">Admin</th>
                <th className="px-6 py-4 font-semibold">Action</th>
                <th className="px-6 py-4 font-semibold">Entity Type</th>
                <th className="px-6 py-4 font-semibold">Entity ID</th>
                <th className="px-6 py-4 font-semibold">Changes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    <div className="flex justify-center items-center gap-2">
                      <RefreshCw size={16} className="animate-spin" /> Loading logs...
                    </div>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground flex flex-col items-center">
                    <ShieldAlert size={32} className="mb-2 text-muted-foreground/50" />
                    No audit logs found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {log.admin ? (
                        <div>
                          <p className="font-semibold">{log.admin.name}</p>
                          <p className="text-xs text-muted-foreground">{log.admin.email}</p>
                        </div>
                      ) : (
                        <span className="text-xs bg-secondary px-2 py-1 rounded-md">SYSTEM</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-md uppercase">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">{log.entityType}</td>
                    <td className="px-6 py-4 text-xs text-muted-foreground font-mono">{log.entityId}</td>
                    <td className="px-6 py-4">
                      {(log.previousValue || log.newValue) ? (
                        <button className="text-primary hover:underline text-xs font-medium flex items-center gap-1" onClick={() => alert(`Previous: ${log.previousValue}\n\nNew: ${log.newValue}`)}>
                          <Eye size={14} /> View Details
                        </button>
                      ) : (
                        <span className="text-muted-foreground text-xs">No changes</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
