import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Monitor, LogOut, Ban, Eye, Search } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface ActiveUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  sessions: number;
  lastActive: string;
  currentStream: string;
  ipAddress: string;
  device: string;
}

export function UserMonitor() {
  const [users] = useState<ActiveUser[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@anurag.edu.in',
      role: 'user',
      sessions: 2,
      lastActive: '2 minutes ago',
      currentStream: 'Morning Campus Vibes',
      ipAddress: '192.168.1.100',
      device: 'Chrome on Windows'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@anurag.edu.in',
      role: 'user',
      sessions: 1,
      lastActive: '5 minutes ago',
      currentStream: 'Morning Campus Vibes',
      ipAddress: '192.168.1.101',
      device: 'Safari on iPhone'
    },
    {
      id: '3',
      name: 'Admin User',
      email: 'admin@anurag.edu.in',
      role: 'admin',
      sessions: 3,
      lastActive: '1 minute ago',
      currentStream: 'Managing Stream',
      ipAddress: '192.168.1.102',
      device: 'Firefox on Linux'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'admin' | 'user'>('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || user.role === filter;
    return matchesSearch && matchesFilter;
  });

  const forceLogout = (userId: string) => {
    console.log('Force logout user:', userId);
  };

  const blockUser = (userId: string) => {
    console.log('Block user:', userId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-white mb-2">User Monitor</h2>
        <p className="text-white/60 font-body">Monitor active users and manage sessions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card glass className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-accent-500/20 rounded-full mx-auto mb-3">
            <Users className="h-6 w-6 text-accent-400" />
          </div>
          <p className="text-2xl font-heading font-bold text-white">{users.length}</p>
          <p className="text-white/60 text-sm font-body">Active Users</p>
        </Card>

        <Card glass className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-full mx-auto mb-3">
            <Monitor className="h-6 w-6 text-blue-400" />
          </div>
          <p className="text-2xl font-heading font-bold text-white">
            {users.reduce((acc, user) => acc + user.sessions, 0)}
          </p>
          <p className="text-white/60 text-sm font-body">Total Sessions</p>
        </Card>

        <Card glass className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-full mx-auto mb-3">
            <Eye className="h-6 w-6 text-green-400" />
          </div>
          <p className="text-2xl font-heading font-bold text-white">247</p>
          <p className="text-white/60 text-sm font-body">Stream Viewers</p>
        </Card>

        <Card glass className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-full mx-auto mb-3">
            <Users className="h-6 w-6 text-purple-400" />
          </div>
          <p className="text-2xl font-heading font-bold text-white">
            {users.filter(user => user.role === 'admin').length}
          </p>
          <p className="text-white/60 text-sm font-body">Admins Online</p>
        </Card>
      </div>

      {/* Filters */}
      <Card glass className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded text-sm font-body transition-all ${
                filter === 'all' ? 'bg-accent-500 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              All ({users.length})
            </button>
            <button
              onClick={() => setFilter('admin')}
              className={`px-3 py-1 rounded text-sm font-body transition-all ${
                filter === 'admin' ? 'bg-accent-500 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              Admins ({users.filter(u => u.role === 'admin').length})
            </button>
            <button
              onClick={() => setFilter('user')}
              className={`px-3 py-1 rounded text-sm font-body transition-all ${
                filter === 'user' ? 'bg-accent-500 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              Users ({users.filter(u => u.role === 'user').length})
            </button>
          </div>
        </div>
      </Card>

      {/* User List */}
      <Card glass className="p-6">
        <h3 className="text-xl font-heading font-semibold text-white mb-6">Active Sessions</h3>
        
        <div className="space-y-4">
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
            >
              <div className="w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center">
                <span className="text-white font-heading font-semibold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-heading font-semibold text-white">{user.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full font-body ${
                    user.role === 'admin' 
                      ? 'bg-purple-500/20 text-purple-400' 
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {user.role}
                  </span>
                  <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full font-body">
                    {user.sessions} session{user.sessions !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="text-sm text-white/60 font-body">
                  <p>{user.email}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span>Watching: {user.currentStream}</span>
                    <span>•</span>
                    <span>Last active: {user.lastActive}</span>
                    <span>•</span>
                    <span>{user.device}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  icon={LogOut}
                  onClick={() => forceLogout(user.id)}
                >
                  Force Logout
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  icon={Ban}
                  onClick={() => blockUser(user.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  Block
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/60 font-body">No users found matching your criteria.</p>
          </div>
        )}
      </Card>
    </div>
  );
}