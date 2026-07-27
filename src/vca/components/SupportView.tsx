import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Send, MessageSquare, CheckCircle2 } from 'lucide-react';

export default function SupportView() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [messageSent, setMessageSent] = useState(false);

  const faqs = [
    { q: 'How does VCA NFC slab authentication work?', a: 'Every VCA slab includes an embedded NTAG 424 DNA cryptographic microchip. Tapping your smartphone reads a secure, uncloneable UID tied directly to our immutable grading ledger.' },
    { q: 'What happens if a tamper loop is broken?', a: 'The NFC microchip status automatically flips from ACTIVE to BREACHED, notifying the owner and invalidating the secondary market insurance escrow.' },
    { q: 'How long does the grading process take?', a: 'Standard vault grading takes 10-14 business days, while Express priority service ensures turnaround within 3-5 business days.' },
    { q: 'Are VCA slabs waterproof and UV-resistant?', a: 'Yes. Our high-grade sonic-welded acrylic encasements feature UV-filtering resin and hermetic moisture barriers.' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16 max-w-4xl mx-auto">
      
      <div className="text-center">
        <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
          Client Services & Knowledge Base
        </span>
        <h2 className="text-3xl md:text-5xl font-display font-black text-white mt-3 mb-2">VCA Support Center</h2>
        <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto">
          Get assistance with grading submissions, NFC chip troubleshooting, vault transfers, and insurance claims.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* FAQs */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-xl space-y-4">
          <h3 className="text-lg font-display font-bold text-white mb-4">Frequently Asked Questions</h3>
          
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left font-semibold text-sm text-white flex justify-between items-center cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-cyan-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-slate-400 font-mono leading-relaxed border-t border-slate-900 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-display font-bold text-white mb-2">Contact VCA Laboratory</h3>
            <p className="text-xs text-slate-400 font-mono mb-6">Send a secure inquiry to our grading and authentication specialists.</p>

            {!messageSent ? (
              <form onSubmit={(e) => { e.preventDefault(); setMessageSent(true); }} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 uppercase">Your Name</label>
                  <input type="text" required placeholder="Todd William" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 uppercase">Inquiry Subject</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-cyan-500">
                    <option>Grading Submission Inquiry</option>
                    <option>NFC Chip Support</option>
                    <option>Vault Transfer Request</option>
                    <option>Insurance & Escrow</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 uppercase">Message</label>
                  <textarea rows={4} required placeholder="Describe your request..." className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-cyan-500" />
                </div>
                <button type="submit" className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer">
                  Send Secure Message
                </button>
              </form>
            ) : (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-display font-bold text-white">Message Dispatched</h4>
                <p className="text-xs text-slate-400 font-mono">An authenticator will respond within 2 hours.</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
