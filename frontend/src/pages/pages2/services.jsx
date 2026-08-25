import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Calendar, ArrowRight, ShieldCheck, Award } from 'lucide-react';

const cards = [
  { id: 1, title: 'EVENT PLANNING', desc: 'Comprehensive event planning tailored to your budget and needs.', icon: Sparkles },
  { id: 2, title: 'PRODUCTION & STAGING', desc: 'State-of-the-art audio, lighting, and stage design.', icon: ShieldCheck },
  { id: 3, title: 'CATERING & HOSPITALITY', desc: 'Exquisite food and beverage arrangements for all guests.', icon: Award },
];

const eventTypes = [
  { id: 1, title: 'Weddings & Ceremonies' },
  { id: 2, title: 'Corporate Galas & Conferences' },
  { id: 3, title: 'Private & Graduation Parties' },
];

export default function Services() {
  const navigate = useNavigate();

  return (
    <section className="page max-w-6xl mx-auto p-6 text-white space-y-6">
      <p className="text-xs text-amber-400 tracking-widest uppercase">WHAT WE DO</p>
      <h1 className="text-3xl font-serif">OUR <b className="text-amber-400">SERVICES</b></h1>
      <p className="text-xs text-gray-300 max-w-2xl">We design, plan and manage all types of events across the UAE. From concept to execution, we handle every detail to create extraordinary experiences.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map(s => {
            const Icon = s.icon;
            return (
              <div className="bg-[#0B0C10] p-5 rounded-xl border border-amber-900/40 space-y-2" key={s.id}>
                <Icon className="text-amber-400 w-8 h-8" />
                <h3 className="text-amber-200 font-bold text-sm">{s.title}</h3>
                <p className="text-xs text-gray-400">{s.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-[#0B0C10] p-5 rounded-xl border border-amber-900/40 space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-amber-400 font-bold text-sm mb-3">ALL TYPES OF EVENTS</h2>
            <div className="space-y-2">
              {eventTypes.map(t => (
                <p key={t.id} className="text-xs text-gray-300 flex items-center gap-2">
                  <Calendar size={12} className="text-amber-400" /> {t.title}
                </p>
              ))}
            </div>
          </div>
          <button 
            className="w-full border border-amber-500 text-amber-300 py-2 rounded text-xs hover:bg-amber-500/10 transition flex items-center justify-center gap-1 font-bold" 
            onClick={() => navigate("/event-type")}
          >
            REQUEST AN EVENT <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}