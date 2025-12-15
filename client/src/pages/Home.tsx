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
import LinaChatbot from "@/components/LinaChatbot";

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
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-10 pb-10">
      {/* 40 Jahre LR Logo - Top Right */}
      <div className="absolute top-4 right-4 z-50">
        <img 
          src="/images/lr-40-years-logo.jpg" 
          alt="40 Jahre LR Success Story" 
          className="w-24 h-auto md:w-32 lg:w-40 rounded-lg shadow-lg gold-glow"
        />
      </div>
      
      {/* Background Elements - Gold Particles */}
      <div className="absolute inset-0 bg-background z-0 gold-particles">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D4AF37]/15 via-background to-background opacity-80"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#D4AF37]/10 via-transparent to-transparent"></div>
      </div>

      <div className="container relative z-10 grid lg:grid-cols-2 gap-8 items-center max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full gold-border text-xs font-bold font-mono mx-auto lg:mx-0 gold-glow">
            <Zap className="w-3 h-3 text-[#D4AF37]" />
            <span className="gold-gradient-text">40 JAHRE ERFOLGSGESCHICHTE</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins leading-tight">
            Starte dein LR-Business – <br />
            <span className="gold-gradient-text">mit KI, System & Team.</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
            Hol dir das kostenlose WhatsApp-Info-Paket: Fast Track, Autokonzept & Lina-KI-Setup.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center lg:justify-start">
            <Button 
              size="lg" 
              className="gold-button text-lg px-8 h-14 rounded-xl w-full sm:w-auto" 
              onClick={() => {
                trackEvent('Contact');
                window.open(whatsappLink, '_blank');
              }}
            >
              <MessageCircle className="mr-2 w-6 h-6" />
              Infos per WhatsApp
            </Button>
          </div>
          
<div className="flex flex-wrap justify-center lg:justify-start gap-3 text-xs text-muted-foreground pt-2">
            <span className="flex items-center gap-1 gold-border px-3 py-1.5 rounded-full"><ShieldCheck className="w-3 h-3 text-[#D4AF37]" /> LR seit 1985</span>
            <span className="flex items-center gap-1 gold-border px-3 py-1.5 rounded-full"><Info className="w-3 h-3 text-[#D4AF37]" /> Info-Paket kostenlos</span>
            <span className="flex items-center gap-1 gold-border px-3 py-1.5 rounded-full"><ShieldCheck className="w-3 h-3 text-[#D4AF37]" /> DSGVO-konform</span>
            <span className="flex items-center gap-1 gold-border px-3 py-1.5 rounded-full"><MessageCircle className="w-3 h-3 text-[#D4AF37]" /> Antwort meist &lt;24h</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="relative rounded-2xl overflow-hidden gold-border shadow-2xl gold-glow aspect-[4/5] max-w-md mx-auto">
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent z-10"></div>
            <img 
              src="/images/hero-ai-lifestyle.png" 
              alt="Entrepreneur with AI Interface" 
              className="w-full h-full object-cover"
            />
            
            {/* Floating UI Element */}
            <div className="absolute bottom-8 left-8 right-8 z-20 bg-background/80 backdrop-blur-md gold-border p-4 rounded-xl gold-glow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="font-bold gold-gradient-text text-sm">Fast Track Active*</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const WhatIsLRSection = () => {
  const points = [
    "LR = Direktvertrieb / Empfehlungsmarketing (Produkte + Teamaufbau)",
    "Du startest nebenbei – Schritt für Schritt",
    "Du verdienst über Provisionen (abhängig von Aktivität & Team)",
    "Du bekommst von uns System + Begleitung + KI-Support (Lina)"
  ];

  return (
    <section className="py-12 bg-card/30 border-y border-[#D4AF37]/10">
      <div className="container max-w-3xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold font-poppins"><span className="gold-gradient-text">Was ist LR in 20 Sekunden?</span></h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {points.map((point, i) => (
            <div key={i} className="flex items-start gap-3 bg-background/50 p-4 rounded-lg gold-border">
              <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">{point}</p>
            </div>
          ))}
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
      badge: "Onboarding"
    },
    {
      quote: "Das Beste: Die Vorlagen. Ich muss nichts erfinden – ich setze nur um.",
      author: "Kevin, 27",
      role: "Quereinsteiger",
      badge: "Vorlagen"
    },
    {
      quote: "Ich wollte erst nur Infos. Nach dem Kurz-Check war alles plötzlich logisch.",
      author: "Miriam, 41",
      role: "Familie & Job",
      badge: "Kurz-Check"
    },
    {
      quote: "Lina spart mir Zeit: Antworten, Ideen, Follow-ups – ich bleibe dran.",
      author: "Tobias, 38",
      role: "selbstständig",
      badge: "WhatsApp Support"
    },
    {
      quote: "Kein Druck, kein Gelaber – einfach Schritt-für-Schritt.",
      author: "Anja, 52",
      role: "Neustart",
      badge: "Onboarding"
    },
    {
      quote: "Ich hatte Angst vor Technik. Setup war easy, weil ich geführt werde.",
      author: "Deniz, 29",
      role: "digital interessiert",
      badge: "Vorlagen"
    }
  ];

  return (
    <section className="py-16 bg-card/30 border-y border-[#D4AF37]/10">
      <div className="container max-w-6xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold font-poppins mb-2"><span className="gold-gradient-text">Echte Menschen. Echte Umsetzung.</span></h2>
          <p className="text-sm text-muted-foreground">Ergebnisse ohne leere Versprechen.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Card key={i} className="bg-background/40 gold-border hover:gold-glow transition-all backdrop-blur-sm">
              <CardContent className="p-6 relative">
                <div className="absolute top-4 right-4 px-2 py-1 bg-[#D4AF37]/10 rounded text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider">
                  {t.badge}
                </div>
                <p className="text-sm italic text-muted-foreground mb-4 leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37]/30 to-[#B8860B]/20 flex items-center justify-center text-xs font-bold text-[#D4AF37]">
                    {t.author.charAt(0)}
                  </div>
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
    <section className="py-16">
      <div className="container max-w-3xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold font-poppins mb-2"><span className="gold-gradient-text">Häufige Fragen & Antworten</span></h2>
          <p className="text-sm text-muted-foreground">Ihr Weg zum Erfolg mit LR – Alles, was Sie wissen müssen.</p>
        </div>
        
        <Accordion type="single" collapsible className="w-full space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="gold-border bg-card/20 rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium hover:text-[#D4AF37] text-left">
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

const FastTrackSection = () => {
  return (
    <section className="py-16">
      <div className="container max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Fast Track Card */}
          <Card className="bg-gradient-to-br from-background to-[#D4AF37]/5 gold-border shadow-lg relative overflow-hidden gold-glow">
            <div className="absolute top-0 right-0 w-20 h-20 bg-[#D4AF37]/10 rounded-bl-full -mr-10 -mt-10"></div>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <h3 className="text-xl font-bold font-poppins gold-gradient-text">Fast Track Bonus*</h3>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="text-2xl font-bold gold-gradient-text">
                  300 €* / 1.100 €* / 2.000 €*
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                    Klarer Startplan (was wann zu tun ist)
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                    WhatsApp-Check: Welche Stufe passt zu dir?
                  </li>
                </ul>
              </div>
              <p className="text-[10px] text-muted-foreground opacity-70">
                *Nur bei Erreichen der Programmbedingungen/Qualifikation. Details im Info-Paket.
              </p>
            </CardContent>
          </Card>

          {/* Autokonzept Card */}
          <Card className="bg-gradient-to-br from-background to-[#B8860B]/5 gold-border shadow-lg relative overflow-hidden gold-glow">
            <div className="absolute top-0 right-0 w-20 h-20 bg-[#B8860B]/10 rounded-bl-full -mr-10 -mt-10"></div>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#B8860B]/20 flex items-center justify-center">
                  <Car className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <h3 className="text-xl font-bold font-poppins gold-gradient-text">Autokonzept*</h3>
              </div>
              
              <div className="space-y-4 mb-6">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    Dienst-/Firmenwagenmodell über Partnerkonditionen*
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    Je nach Stufe kann ein monatlicher Zuschuss möglich sein*
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    Du bekommst die Übersicht: Voraussetzungen, Modelle, Ablauf
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
      title: "Wissen & Coaching",
      desc: "Umfassendes LR-Wissen und persönliches Coaching – Lina kennt jeden Karriereplan, jedes Produkt und jeden Einwand. Sie coacht dich wie ein erfahrener Mentor.",
      icon: <Users className="w-5 h-5 text-[#D4AF37]" />
    },
    {
      title: "Vertrieb & WhatsApp",
      desc: "Automatisierte Kundenbetreuung, FAQ-Bot, Follow-up-Erinnerungen, Lead-Qualifizierung.",
      icon: <MessageCircle className="w-5 h-5 text-[#D4AF37]" />
    },
    {
      title: "Social Media",
      desc: "Content-Vorlagen für Reels, Posts und Stories. Hashtag-Vorschläge, Posting-Zeiten, Trend-Analyse.",
      icon: <Smartphone className="w-5 h-5 text-[#D4AF37]" />
    },
    {
      title: "24/7 Verfügbar",
      desc: "Immer für dich da – auch nachts und am Wochenende. Perfekt für Nebenbei-Starter.",
      icon: <Zap className="w-5 h-5 text-[#D4AF37]" />
    }
  ];

  return (
    <section className="py-16 bg-card/30 border-y border-[#D4AF37]/10">
      <div className="container max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold font-poppins mb-2"><span className="gold-gradient-text">Lina – deine vollumfängliche Business-Partnerin</span></h2>
          <p className="text-sm text-muted-foreground">Keine Erfahrung? Lina regelt das.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {features.map((f, i) => (
            <Card key={i} className="bg-background/40 gold-border hover:gold-glow transition-all text-center">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-bold mb-2 text-sm gold-gradient-text">{f.title}</h3>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <p className="text-center text-sm text-muted-foreground max-w-2xl mx-auto">
          Lina ist deine vollumfängliche Business-Partnerin. Sie weiß alles über LR, unterstützt dich im Vertrieb, erstellt Content für Social Media und ist <strong>24/7 verfügbar auf allen deinen Geräten</strong>.
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
    toast.success("Anfrage gesendet!", {
      description: "Wir melden uns in Kürze bei dir.",
    });
    form.reset();
    setLocation("/danke");
  }

  return (
    <section id="contact" className="py-16 relative">
      <div className="container max-w-3xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold font-poppins mb-8"><span className="gold-gradient-text">Willst du das Info-Paket per WhatsApp?</span></h2>
          
          <Button 
            size="lg" 
            className="gold-button text-lg px-10 h-16 rounded-xl w-full md:w-auto mb-8" 
            onClick={() => {
              trackEvent('Contact');
              window.open(whatsappLink, '_blank');
            }}
          >
            <MessageCircle className="mr-2 w-6 h-6" />
            WhatsApp öffnen
          </Button>
          
          <div className="flex items-center justify-center gap-4 opacity-50">
            <div className="h-px bg-border w-20"></div>
            <span className="text-xs uppercase tracking-widest">Oder</span>
            <div className="h-px bg-border w-20"></div>
          </div>
        </div>

        <Card className="bg-card gold-border shadow-lg overflow-hidden max-w-md mx-auto gold-glow">
          <div className="p-6 bg-[#D4AF37]/5 border-b border-[#D4AF37]/20">
            <h3 className="font-bold text-center gold-gradient-text">Kein WhatsApp?</h3>
            <p className="text-xs text-center text-muted-foreground">Nutze das 20-Sekunden-Formular</p>
          </div>
          <div className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
    <footer className="py-8 border-t border-[#D4AF37]/20 bg-background text-[10px] text-muted-foreground text-center">
      <div className="container space-y-4 max-w-4xl">
        <p>*Details zu Voraussetzungen, Fast Track Bonus und Autokonzept im kostenlosen Info-Paket. Keine Erfolgsgarantie; Ergebnisse hängen von individuellem Einsatz ab.</p>
        <div className="flex justify-center gap-6 text-xs">
          <a href="/impressum" className="hover:text-[#D4AF37] transition-colors">Impressum</a>
          <a href="/datenschutz" className="hover:text-[#D4AF37] transition-colors">Datenschutz</a>
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
      <LinaChatbot />
      <div className="selection:bg-primary/30 pb-20 md:pb-0">
      <HeroSection />
      <WhatIsLRSection />
      <FastTrackSection />
      <LinaSection />
      <SocialProofSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
      
      {/* Sticky WhatsApp Button for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-lg border-t border-[#D4AF37]/30 md:hidden z-50">
        <Button 
          className="w-full gold-button font-bold h-12 rounded-xl"
          onClick={() => {
            trackEvent('Contact');
            window.open("https://wa.me/491715060008?text=Hi%20Mathias%2C%20ich%20will%20das%20LR%2BKI%20Info-Paket.%20Interesse%3A%20%5BFast%20Track%2FAuto%2FBeides%5D.%20Vorname%3A%20____", '_blank');
          }}
        >
          <MessageCircle className="mr-2 w-5 h-5" />
          WhatsApp Infos
        </Button>
      </div>
      </div>
    </div>
  );
}
