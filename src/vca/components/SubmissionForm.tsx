import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ChevronRight, MapPin, Package, ShieldCheck, Plus, Trash2 } from 'lucide-react';

export default function SubmissionForm() {
  const [step, setStep] = useState(1);
  
  const [customer, setCustomer] = useState({
    name: '', email: '', address: '', city: '', prov: '', postal: ''
  });
  
  const [items, setItems] = useState([
    { id: 1, name: '', category: 'tcg', year: '', declaredValue: '' }
  ]);
  
  const [services, setServices] = useState({
    expressReturn: false,
    insurance: false,
    clauseProtection: false
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const isStep1Valid = customer.name.length > 2 && customer.address.length > 5;
  const isStep2Valid = items.every(item => item.name.length > 2 && item.declaredValue !== '');

  const addItem = () => {
    setItems([...items, { id: Date.now(), name: '', category: 'tcg', year: '', declaredValue: '' }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: number, field: string, value: string) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  return (
    <section className="py-24 bg-slate-900 relative border-t border-slate-800" id="submit">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-white mb-4">Submit for Authentication</h2>
          <p className="text-slate-400">Complete the form below to register your items and receive mailing instructions.</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-12 max-w-2xl mx-auto">
          {[1, 2, 3, 4].map((num, idx) => (
            <div key={num} className="flex items-center flex-1 last:flex-none">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors z-10 shrink-0 ${
                  step >= num ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {step > num ? <CheckCircle2 className="w-5 h-5" /> : num}
              </div>
              {idx < 3 && (
                <div
                  className={`flex-1 h-1 transition-colors mx-2 rounded-full ${
                    step > num ? 'bg-cyan-500' : 'bg-slate-800'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden min-h-[400px]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600" />
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-400" /> Customer & Return Address
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                      <input type="text" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                      <input type="email" value={customer.email} onChange={e => setCustomer({...customer, email: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Street Address</label>
                    <input type="text" value={customer.address} onChange={e => setCustomer({...customer, address: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">City</label>
                      <input type="text" value={customer.city} onChange={e => setCustomer({...customer, city: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:border-cyan-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Prov / State</label>
                      <input type="text" value={customer.prov} onChange={e => setCustomer({...customer, prov: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:border-cyan-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Postal Code</label>
                      <input type="text" value={customer.postal} onChange={e => setCustomer({...customer, postal: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:border-cyan-500 outline-none transition-all" />
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <button onClick={nextStep} disabled={!isStep1Valid} className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl transition-all">
                    Continue <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Package className="w-5 h-5 text-cyan-400" /> Items Included
                </h3>
                
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item, index) => (
                    <div key={item.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl relative">
                      {items.length > 1 && (
                        <button onClick={() => removeItem(item.id)} className="absolute top-3 right-3 text-slate-500 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <div className="mb-3 text-sm font-semibold text-cyan-500">Item #{index + 1}</div>
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-5">
                          <label className="block text-xs font-medium text-slate-400 mb-1">Item Description</label>
                          <input type="text" value={item.name} onChange={e => updateItem(item.id, 'name', e.target.value)} placeholder="e.g. 1999 Charizard Base Set" className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-sm text-white focus:border-cyan-500 outline-none" />
                        </div>
                        <div className="md:col-span-3">
                          <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                          <select value={item.category} onChange={e => updateItem(item.id, 'category', e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-sm text-white focus:border-cyan-500 outline-none">
                            <option value="tcg">TCG</option>
                            <option value="sports">Sports</option>
                            <option value="memorabilia">Memorabilia</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-slate-400 mb-1">Year</label>
                          <input type="text" value={item.year} onChange={e => updateItem(item.id, 'year', e.target.value)} placeholder="YYYY" className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-sm text-white focus:border-cyan-500 outline-none" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-slate-400 mb-1">Value ($)</label>
                          <input type="number" value={item.declaredValue} onChange={e => updateItem(item.id, 'declaredValue', e.target.value)} placeholder="1000" className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-sm text-white focus:border-cyan-500 outline-none" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button onClick={addItem} className="mt-4 flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 font-medium">
                  <Plus className="w-4 h-4" /> Add Another Item
                </button>

                <div className="mt-8 flex justify-between">
                  <button onClick={prevStep} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors">Back</button>
                  <button onClick={nextStep} disabled={!isStep2Valid} className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl transition-all">
                    Continue <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" /> Services & Protection
                </h3>
                
                <div className="space-y-4">
                  <label className={`flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition-colors ${services.expressReturn ? 'bg-cyan-500/10 border-cyan-500/50' : 'bg-slate-900 border-slate-700 hover:border-slate-500'}`}>
                    <div className="mt-1">
                      <input type="checkbox" checked={services.expressReturn} onChange={(e) => setServices({...services, expressReturn: e.target.checked})} className="w-5 h-5 accent-cyan-500 bg-slate-800 border-slate-600 rounded" />
                    </div>
                    <div>
                      <div className="text-white font-bold mb-1">Express Return Shipping</div>
                      <div className="text-sm text-slate-400">Prioritized overnight return shipping once grading is complete. Requires signature upon delivery.</div>
                    </div>
                  </label>
                  
                  <label className={`flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition-colors ${services.insurance ? 'bg-cyan-500/10 border-cyan-500/50' : 'bg-slate-900 border-slate-700 hover:border-slate-500'}`}>
                    <div className="mt-1">
                      <input type="checkbox" checked={services.insurance} onChange={(e) => setServices({...services, insurance: e.target.checked})} className="w-5 h-5 accent-cyan-500 bg-slate-800 border-slate-600 rounded" />
                    </div>
                    <div>
                      <div className="text-white font-bold mb-1">Full Value Insurance</div>
                      <div className="text-sm text-slate-400">Protects your assets for their total declared value during transit both ways and while in the VCA vault.</div>
                    </div>
                  </label>

                  <label className={`flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition-colors ${services.clauseProtection ? 'bg-cyan-500/10 border-cyan-500/50' : 'bg-slate-900 border-slate-700 hover:border-slate-500'}`}>
                    <div className="mt-1">
                      <input type="checkbox" checked={services.clauseProtection} onChange={(e) => setServices({...services, clauseProtection: e.target.checked})} className="w-5 h-5 accent-cyan-500 bg-slate-800 border-slate-600 rounded" />
                    </div>
                    <div>
                      <div className="text-white font-bold mb-1">Clause Protection Protocol</div>
                      <div className="text-sm text-slate-400">Advanced cryptographic verification logging. Provides an immutable digital certificate of authenticity backed by our guarantee.</div>
                    </div>
                  </label>
                </div>

                <div className="mt-8 flex justify-between">
                  <button onClick={prevStep} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors">Back</button>
                  <button onClick={nextStep} className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-all">
                    Review <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/20">
                    <CheckCircle2 className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Finalize Submission</h3>
                  <p className="text-slate-400">Please review your submission details and mailing instructions.</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-left mb-8 max-w-lg mx-auto">
                  <h4 className="font-bold text-cyan-400 mb-4 border-b border-slate-800 pb-2">Mailing Instructions</h4>
                  <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                    Carefully package your items in semi-rigid card savers or top-loaders. Do not use screw-down cases. Include a printout of your submission confirmation email in the package.
                  </p>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Ship To</p>
                    <p className="text-white font-mono text-lg font-bold">Verified Card Authority</p>
                    <p className="text-slate-300 font-mono">3534 46 St NW</p>
                    <p className="text-slate-300 font-mono">Edmonton, Alberta</p>
                    <p className="text-cyan-400 font-mono font-bold">T6L 5X2</p>
                  </div>
                </div>

                <div className="flex justify-between max-w-lg mx-auto">
                  <button onClick={prevStep} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors">Edit</button>
                  <button onClick={() => alert('Submission confirmed! Check your email for printing labels.')} className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                    Confirm & Submit
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
