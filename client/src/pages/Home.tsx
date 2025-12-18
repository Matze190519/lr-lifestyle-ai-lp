import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, MessageCircle, ShieldCheck, Zap, Info, Car, TrendingUp, Smartphone, Users, HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useEffect } from "react";


// --- Schema & Types ---
const formSchema = z.object({
  name: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein"),
  phone: z.string().min(6, "Telefonnummer muss mindestens 6 Zeichen lang sein"),
  interest: z.string().min(1, "Bitte wähle ein Interesse aus"),
  dsgvo: z.boolean().refine(val => val === true, "Bitte stimme der Datenschutzerklärung zu"),
});

// --- Tracking Helper ---
const trackEvent = (eventName: string, params = {}) => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, params);
  }
  console.log(`Tracking Event: ${eventName}`, params);
};

// --- Components ---

const HeroSection = () => {
  const whatsappLink = "https://wa.me/491715060008?text=Hi%20Mathias%2C%20ich%20will%20das%20LR%2BKI%20Info-Paket.%20Interesse%3A%20%5BFast%20Track%2FAuto%2FBeides%5D.%20Vorname%3A%20____";

  return (
    <section className="relative md:min-h-[90vh] md:flex md:items-center overflow-hidden bg-black">
      {/* Background - Black with radial white glow - nur auf Desktop */}
      <div 
        className="absolute inset-0 z-0 hidden md:block"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 1) 60%)'
        }}
      >
        {/* Gold border frame with WHITE GLOW box-shadow */}
        <div 
          className="absolute inset-10 lg:inset-14 border border-[#C9A86C]/60 rounded-xl"
          style={{
            boxShadow: '0 0 30px rgba(255, 255, 255, 0.6), 0 0 60px rgba(255, 255, 255, 0.5), 0 0 90px rgba(255, 255, 255, 0.4), 0 0 120px rgba(255, 255, 255, 0.3)'
          }}
        ></div>
      </div>

      {/* 40 Jahre LR Logo - Top Right - nur auf Desktop */}
      <div className="absolute top-16 right-16 lg:top-20 lg:right-20 z-50 hidden md:block">
        <img 
          src="/images/lr-40-years-black-bg.jpg" 
          alt="40 Jahre LR Success Story" 
          className="w-16 lg:w-20 rounded-md"
        />
      </div>

      {/* MOBILE LAYOUT - Kompakt ohne Lücken */}
      <div className="md:hidden w-full">
        {/* Sticky Promo Banner */}
        <div 
          className="w-full py-2 px-4 text-center text-xs font-medium"
          style={{ background: 'linear-gradient(90deg, #C9A86C 0%, #E8D5A3 50%, #C9A86C 100%)' }}
        >
          <span className="text-black">Bis zu 24.000€ Bonus im ersten Jahr möglich*</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#C9A86C]/20">
          <img 
            src="/images/lr-40-years-black-bg.jpg" 
            alt="40 Jahre LR" 
            className="w-10 h-auto rounded"
          />
          <span className="text-[11px] text-[#C9A86C] font-medium">Deutsches Unternehmen seit 1985</span>
        </div>

        {/* Hero Content - Kompakt */}
        <div className="px-5 pt-6 pb-4">
          {/* Headline mit Gold-Gradient */}
          <h1 className="text-2xl font-bold mb-3 leading-tight">
            <span style={{ background: 'linear-gradient(135deg, #C9A86C 0%, #E8D5A3 50%, #C9A86C 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dein Weg zur</span>
            <br />
            <span style={{ background: 'linear-gradient(135deg, #C9A86C 0%, #E8D5A3 50%, #C9A86C 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>finanziellen Freiheit</span>
          </h1>

          {/* Sub-Headline */}
          <p className="text-white/90 text-sm mb-4 leading-relaxed">
            Starte mit LR + KI-Coach Lina. <strong className="text-[#C9A86C]">Bis zu 2.000€/Monat</strong> garantierter Bonus.*
          </p>

          {/* 3 Benefits - Kompakt */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-3 bg-[#C9A86C]/10 rounded-lg px-3 py-2 border border-[#C9A86C]/30">
              <TrendingUp className="w-4 h-4 text-[#C9A86C] shrink-0" />
              <span className="text-xs text-white/90"><strong className="text-[#C9A86C]">300€ - 2.000€</strong> monatlicher Bonus</span>
            </div>
            <div className="flex items-center gap-3 bg-[#C9A86C]/10 rounded-lg px-3 py-2 border border-[#C9A86C]/30">
              <Smartphone className="w-4 h-4 text-[#C9A86C] shrink-0" />
              <span className="text-xs text-white/90"><strong className="text-[#C9A86C]">KI-Coach Lina</strong> 24/7 Support</span>
            </div>
            <div className="flex items-center gap-3 bg-[#C9A86C]/10 rounded-lg px-3 py-2 border border-[#C9A86C]/30">
              <Car className="w-4 h-4 text-[#C9A86C] shrink-0" />
              <span className="text-xs text-white/90"><strong className="text-[#C9A86C]">Firmenwagen</strong> ab Junior Manager</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Button 
              className="w-full h-12 rounded-lg font-semibold text-sm" 
              style={{
                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                color: 'white'
              }}
              onClick={() => {
                trackEvent('Contact');
                window.open(whatsappLink, '_blank');
              }}
            >
              <MessageCircle className="mr-2 w-4 h-4" />
              WhatsApp: Kostenlose Infos
            </Button>
            <Button 
              variant="outline"
              className="w-full h-10 rounded-lg font-medium text-xs border-[#C9A86C]/50 text-[#C9A86C] hover:bg-[#C9A86C]/10"
              onClick={() => {
                document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Oder: Formular ausfüllen
            </Button>
          </div>

          <p className="text-[9px] text-white/40 mt-3 text-center">*Bei Erreichen der Programmbedingungen. Details im Info-Paket.</p>
        </div>

        {/* Trust Badges */}
        <div className="px-4 pb-4">
          <div className="flex justify-center gap-4 text-[10px] text-white/50">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> DSGVO</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Kostenlos</span>
            <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> 24h Antwort</span>
          </div>
        </div>
      </div>

      {/* DESKTOP LAYOUT */}
      <div className="container relative z-10 max-w-5xl py-16 px-16 lg:px-20 hidden md:block">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <div>
              <p className="text-sm text-[#C9A86C] uppercase tracking-wider mb-2 font-medium">Bist du es leid, für fremde Träume zu arbeiten?</p>
              <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
                <span className="gold-gradient-text">Bis zu 2.000€</span>
                <br />
                <span className="text-white">monatlicher Bonus*</span>
              </h1>
            </div>
            
            <p className="text-sm text-white/80 leading-relaxed">
              Matthias: <strong className="text-white">Nach 1 Jahr 5.000€/Monat</strong>. Heute? <strong className="gold-gradient-text">Ein Vielfaches.</strong> Mit seinem System + KI-Coach Lina schaffst du das auch.
            </p>
            
            {/* Bullet Points */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#C9A86C] flex items-center justify-center shrink-0 mt-0.5">
                  <TrendingUp className="w-3 h-3 text-black" />
                </div>
                <p className="text-white/90 text-sm"><span className="gold-gradient-text font-semibold">Garantierter Bonus:</span> 300€ bis 2.000€/Monat</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#C9A86C] flex items-center justify-center shrink-0 mt-0.5">
                  <Smartphone className="w-3 h-3 text-black" />
                </div>
                <p className="text-white/90 text-sm"><span className="gold-gradient-text font-semibold">KI-Coach Lina:</span> 24/7 Support + Vorlagen</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#C9A86C] flex items-center justify-center shrink-0 mt-0.5">
                  <Car className="w-3 h-3 text-black" />
                </div>
                <p className="text-white/90 text-sm"><span className="gold-gradient-text font-semibold">Firmenwagen-Programm:</span> Audi, BMW, Mercedes – bis zu 80% günstiger</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#C9A86C] flex items-center justify-center shrink-0 mt-0.5">
                  <Users className="w-3 h-3 text-black" />
                </div>
                <p className="text-white/90 text-sm"><span className="gold-gradient-text font-semibold">Vererbbar:</span> Baue ein Vermögen auf</p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Button 
                size="lg" 
                className="text-base px-8 h-14 rounded-xl font-bold shadow-lg transition-all duration-300 hover:scale-105" 
                style={{
                  background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                  color: 'white'
                }}
                onClick={() => {
                  trackEvent('Contact');
                  window.open(whatsappLink, '_blank');
                }}
              >
                <MessageCircle className="mr-2 w-6 h-6" />
                Jetzt Info-Paket holen
              </Button>
              <p className="text-xs text-white/50 mt-3">*Bei Erreichen der Programmbedingungen</p>
            </div>
          </motion.div>

          {/* Right Side - Stats Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative p-8 rounded-2xl bg-[#0a0a0a]/80 backdrop-blur-sm animate-float shadow-[0_0_30px_rgba(255,255,255,0.5),0_0_60px_rgba(255,255,255,0.3),0_0_90px_rgba(255,255,255,0.2)]">
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 rounded-lg bg-gradient-to-b from-[#C9A86C]/20 to-transparent border border-white/20">
                  <p className="text-2xl font-bold gold-gradient-text">300€</p>
                  <p className="text-xs text-white/60 mt-1">Stufe 1*</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-gradient-to-b from-[#C9A86C]/30 to-transparent border border-white/20">
                  <p className="text-2xl font-bold gold-gradient-text">1.100€</p>
                  <p className="text-xs text-white/60 mt-1">Stufe 2*</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-gradient-to-b from-[#C9A86C]/40 to-transparent border border-white/20">
                  <p className="text-2xl font-bold gold-gradient-text">2.000€</p>
                  <p className="text-xs text-white/60 mt-1">Stufe 3*</p>
                </div>
              </div>
              
              <div className="text-center mb-6">
                <p className="text-lg font-semibold gold-gradient-text">Fast Track Bonus*</p>
                <p className="text-xs text-white/50 mt-1">*Bei Erreichen der Programmbedingungen</p>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#C9A86C]/10 border border-white/15">
                  <Car className="w-5 h-5 text-[#C9A86C]" />
                  <span className="text-sm text-white/80">Autokonzept verfügbar*</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#C9A86C]/10 border border-white/15">
                  <Smartphone className="w-5 h-5 text-[#C9A86C]" />
                  <span className="text-sm text-white/80">LINA KI-Support inklusive</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#C9A86C]/10 border border-white/15">
                  <Users className="w-5 h-5 text-[#C9A86C]" />
                  <span className="text-sm text-white/80">Team & System Ready</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trust Badges */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4 mt-12 pt-8 "
        >
          <span className="flex items-center gap-2 text-xs text-white/60 px-4 py-2 rounded-full border border-white/20">
            <ShieldCheck className="w-4 h-4 text-[#C9A86C]" /> LR seit 1985
          </span>
          <span className="flex items-center gap-2 text-xs text-white/60 px-4 py-2 rounded-full border border-white/20">
            <Info className="w-4 h-4 text-[#C9A86C]" /> Info-Paket kostenlos
          </span>
          <span className="flex items-center gap-2 text-xs text-white/60 px-4 py-2 rounded-full border border-white/20">
            <ShieldCheck className="w-4 h-4 text-[#C9A86C]" /> DSGVO-konform
          </span>
          <span className="flex items-center gap-2 text-xs text-white/60 px-4 py-2 rounded-full border border-white/20">
            <MessageCircle className="w-4 h-4 text-[#C9A86C]" /> Antwort &lt;24h
          </span>
        </motion.div>
      </div>
    </section>
  );
};

const WhatIsLRSection = () => {
  const benefits = [
    {
      title: "Garantierter Bonus – kein Risiko",
      desc: "Das Fast Track Programm zahlt dir 12 Monate lang einen garantierten Mindestbonus: 300€, 1.100€ oder 2.000€ monatlich – zusätzlich zu deiner Handelsspanne. Bis zu 24.000€ im ersten Jahr!"
    },
    {
      title: "Lina – Vertrieb 2.0",
      desc: "Ruf Lina an! Sie erstellt Bilder, Texte, Videos – und bespricht mit dir deine Ziele mit einem klaren Plan. Die Zukunft des Vertriebs."
    },
    {
      title: "Firmenwagen? Ab Tag 1 möglich",
      desc: "Audi, BMW, Mercedes, VW – bis zu 80% günstiger als privat. Schon ab Junior Manager qualifizierst du dich für das legendäre LR-Autokonzept."
    },
    {
      title: "Baue echtes Vermögen auf",
      desc: "Kein Job, der endet wenn du aufhörst. Dein passives Einkommen wächst – und du kannst es komplett an deine Kinder vererben. Echte finanzielle Freiheit."
    },
    {
      title: "Dein Erfolg = Teamerfolg",
      desc: "Vergiss Ellenbogen-Mentalität. Bei uns gewinnst du, wenn dein Team gewinnt. Einfache Duplikation – was für dich funktioniert, funktioniert für alle."
    },
    {
      title: "Premium-Produkte, die sich verkaufen",
      desc: "Keine China-Ware. LR-Produkte sind \"Made in Germany\", SGS-zertifiziert und haben Millionen zufriedener Kunden. Du verkaufst Qualität, nicht Schrott."
    }
  ];

  return (
    <section className="py-12 section-glow ">
      <div className="container max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold font-poppins"><span className="gold-gradient-text">Warum LR + KI = Dein Erfolg?</span></h2>
          <p className="text-sm text-white/60 mt-2">6 Gründe, warum jetzt der beste Zeitpunkt ist</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {benefits.map((benefit, i) => (
            <div key={i} className="bg-black/80 p-5 rounded-lg gold-border-glow">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#C9A86C] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white mb-1">{benefit.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{benefit.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const MathiasSection = () => {
  return (
    <section className="py-16 section-glow">
      <div className="container max-w-4xl">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Mathias Bild - Groß und Rund */}
          <div className="shrink-0">
            <a href="/about" className="block">
              <div 
                className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden transition-transform hover:scale-105 gold-border-glow"
              >
                <img 
                  src="/images/mathias.png" 
                  alt="Mathias Vinzing" 
                  className="w-full h-full object-cover"
                />
              </div>
            </a>
          </div>
          
          {/* Text */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold font-poppins mb-2">
              <span className="gold-gradient-text">Mathias Vinzing</span>
            </h2>
            <p className="text-sm text-[#C9A86C] mb-4">Platin-Orgaleiter | Dein Coach</p>
            <p className="text-white/80 leading-relaxed mb-6 max-w-lg">
              Vom Dachdecker zum Platin-Orgaleiter. Heute lebe ich auf Mallorca und betreibe mein LR-Business digital – mit LINA als KI-Assistentin. <strong className="text-white">Ich zeige dir, wie du das auch schaffst.</strong>
            </p>
            <a 
              href="/about" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[#C9A86C]/50 text-[#C9A86C] hover:bg-[#C9A86C]/10 transition-colors text-sm font-medium"
            >
              Mehr über mich erfahren
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const SocialProofSection = () => {
  const testimonials = [
    {
      quote: "Ich hatte null Plan – jetzt hab ich endlich einen klaren Startablauf und weiß, was ich täglich machen soll.",
      author: "Sabrina, 34",
      role: "Nebenjob",
      badge: "Onboarding",
      image: "/images/testimonial-sabrina.png"
    },
    {
      quote: "Das Beste: Die Vorlagen. Ich muss nichts erfinden – ich setze nur um.",
      author: "Kevin, 27",
      role: "Quereinsteiger",
      badge: "Vorlagen",
      image: "/images/testimonial-kevin.png"
    },
    {
      quote: "Ich wollte erst nur Infos. Nach dem Kurz-Check war alles plötzlich logisch.",
      author: "Miriam, 41",
      role: "Familie & Job",
      badge: "Kurz-Check",
      image: "/images/testimonial-miriam.png"
    },
    {
      quote: "Lina spart mir Zeit: Antworten, Ideen, Follow-ups – ich bleibe dran.",
      author: "Tobias, 38",
      role: "selbstständig",
      badge: "WhatsApp Support",
      image: "/images/testimonial-tobias.png"
    },
    {
      quote: "Kein Druck, kein Gelaber – einfach Schritt-für-Schritt.",
      author: "Anja, 52",
      role: "Neustart",
      badge: "Onboarding",
      image: "/images/testimonial-anja.png"
    },
    {
      quote: "Ich hatte Angst vor Technik. Setup war easy, weil ich geführt werde.",
      author: "Deniz, 29",
      role: "digital interessiert",
      badge: "Vorlagen",
      image: "/images/testimonial-deniz.png"
    }
  ];

  return (
    <section className="py-16 section-glow ">
      <div className="container max-w-6xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold font-poppins mb-2"><span className="gold-gradient-text">Echte Menschen. Echte Umsetzung.</span></h2>
          <p className="text-sm text-muted-foreground">Ergebnisse ohne leere Versprechen.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Card key={i} className="bg-black/80 transition-all backdrop-blur-sm gold-border-glow">
              <CardContent className="p-6 relative">
                <div className="absolute top-4 right-4 px-2 py-1 bg-[#C9A86C]/10 rounded text-[10px] font-mono text-[#C9A86C] uppercase tracking-wider">
                  {t.badge}
                </div>
                <p className="text-sm italic text-muted-foreground mb-4 leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <img 
                    src={t.image} 
                    alt={t.author} 
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#C9A86C]/30"
                  />
                  <div>
                    <p className="font-bold text-sm">{t.author}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQSection = () => {
  const faqs = [
    {
      q: "Was ist Lina (KI) konkret?",
      a: "Lina ist Ihre persönliche digitale Partnerin und KI-Assistentin im LR Lifestyle Team, erreichbar über WhatsApp. Sie wurde entwickelt, um Sie rund um die Uhr (24/7) zu unterstützen. Lina dient als Mentorin, hilft beim Onboarding neuer Partner, beim Aufbau des Teams, bei der Produktberatung und sogar bei der Formulierung wirkungsvoller WhatsApp-Nachrichten für Interessenten. Lina kann auch Live-Coachings und Telefongespräche führen, um Sie optimal voranzubringen."
    },
    {
      q: "Was bekomme ich auf WhatsApp?",
      a: "Über WhatsApp erhalten Sie direkten Zugriff auf Lina, Ihren kostenlosen Coach. Sie bietet umfangreiche Unterstützung und Tools:\n\n• Produktwissen: Blitzschnelle Antworten und detaillierte Informationen zu LR Produkten.\n• Social Media Hilfe: Generierung von Post-Texten, Bildern und Videos für Plattformen wie Instagram, Facebook oder TikTok.\n• Vertriebs- und Verkaufsvorlagen: Fertige WhatsApp-Vorlagen für den Erstkontakt oder das Nachfassen.\n• Coaching: Unterstützung bei der Zielsetzung und Übung von Verkaufsgesprächen oder Geschäftsvorstellungen."
    },
    {
      q: "Kostet mich das Info-Paket oder der Start etwas?",
      a: "Der Support durch Lina als Ihr persönlicher Coach ist kostenlos. Der offizielle Start als LR Partner beginnt jedoch mit einer einmaligen Erstbestellung, bei der eine Startpaket-Gebühr von 29,90 € (100 PW) für das Printpaket anfällt. Die Startersets selbst bieten erhebliche Ersparnisse gegenüber dem Einzelkauf."
    },
    {
      q: "Wie läuft das nach dem Kontakt ab?",
      a: "Nach der Entscheidung zur Partnerschaft beginnt das strukturierte Onboarding. Die ersten Schritte umfassen:\n\n• Die Auswahl und Bestellung eines passenden Startersets, das Produkte und Werkzeuge enthält.\n• Die Online-Registrierung und die Aktivierung Ihres persönlichen Shop-Links.\n• Die Einführung in die wichtigsten Tools wie LR Neo, MyOffice und die Connect App.\n• Das Sammeln erster Kontakte (Namensliste) und die Vorbereitung auf die ersten Produkt- oder Geschäftsvorstellungen, oft mit Unterstützung durch Lina."
    },
    {
      q: "Ist das LR Geschäft seriös?",
      a: "Ja, LR Health & Beauty ist ein etabliertes und seriöses europäisches Social-Commerce-Unternehmen. Es wurde 1985 gegründet und feierte 2025 sein 40-jähriges Bestehen. LR operiert in 32 Ländern, legt Wert auf höchste Produktqualität (\"Made in Germany\"), und arbeitet mit Prominenten zusammen. Die Qualität der Aloe Vera Produkte wird durch unabhängige Siegel wie das SGS INSTITUT FRESENIUS und das IASC-Siegel bestätigt."
    },
    {
      q: "Muss ich verkaufen oder kann ich nur Team aufbauen?",
      a: "Das LR Geschäftsmodell basiert auf drei Säulen:\n\n1. Eigenbedarf (Produkte zum Vorteilspreis nutzen).\n2. Verkauf (Produkte an Kunden weiterempfehlen und die Handelsspanne von ca. 30–40 % als direkten Verdienst erhalten).\n3. Weiterempfehlung und Teamaufbau (neue Partner gewinnen und Boni auf deren Umsätze erhalten).\n\nEs gibt keine Verpflichtung, Produkte zu verkaufen."
    },
    {
      q: "Wie viel Zeit brauche ich pro Woche?",
      a: "Das Geschäftsmodell ermöglicht eine flexible Zeiteinteilung und das ortsunabhängige Arbeiten. Sie können das Geschäft haupt- oder nebenberuflich starten, je nachdem, wie es in Ihre Work-Life-Balance passt. Es wird empfohlen, täglich mit mindestens einer Person über LR zu sprechen, wobei schon 30 Minuten fokussierter LR-Zeit pro Tag zum Erfolg beitragen können."
    },
    {
      q: "Was ist der Fast Track Bonus genau?",
      a: "Der Fast Track Bonus ist ein spezielles Programm, das neue Partner für die schnelle Erreichung der ersten drei Karrierestufen (Junior Manager, Junior Teamleiter, Orgaleiter) belohnt. Er garantiert einen monatlichen Mindestbonus für bis zu 12 Monate. Dieser garantierte Betrag wird gezahlt, falls der regulär errechnete Bonus niedriger ausfällt (Uplift)."
    },
    {
      q: "Wie hoch ist der garantierte Bonus in den Fast Track Stufen?",
      a: "Die garantierten Mindestboni sind:\n\n• Junior Manager: 300 € pro Monat.\n• Junior Teamleiter: 1.100 € pro Monat.\n• Orgaleiter: 2.000 € pro Monat.\n\nDiese Beträge werden zusätzlich zur Handelsspanne und zum Autobonus gezahlt."
    },
    {
      q: "Wie funktioniert das LR Autokonzept?",
      a: "Das Autokonzept ist ein attraktives Firmenwagenprogramm, das qualifizierten Partnern ermöglicht, Fahrzeuge von Top-Marken wie VW, Audi, Mercedes-Benz oder BMW zu besonders günstigen Leasingkonditionen zu erhalten. Ein großer Vorteil ist, dass die Leasingverträge oft ohne Anzahlung und ohne Schlussrate abgeschlossen werden. Die Qualifikation ist bereits ab der Stufe Junior Manager (4.000 PW) möglich. Zusätzlich erhalten Partner einen monatlichen Autobonus (z.B. 55 € für Junior Manager), der die Leasingkosten erheblich reduziert."
    },
    {
      q: "Was, wenn ich unsicher bin oder Bedenken habe?",
      a: "Unsicherheit ist am Anfang normal. Das LR Geschäftsmodell ist mit geringem Risiko verbunden, da kein hohes Startkapital oder Lagerhaltung erforderlich ist. Lina, Ihr Coach, ist rund um die Uhr verfügbar, um spezifische Bedenken anzusprechen und zu klären. Sie kann Ihnen helfen, alle Fragen zum Geschäftsmodell und zu möglichen Ängsten (z.B. Angst vor Social Media oder davor, keine Kontakte zu finden) zu entmystifizieren."
    },
    {
      q: "Gibt es für höhere Karrierestufen einen garantierten Bonus?",
      a: "Ja, für höhere Karrierestufen ab Orgaleiter gibt es den Business Track Bonus. Dieses Programm garantiert ebenfalls feste Mindestboni (z.B. 2.000 € für Orgaleiter, 3.000 € für Bronze-Orgaleiter). Der Partner erhält immer den höheren Betrag zwischen dem regulär errechneten Bonus und dem garantierten Business Track Bonus."
    },
    {
      q: "Woher weiß ich, welche Produkte für mich geeignet sind?",
      a: "LR bietet ein breites Portfolio an Gesundheits- und Schönheitsprodukten, darunter Aloe Vera, Nahrungsergänzung (Lifetakt), Parfüms (Mood Infusion & Iconic Elixirs) und Kosmetik (Zeitgard). Lina kann Ihnen helfen, schnell Produktinformationen zu finden, und es steht ein LR Duftfinder zur Verfügung, um die richtige Emotion oder den passenden Duft zu finden."
    },
    {
      q: "Für wen ist das LR Business geeignet?",
      a: "Das LR Business ist für jeden geeignet, der sich ein flexibles Einkommen aufbauen möchte:\n\n• Angestellte: Raus aus dem Hamsterrad – bauen Sie sich nebenberuflich Sicherheit (Plan B) auf, ohne Ihren Job zu kündigen.\n• Selbständige: Kein Personal, keine Miete, kein Warenlager – nutzen Sie ein fertiges Milliarden-System ohne das klassische Risiko.\n• Mamas & Papas: Arbeiten Sie vom Küchentisch oder Spielplatz aus – volle Flexibilität für Ihre Familie dank Home-Office.\n• Quereinsteiger: Sie haben noch nie verkauft? Perfekt. Unser KI-System und Mentoring machen Sie fit. Jeder kann das lernen.\n\nAlles was Sie brauchen, ist Ihr Smartphone oder Laptop."
    },
    {
      q: "Welche Startersets gibt es und was kosten sie?",
      a: "LR bietet verschiedene Startersets für den Einstieg an. Die Startpaket-Gebühr beträgt 29,90 € (100 PW) für das Printpaket. Darüber hinaus gibt es das Profi Business Startpaket mit 2.000 PW, das bereits die Hälfte der Qualifikation für das Autokonzept (4.000 PW) abdeckt. Die Startersets bieten erhebliche Ersparnisse gegenüber dem Einzelkauf und enthalten Produkte sowie wichtige Werkzeuge für Ihren Start."
    },
    {
      q: "Wie funktioniert das duplizierbare System?",
      a: "Unser System ist darauf ausgelegt, dass Sie es 1:1 an neue Partner weitergeben können. Sie erhalten:\n\n• 100+ Post-Vorlagen, Scripts und Checklisten – kein Rätselraten.\n• Einen klaren 30-Tage-Plan mit konkreten Aufgaben.\n• Fertige Videos und Präsentationen zum Teilen.\n• Lina KI für automatisierte Content-Erstellung.\n\nWas bei Ihnen funktioniert, geben Sie einfach weiter – neue Partner verstehen den Einstieg schnell und können sofort loslegen."
    },
    {
      q: "Welche Unterstützung bekomme ich vom Team?",
      a: "Sie sind nie allein. Das LR Lifestyle Team bietet umfassende Unterstützung:\n\n• Persönliches Mentoring: Mentoren mit 30+ Jahren Erfahrung begleiten Sie.\n• WhatsApp-Gruppen: Schneller Austausch und Hilfe von der Community.\n• Zoom-Calls: Regelmäßige Trainings und Q&A-Sessions.\n• Events: Networking und Weiterbildung auf Veranstaltungen.\n• Lina KI: 24/7 verfügbar für alle Fragen rund um LR, Produkte und Vertrieb.\n\nVon Tag 1 an haben Sie ein starkes Team an Ihrer Seite."
    },
    {
      q: "Kann ich das Business auch international aufbauen?",
      a: "Ja, LR Health & Beauty ist in 32 Ländern aktiv. Sie können Ihr Netzwerk über Landesgrenzen hinweg aufbauen und von internationalen Umsätzen profitieren. Das Geschäftsmodell funktioniert 100% online, sodass Sie Partner und Kunden weltweit gewinnen können – alles von zu Hause aus mit Ihrem Smartphone oder Laptop."
    }
  ];

  return (
    <section className="py-16 section-glow">
      <div className="container max-w-3xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold font-poppins mb-2"><span className="gold-gradient-text">Häufige Fragen & Antworten</span></h2>
          <p className="text-sm text-muted-foreground">Ihr Weg zum Erfolg mit LR – Alles, was Sie wissen müssen.</p>
        </div>
        
        <Accordion type="single" collapsible className="w-full space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="bg-black/80 rounded-lg px-4 gold-border-glow">
              <AccordionTrigger className="text-sm font-medium hover:text-[#C9A86C] text-left">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

const BusinessTrackSection = () => {
  const stufen = [
    { stufe: "Orgaleiter", bonus: "2.000", kriterien: "100 PW Eigenumsatz, 6 aktive Linien, 24.000 PW Gesamtumsatz" },
    { stufe: "Bronze Orgaleiter", bonus: "3.000", kriterien: "100 PW Eigenumsatz, 6 aktive Linien, 50.000 PW Gesamtumsatz" },
    { stufe: "Silber Orgaleiter", bonus: "5.000", kriterien: "100 PW Eigenumsatz, 6 aktive Linien, 100.000 PW Gesamtumsatz" },
    { stufe: "Gold Orgaleiter", bonus: "10.000", kriterien: "100 PW Eigenumsatz, 7 aktive Linien, 250.000 PW Gesamtumsatz" },
    { stufe: "Platin Orgaleiter", bonus: "15.000", kriterien: "100 PW Eigenumsatz, 10 aktive Linien (21%-Linien), 350.000 PW Gesamtumsatz" },
    { stufe: "Vize-Präsident", bonus: "25.000", kriterien: "100 PW Eigenumsatz, 10 aktive Linien (21%-Linien), 1.000.000 PW Gesamtumsatz" },
    { stufe: "Präsident", bonus: "40.000", kriterien: "100 PW Eigenumsatz, 10 aktive Linien (21%-Linien), 2.000.000 PW Gesamtumsatz" },
  ];

  return (
    <section className="py-16 section-glow">
      <div className="container max-w-4xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold font-poppins mb-2">
            <span className="gold-gradient-text">Auch viel mehr als 2.000€ möglich!</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            Der Business Track garantiert fixe monatliche Mindestboni.
          </p>
        </div>

        {/* Akkordeon für Business Track Details */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="business-track" className="bg-black/80 rounded-lg px-4 gold-border-glow">
            <AccordionTrigger className="text-sm font-medium hover:text-[#C9A86C]">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-[#C9A86C]" />
                <span className="gold-gradient-text font-bold">Business Track Stufen anzeigen</span>
                <span className="text-white/60 text-xs ml-2">(2.000€ – 40.000€/Monat)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-4 pb-2">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#C9A86C]/30 bg-[#C9A86C]/10">
                        <th className="px-3 py-2 text-left font-semibold gold-gradient-text text-xs">Karrierestufe</th>
                        <th className="px-3 py-2 text-center font-semibold gold-gradient-text text-xs">Bonus/Monat</th>
                        <th className="px-3 py-2 text-left font-semibold gold-gradient-text text-xs hidden md:table-cell">Qualifikation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stufen.map((s, i) => (
                        <tr key={i} className="border-b border-white/10">
                          <td className="px-3 py-2 font-medium text-white text-xs">{s.stufe}</td>
                          <td className="px-3 py-2 text-center">
                            <span className="gold-gradient-text font-bold">{s.bonus}€</span>
                          </td>
                          <td className="px-3 py-2 text-white/60 text-xs hidden md:table-cell">{s.kriterien}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-center text-[10px] text-muted-foreground mt-3">
                  <strong className="text-[#C9A86C]">+</strong> Handelsspanne und Autobonus kommen immer oben drauf!
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

const FastTrackSection = () => {
  return (
    <section className="py-16 section-glow">
      <div className="container max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Fast Track Card - Premium Gold Glow */}
          <Card className="bg-black/80 shadow-lg relative gold-border-glow rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-[#C9A86C]/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#C9A86C]" />
                </div>
                <h3 className="text-xl font-bold font-poppins gold-gradient-text">Fast Track Bonus*</h3>
              </div>
              
              {/* Visuell ansprechende Stufen-Darstellung */}
              <div className="mb-5">
                <div className="flex justify-between gap-2 mb-4">
                  {/* Stufe 1 */}
                  <div className="flex-1 text-center px-4 py-3 rounded-lg bg-black/80 gold-border-glow">
                    <p className="text-[10px] text-[#C9A86C] mb-1">STUFE 1</p>
                    <p className="text-sm font-bold gold-gradient-text">300 €</p>
                    <p className="text-[9px] text-white/50">Junior Manager</p>
                  </div>
                  {/* Stufe 2 */}
                  <div className="flex-1 text-center px-4 py-3 rounded-lg bg-black/80 gold-border-glow">
                    <p className="text-[10px] text-[#C9A86C] mb-1">STUFE 2</p>
                    <p className="text-sm font-bold gold-gradient-text">1.100 €</p>
                    <p className="text-[9px] text-white/50">Teamleiter</p>
                  </div>
                  {/* Stufe 3 */}
                  <div className="flex-1 text-center px-4 py-3 rounded-lg bg-black/80 gold-border-glow">
                    <p className="text-[10px] text-[#C9A86C] mb-1">STUFE 3</p>
                    <p className="text-sm font-bold gold-gradient-text">2.000 €</p>
                    <p className="text-[9px] text-white/50">Orgaleiter</p>
                  </div>
                </div>
                
                {/* Highlight Badge */}
                <div className="text-center p-3 rounded-lg bg-gradient-to-r from-[#C9A86C]/20 via-[#C9A86C]/30 to-[#C9A86C]/20 border border-[#C9A86C]/40">
                  <p className="text-sm font-semibold text-white">Bis zu <span className="gold-gradient-text text-lg">24.000€</span> in 12 Monaten</p>
                  <p className="text-[10px] text-white/60">+ Autobonus + Handelsspanne</p>
                </div>
              </div>
              
              <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A86C]" />
                  <span>Garantierter <strong className="text-white">Mindestbonus</strong> für 12 Monate</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A86C]" />
                  <span>Klarer <strong className="text-white">Startplan</strong> (was wann zu tun ist)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A86C]" />
                  <span>WhatsApp-Check: <strong className="text-white">Welche Stufe</strong> passt zu dir?</span>
                </li>
              </ul>
              <p className="text-[10px] text-muted-foreground opacity-70">
                *Nur bei Erreichen der Programmbedingungen/Qualifikation. Details im Info-Paket.
              </p>
            </CardContent>
          </Card>

          {/* Autokonzept Card - Premium Gold Glow */}
          <Card className="bg-black/80 shadow-lg relative gold-border-glow rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#C9A86C]/20 flex items-center justify-center">
                  <Car className="w-5 h-5 text-[#C9A86C]" />
                </div>
                <h3 className="text-xl font-bold font-poppins gold-gradient-text">Autokonzept*</h3>
              </div>
              
              {/* Autokonzept Video mit Mercedes Vorschaubild */}
              <div className="mb-4 rounded-lg overflow-hidden">
                <video 
                  className="w-full h-auto rounded-lg"
                  controls
                  poster="/images/mercedes-preview.png"
                  preload="metadata"
                >
                  <source src="/images/autokonzept-video.mp4" type="video/mp4" />
                  Dein Browser unterstützt keine Videos.
                </video>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="text-center mb-3">
                  <p className="text-lg font-semibold gold-gradient-text">Dein Traumwagen wartet</p>
                  <p className="text-xs text-white/70">Audi • BMW • Mercedes • VW</p>
                </div>
                
                {/* Highlight: Ersparnis */}
                <div className="text-center p-2 rounded-lg bg-gradient-to-r from-[#C9A86C]/10 via-[#C9A86C]/20 to-[#C9A86C]/10 border border-[#C9A86C]/30">
                  <p className="text-sm font-semibold text-white">Bis zu <span className="gold-gradient-text">80% günstiger</span> als privat</p>
                </div>
                
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A86C] shrink-0 mt-0.5" />
                    <span><strong className="text-white">Exklusive Partnerkonditionen</strong> über LR</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A86C] shrink-0 mt-0.5" />
                    <span><strong className="text-white">Monatlicher Autobonus</strong> je nach Karrierestufe</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A86C] shrink-0 mt-0.5" />
                    <span>Qualifikation ab <strong className="text-white">Junior Manager</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A86C] shrink-0 mt-0.5" />
                    <span><strong className="text-white">Dienst- oder Firmenwagen</strong> möglich</span>
                  </li>
                </ul>
              </div>
              <p className="text-[10px] text-muted-foreground opacity-70">
                *Voraussetzungen/Bonität/Qualifikation/Modell abhängig. Details im Info-Paket.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

const LinaSection = () => {
  const features = [
    {
      title: "Live-Anrufe",
      desc: "Ruf Lina an! Sie führt Coaching-Gespräche, Geschäftsvorstellungen und bespricht deine Ziele – mit einem klaren Plan zur Umsetzung.",
      icon: <Zap className="w-5 h-5 text-[#C9A86C]" />
    },
    {
      title: "Bilder & Videos",
      desc: "Lina erstellt dir professionelle Bilder, Videos und Reels für Social Media – auf Knopfdruck. Kein Grafikdesigner nötig.",
      icon: <Smartphone className="w-5 h-5 text-[#C9A86C]" />
    },
    {
      title: "Texte & Vorlagen",
      desc: "Fertige WhatsApp-Nachrichten, Posts, Stories und Verkaufstexte. Lina schreibt – du kopierst und sendest.",
      icon: <MessageCircle className="w-5 h-5 text-[#C9A86C]" />
    },
    {
      title: "24/7 Coaching",
      desc: "Produktwissen, Karrierepläne, Einwandbehandlung – Lina coacht dich wie ein Mentor mit 20 Jahren Erfahrung. Rund um die Uhr.",
      icon: <Users className="w-5 h-5 text-[#C9A86C]" />
    }
  ];

  return (
    <section className="py-16 section-glow ">
      <div className="container max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold font-poppins mb-2"><span className="gold-gradient-text">Lina – Vertrieb 2.0</span></h2>
          <p className="text-sm text-muted-foreground">Ruf sie an, lass dir Bilder und Texte erstellen – die Zukunft des Vertriebs.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {features.map((f, i) => (
            <Card key={i} className="bg-black/80 transition-all text-center gold-border-glow">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#C9A86C]/10 flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-bold mb-2 text-sm gold-gradient-text">{f.title}</h3>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <p className="text-center text-sm text-muted-foreground max-w-2xl mx-auto">
          <strong className="text-white">Stell dir vor:</strong> Du rufst Lina an, besprichst deine Ziele – und sie gibt dir einen genauen Plan, wie du sie erreichst. <strong className="gold-gradient-text">Das ist Vertrieb 2.0.</strong>
        </p>
      </div>
    </section>
  );
};

const FinalCTASection = () => {
  const whatsappLink = "https://wa.me/491715060008?text=Hi%20Mathias%2C%20ich%20will%20das%20LR%2BKI%20Info-Paket.%20Interesse%3A%20%5BFast%20Track%2FAuto%2FBeides%5D.%20Vorname%3A%20____";
  const [_, setLocation] = useLocation();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      interest: "",
      dsgvo: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    trackEvent('Lead');
    // Meta Pixel Lead Event
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', {
        content_name: 'LR Info-Paket Anfrage',
        content_category: values.interest || 'Allgemein',
      });
    }
    toast.success("Anfrage gesendet!", {
      description: "Wir melden uns in Kürze bei dir.",
    });
    form.reset();
    setLocation("/danke");
  }

  return (
    <section id="contact" className="py-12 md:py-16 relative">
      <div className="container max-w-3xl px-6 md:px-4">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-3xl md:text-2xl font-bold font-poppins mb-6 md:mb-8"><span className="gold-gradient-text">Jetzt Info-Paket sichern!</span></h2>
          
          <Button 
            size="lg" 
            className="w-full md:w-auto text-xl md:text-lg px-10 h-20 md:h-16 rounded-2xl md:rounded-xl font-bold shadow-2xl mb-8 transition-all duration-300 hover:scale-105" 
            style={{
              background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
              color: 'white'
            }}
            onClick={() => {
              trackEvent('Contact');
              // Meta Pixel Lead Event for WhatsApp
              if (typeof window !== 'undefined' && (window as any).fbq) {
                (window as any).fbq('track', 'Lead', {
                  content_name: 'WhatsApp Kontakt',
                  content_category: 'WhatsApp',
                });
              }
              window.open(whatsappLink, '_blank');
            }}
          >
            <MessageCircle className="mr-3 w-7 h-7 md:w-6 md:h-6" />
            WhatsApp: Jetzt starten
          </Button>
          
          <div className="flex items-center justify-center gap-4 opacity-40 my-6">
            <div className="h-px bg-border w-16 md:w-20"></div>
            <span className="text-xs uppercase tracking-widest">Oder Formular</span>
            <div className="h-px bg-border w-16 md:w-20"></div>
          </div>
        </div>

        <Card className="bg-card gold-border shadow-2xl overflow-hidden max-w-md mx-auto" style={{
          boxShadow: '0 0 40px rgba(201, 168, 108, 0.6), 0 0 80px rgba(201, 168, 108, 0.4)'
        }}>
          <div className="p-6 md:p-6 bg-gradient-to-b from-[#C9A86C]/10 to-transparent">
            <h3 className="text-xl md:text-lg font-bold text-center gold-gradient-text">Kein WhatsApp?</h3>
            <p className="text-sm md:text-xs text-center text-muted-foreground mt-1">Nutze das 20-Sekunden-Formular</p>
          </div>
          <div className="p-6">
            <Form {...form}>
              <form 
                name="contact" 
                method="POST" 
                data-netlify="true" 
                data-netlify-honeypot="bot-field"
                onSubmit={form.handleSubmit(onSubmit)} 
                className="space-y-4"
              >
                {/* Hidden field for Netlify */}
                <input type="hidden" name="form-name" value="contact" />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Vorname*</FormLabel>
                      <FormControl>
                        <Input placeholder="Dein Vorname" {...field} className="bg-muted/50 h-10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">WhatsApp Nummer*</FormLabel>
                      <FormControl>
                        <Input placeholder="+49 ..." {...field} className="bg-muted/50 h-10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="interest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Interesse</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-muted/50 h-10">
                            <SelectValue placeholder="Bitte wählen" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fast_track">Fast Track</SelectItem>
                          <SelectItem value="autokonzept">Autokonzept</SelectItem>
                          <SelectItem value="beides">Beides</SelectItem>
                          <SelectItem value="allgemein">Allgemein</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dsgvo"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 shadow">
                      <FormControl>
                        <input 
                          type="checkbox" 
                          checked={field.value} 
                          onChange={field.onChange}
                          className="h-4 w-4 rounded border-primary text-primary focus:ring-primary"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-xs font-normal">
                          Ich stimme der Datenschutzerklärung zu und bin damit einverstanden, kontaktiert zu werden.
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full font-bold gold-button rounded-lg">
                  Absenden
                </Button>
              </form>
            </Form>
          </div>
        </Card>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-8  bg-background text-[10px] text-muted-foreground text-center">
      <div className="container space-y-4 max-w-4xl">
        <p>*Details zu Voraussetzungen, Fast Track Bonus und Autokonzept im kostenlosen Info-Paket. Keine Erfolgsgarantie; Ergebnisse hängen von individuellem Einsatz ab.</p>
        <div className="flex justify-center gap-6 text-xs">
          <a href="/about" className="hover:text-[#C9A86C] transition-colors">Über uns</a>
          <a href="/impressum" className="hover:text-[#C9A86C] transition-colors">Impressum</a>
          <a href="/datenschutz" className="hover:text-[#C9A86C] transition-colors">Datenschutz</a>
        </div>
        <p className="opacity-50">© 2025 LR Lifestyle AI</p>
      </div>
    </footer>
  );
};

export default function Home() {
  useEffect(() => {
    // Initial PageView Tracking
    trackEvent('PageView');
  }, []);  return (
    <div className="min-h-screen bg-background text-foreground font-sans">

      <div className="selection:bg-primary/30 pb-20 md:pb-0">
      <HeroSection />
      <WhatIsLRSection />
      <FinalCTASection />
      <FastTrackSection />
      <BusinessTrackSection />
      <LinaSection />
      <MathiasSection />
      <SocialProofSection />
      <FAQSection />
      <Footer />
      
      {/* Sticky WhatsApp Button for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/95 backdrop-blur-lg border-t border-[#25D366]/30 md:hidden z-50">
        <Button 
          className="w-full font-bold h-14 rounded-xl shadow-2xl transition-all duration-300 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            color: 'white'
          }}
          onClick={() => {
            trackEvent('Contact');
            window.open("https://wa.me/491715060008?text=Hi%20Mathias%2C%20ich%20will%20das%20LR%2BKI%20Info-Paket.%20Interesse%3A%20%5BFast%20Track%2FAuto%2FBeides%5D.%20Vorname%3A%20____", '_blank');
          }}
        >
          <MessageCircle className="mr-2 w-6 h-6" />
          WhatsApp: Jetzt Info-Paket holen
        </Button>
      </div>
      </div>
    </div>
  );
}
