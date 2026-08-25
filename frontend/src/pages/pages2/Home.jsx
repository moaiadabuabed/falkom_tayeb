/*import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle2, ShieldCheck, Users, ArrowRight, Star, Quote } from 'lucide-react';

/*const topFeedbacks = [
  {
    id: 1,
    name: 'Ahmad & Layla',
    role: 'Wedding Ceremony',
    rating: 5,
    comment: 'The setup was beyond our expectations! The stage lighting and seating arrangements gave our wedding a royal feel.',
  },
  {
    id: 2,
    name: 'Omar Mansour',
    role: 'Annual Corporate Gala',
    rating: 5,
    comment: 'Flawless coordination and high-end audio/visual tech. Our guests were thoroughly impressed by the atmosphere.',
  },
  {
    id: 3,
    name: 'Rania Al-Khatib',
    role: 'Private Graduation Party',
    rating: 5,
    comment: 'Attention to detail was incredible. Choosing custom items made planning completely stress-free.',
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-luxury-hall text-white flex flex-col justify-between">
      {/* Hero Section *//*}/*
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-serif-luxury tracking-wide leading-tight text-white">
            EXTRAORDINARY <br />
            <span className="text-amber-400">MOMENTS.</span> <br />
            PERFECTLY PLANNED.
          </h1>
          <p className="text-gray-300 text-sm max-w-md leading-relaxed">
            We turn your vision into unforgettable experiences crafted with elegance, precision and passion.
          </p>
          <button 
            onClick={() => navigate('/event-type')}
            className="btn-gold px-8 py-3.5 rounded text-xs tracking-widest uppercase flex items-center gap-2 font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)] transition hover:scale-105"
          >
            PLAN YOUR EVENT <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Feature Cards Grid *//*}
      <section className="max-w-6xl mx-auto px-6 pb-12 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: 'BESPOKE EXPERIENCES', desc: 'Custom designed events tailored to your vision.', icon: Sparkles },
            { title: 'FLAWLESS EXECUTION', desc: 'Every detail managed with precision.', icon: CheckCircle2 },
            { title: 'PREMIUM QUALITY', desc: 'We work with the finest standards and partners.', icon: ShieldCheck },
            { title: 'DEDICATED TEAM', desc: 'Professionals dedicated to your satisfaction.', icon: Users },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="card-luxury p-6 rounded-xl text-center border-gold flex flex-col items-center">
                <Icon className="w-6 h-6 text-amber-400 mb-3" />
                <h3 className="font-serif-luxury text-xs text-amber-200 mb-1 tracking-wider">{item.title}</h3>
                <p className="text-[11px] text-gray-400">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials Section *//*}
      <section className="py-12 px-6 max-w-6xl mx-auto w-full border-t border-amber-900/30">
        <div className="text-center mb-10">
          <p className="text-amber-400 text-xs tracking-widest uppercase mb-1">TESTIMONIALS</p>
          <h2 className="text-2xl md:text-3xl font-serif-luxury text-amber-200">WHAT OUR CLIENTS SAY</h2>
          <div className="w-12 h-0.5 bg-amber-500/60 mx-auto mt-3"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topFeedbacks.map((item) => (
            <div
              key={item.id}
              className="card-luxury p-6 rounded-xl border-gold flex flex-col justify-between relative"
            >
              <Quote className="w-8 h-8 text-amber-500/10 absolute top-4 right-4" />

              <div>
                <div className="flex gap-1 mb-3">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-gray-300 leading-relaxed mb-6 italic">
                  "{item.comment}"
                </p>
              </div>

              <div className="border-t border-amber-900/30 pt-3">
                <h4 className="font-serif-luxury text-amber-200 text-xs">{item.name}</h4>
                <p className="text-[10px] text-gray-500">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}*/
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle2, ShieldCheck, Users, ArrowRight, Star, Quote } from 'lucide-react';

const topFeedbacks = [
  {
    id: 1,
    name: 'Ahmad & Layla',
    role: 'Wedding Ceremony',
    rating: 5,
    comment: 'The setup was beyond our expectations! The stage lighting and seating arrangements gave our wedding a royal feel.',
  },
  {
    id: 2,
    name: 'Omar Mansour',
    role: 'Annual Corporate Gala',
    rating: 5,
    comment: 'Flawless coordination and high-end audio/visual tech. Our guests were thoroughly impressed by the atmosphere.',
  },
  {
    id: 3,
    name: 'Rania Al-Khatib',
    role: 'Private Graduation Party',
    rating: 5,
    comment: 'Attention to detail was incredible. Choosing custom items made planning completely stress-free.',
  },
];

export default function Home() {
  const navigate = useNavigate();

  const features = [
    ["BESPOKE EXPERIENCES", "Custom designed events tailored to your vision.", Sparkles],
    ["FLAWLESS EXECUTION", "Every detail managed with precision.", CheckCircle2],
    ["PREMIUM QUALITY", "We work with the finest standards and partners.", ShieldCheck],
    ["DEDICATED TEAM", "Professionals dedicated to your satisfaction.", Users],
  ];

  return (
    <div className="min-h-screen bg-[#050507] text-white flex flex-col justify-between">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-serif tracking-wide leading-tight text-white">
            EXTRAORDINARY <br />
            <span className="text-amber-400">MOMENTS.</span> <br />
            PERFECTLY PLANNED.
          </h1>
          <p className="text-gray-300 text-sm max-w-md leading-relaxed">
            We turn your vision into unforgettable experiences crafted with elegance, precision and passion.
          </p>
          <button 
            onClick={() => navigate('/event-type')}
            className="bg-amber-500 hover:bg-amber-400 text-black px-8 py-3.5 rounded text-xs tracking-widest uppercase flex items-center gap-2 font-bold transition hover:scale-105"
          >
            PLAN YOUR EVENT <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-12 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {features.map(([title, desc, Icon], idx) => (
            <div key={idx} className="bg-[#0B0C10] p-6 rounded-xl text-center border border-amber-900/40 flex flex-col items-center">
              <Icon className="w-6 h-6 text-amber-400 mb-3" />
              <h3 className="font-serif text-xs text-amber-200 mb-1 tracking-wider">{title}</h3>
              <p className="text-[11px] text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 px-6 max-w-6xl mx-auto w-full border-t border-amber-900/30">
        <div className="text-center mb-10">
          <p className="text-amber-400 text-xs tracking-widest uppercase mb-1">TESTIMONIALS</p>
          <h2 className="text-2xl md:text-3xl font-serif text-amber-200">WHAT OUR CLIENTS SAY</h2>
          <div className="w-12 h-0.5 bg-amber-500/60 mx-auto mt-3"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topFeedbacks.map((item) => (
            <div
              key={item.id}
              className="bg-[#0B0C10] p-6 rounded-xl border border-amber-900/40 flex flex-col justify-between relative"
            >
              <Quote className="w-8 h-8 text-amber-500/10 absolute top-4 right-4" />
              <div>
                <div className="flex gap-1 mb-3">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-gray-300 leading-relaxed mb-6 italic">
                  "{item.comment}"
                </p>
              </div>

              <div className="border-t border-amber-900/30 pt-3">
                <h4 className="font-serif text-amber-200 text-xs">{item.name}</h4>
                <p className="text-[10px] text-gray-500">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}