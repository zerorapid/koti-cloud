"use client";

import { useState } from "react";
import { 
  ImageIcon, 
  Trash2, 
  Plus, 
  Bell,
  Layout,
  ChevronRight,
  Settings,
  Sparkles,
  Filter,
  Send,
  Ticket,
  Maximize2,
  CheckCircle2,
  X,
  TrendingUp,
  MousePointer2,
  ShoppingBag,
  DollarSign,
  BarChart3,
  AlertCircle,
  Download,
  Calendar,
  Smartphone,
  Tag,
  PieChart,
  Zap,
  Target,
  ArrowRight,
  MoreVertical,
  Activity,
  History,
  Eye,
  GripVertical,
  UserPlus,
  Clock,
  MapPin,
  Volume2,
  Globe,
  Layers,
  ArrowUpRight
} from "lucide-react";
import { BANNERS } from "@/lib/koti-db";

const TABS = [
  { id: 'hero', label: '🎨 Hero Banners' },
  { id: 'push', label: '🔔 Push Notifications' },
  { id: 'coupons', label: '🏷️ Coupons & Offers' },
  { id: 'popups', label: '💬 Popups & Interstitials' }
];

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState('hero');
  const [banners, setBanners] = useState(BANNERS);
  const [perfModal, setPerfModal] = useState<any>(null);
  const [createModal, setCreateModal] = useState<string | null>(null);

  const closeModals = () => {
    setPerfModal(null);
    setCreateModal(null);
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <Sparkles size={18} className="text-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">Growth Engine</span>
           </div>
           <h1 className="text-3xl font-black text-foreground tracking-tighter">In-App Marketing Manager</h1>
           <p className="text-muted-foreground font-medium mt-1 text-sm">Orchestrate cross-platform banners, notifications, and promotional logic.</p>
        </div>
        <div className="flex items-center gap-3">
           <select className="bg-card border border-border px-4 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest outline-none focus:border-primary transition-all">
              <option>All Cities</option>
              <option>Nashik</option>
              <option>Vijayawada</option>
           </select>
           <button className="flex items-center gap-2 px-5 py-2.5 bg-card border border-border rounded-lg text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all shadow-sm">
              <Download size={14} /> Global Report
           </button>
        </div>
      </div>

      {/* 2. KPI Overview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <KPICard label="Active Campaigns" value="4" />
         <KPICard label="Avg Banner CTR" value="3.8%" trend="+0.4%" trendUp />
         <KPICard label="Push Delivery" value="98.2%" />
         <KPICard label="Marketing ROAS" value="12.4x" trend="+2.1x" trendUp />
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex gap-8 border-b border-border mb-6">
         {TABS.map(tab => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             className={`pb-4 px-1 text-[13px] font-black tracking-tight transition-all border-b-2 ${
               activeTab === tab.id 
                 ? 'border-primary text-primary' 
                 : 'border-transparent text-muted-foreground hover:text-foreground'
             }`}
           >
             {tab.label}
           </button>
         ))}
      </div>

      {/* 4. Tab Content Area */}
      <div className="animate-in slide-in-from-bottom-2 duration-500">
         
         {/* HERO BANNERS */}
         {activeTab === 'hero' && (
           <div className="space-y-8">
              <Section title="Home Screen Carousel Manager" action={<button onClick={() => setCreateModal('banner')} className="px-5 py-2 bg-primary text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm hover:opacity-90 active:scale-95 transition-all">+ Add Banner</button>}>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {banners.filter(b => b.slot === 'Hero').map((b, i) => (
                      <div key={i} className="bg-card border border-border rounded-xl p-4 shadow-sm hover:border-primary/20 transition-all group relative overflow-hidden">
                         <div className="flex items-center gap-2 mb-3">
                            <GripVertical size={14} className="text-muted-foreground/30 cursor-move" />
                            <h4 className="text-[13px] font-black text-foreground tracking-tight truncate">{b.title}</h4>
                         </div>
                         <div className="aspect-[16/7] bg-muted rounded-lg overflow-hidden border border-border mb-3 relative">
                            <img src={b.img} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute top-2 right-2 px-2 py-0.5 bg-background/90 backdrop-blur-sm rounded text-[8px] font-black uppercase tracking-widest border border-border">{b.slot}</div>
                         </div>
                         <div className="space-y-1.5 mb-4">
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter flex items-center gap-2">
                               <Calendar size={12} className="text-primary" /> Apr 20 → Apr 25
                            </div>
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter flex items-center gap-2">
                               <MapPin size={12} className="text-primary" /> Nashik, Vijayawada
                            </div>
                         </div>
                         <div className="flex gap-2">
                            <button onClick={() => setPerfModal({ type: 'Banner', name: b.title, imp: '42K', ctr: '5.9%', rev: '₹1.4L' })} className="p-2 bg-primary/10 text-primary rounded-lg border border-primary/20 hover:bg-primary hover:text-white transition-all shadow-sm">
                               <BarChart3 size={14} />
                            </button>
                            <button className="flex-1 py-1.5 bg-secondary text-[10px] font-black uppercase tracking-widest rounded-lg border border-border hover:bg-muted transition-all">Edit</button>
                            <button className="px-2 py-1.5 bg-secondary text-red-500 rounded-lg border border-border hover:bg-red-50 transition-all"><Trash2 size={14} /></button>
                         </div>
                      </div>
                    ))}
                 </div>
              </Section>
           </div>
         )}

         {/* PUSH NOTIFICATIONS */}
         {activeTab === 'push' && (
           <div className="space-y-8">
              <Section title="Send New Push" action={<button onClick={() => setCreateModal('push')} className="px-5 py-2 bg-primary text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">+ New Push Campaign</button>}>
                 <div className="overflow-x-auto border border-border rounded-xl">
                    <table className="w-full text-left">
                       <thead className="bg-muted/30 text-[9px] font-black text-muted-foreground uppercase tracking-[2px] border-b border-border">
                          <tr>
                             <th className="px-6 py-4">Date</th>
                             <th className="px-6 py-4">Notification Title</th>
                             <th className="px-6 py-4">Target</th>
                             <th className="px-6 py-4 text-center">Delivered</th>
                             <th className="px-6 py-4 text-center">Opened</th>
                             <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-border/50">
                          <PushRow 
                            date="Apr 19, 10:30 AM" 
                            title="Fresh Greens Sale!" 
                            target="All Users" 
                            del="14,100" 
                            open="3,800" 
                            status="Completed" 
                            onPerf={() => setPerfModal({ type: 'Push', name: 'Fresh Greens Sale!', imp: '14.5K', ctr: '26%', rev: '₹42K' })}
                          />
                          <PushRow 
                            date="Apr 18, 06:00 PM" 
                            title="50% Off Snacks" 
                            target="Cart Abandoners" 
                            del="2,750" 
                            open="1,200" 
                            status="Completed"
                            onPerf={() => setPerfModal({ type: 'Push', name: '50% Off Snacks', imp: '2.8K', ctr: '43%', rev: '₹12K' })}
                          />
                       </tbody>
                    </table>
                 </div>
              </Section>
           </div>
         )}

         {/* COUPONS */}
         {activeTab === 'coupons' && (
           <div className="space-y-8">
              <Section title="Coupon Manager" action={<button onClick={() => setCreateModal('coupon')} className="px-5 py-2 bg-primary text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">+ Create Coupon</button>}>
                 <div className="overflow-x-auto border border-border rounded-xl">
                    <table className="w-full text-left">
                       <thead className="bg-muted/30 text-[9px] font-black text-muted-foreground uppercase tracking-[2px] border-b border-border">
                          <tr>
                             <th className="px-6 py-4">Code</th>
                             <th className="px-6 py-4">Discount</th>
                             <th className="px-6 py-4 text-center">Limit</th>
                             <th className="px-6 py-4 text-center">Used</th>
                             <th className="px-6 py-4">Expiry</th>
                             <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-border/50">
                          <CouponRow 
                            code="WELCOME50" 
                            disc="₹50 Flat" 
                            limit="5,000" 
                            used="3,842" 
                            exp="May 31" 
                            status="Active" 
                            onPerf={() => setPerfModal({ type: 'Coupon', name: 'WELCOME50', imp: '5.2K Uses', ctr: 'ROAS 3.5x', rev: '₹6.8L GMV' })}
                          />
                          <CouponRow 
                            code="MONSOON20" 
                            disc="20% Off" 
                            limit="10,000" 
                            used="6,210" 
                            exp="Apr 30" 
                            status="Active"
                            onPerf={() => setPerfModal({ type: 'Coupon', name: 'MONSOON20', imp: '8.4K Uses', ctr: 'ROAS 2.2x', rev: '₹16.8L GMV' })}
                          />
                       </tbody>
                    </table>
                 </div>
              </Section>
           </div>
         )}

         {/* POPUPS */}
         {activeTab === 'popups' && (
           <Section title="Interstitial & Dialog Manager" action={<button onClick={() => setCreateModal('popup')} className="px-5 py-2 bg-primary text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">+ Add Popup</button>}>
              <div className="overflow-x-auto border border-border rounded-xl">
                 <table className="w-full text-left">
                    <thead className="bg-muted/30 text-[9px] font-black text-muted-foreground uppercase tracking-[2px] border-b border-border">
                       <tr>
                          <th className="px-6 py-4">Popup Name</th>
                          <th className="px-6 py-4">Type</th>
                          <th className="px-6 py-4">Trigger</th>
                          <th className="px-6 py-4 text-center">CTR %</th>
                          <th className="px-6 py-4 text-center">Dismiss %</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                       <PopupRow 
                         name="Refer & Earn" 
                         type="Interstitial" 
                         trig="App Open" 
                         ctr="12.4%" 
                         dis="68%" 
                         status="Active" 
                         onPerf={() => setPerfModal({ type: 'Popup', name: 'Refer & Earn', imp: '45K', ctr: '12.4%', rev: '₹2.1L GMV' })}
                       />
                       <PopupRow 
                         name="UPI Cashback" 
                         type="Bottom Sheet" 
                         trig="Checkout" 
                         ctr="8.2%" 
                         dis="82%" 
                         status="Active"
                         onPerf={() => setPerfModal({ type: 'Popup', name: 'UPI Cashback', imp: '18K', ctr: '8.2%', rev: '₹84K GMV' })}
                       />
                    </tbody>
                 </table>
              </div>
           </Section>
         )}

      </div>

      {/* PERFORMANCE POPUP (MODAL) */}
      {perfModal && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={closeModals} />
           <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="px-8 py-6 border-b border-border bg-muted/10 flex items-center justify-between">
                 <div>
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10 mb-2 inline-block">{perfModal.type} Performance</span>
                    <h3 className="text-xl font-black text-foreground tracking-tighter">{perfModal.name}</h3>
                 </div>
                 <button onClick={closeModals} className="p-2 hover:bg-muted rounded-full transition-colors"><X size={20} /></button>
              </div>
              <div className="p-8">
                 <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Impressions / Reach</p>
                       <p className="text-2xl font-black text-foreground tracking-tighter">{perfModal.imp}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Click / Open Rate</p>
                       <p className="text-2xl font-black text-primary tracking-tighter">{perfModal.ctr}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Revenue (₹)</p>
                       <p className="text-2xl font-black text-green-600 tracking-tighter">{perfModal.rev}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Efficiency / ROAS</p>
                       <p className="text-2xl font-black text-foreground tracking-tighter">14.2x</p>
                    </div>
                 </div>
                 <div className="bg-muted/30 border border-border rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                          <TrendingUp size={18} />
                       </div>
                       <div>
                          <p className="text-[11px] font-black text-foreground leading-none">Healthy Conversion</p>
                          <p className="text-[10px] font-bold text-muted-foreground mt-1">Performing 22% better than average</p>
                       </div>
                    </div>
                    <ArrowUpRight size={18} className="text-muted-foreground" />
                 </div>
              </div>
              <div className="px-8 py-4 bg-muted/5 border-t border-border flex justify-end">
                 <button onClick={closeModals} className="px-6 py-2 bg-primary text-white rounded-lg text-[11px] font-black uppercase tracking-widest">Close Metrics</button>
              </div>
           </div>
        </div>
      )}

      {/* CREATE MODALS (EXPANDED INPUT FIELDS) */}
      {createModal && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 animate-in fade-in duration-300 overflow-y-auto">
           <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={closeModals} />
           <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden my-auto animate-in slide-in-from-bottom-4 duration-300">
              <div className="px-8 py-6 border-b border-border bg-muted/10 flex items-center justify-between">
                 <h3 className="text-xl font-black text-foreground tracking-tighter uppercase tracking-widest text-[14px]">
                    {createModal === 'banner' && '✨ Create New Banner'}
                    {createModal === 'push' && '📡 New Push Campaign'}
                    {createModal === 'coupon' && '🏷️ Issue New Coupon'}
                    {createModal === 'popup' && '💬 Design In-App Popup'}
                 </h3>
                 <button onClick={closeModals} className="p-2 hover:bg-muted rounded-full transition-colors"><X size={20} /></button>
              </div>
              
              <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                 {/* BANNER FORM */}
                 {createModal === 'banner' && (
                   <div className="grid grid-cols-2 gap-6">
                      <FormItem label="Campaign Name" placeholder="e.g., Summer Refresh" colSpan={2} />
                      <FormItem label="Slot Position" type="select" options={['Hero (Top)', 'Secondary (Mid)', 'Footer Slider']} />
                      <FormItem label="City Target" type="select" options={['All Cities', 'Nashik Only', 'Vijayawada Only']} />
                      <FormItem label="Start Date" type="datetime-local" />
                      <FormItem label="End Date" type="datetime-local" />
                      <FormItem label="Deep Link / Action URL" placeholder="app://category/beverages" colSpan={2} />
                      <FormItem label="Image URL (16:9)" placeholder="https://cdn.koti.in/banners/..." colSpan={2} />
                      <div className="col-span-2 p-6 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:border-primary transition-all cursor-pointer bg-muted/5">
                         <ImageIcon size={32} className="mb-2 opacity-20" />
                         <p className="text-[11px] font-black uppercase tracking-widest">Click to upload banner assets</p>
                      </div>
                   </div>
                 )}

                 {/* PUSH FORM */}
                 {createModal === 'push' && (
                   <div className="grid grid-cols-2 gap-6">
                      <FormItem label="Notification Title" placeholder="e.g., Dinner is served! 🍕" colSpan={2} />
                      <FormItem label="Body Text" placeholder="e.g., Get 20% off on all pizzas tonight." colSpan={2} />
                      <FormItem label="Target Segment" type="select" options={['All Active Users', 'New Signups (<7d)', 'Churn Risk (>15d)', 'Loyalty Tier: Diamond']} />
                      <FormItem label="Priority Level" type="select" options={['Normal (Silent)', 'High (Sound + Banner)', 'Critical (System Alert)']} />
                      <FormItem label="Schedule Delay" type="select" options={['Instant (Now)', 'Scheduled', 'Trigger-based (Event)']} />
                      <FormItem label="Push Sound" type="select" options={['Default Koti', 'Cashier Ring', 'Silent']} />
                      <FormItem label="Image/Icon URL" placeholder="https://cdn.koti.in/icons/..." colSpan={2} />
                      <FormItem label="Deep Link" placeholder="app://promo/pizzas" colSpan={2} />
                   </div>
                 )}

                 {/* COUPON FORM */}
                 {createModal === 'coupon' && (
                   <div className="grid grid-cols-2 gap-6">
                      <FormItem label="Coupon Code" placeholder="e.g., KOTIFRESH20" colSpan={2} />
                      <FormItem label="Discount Type" type="select" options={['Percentage (%)', 'Flat Amount (₹)', 'Free Delivery']} />
                      <FormItem label="Discount Value" placeholder="e.g., 20" />
                      <FormItem label="Min. Order Value (₹)" placeholder="e.g., 499" />
                      <FormItem label="Max. Discount (₹)" placeholder="e.g., 100" />
                      <FormItem label="Usage Limit (Per User)" type="number" defaultValue="1" />
                      <FormItem label="Total Pool Limit" type="number" defaultValue="5000" />
                      <FormItem label="Expiry Date" type="datetime-local" colSpan={2} />
                      <FormItem label="Internal Description" placeholder="Campaign tracking notes..." colSpan={2} />
                   </div>
                 )}

                 {/* POPUP FORM */}
                 {createModal === 'popup' && (
                   <div className="grid grid-cols-2 gap-6">
                      <FormItem label="Popup Internal Name" placeholder="e.g., Wallet Balance Alert" colSpan={2} />
                      <FormItem label="Display Type" type="select" options={['Full Screen Modal', 'Bottom Sheet Slider', 'Centered Dialog']} />
                      <FormItem label="Trigger Event" type="select" options={['On App Open', 'On Cart View', 'On Successful Delivery', 'Timed (30s delay)']} />
                      <FormItem label="Frequency Cap" type="select" options={['1 per session', '1 per day', '1 per week', 'No limit']} />
                      <FormItem label="Display Priority" type="number" defaultValue="1" />
                      <FormItem label="Auto-Dismiss (Sec)" type="number" defaultValue="0" />
                      <FormItem label="Action URL" placeholder="app://wallet/recharge" colSpan={2} />
                      <div className="col-span-2 flex items-center gap-4">
                         <ToggleItem label="Blur Background" defaultChecked />
                         <ToggleItem label="Close on Overlay Click" defaultChecked />
                      </div>
                   </div>
                 )}
              </div>

              <div className="px-8 py-6 bg-muted/10 border-t border-border flex justify-end gap-3">
                 <button onClick={closeModals} className="px-6 py-3 bg-secondary text-foreground border border-border rounded-lg text-[11px] font-black uppercase tracking-widest shadow-sm hover:bg-muted transition-all">Cancel</button>
                 <button onClick={closeModals} className="px-8 py-3 bg-primary text-white rounded-lg text-[11px] font-black uppercase tracking-widest shadow-md shadow-primary/20 hover:opacity-90 active:scale-95 transition-all">Create Campaign</button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}

function Section({ title, action, children }: any) {
  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
       <div className="px-8 py-6 border-b border-border bg-muted/5 flex items-center justify-between">
          <h3 className="text-base font-black text-foreground tracking-tighter uppercase tracking-widest text-[11px]">{title}</h3>
          {action}
       </div>
       <div className="p-8">
          {children}
       </div>
    </div>
  );
}

function KPICard({ label, value, trend, trendUp }: any) {
  return (
    <div className="bg-card p-6 border border-border rounded-xl shadow-sm text-center">
       <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
       <p className="text-xl font-black text-foreground tracking-tighter">{value}</p>
       {trend && (
         <p className={`text-[9px] font-bold mt-1 ${trendUp ? 'text-green-500' : 'text-red-500'}`}>{trend}</p>
       )}
    </div>
  );
}

function FormItem({ label, placeholder, type = "text", options = [], colSpan = 1, defaultValue }: any) {
  return (
    <div className={`space-y-2 ${colSpan === 2 ? 'col-span-2' : ''}`}>
       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">{label}</label>
       {type === 'select' ? (
         <select className="w-full px-4 py-3 bg-muted/20 border border-input rounded-lg text-[13px] font-bold outline-none focus:border-primary transition-all">
            {options.map((opt: string) => <option key={opt}>{opt}</option>)}
         </select>
       ) : (
         <input 
           type={type} 
           placeholder={placeholder} 
           defaultValue={defaultValue}
           className="w-full px-4 py-3 bg-muted/20 border border-input rounded-lg text-[13px] font-bold focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30" 
         />
       )}
    </div>
  );
}

function ToggleItem({ label, checked, defaultChecked, onChange }: any) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group py-1">
       <div className="relative">
          <input 
            type="checkbox" 
            className="sr-only" 
            checked={checked} 
            defaultChecked={defaultChecked}
            onChange={(e) => onChange?.(e.target.checked)} 
          />
          <div className={`w-8 h-4 rounded-full border transition-all ${
             checked || defaultChecked ? 'bg-primary border-primary' : 'bg-muted border-border'
          }`} />
          <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-all ${
             checked || defaultChecked ? 'left-4.5' : 'left-0.5'
          }`} />
       </div>
       <span className="text-[11px] font-black text-muted-foreground group-hover:text-primary transition-colors tracking-widest uppercase">{label}</span>
    </label>
  );
}

function PushRow({ date, title, target, del, open, status, onPerf }: any) {
  return (
    <tr className="hover:bg-secondary/30 transition-colors">
       <td className="px-6 py-4 text-[11px] font-bold text-muted-foreground">{date}</td>
       <td className="px-6 py-4 font-black text-[13px] tracking-tight">{title}</td>
       <td className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest">{target}</td>
       <td className="px-6 py-4 text-center text-[13px] font-medium">{del}</td>
       <td className="px-6 py-4 text-center text-[13px] font-medium">{open}</td>
       <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
          <button onClick={onPerf} className="p-2 bg-primary/10 text-primary rounded-lg border border-primary/20 hover:bg-primary hover:text-white transition-all shadow-sm">
             <BarChart3 size={14} />
          </button>
          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${status === 'Completed' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>{status}</span>
       </td>
    </tr>
  );
}

function CouponRow({ code, disc, limit, used, exp, status, onPerf }: any) {
  return (
    <tr className="hover:bg-secondary/30 transition-colors">
       <td className="px-6 py-4 font-black text-[13px] tracking-widest text-primary">{code}</td>
       <td className="px-6 py-4 font-black text-[13px]">{disc}</td>
       <td className="px-6 py-4 text-center text-[13px] font-medium">{limit}</td>
       <td className="px-6 py-4 text-center text-[13px] font-medium">{used}</td>
       <td className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest">{exp}</td>
       <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
          <button onClick={onPerf} className="p-2 bg-primary/10 text-primary rounded-lg border border-primary/20 hover:bg-primary hover:text-white transition-all shadow-sm">
             <BarChart3 size={14} />
          </button>
          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${status === 'Active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>{status}</span>
       </td>
    </tr>
  );
}

function PopupRow({ name, type, trig, ctr, dis, status, onPerf }: any) {
  return (
    <tr className="hover:bg-secondary/30 transition-colors">
       <td className="px-6 py-4 font-black text-[13px] tracking-tight">{name}</td>
       <td className="px-6 py-4 text-[11px] font-black uppercase tracking-widest">{type}</td>
       <td className="px-6 py-4 text-[11px] font-bold text-muted-foreground">{trig}</td>
       <td className="px-6 py-4 text-center font-black text-green-600">{ctr}</td>
       <td className="px-6 py-4 text-center font-bold text-muted-foreground/50">{dis}</td>
       <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
          <button onClick={onPerf} className="p-2 bg-primary/10 text-primary rounded-lg border border-primary/20 hover:bg-primary hover:text-white transition-all shadow-sm">
             <BarChart3 size={14} />
          </button>
          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${status === 'Active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>{status}</span>
       </td>
    </tr>
  );
}
