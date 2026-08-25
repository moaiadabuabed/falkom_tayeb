import React from 'react';

import { Sparkles, Calendar, Heart, ShieldCheck, Award, Users, CheckCircle2, Crown } from 'lucide-react';

/*const AboutUs = () => {
  const stats = [
    { label: 'فعالية تم تنظيمها', value: '+500', icon: Calendar },
    { label: 'عميل سعيد', value: '+350', icon: Heart },
    { label: 'سنوات الخبرة', value: '8+', icon: Award },
    { label: 'شركاء النجاح', value: '+50', icon: Users },
  ];

  const values = [
    {
      title: 'الإنقاذ والدقة',
      description: 'نهتم بأصغر التفاصيل لنضمن لك حدثاً متكاملاً يدوم في الذاكرة دون أي إرباك.',
      icon: Sparkles,
    },
    {
      title: 'الجودة والشفافية',
      description: 'نعمل مع أفضل الموردين وبأسعار واضحة لتأمين خدمات فاخرة تتناسب مع تطلعاتك.',
      icon: ShieldCheck,
    },
    {
      title: 'لمسة إبداعية',
      description: 'نبتكر أفكاراً وتصاميم مخصصة لكل حدث تعكس شخصية العميل ورؤيته الخاصة.',
      icon: Heart,
    },
  ];

  return (
    <div className="bg-slate-950 text-white min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Hero Section *//*}
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
          <Sparkles className="w-4 h-4" />
          <span>من نحن</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
          نصنع من لحظاتكم الفذة ذكريات لا تُنسى
        </h1>
        
        <p className="text-slate-400 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
          نحن فريق متخصص في تنظيم وتنسيق الفعاليات والمناسبات الخاصة والمؤتمرات. نسعى دائماً لتحويل رؤيتكم إلى واقع ملموس بكل احترافية وأناقة.
        </p>
      </div>

      {/* Stats Section *//*}
      <div className="max-w-6xl mx-auto mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx} 
              className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 text-center hover:border-amber-500/40 transition-all duration-300"
            >
              <Icon className="w-8 h-8 mx-auto text-amber-400 mb-3" />
              <div className="text-3xl font-extrabold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Values Section *//*}
      <div className="max-w-6xl mx-auto mt-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">رؤيتنا وقيمنا</h2>
          <p className="text-slate-400">الأسس التي نعتمد عليها في كل مشروع ننجزه</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="p-8 rounded-2xl bg-slate-900/30 border border-slate-800/80 hover:bg-slate-900/60 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;*/
const whyChooseUs = [
  ["TRUSTED EXPERTISE", "Years of hands-on experience delivering events across the UAE, from intimate gatherings to large-scale productions.", ShieldCheck],
  ["END-TO-END PLANNING", "From the very first idea to the final teardown, we manage every moving part so you don't have to.", CheckCircle2],
  ["TAILORED TO YOU", "No two events are alike. Every plan is built around your vision, your guests and your budget.", Sparkles],
  ["A TEAM THAT CARES", "Dedicated coordinators stay with you at every step, answering questions and solving problems before they arise.", Users],
];

const ourValues = [
  ["EXCELLENCE", "We hold every detail, big or small, to the same high standard.", Crown],
  ["CREATIVITY", "We bring fresh ideas to every event, from weddings to product launches.", Sparkles],
  ["RELIABILITY", "Clients count on us to deliver exactly what we promise, on time.", CheckCircle2],
  ["PASSION", "We love what we do, and it shows in the experiences we create.", Heart],
];

function AboutUs() {
  return <section className="page">
    <p className="eyebrow">WHO WE ARE</p>
    <h1 className="page-title">ABOUT <b>US</b></h1>
    <p className="intro">Falkom Tayyeb is an Abu Dhabi based event planning and management company dedicated to turning ideas into unforgettable experiences. We work closely with our clients to plan, organize and manage every detail of their events, ensuring everything runs smoothly from start to finish.</p>
    <p className="intro">Our goal is simple: to create unique, well organized and memorable events that reflect our clients' vision, while delivering a professional and enjoyable experience for everyone involved - from the first conversation to the last guest leaving the room.</p>

    <h3 className="section-title">WHY CHOOSE US</h3>
    <div className="feature-grid" style={{ padding: "0 0 40px", margin: 0 }}>
      {whyChooseUs.map(([title, desc, Icon]) =>
        <div className="card feature" key={title}><Icon size={25} /><h3>{title}</h3><p>{desc}</p></div>
      )}
    </div>

    <h3 className="section-title">OUR VALUES</h3>
    <div className="feature-grid" style={{ padding: 0, margin: 0 }}>
      {ourValues.map(([title, desc, Icon]) =>
        <div className="card feature" key={title}><Icon size={25} /><h3>{title}</h3><p>{desc}</p></div>
      )}
    </div>
  </section>;
}
