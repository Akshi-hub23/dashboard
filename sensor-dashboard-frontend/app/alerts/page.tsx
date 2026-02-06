'use client'

import { fetchAlerts, acknowledgeAlert, fetchSettings, saveSettings } from '@/lib/api'
import type { Alert, ThresholdSettings } from '@/lib/sensor-data'
import Header from '@/components/header'
import { useState, useEffect } from 'react'
import { AlertCircle, Check, Volume2, VolumeX } from 'lucide-react'

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [filterSeverity, setFilterSeverity] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<'alerts' | 'settings'>(
    'alerts'
  )

  useEffect(() => {
    async function loadAlerts() {
      try {
        const data = await fetchAlerts()
        setAlerts(data)
      } catch (error) {
        console.error('Failed to fetch alerts:', error)
      } finally {
        setLoading(false)
      }
    }

    async function loadSettings() {
      try {
        const data = await fetchSettings()
        setThresholds(data)
      } catch (error) {
        console.error('Failed to fetch settings:', error)
      }
    }

    loadAlerts()
    loadSettings()
  }, [])

  // Threshold settings state
  const [thresholds, setThresholds] = useState<ThresholdSettings>({
    temperature: { warning: 30, critical: 35 },
    humidity: { warning: 75, critical: 85 },
    soilMoisture: { warning: 30, critical: 20 },
    gas: { warning: 300, critical: 500 },
  })

  const [savingSettings, setSavingSettings] = useState(false)

  const handleThresholdChange = (
    sensor: keyof typeof thresholds,
    level: 'warning' | 'critical',
    value: number
  ) => {
    setThresholds(prev => ({
      ...prev,
      [sensor]: { ...prev[sensor], [level]: value }
    }))
  }

  const handleSaveSettings = async () => {
    setSavingSettings(true)
    try {
      await saveSettings(thresholds)
      alert('Settings saved successfully!')
    } catch (error) {
           console.error('Failed to save settings:', error)
           alert('Failed to save settings. Please try again.')
    } finally {
      setSavingSettings(false)
    }
  }

  const filteredAlerts = alerts.filter((alert) => {
    if (filterSeverity === 'all') return true
    return alert.severity === filterSeverity
  })

  const handleAcknowledgeAlert = async (id: string) => {
    try {
      const updatedAlert = await acknowledgeAlert(id)
      setAlerts((prev) =>
        prev.map((alert) => (alert.id === id ? updatedAlert : alert))
      )
    } catch (error) {
      console.error('Error acknowledging alert:', error)
    }
  }

  const handleMute = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? { ...alert, muted: !alert.muted }
          : alert
      )
    )
  }

  const severityColor = {
    critical: 'text-red-600 bg-red-50',
    high: 'text-orange-600 bg-orange-50',
    medium: 'text-yellow-600 bg-yellow-50',
    low: 'text-blue-600 bg-blue-50',
  }

  const severityBadgeColor = {
    critical: 'bg-red-100 text-red-800',
    high: 'bg-orange-100 text-orange-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-blue-100 text-blue-800',
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Alerts & Settings"
        subtitle="Manage notifications and configure alert thresholds"
      />

      <div className="flex-1 overflow-auto p-8">
        {/* Tabs */}
        <div className="flex gap-4 border-b border-border mb-6">
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'alerts'
                ? 'text-accent border-b-2 border-accent'
                : 'text-muted-foreground hover:text-card-foreground'
            }`}
          >
            Alerts
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'settings'
                ? 'text-accent border-b-2 border-accent'
                : 'text-muted-foreground hover:text-card-foreground'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">Loading alerts...</p>
              </div>
            ) : (
              <>
            {/* Active Alerts Title */}
            <h2 className="text-xl font-bold text-card-foreground mb-4">
              Active Alerts
            </h2>

            {/* Filter Buttons */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {['all', 'critical', 'high', 'medium', 'low'].map(
                (severity) => (
                  <button
                    key={severity}
                    onClick={() => setFilterSeverity(severity)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      filterSeverity === severity
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-secondary text-card-foreground hover:bg-border'
                    }`}
                  >
                    {severity.charAt(0).toUpperCase() +
                      severity.slice(1)}
                  </button>
                )
              )}
            </div>

            {/* Alerts List */}
            <div className="space-y-3">
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`rounded-lg border-l-4 border p-4 transition-all duration-300 ${
                      alert.acknowledged
                        ? 'bg-secondary/30 border-secondary opacity-80'
                        : `bg-white shadow-sm hover:shadow-md ${
                            alert.severity === 'critical'
                              ? 'border-red-500'
                              : alert.severity === 'high'
                              ? 'border-amber-500'
                              : alert.severity === 'medium'
                              ? 'border-blue-500'
                              : 'border-slate-400'
                          }`
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-3">
                        <div
                          className={`mt-1 rounded-full p-2 ${
                            alert.acknowledged
                              ? 'bg-secondary text-secondary-foreground/60'
                              : alert.severity === 'critical'
                              ? 'bg-red-100 text-red-600'
                              : 'bg-blue-100 text-blue-600'
                          }`}
                        >
                          <AlertCircle size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-gray-900 line-clamp-1">
                              {alert.sensorName}
                            </h4>
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                alert.severity === 'critical'
                                  ? 'bg-red-100 text-red-700'
                                  : alert.severity === 'high'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {alert.severity}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {alert.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                            <span suppressHydrationWarning>
                              {new Date(alert.timestamp).toLocaleTimeString()}
                            </span>
                            {alert.acknowledged && alert.acknowledgedAt && (
                              <>
                                <span>•</span>
                                <span className="text-secondary-foreground/70 font-medium">
                                  Acknowledged by {alert.acknowledgedBy} at{' '}
                                  {new Date(
                                    alert.acknowledgedAt
                                  ).toLocaleTimeString()}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {alert.acknowledged ? (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100">
                            <Check size={14} strokeWidth={3} />
                            Acknowledged
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAcknowledgeAlert(alert.id)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95"
                          >
                            Acknowledge
                          </button>
                        )}
                        <button
                          onClick={() => handleMute(alert.id)}
                          className="p-2 hover:bg-black/5 rounded-full transition-colors"
                          title={alert.muted ? 'Unmute' : 'Mute'}
                        >
                          {alert.muted ? (
                            <VolumeX size={18} className="text-gray-400" />
                          ) : (
                            <Volume2 size={18} className="text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <AlertCircle
                    size={48}
                    className="mx-auto text-muted-foreground mb-3 opacity-50"
                  />
                  <p className="text-muted-foreground">
                    No {filterSeverity === 'all' ? '' : filterSeverity} alerts
                    at this time
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="flex justify-end mt-6 text-sm text-muted-foreground">
              Page 1 of 1
            </div>
              </>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-bold text-card-foreground mb-4">
                Alert Thresholds
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { key: 'temperature' as const, label: 'Temperature (°C)' },
                  { key: 'humidity' as const, label: 'Humidity (%)' },
                  { key: 'soilMoisture' as const, label: 'Soil Moisture (%)' },
                  { key: 'gas' as const, label: 'Gas (ppm)' },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="p-4 border border-border rounded-lg"
                  >
                    <h4 className="font-medium text-card-foreground mb-3">
                      {item.label}
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-muted-foreground">
                          Warning Level
                        </label>
                        <input
                          type="number"
                          value={thresholds[item.key].warning}
                          onChange={(e) => handleThresholdChange(item.key, 'warning', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-card-foreground text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">
                          Critical Level
                        </label>
                        <input
                          type="number"
                          value={thresholds[item.key].critical}
                          onChange={(e) => handleThresholdChange(item.key, 'critical', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-card-foreground text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button 
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {savingSettings && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                {savingSettings ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
