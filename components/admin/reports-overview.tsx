'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, DollarSign, Users, BarChart3, PieChart as PieChartIcon, TrendingUp, Loader2 } from 'lucide-react';


interface ReportsData {
  eventData: { name: string; events: number; tickets: number }[];
  salesData: { name: string; sales: number; tickets: number }[];
  userData: { name: string; users: number }[];
  categoryBreakdown: { name: string; value: number }[];
  userStatus: { name: string; value: number }[];
}

const COLORS = ['#008D50', '#3B82F6', '#EAB308', '#A855F7', '#80858E', '#008D50'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-3 rounded-xl border border-gris4 shadow-lg">
        <p className="text-sm font-medium text-navy mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`tooltip-${index}`} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString('fr-FR')}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function ReportsOverview() {
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await fetch('/api/admin/reports/stats');
        if (!res.ok) throw new Error('Erreur lors du chargement des rapports');
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  const exportToCSV = (rows: Record<string, any>[], filename: string) => {
    if (rows.length === 0) return;
    const csvContent = [
      Object.keys(rows[0]).join(','),
      ...rows.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-green" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red text-sm">{error || 'Erreur de chargement'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Export button */}
      <div className="flex justify-end">
        <button
          onClick={() => exportToCSV(data.eventData, 'evenements')}
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-gris4 text-navy text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
        >
          <Download className="h-4 w-4" />
          Exporter (CSV)
        </button>
      </div>

      <Tabs defaultValue="events" className="space-y-6">
        <TabsList className="bg-bg border border-gris4/50 rounded-xl p-1">
          <TabsTrigger
            value="events"
            className="rounded-lg text-sm data-[state=active]:bg-green/10 data-[state=active]:text-green data-[state=active]:shadow-none"
          >
            Événements
          </TabsTrigger>
          <TabsTrigger
            value="sales"
            className="rounded-lg text-sm data-[state=active]:bg-green/10 data-[state=active]:text-green data-[state=active]:shadow-none"
          >
            Ventes
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="rounded-lg text-sm data-[state=active]:bg-green/10 data-[state=active]:text-green data-[state=active]:shadow-none"
          >
            Utilisateurs
          </TabsTrigger>
        </TabsList>

        {/* --- Events Tab --- */}
        <TabsContent value="events" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="h-5 w-5 text-green" />
                <h3 className="text-sm font-semibold text-navy">Événements par mois</h3>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.eventData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#CFD4E4" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#80858E' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#80858E' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: '12px', color: '#80858E' }}
                    />
                    <Bar dataKey="events" fill="#008D50" name="Événements" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="tickets" fill="#3B82F6" name="Billets vendus" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <PieChartIcon className="h-5 w-5 text-green" />
                <h3 className="text-sm font-semibold text-navy">Répartition des événements</h3>
              </div>
              <div className="h-[280px] flex items-center justify-center">
                {data.categoryBreakdown.length === 0 ? (
                  <p className="text-sm text-gris2">Aucune donnée disponible</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.categoryBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={90}
                        innerRadius={50}
                        fill="#008D50"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        stroke="none"
                      >
                        {data.categoryBreakdown.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [value, 'Événements']}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #CFD4E4',
                          borderRadius: '12px',
                          fontSize: '12px',
                          padding: '8px 12px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* --- Sales Tab --- */}
        <TabsContent value="sales" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-5 w-5 text-green" />
                <h3 className="text-sm font-semibold text-navy">Ventes mensuelles</h3>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#CFD4E4" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#80858E' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#80858E' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: '12px', color: '#80858E' }}
                    />
                    <Line type="monotone" dataKey="sales" stroke="#008D50" strokeWidth={2} dot={{ r: 4, fill: '#008D50' }} name="Chiffre d'affaires (FCFA)" />
                    <Line type="monotone" dataKey="tickets" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4, fill: '#3B82F6' }} name="Billets vendus" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="h-5 w-5 text-green" />
                <h3 className="text-sm font-semibold text-navy">Moyenne des ventes</h3>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#CFD4E4" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#80858E' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#80858E' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: '12px', color: '#80858E' }}
                    />
                    <Bar dataKey="sales" fill="#008D50" name="Ventes (FCFA)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* --- Users Tab --- */}
        <TabsContent value="users" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Users className="h-5 w-5 text-green" />
                <h3 className="text-sm font-semibold text-navy">Nouveaux utilisateurs</h3>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.userData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#CFD4E4" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#80858E' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#80858E' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: '12px', color: '#80858E' }}
                    />
                    <Line type="monotone" dataKey="users" stroke="#008D50" strokeWidth={2} dot={{ r: 4, fill: '#008D50' }} name="Nouveaux utilisateurs" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <PieChartIcon className="h-5 w-5 text-green" />
                <h3 className="text-sm font-semibold text-navy">Répartition des utilisateurs</h3>
              </div>
              <div className="h-[280px] flex items-center justify-center">
                {data.userStatus.length === 0 ? (
                  <p className="text-sm text-gris2">Aucune donnée disponible</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.userStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={90}
                        innerRadius={50}
                        fill="#008D50"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        stroke="none"
                      >
                        {data.userStatus.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [value, 'Utilisateurs']}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #CFD4E4',
                          borderRadius: '12px',
                          fontSize: '12px',
                          padding: '8px 12px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
