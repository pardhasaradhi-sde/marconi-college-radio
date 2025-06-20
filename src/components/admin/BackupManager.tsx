import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Cloud, Download, Upload, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface BackupStatus {
  lastBackup: string;
  nextScheduled: string;
  totalSize: string;
  status: 'success' | 'warning' | 'error';
  autoSync: boolean;
}

export function BackupManager() {
  const [backupStatus] = useState<BackupStatus>({
    lastBackup: '2024-01-20 14:30:00',
    nextScheduled: '2024-01-21 02:00:00',
    totalSize: '2.4 GB',
    status: 'success',
    autoSync: true
  });

  const [syncInProgress, setSyncInProgress] = useState(false);

  const handleSyncNow = async () => {
    setSyncInProgress(true);
    // Simulate sync process
    setTimeout(() => {
      setSyncInProgress(false);
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'error': return AlertCircle;
      default: return CheckCircle;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-white mb-2">Backup & Sync Manager</h2>
        <p className="text-white/60 font-body">Manage your data backups and cloud synchronization</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card glass className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-white">Last Backup</h3>
              <p className="text-white/60 text-sm font-body">Automatic backup</p>
            </div>
          </div>
          <p className="text-white font-body">{backupStatus.lastBackup}</p>
        </Card>

        <Card glass className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Database className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-white">Total Size</h3>
              <p className="text-white/60 text-sm font-body">All backups</p>
            </div>
          </div>
          <p className="text-white font-body">{backupStatus.totalSize}</p>
        </Card>

        <Card glass className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Cloud className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-white">Next Backup</h3>
              <p className="text-white/60 text-sm font-body">Scheduled</p>
            </div>
          </div>
          <p className="text-white font-body">{backupStatus.nextScheduled}</p>
        </Card>
      </div>

      {/* AWS S3 Sync */}
      <Card glass className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-heading font-semibold text-white mb-2">AWS S3 Synchronization</h3>
            <p className="text-white/60 font-body">Sync your media files with Amazon S3 cloud storage</p>
          </div>
          <div className={`flex items-center gap-2 ${getStatusColor(backupStatus.status)}`}>
            {React.createElement(getStatusIcon(backupStatus.status), { size: 20 })}
            <span className="text-sm font-body capitalize">{backupStatus.status}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-white/60 text-sm font-body mb-2">S3 Bucket</label>
              <div className="p-3 bg-white/5 rounded-lg font-mono text-white text-sm">
                marconi-backup-bucket
              </div>
            </div>
            
            <div>
              <label className="block text-white/60 text-sm font-body mb-2">Region</label>
              <div className="p-3 bg-white/5 rounded-lg font-mono text-white text-sm">
                ap-south-1 (Mumbai)
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-white font-body">Auto Sync</p>
                <p className="text-white/60 text-sm font-body">Automatic daily sync at 2:00 AM</p>
              </div>
              <div className={`w-12 h-6 rounded-full transition-all cursor-pointer ${
                backupStatus.autoSync ? 'bg-green-500' : 'bg-gray-600'
              }`}>
                <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-all ${
                  backupStatus.autoSync ? 'ml-6' : 'ml-0.5'
                }`}></div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-white/60 text-sm font-body mb-2">Sync Status</label>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-body">
                  <span className="text-white/60">Audio Files</span>
                  <span className="text-green-400">✓ Synced (45 files)</span>
                </div>
                <div className="flex justify-between text-sm font-body">
                  <span className="text-white/60">Video Files</span>
                  <span className="text-green-400">✓ Synced (12 files)</span>
                </div>
                <div className="flex justify-between text-sm font-body">
                  <span className="text-white/60">Metadata</span>
                  <span className="text-green-400">✓ Synced</span>
                </div>
                <div className="flex justify-between text-sm font-body">
                  <span className="text-white/60">Schedule Data</span>
                  <span className="text-green-400">✓ Synced</span>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              icon={syncInProgress ? RefreshCw : Upload}
              onClick={handleSyncNow}
              disabled={syncInProgress}
              className="w-full"
            >
              {syncInProgress ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="animate-spin" size={16} />
                  Syncing...
                </span>
              ) : (
                'Sync Now'
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Local Backup Management */}
      <Card glass className="p-6">
        <h3 className="text-xl font-heading font-semibold text-white mb-6">Local Backup Management</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-heading font-semibold text-white">Database Backup</h4>
                <span className="text-green-400 text-sm font-body">✓ Up to date</span>
              </div>
              <p className="text-white/60 text-sm font-body">User data, schedules, and settings</p>
              <p className="text-white/60 text-xs font-body mt-1">Size: 45.2 MB • Last: 2 hours ago</p>
            </div>

            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-heading font-semibold text-white">Media Files</h4>
                <span className="text-green-400 text-sm font-body">✓ Up to date</span>
              </div>
              <p className="text-white/60 text-sm font-body">Audio, video, and advertisement files</p>
              <p className="text-white/60 text-xs font-body mt-1">Size: 2.1 GB • Last: 30 minutes ago</p>
            </div>

            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-heading font-semibold text-white">Configuration</h4>
                <span className="text-green-400 text-sm font-body">✓ Up to date</span>
              </div>
              <p className="text-white/60 text-sm font-body">System settings and stream configuration</p>
              <p className="text-white/60 text-xs font-body mt-1">Size: 2.3 MB • Last: 1 hour ago</p>
            </div>
          </div>

          <div className="space-y-4">
            <Button variant="primary" size="sm" icon={Download} className="w-full">
              Download Full Backup
            </Button>
            
            <Button variant="secondary" size="sm" icon={Database} className="w-full">
              Create Manual Backup
            </Button>
            
            <Button variant="ghost" size="sm" className="w-full">
              Restore from Backup
            </Button>

            <div className="mt-6 pt-4 border-t border-white/10">
              <h4 className="font-heading font-semibold text-white mb-3">Backup Schedule</h4>
              <div className="space-y-2 text-sm font-body">
                <div className="flex justify-between text-white/60">
                  <span>Daily Database Backup</span>
                  <span>02:00 AM</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Weekly Full Backup</span>
                  <span>Sunday 03:00 AM</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Monthly Archive</span>
                  <span>1st of Month</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}