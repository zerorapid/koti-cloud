"use client";

import { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Calendar, 
  Filter, 
  ChevronRight, 
  ArrowUpRight, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Clock, 
  MapPin, 
  AlertCircle,
  RefreshCw,
  PieChart,
  Target,
  Activity,
  Layers,
  Truck,
  CreditCard,
  Building,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  MousePointer2,
  Info,
  Zap,
  Flame,
  Layout
} from "lucide-react";

export default function ReportsPage() {
  const [city, setCity] = useState("all");
  const [zone, setZone] = useState("all");

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      
      {/* 1. Header & Intelligent Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <Activity size={18} className="text-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">Control Environment</span>
           </div>
           <h1 className="text-3xl font-black text-foreground tracking-tighter">Analytics & Reports</h1>
           <p className="text-muted-foreground font-medium mt-1 text-sm">Synchronized multi-pincode intelligence and operational audit layer.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
           <select 
             value={city} 
             onChange={(e) => setCity(e.target.value)}
             className="bg-card border border-border px-4 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest outline-none focus:border-primary transition-all"
           >
              <option value="all">All Cities</option>
              <option value="nashik">Nashik</option>
              <option value="vijayawada">Vijayawada</option>
           </select>
           <select 
             value={zone} 
             onChange={(e) => setZone(e.target.value)}
             className="bg-card border border-border px-4 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest outline-none focus:border-primary transition-all"
           >
              <option value="all">All Zones</option>
              <option value="urban">Semi-Urban</option>
              <option value="rural">Rural Clusters</option>
              <option value="industrial">Industrial Belt</option>
           </select>
           <input type="date" defaultValue="2026-04-13" className="bg-card border border-border px-4 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest outline-none focus:border-primary transition-all" />
           <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-[11px] font-black uppercase tracking-widest shadow-md hover:opacity-90 active:scale-95 transition-all">
              <Download size={14} /> Export CSV
           </button>
        </div>
      </div>

      {/* 2. KPI Grid (The Pulse) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
         <KPICard label="Total Orders" value="14,892" trend="+18.4%" trendUp />
         <KPICard label="Avg Delivery" value="14.2 min" trend="-1.1 min" trendUp />
         <KPICard label="SLA Compliance" value="89.7%" trend="+4.2%" trendUp />
         <KPICard label="Cancellation" value="5.1%" trend="+0.8%" trendUp={false} />
         <KPICard label="Wastage" value="2.8%" trend="-0.4%" trendUp />
         <KPICard label="Avg Order Val" value="₹284" trend="+₹12" trendUp />
      </div>

      {/* 3. Primary Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <ChartCard title="📈 Order Volume (7d)">
            <div className="h-40 flex items-end justify-between px-2 pt-4">
               {[40, 60, 45, 90, 65, 80, 70].map((h, i) => (
                 <div key={i} className="w-6 bg-primary/20 rounded-t-md relative group hover:bg-primary transition-all cursor-pointer" style={{ height: `${h}%` }}>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity">{(h * 20).toLocaleString()}</div>
                 </div>
               ))}
            </div>
            <div className="flex justify-between px-2 mt-2 text-[8px] font-black text-muted-foreground uppercase tracking-widest">
               <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
         </ChartCard>

         <ChartCard title="💰 Payment Mix">
            <div className="h-40 flex items-center justify-center relative">
               <svg viewBox="0 0 100 100" className="w-32 h-32 transform -rotate-90">
                  <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="12" fill="none" />
                  <circle cx="50" cy="50" r="40" stroke="#E11D48" strokeWidth="12" fill="none" strokeDasharray="251" strokeDashoffset="95" className="transition-all duration-1000" />
                  <circle cx="50" cy="50" r="40" stroke="#fbbf24" strokeWidth="12" fill="none" strokeDasharray="251" strokeDashoffset="180" />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-xl font-black tracking-tight text-foreground">₹4.2L</p>
                  <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Revenue</p>
               </div>
            </div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
               <LegendItem color="bg-primary" label="UPI (62%)" />
               <LegendItem color="bg-amber-400" label="COD (28%)" />
            </div>
         </ChartCard>

         <ChartCard title="🚚 Delivery SLA">
            <div className="h-40 flex flex-col justify-center gap-4 px-2">
               <SLABar label="≤ 10 min" val={34} color="bg-green-500" />
               <SLABar label="11-15 min" val={48} color="bg-primary" />
               <SLABar label="16-20 min" val={14} color="bg-amber-500" />
               <SLABar label="> 20 min" val={4} color="bg-red-500" />
            </div>
         </ChartCard>

         <ChartCard title="🥦 Categories">
            <div className="h-40 flex items-end justify-around px-2">
               {[85, 62, 45, 38, 22].map((h, i) => (
                 <div key={i} className="flex flex-col items-center gap-2">
                    <div className="w-8 bg-primary rounded-t-md hover:opacity-80 transition-all" style={{ height: `${h}%` }} />
                    <span className="text-[8px] font-black text-muted-foreground uppercase tracking-tighter">CAT-{i+1}</span>
                 </div>
               ))}
            </div>
         </ChartCard>
      </div>

      {/* 4. Advanced Heatmap & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Section title="🔥 Peak Order Hours Heatmap (Orders)">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm overflow-hidden">
               <div className="grid grid-cols-[40px_repeat(24,1fr)] gap-1">
                  <div />
                  {Array.from({length: 24}).map((_, i) => (
                    <div key={i} className="text-[8px] font-black text-muted-foreground text-center">{i}</div>
                  ))}
                  {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => (
                    <>
                      <div key={day} className="text-[8px] font-black text-muted-foreground flex items-center">{day}</div>
                      {Array.from({length: 24}).map((_, h) => {
                        const val = (h >= 8 && h <= 12) || (h >= 17 && h <= 20) ? Math.random() * 0.8 + 0.2 : Math.random() * 0.2;
                        return <div key={h} className="aspect-square rounded-sm transition-all hover:scale-125 cursor-pointer" style={{ backgroundColor: `rgba(225, 29, 72, ${val})` }} />;
                      })}
                    </>
                  ))}
               </div>
            </div>
         </Section>

         <Section title="📦 Top 10 Fast-Moving SKUs">
            <div className="overflow-x-auto border border-border rounded-xl bg-card">
               <table className="w-full text-left">
                  <thead className="bg-muted/30 text-[9px] font-black text-muted-foreground uppercase tracking-[2px] border-b border-border">
                     <tr>
                        <th className="px-6 py-4">SKU Name</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4 text-center">Orders</th>
                        <th className="px-6 py-4 text-right">Wastage %</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                     <SKURow name="Amul Taaza 500ml" cat="Dairy" count="1,240" waste="0.4%" />
                     <SKURow name="Local Tomatoes 1kg" cat="Veggies" count="980" waste="3.1%" isWarning />
                     <SKURow name="Aashirvaad Atta 5kg" cat="Staples" count="875" waste="0.8%" />
                     <SKURow name="Lay's Classic" cat="Snacks" count="760" waste="1.2%" />
                  </tbody>
               </table>
            </div>
         </Section>
      </div>

      {/* 5. Zone Performance Table */}
      <Section title="🗺️ Zone Performance Dashboard">
         <div className="overflow-x-auto border border-border rounded-xl bg-card shadow-sm">
            <table className="w-full text-left">
               <thead className="bg-muted/30 text-[9px] font-black text-muted-foreground uppercase tracking-[2px] border-b border-border">
                  <tr>
                     <th className="px-6 py-4">Pincode Cluster</th>
                     <th className="px-6 py-4">Zone Type</th>
                     <th className="px-6 py-4 text-center">Orders</th>
                     <th className="px-6 py-4 text-center">Avg Delivery</th>
                     <th className="px-6 py-4 text-center">SLA Hit</th>
                     <th className="px-6 py-4 text-right">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border/50">
                  <ZoneRow pin="422001" zone="Semi-Urban" orders="2,410" time="14.2m" sla="94%" status="Optimized" />
                  <ZoneRow pin="422003" zone="Rural" orders="1,840" time="18.5m" sla="78%" status="Needs Action" />
                  <ZoneRow pin="520004" zone="College Belt" orders="3,210" time="11.4m" sla="96%" status="Optimized" />
               </tbody>
            </table>
         </div>
      </Section>

      {/* 6. Intelligent Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <AlertItem type="critical" icon={AlertTriangle} msg="High vegetable wastage (>3.5%) in Nashik Zone B. Adjust procurement." action="Audit Stock" />
         <AlertItem type="warning" icon={Zap} msg="42% COD orders in Pincode 826001. Push UPI incentives for riders." action="Push Offers" />
         <AlertItem type="info" icon={Info} msg="Evening peak (17:00-20:00) requires 8 extra riders. Auto-schedule enabled." action="Shifts" />
      </div>

    </div>
  );
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="space-y-4">
       <h2 className="text-[11px] font-black text-muted-foreground uppercase tracking-[2px] px-1">{title}</h2>
       {children}
    </div>
  );
}

function KPICard({ label, value, trend, trendUp }: any) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm hover:border-primary/20 transition-all">
       <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2 leading-none">{label}</p>
       <div className="flex items-end justify-between">
          <p className="text-xl font-black text-foreground tracking-tighter leading-none">{value}</p>
          <span className={`text-[9px] font-black ${trendUp ? 'text-green-500' : 'text-red-500'}`}>{trend}</span>
       </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
       <h3 className="text-[11px] font-black text-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
          <Layers size={12} className="text-primary" /> {title}
       </h3>
       {children}
    </div>
  );
}

function LegendItem({ color, label }: any) {
  return (
    <div className="flex items-center gap-1.5">
       <div className={`w-2 h-2 rounded-full ${color}`} />
       <span className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter">{label}</span>
    </div>
  );
}

function SLABar({ label, val, color }: any) {
  return (
    <div className="flex items-center gap-3">
       <span className="w-16 text-[9px] font-black text-muted-foreground text-right">{label}</span>
       <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div className={`h-full ${color}`} style={{ width: `${val}%` }} />
       </div>
       <span className="w-8 text-[9px] font-black text-foreground">{val}%</span>
    </div>
  );
}

function SKURow({ name, cat, count, waste, isWarning }: any) {
  return (
    <tr className="hover:bg-secondary/30 transition-colors">
       <td className="px-6 py-4 font-black text-[13px] tracking-tight">{name}</td>
       <td className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground">{cat}</td>
       <td className="px-6 py-4 text-center text-[13px] font-medium">{count}</td>
       <td className="px-6 py-4 text-right">
          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
             isWarning ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'
          }`}>
             {waste}
          </span>
       </td>
    </tr>
  );
}

function ZoneRow({ pin, zone, orders, time, sla, status }: any) {
  return (
    <tr className="hover:bg-secondary/30 transition-colors">
       <td className="px-6 py-4 font-black text-[13px] tracking-widest text-primary">{pin}</td>
       <td className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground">{zone}</td>
       <td className="px-6 py-4 text-center text-[13px] font-medium">{orders}</td>
       <td className="px-6 py-4 text-center text-[13px] font-bold text-foreground">{time}</td>
       <td className="px-6 py-4 text-center">
          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
             parseInt(sla) > 90 ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'
          }`}>
             {sla}
          </span>
       </td>
       <td className="px-6 py-4 text-right">
          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
             status === 'Optimized' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'
          }`}>
             {status}
          </span>
       </td>
    </tr>
  );
}

function AlertItem({ type, icon: Icon, msg, action }: any) {
  const styles = {
    critical: "bg-red-50 border-red-100 text-red-700",
    warning: "bg-amber-50 border-amber-100 text-amber-700",
    info: "bg-blue-50 border-blue-100 text-blue-700"
  };
  return (
    <div className={`p-4 rounded-xl border flex items-start gap-3 shadow-sm ${styles[type as keyof typeof styles]}`}>
       <Icon size={18} className="mt-0.5 flex-shrink-0" />
       <div className="flex-1">
          <p className="text-[12px] font-bold leading-tight">{msg}</p>
          <button className="mt-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:underline">
             {action} <ArrowRight size={12} />
          </button>
       </div>
    </div>
  );
}
