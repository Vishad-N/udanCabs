"use client";

import React, { useEffect, useState } from 'react';
import { settingsApi } from '@/lib/api';
import { Save, Loader2, RefreshCw } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await settingsApi.getAll();
      const arr = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      const mapped = arr.reduce((acc: any, cur: any) => {
        acc[cur.key] = cur.value;
        return acc;
      }, {});
      setSettings(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        settings: Object.keys(settings).map((key) => ({
          key,
          value: settings[key],
        })),
      };
      await settingsApi.bulkUpdate(payload);
      alert('Settings updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Website Settings</h1>
          <p className="text-muted-foreground">Manage global configuration for the customer-facing website.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchSettings} className="px-4 py-2 border rounded-lg hover:bg-secondary flex items-center gap-2 text-sm font-medium">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button 
            onClick={handleSave} 
            disabled={saving || loading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2 text-sm font-bold shadow-lg shadow-primary/25 disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span>Save Settings</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-xl font-bold mb-4">Company Details</h2>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-muted-foreground">Company Name</label>
              <input 
                type="text" 
                value={settings.companyName || ''} 
                onChange={(e) => handleChange('companyName', e.target.value)}
                className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-muted-foreground">About Us Description</label>
              <textarea 
                rows={4}
                value={settings.description || ''} 
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary resize-none"
              ></textarea>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-xl font-bold mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-muted-foreground">Phone Number</label>
                <input 
                  type="text" 
                  maxLength={10}
                  onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }}
                  value={settings.contactPhone || ''} 
                  onChange={(e) => handleChange('contactPhone', e.target.value)}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-muted-foreground">WhatsApp Number</label>
                <input 
                  type="text" 
                  maxLength={10}
                  onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }}
                  value={settings.whatsappNumber || ''} 
                  onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-muted-foreground">Email Address</label>
              <input 
                type="email" 
                value={settings.contactEmail || ''} 
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-muted-foreground">Office Address</label>
              <input 
                type="text" 
                value={settings.address || ''} 
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-muted-foreground">Operating Hours</label>
              <input 
                type="text" 
                value={settings.operatingHours || ''} 
                onChange={(e) => handleChange('operatingHours', e.target.value)}
                className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
