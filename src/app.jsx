import React, { useState, useMemo, useCallback } from 'react';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Wallet, CreditCard, PiggyBank, ArrowUpRight, ArrowDownRight, Home, BarChart3, Target, Upload, Bell, Check, AlertTriangle, Calendar, Plus, Trash2, RefreshCw, Zap, ShoppingBag, Car, Coffee, Wifi, Film, Heart, Building } from 'lucide-react';

const BANK_CONFIGS = {
  lcl: { name: 'LCL', color: '#0066b2', dateCol: 'Date', descCol: 'Libellé', amountCol: 'Montant' },
  revolut: { name: 'Revolut', color: '#000', dateCol: 'Started Date', descCol: 'Description', amountCol: 'Amount' },
  n26: { name: 'N26', color: '#36a18b', dateCol: 'Date', descCol: 'Payee', amountCol: 'Amount (EUR)' },
  ce: { name: 'Caisse d\'Épargne', color: '#e4002b', dateCol: 'Date opération', descCol: 'Libellé', amountCol: 'Montant' },
  trade_republic: { name: 'Trade Republic', color: '#1e1e1e', dateCol: 'Date', descCol: 'Description', amountCol: 'Amount' },
};

const CATEGORIES = {
  'Logement': { icon: Building, color: '#6366f1', keywords: ['loyer', 'edf', 'engie', 'eau', 'electricite', 'gaz', 'assurance hab'] },
  'Alimentation': { icon: ShoppingBag, color: '#22c55e', keywords: ['carrefour', 'leclerc', 'auchan', 'lidl', 'monoprix', 'franprix', 'picard'] },
  'Transport': { icon: Car, color: '#f59e0b', keywords: ['sncf', 'ratp', 'uber', 'bolt', 'essence', 'total', 'parking', 'navigo'] },
  'Restaurants': { icon: Coffee, color: '#14b8a6', keywords: ['restaurant', 'mcdo', 'burger', 'pizza', 'sushi', 'deliveroo', 'ubereats'] },
  'Abonnements': { icon: Wifi, color: '#ec4899', keywords: ['netflix', 'spotify', 'amazon prime', 'disney', 'orange', 'sfr', 'free', 'canal'] },
  'Shopping': { icon: ShoppingBag, color: '#8b5cf6', keywords: ['amazon', 'fnac', 'darty', 'zara', 'hm', 'decathlon', 'ikea'] },
  'Santé': { icon: Heart, color: '#ef4444', keywords: ['pharmacie', 'medecin', 'docteur', 'hopital', 'mutuelle', 'cpam'] },
  'Loisirs': { icon: Film, color: '#06b6d4', keywords: ['cinema', 'concert', 'theatre', 'sport', 'fitness', 'basic fit'] },
  'Salaire': { icon: Wallet, color: '#10b981', keywords: ['virement salaire', 'salaire', 'paie'] },
  'Transfert': { icon: RefreshCw, color: '#64748b', keywords: ['virement', 'transfert'] },
};

const initialTransactions = [
  { id: 1, date: '2024-01-15', description: 'Carrefour Market', amount: -87.50, category: 'Alimentation', bank: 'LCL' },
  { id: 2, date: '2024-01-15', description: 'Virement Salaire', amount: 2850.00, category: 'Salaire', bank: 'LCL' },
  { id: 3, date: '2024-01-14', description: 'Netflix', amount: -17.99, category: 'Abonnements', bank: 'Revolut' },
  { id: 4, date: '2024-01-14', description: 'SNCF Voyages', amount: -45.00, category: 'Transport', bank: 'LCL' },
  { id: 5, date: '2024-01-13', description: 'Restaurant Le Bistrot', amount: -38.50, category: 'Restaurants', bank: 'Revolut' },
  { id: 6, date: '2024-01-12', description: 'Loyer Janvier', amount: -950.00, category: 'Logement', bank: 'LCL' },
  { id: 7, date: '2024-01-11', description: 'Spotify Premium', amount: -9.99, category: 'Abonnements', bank: 'N26' },
  { id: 8, date: '2024-01-10', description: 'Amazon Prime', amount: -6.99, category: 'Abonnements', bank: 'Revolut' },
  { id: 9, date: '2024-01-08', description: 'Basic Fit', amount: -29.99, category: 'Loisirs', bank: 'LCL' },
  { id: 10, date: '2024-01-05', description: 'EDF Electricité', amount: -85.00, category: 'Logement', bank: 'LCL' },
];

const initialGoals = [
  { id: 1, name: 'Fonds d\'urgence', target: 10000, current: 5200, deadline: '2024-12-31', color: '#22c55e' },
  { id: 2, name: 'Voyage Japon', target: 5000, current: 1800, deadline: '2025-06-01', color: '#6366f1' },
  { id: 3, name: 'Apport immobilier', target: 50000, current: 12450, deadline: '2027-01-01', color: '#f59e0b' },
];

const evolutionData = [
  { month: 'Août', solde: 8500, depenses: 1850, revenus: 2900 },
  { month: 'Sept', solde: 9200, depenses: 2100, revenus: 2850 },
  { month: 'Oct', solde: 9800, depenses: 1950, revenus: 2850 },
  { month: 'Nov', solde: 10500, depenses: 2200, revenus: 2900 },
  { month: 'Déc', solde: 11200, depenses: 2450, revenus: 3150 },
  { month: 'Jan', solde: 12450, depenses: 1890, revenus: 2895 },
];

const KPICard = ({ title, value, change, changeType, icon: Icon, color }) => (
  <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-4 border border-gray-700/50">
    <div className="flex justify-between items-start mb-2">
      <div className={`p-2 rounded-xl ${color}`}><Icon size={18} className="text-white" /></div>
      {change && (
        <div className={`flex items-center gap-1 text-xs ${changeType === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
          {changeType === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{change}
        </div>
      )}
    </div>
    <p className="text-gray-400 text-xs mb-1">{title}</p>
    <p className="text-xl font-semibold text-white">{value}</p>
  </div>
);

const formatCurrency = (v) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(v);

const categorizeTransaction = (desc) => {
  const lower = desc.toLowerCase();
  for (const [cat, config] of Object.entries(CATEGORIES)) {
    if (config.keywords.some(kw => lower.includes(kw))) return cat;
  }
  return 'Autre';
};

const detectBank = (headers) => {
  const h = headers.map(x => x?.toLowerCase() || '');
  if (h.some(x => x.includes('started date'))) return 'revolut';
  if (h.some(x => x.includes('payee')) && h.some(x => x.includes('amount (eur)'))) return 'n26';
  if (h.some(x => x.includes('date opération'))) return 'ce';
  if (h.some(x => x.includes('libellé')) && h.some(x => x.includes('montant'))) return 'lcl';
  return 'lcl';
};

export default function App() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [transactions, setTransactions] = useState(initialTransactions);
  const [goals, setGoals] = useState(initialGoals);
  const [importState, setImportState] = useState({ files: [], preview: null, detected: null });
  const [dragOver, setDragOver] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', target: '', deadline: '' });
  const [showGoalForm, setShowGoalForm] = useState(false);

  const accountsData = useMemo(() => {
    const accounts = {};
    transactions.forEach(t => {
      if (!accounts[t.bank]) accounts[t.bank] = 0;
      accounts[t.bank] += t.amount;
    });
    return Object.entries(accounts).map(([name, bal]) => ({
      name, balance: 3000 + bal, color: BANK_CONFIGS[name.toLowerCase()]?.color || '#6366f1'
    }));
  }, [transactions]);

  const totalBalance = accountsData.reduce((s, a) => s + a.balance, 0);
  const totalDepenses = transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const totalRevenus = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const tauxEpargne = totalRevenus > 0 ? (((totalRevenus - totalDepenses) / totalRevenus) * 100).toFixed(0) : 0;

  const categoryStats = useMemo(() => {
    const stats = {};
    transactions.filter(t => t.amount < 0).forEach(t => {
      if (!stats[t.category]) stats[t.category] = 0;
      stats[t.category] += Math.abs(t.amount);
    });
    return Object.entries(stats).map(([name, value]) => ({
      name, value, color: CATEGORIES[name]?.color || '#64748b', icon: CATEGORIES[name]?.icon || CreditCard
    })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  const subscriptions = useMemo(() => {
    const subs = {};
    transactions.filter(t => t.category === 'Abonnements').forEach(t => {
      const key = t.description.toLowerCase();
      if (!subs[key]) subs[key] = { name: t.description, amount: Math.abs(t.amount), count: 0 };
      subs[key].count++;
    });
    return Object.values(subs).filter(s => s.count >= 1);
  }, [transactions]);

  const alerts = useMemo(() => {
    const a = [];
    const totalSubs = subscriptions.reduce((s, sub) => s + sub.amount, 0);
    if (totalSubs > 100) a.push({ type: 'warning', title: 'Abonnements élevés', message: `${formatCurrency(totalSubs)}/mois`, icon: AlertTriangle });
    if (totalDepenses > totalRevenus * 0.9) a.push({ type: 'danger', title: 'Dépenses élevées', message: '+90% des revenus', icon: TrendingDown });
    const resto = categoryStats.find(c => c.name === 'Restaurants');
    if (resto && resto.value > 200) a.push({ type: 'info', title: 'Restaurants', message: `${formatCurrency(resto.value)} ce mois`, icon: Coffee });
    return a;
  }, [subscriptions, totalDepenses, totalRevenus, categoryStats]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer?.files || e.target?.files || []);
    if (files.length === 0) return;
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target.result;
        const lines = text.split('\n').filter(l => l.trim());
        const headers = lines[0].split(/[,;]/).map(h => h.trim().replace(/"/g, ''));
        const bank = detectBank(headers);
        const config = BANK_CONFIGS[bank];
        
        const parsed = lines.slice(1).map((line, idx) => {
          const cols = line.split(/[,;]/).map(c => c.trim().replace(/"/g, ''));
          const dateIdx = headers.findIndex(h => h.toLowerCase().includes(config.dateCol.toLowerCase().split(' ')[0]));
          const descIdx = headers.findIndex(h => h.toLowerCase().includes(config.descCol.toLowerCase().split(' ')[0]));
          const amtIdx = headers.findIndex(h => h.toLowerCase().includes(config.amountCol.toLowerCase().split(' ')[0]));
          
          const amount = parseFloat((cols[amtIdx] || '0').replace(',', '.').replace(/[^\d.-]/g, '')) || 0;
          const desc = cols[descIdx] || 'Transaction';
          
          return { id: Date.now() + idx, date: cols[dateIdx] || new Date().toISOString().split('T')[0], description: desc, amount, category: categorizeTransaction(desc), bank: config.name };
        }).filter(t => t.amount !== 0);
        
        setImportState({ files: [{ name: file.name, bank: config.name, count: parsed.length }], preview: parsed, detected: bank });
      };
      reader.readAsText(file);
    });
  }, []);

  const confirmImport = () => {
    if (importState.preview) {
      setTransactions(prev => [...importState.preview, ...prev]);
      setImportState({ files: [], preview: null, detected: null });
    }
  };

  const addGoal = () => {
    if (newGoal.name && newGoal.target) {
      setGoals(prev => [...prev, { id: Date.now(), name: newGoal.name, target: parseFloat(newGoal.target), current: 0, deadline: newGoal.deadline || '2025-12-31', color: ['#22c55e', '#6366f1', '#f59e0b', '#ec4899'][goals.length % 4] }]);
      setNewGoal({ name: '', target: '', deadline: '' });
      setShowGoalForm(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (<div className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm"><p className="text-gray-400">{label}</p>{payload.map((e, i) => <p key={i} className="text-white">{e.name}: {formatCurrency(e.value)}</p>)}</div>);
    }
    return null;
  };

  const renderDashboard = () => (
    <>
      <div className="grid grid-cols-4 gap-3 mb-6">
        <KPICard title="Patrimoine Total" value={formatCurrency(totalBalance)} change="+8.2%" changeType="up" icon={Wallet} color="bg-indigo-600" />
        <KPICard title="Dépenses du Mois" value={formatCurrency(totalDepenses)} change="-12%" changeType="up" icon={CreditCard} color="bg-rose-600" />
        <KPICard title="Revenus du Mois" value={formatCurrency(totalRevenus)} change="+3.5%" changeType="up" icon={TrendingUp} color="bg-emerald-600" />
        <KPICard title="Taux d'Épargne" value={`${tauxEpargne}%`} change="+5pts" changeType="up" icon={PiggyBank} color="bg-amber-600" />
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-2 bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
          <h3 className="font-semibold mb-3">Évolution du Patrimoine</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={evolutionData}>
              <defs><linearGradient id="cS" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="solde" name="Solde" stroke="#6366f1" strokeWidth={2} fill="url(#cS)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
          <h3 className="font-semibold mb-3">Répartition Dépenses</h3>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart><Pie data={categoryStats.slice(0, 5)} cx="50%" cy="50%" innerRadius={35} outerRadius={50} paddingAngle={3} dataKey="value">{categoryStats.slice(0, 5).map((e, i) => <Cell key={i} fill={e.color} />)}</Pie></PieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-2">{categoryStats.slice(0, 4).map((cat, i) => (<div key={i} className="flex justify-between text-xs"><span className="text-gray-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{backgroundColor: cat.color}}/>{cat.name}</span><span className="text-white">{formatCurrency(cat.value)}</span></div>))}</div>
        </div>
      </div>
      <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
        <div className="flex justify-between items-center mb-3"><h3 className="font-semibold">Dernières Transactions</h3><span className="text-indigo-400 text-sm cursor-pointer">Voir tout →</span></div>
        <div className="space-y-2">{transactions.slice(0, 6).map(t => (<div key={t.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-700/30"><div className="flex items-center gap-3"><div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.amount > 0 ? 'bg-emerald-600/20' : 'bg-gray-700'}`}>{t.amount > 0 ? <TrendingUp size={14} className="text-emerald-400" /> : <CreditCard size={14} className="text-gray-400" />}</div><div><p className="text-sm font-medium">{t.description}</p><p className="text-xs text-gray-500">{t.category} • {t.bank}</p></div></div><span className={`text-sm font-semibold ${t.amount > 0 ? 'text-emerald-400' : 'text-white'}`}>{t.amount > 0 ? '+' : ''}{formatCurrency(t.amount)}</span></div>))}</div>
      </div>
    </>
  );

  const renderImport = () => (
    <div className="space-y-6">
      <div><h2 className="text-xl font-bold mb-1">Import de Relevés</h2><p className="text-gray-400 text-sm">Importez vos relevés bancaires (CSV)</p></div>
      <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop} className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${dragOver ? 'border-indigo-500 bg-indigo-500/10' : 'border-gray-700 hover:border-gray-600'}`}>
        <Upload size={40} className="mx-auto mb-4 text-gray-500" /><p className="text-lg mb-2">Glissez vos fichiers ici</p><p className="text-gray-500 text-sm mb-4">ou</p>
        <label className="px-6 py-2 bg-indigo-600 rounded-xl cursor-pointer hover:bg-indigo-700">Parcourir<input type="file" accept=".csv,.xlsx" multiple onChange={handleDrop} className="hidden" /></label>
      </div>
      {importState.preview && (
        <div className="bg-gray-800/50 rounded-2xl p-5 border border-gray-700/50">
          <div className="flex justify-between items-center mb-4"><div><h3 className="font-semibold flex items-center gap-2"><Check className="text-emerald-400" size={18} />Banque : {BANK_CONFIGS[importState.detected]?.name}</h3><p className="text-sm text-gray-400">{importState.preview.length} transactions</p></div>
          <div className="flex gap-2"><button onClick={() => setImportState({ files: [], preview: null, detected: null })} className="px-4 py-2 bg-gray-700 rounded-xl">Annuler</button><button onClick={confirmImport} className="px-4 py-2 bg-emerald-600 rounded-xl flex items-center gap-2"><Check size={16} />Importer</button></div></div>
          <div className="max-h-64 overflow-y-auto space-y-1">{importState.preview.slice(0, 10).map((t, i) => (<div key={i} className="flex justify-between items-center p-2 bg-gray-700/30 rounded-lg text-sm"><span className="text-gray-400 w-24">{t.date}</span><span className="flex-1 truncate px-2">{t.description}</span><span className="text-xs px-2 py-1 bg-gray-700 rounded">{t.category}</span><span className={`w-24 text-right font-medium ${t.amount > 0 ? 'text-emerald-400' : 'text-white'}`}>{formatCurrency(t.amount)}</span></div>))}</div>
        </div>
      )}
      <div className="bg-gray-800/50 rounded-2xl p-5 border border-gray-700/50"><h3 className="font-semibold mb-3">Banques Supportées</h3><div className="grid grid-cols-5 gap-3">{Object.entries(BANK_CONFIGS).map(([key, bank]) => (<div key={key} className="p-3 bg-gray-700/30 rounded-xl text-center"><div className="w-8 h-8 rounded-full mx-auto mb-2" style={{ backgroundColor: bank.color }} /><p className="text-sm">{bank.name}</p></div>))}</div></div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div><h2 className="text-xl font-bold mb-1">Analyses</h2><p className="text-gray-400 text-sm">Insights et opportunités</p></div>
      {alerts.length > 0 && <div className="space-y-2">{alerts.map((alert, i) => (<div key={i} className={`p-4 rounded-xl flex items-center gap-3 ${alert.type === 'danger' ? 'bg-red-500/10 border border-red-500/30' : alert.type === 'warning' ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-blue-500/10 border border-blue-500/30'}`}><alert.icon className={alert.type === 'danger' ? 'text-red-400' : alert.type === 'warning' ? 'text-amber-400' : 'text-blue-400'} /><div><p className="font-medium">{alert.title}</p><p className="text-sm text-gray-400">{alert.message}</p></div></div>))}</div>}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800/50 rounded-2xl p-5 border border-gray-700/50"><h3 className="font-semibold mb-4 flex items-center gap-2"><Wifi size={18} className="text-pink-400" />Abonnements</h3><div className="space-y-3">{subscriptions.map((sub, i) => (<div key={i} className="flex justify-between items-center p-3 bg-gray-700/30 rounded-xl"><span>{sub.name}</span><span className="font-semibold">{formatCurrency(sub.amount)}/mois</span></div>))}<div className="pt-3 border-t border-gray-700 flex justify-between"><span className="text-gray-400">Total</span><span className="font-bold text-pink-400">{formatCurrency(subscriptions.reduce((s, sub) => s + sub.amount, 0))}</span></div></div></div>
        <div className="bg-gray-800/50 rounded-2xl p-5 border border-gray-700/50"><h3 className="font-semibold mb-4 flex items-center gap-2"><BarChart3 size={18} className="text-indigo-400" />Par Catégorie</h3><ResponsiveContainer width="100%" height={200}><BarChart data={categoryStats.slice(0, 6)} layout="vertical"><XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} /><YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} width={80} /><Tooltip content={<CustomTooltip />} /><Bar dataKey="value" radius={[0, 4, 4, 0]}>{categoryStats.slice(0, 6).map((e, i) => <Cell key={i} fill={e.color} />)}</Bar></BarChart></ResponsiveContainer></div>
      </div>
      <div className="bg-gray-800/50 rounded-2xl p-5 border border-gray-700/50"><h3 className="font-semibold mb-4 flex items-center gap-2"><Zap size={18} className="text-amber-400" />Économies Potentielles</h3><div className="grid grid-cols-3 gap-3">{[{ title: 'Restaurants', saving: 100, tip: 'Cuisiner +2x/semaine' },{ title: 'Abonnements', saving: 30, tip: 'Offres famille' },{ title: 'Transport', saving: 50, tip: 'Covoiturage' }].map((opp, i) => (<div key={i} className="p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/20"><p className="font-medium mb-1">{opp.title}</p><p className="text-2xl font-bold text-amber-400">-{opp.saving}€</p><p className="text-xs text-gray-400 mt-1">{opp.tip}</p></div>))}</div></div>
    </div>
  );

  const renderGoals = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><div><h2 className="text-xl font-bold mb-1">Objectifs</h2><p className="text-gray-400 text-sm">Suivez vos projets</p></div><button onClick={() => setShowGoalForm(true)} className="px-4 py-2 bg-indigo-600 rounded-xl hover:bg-indigo-700 flex items-center gap-2"><Plus size={16} />Nouveau</button></div>
      {showGoalForm && (<div className="bg-gray-800/50 rounded-2xl p-5 border border-indigo-500/50"><h3 className="font-semibold mb-4">Créer un Objectif</h3><div className="grid grid-cols-3 gap-4 mb-4"><input placeholder="Nom" value={newGoal.name} onChange={e => setNewGoal({...newGoal, name: e.target.value})} className="p-3 bg-gray-700 rounded-xl border border-gray-600 focus:border-indigo-500 outline-none" /><input type="number" placeholder="Montant (€)" value={newGoal.target} onChange={e => setNewGoal({...newGoal, target: e.target.value})} className="p-3 bg-gray-700 rounded-xl border border-gray-600 focus:border-indigo-500 outline-none" /><input type="date" value={newGoal.deadline} onChange={e => setNewGoal({...newGoal, deadline: e.target.value})} className="p-3 bg-gray-700 rounded-xl border border-gray-600 focus:border-indigo-500 outline-none" /></div><div className="flex gap-2"><button onClick={() => setShowGoalForm(false)} className="px-4 py-2 bg-gray-700 rounded-xl">Annuler</button><button onClick={addGoal} className="px-4 py-2 bg-emerald-600 rounded-xl flex items-center gap-2"><Check size={16} />Créer</button></div></div>)}
      <div className="grid grid-cols-1 gap-4">{goals.map(goal => { const progress = (goal.current / goal.target) * 100; const remaining = goal.target - goal.current; const monthsLeft = Math.max(1, Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24 * 30))); const monthlyNeeded = remaining / monthsLeft; return (<div key={goal.id} className="bg-gray-800/50 rounded-2xl p-5 border border-gray-700/50"><div className="flex justify-between items-start mb-4"><div><h3 className="font-semibold text-lg">{goal.name}</h3><p className="text-sm text-gray-400 flex items-center gap-1"><Calendar size={12} />{new Date(goal.deadline).toLocaleDateString('fr-FR')}</p></div><button className="p-2 hover:bg-gray-700 rounded-lg"><Trash2 size={16} className="text-gray-500" /></button></div><div className="flex items-end gap-4 mb-3"><span className="text-3xl font-bold">{formatCurrency(goal.current)}</span><span className="text-gray-500 mb-1">/ {formatCurrency(goal.target)}</span></div><div className="h-3 bg-gray-700 rounded-full overflow-hidden mb-3"><div className="h-full rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%`, backgroundColor: goal.color }} /></div><div className="flex justify-between text-sm"><span className="text-gray-400">{progress.toFixed(0)}%</span><span className="text-gray-400">Besoin: <span className="text-white font-medium">{formatCurrency(monthlyNeeded)}/mois</span></span></div></div>); })}</div>
      <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-2xl p-5 border border-indigo-500/30"><h3 className="font-semibold mb-2 flex items-center gap-2"><Target size={18} />Simulation</h3><p className="text-gray-300 text-sm">Taux d'épargne: <span className="text-indigo-400 font-bold">{tauxEpargne}%</span> — Objectifs atteignables d'ici <span className="text-indigo-400 font-bold">2026</span></p></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <aside className="fixed left-0 top-0 h-full w-56 bg-gray-800/50 backdrop-blur border-r border-gray-700/50 p-4 z-10">
        <div className="flex items-center gap-2 mb-6 px-2"><div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center"><Wallet size={18} /></div><span className="text-lg font-bold">FinanceApp</span></div>
        <nav className="space-y-1">{[{ id: 'dashboard', icon: Home, label: 'Dashboard' },{ id: 'import', icon: Upload, label: 'Import' },{ id: 'analytics', icon: BarChart3, label: 'Analyses' },{ id: 'goals', icon: Target, label: 'Objectifs' }].map(item => (<button key={item.id} onClick={() => setActiveNav(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm ${activeNav === item.id ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700/50'}`}><item.icon size={18} />{item.label}</button>))}</nav>
        <div className="mt-6 pt-4 border-t border-gray-700/50"><p className="text-xs text-gray-500 uppercase tracking-wider mb-2 px-2">Comptes</p>{accountsData.map((a, i) => (<div key={i} className="flex justify-between items-center px-2 py-1.5 text-xs"><span className="text-gray-400 truncate">{a.name}</span><span className="font-medium">{formatCurrency(a.balance)}</span></div>))}<div className="mt-2 pt-2 border-t border-gray-700/50 px-2 flex justify-between"><span className="text-gray-400 text-xs">Total</span><span className="font-bold text-sm">{formatCurrency(totalBalance)}</span></div></div>
      </aside>
      <main className="ml-56 p-6">
        <header className="flex justify-between items-center mb-6"><h1 className="text-xl font-bold">{activeNav === 'dashboard' ? 'Tableau de bord' : activeNav === 'import' ? 'Import' : activeNav === 'analytics' ? 'Analyses' : 'Objectifs'}</h1><button className="p-2 bg-gray-800 rounded-xl hover:bg-gray-700 relative"><Bell size={18} /><span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" /></button></header>
        {activeNav === 'dashboard' && renderDashboard()}
        {activeNav === 'import' && renderImport()}
        {activeNav === 'analytics' && renderAnalytics()}
        {activeNav === 'goals' && renderGoals()}
      </main>
    </div>
  );
}
