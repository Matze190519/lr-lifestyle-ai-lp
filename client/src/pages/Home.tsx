import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ChevronRight, MessageCircle, Star, Zap } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

// --- Schema & Types ---
const formSchema = z.object({
  name: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein"),
  email: z.string().email("Ungültige E-Mail-Adresse"),
  phone: z.string().min(6, "Telefonnummer muss mindestens 6 Zeichen lang sein"),
  source: z.string().optional(),
  message: z.string().optional(),
});

// --- Components ---

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-10">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-background z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-secondary/10 via-background to-background opacity-30"></div>
      </div>

      <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium font-mono">
            <Zap className="w-4 h-4" />
            <span>AI POWERED BUSINESS</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold font-poppins leading-tight">
            Verdiene Geld. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Gewinne Freiheit.</span> <br />
            Nutze KI.
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-xl">
            Baue dein eigenes LR-Business – mit modernster Technologie und einem starken Team an deiner Seite. Der perfekte Start für Unternehmer und Visionäre.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8 h-14 shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] transition-all duration-300" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              Jetzt kostenlos informieren
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5 text-foreground h-14" onClick={() => window.open('https://wa.me/491715060008', '_blank')}>
              <MessageCircle className="mr-2 w-5 h-5" />
              WhatsApp Chat
            </Button>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-bold overflow-hidden">
                  <img src={`https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop`} alt="User" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <p>Bereits <span className="text-primary font-bold">1.000+</span> Partner im Team</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative rounded-2xl overflow-hidden border border-primary/20 shadow-2xl shadow-primary/10 aspect-[4/3] group">
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10"></div>
            <img 
              src="/images/hero-ai-lifestyle.png" 
              alt="Entrepreneur with AI Interface" 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            
            {/* Floating UI Elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute bottom-8 left-8 z-20 bg-background/80 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-lg max-w-xs"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Monatlicher Bonus</p>
                  <p className="font-bold text-foreground">Fast Track Active</p>
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-secondary w-[85%]"></div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const SocialProofSection = () => {
  const testimonials = [
    {
      name: "Sarah M.",
      role: "Unternehmerin",
      quote: "Dank der KI-Tools konnte ich mein Business nebenbei aufbauen. Das Autokonzept ist der Wahnsinn!",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
    },
    {
      name: "Michael K.",
      role: "Vertriebsleiter",
      quote: "Endlich ein System, das funktioniert. Keine Kaltakquise mehr, sondern smarte Leads durch Technologie.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
    },
    {
      name: "Julia W.",
      role: "Marketing Expertin",
      quote: "Die Kombination aus LR-Produkten und moderner Automatisierung ist einzigartig am Markt.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop"
    }
  ];

  return (
    <section className="py-20 bg-background/50 border-y border-white/5">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-poppins mb-4">Erfolg ist kein Zufall</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Schließe dich hunderten erfolgreichen Unternehmern an, die bereits den Schritt gewagt haben.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <Card key={i} className="bg-card/50 border-primary/10 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4 text-secondary">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-lg mb-6 italic text-foreground/90">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                  <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover border border-primary/20" />
                  <div>
                    <p className="font-bold font-poppins">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
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

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Kostenlose Info-Session",
      desc: "Lerne das Konzept kennen – unverbindlich und persönlich im Gespräch mit Mathias."
    },
    {
      number: "02",
      title: "Onboarding mit KI",
      desc: "Wir richten dein Business ein – von der ersten Bestellung bis zum automatisierten Marketing."
    },
    {
      number: "03",
      title: "Starte & Wachse",
      desc: "Baue dein Team auf, verdiene Provisionen und erreiche deine Ziele (z.B. Autokonzept)."
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10"></div>
      
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
              Dein Weg zum <span className="text-primary">Erfolg</span>
            </h2>
            <p className="text-muted-foreground mb-10 text-lg">
              Wir haben den Prozess so einfach wie möglich gestaltet. Kein Vorwissen nötig – wir führen dich Schritt für Schritt.
            </p>
            
            <div className="space-y-8">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xl font-bold font-mono text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 shrink-0">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{step.title}</h3>
                    <p className="text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-2xl blur-xl transform rotate-3"></div>
            <img 
              src="/images/feature-ai-automation.png" 
              alt="AI Automation Process" 
              className="relative rounded-2xl border border-white/10 shadow-2xl w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const BenefitsSection = () => {
  const benefits = [
    {
      title: "Passives Einkommen",
      desc: "Verdiene auch dann, wenn dein Team verkauft. Baue dir langfristige finanzielle Sicherheit auf.",
      icon: <ArrowRight className="w-6 h-6" /> // Placeholder icon
    },
    {
      title: "Maximale Flexibilität",
      desc: "Arbeite von überall, wann du willst. Perfekt für Eltern, Berufstätige und digitale Nomaden.",
      icon: <ArrowRight className="w-6 h-6" />
    },
    {
      title: "KI-gestützte Prozesse",
      desc: "Automatisiere Kundenakquise, Follow-ups und Marketing. Spare Zeit und gewinne mehr Kunden.",
      icon: <ArrowRight className="w-6 h-6" />
    },
    {
      title: "Exklusives Autokonzept",
      desc: "Fahre dein Traumauto – finanziert durch deine LR-Provisionen. Ein greifbares Ziel für deinen Erfolg.",
      icon: <ArrowRight className="w-6 h-6" />
    }
  ];

  return (
    <section className="py-24 bg-card/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4">Warum LR Lifestyle Team?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Wir kombinieren ein bewährtes Geschäftsmodell mit den Möglichkeiten des 21. Jahrhunderts.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => (
            <Card key={i} className="bg-background border-primary/10 hover:border-primary/50 transition-all duration-300 group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-6 relative z-10">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-poppins mb-3">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Car Concept Highlight */}
        <div className="mt-20 relative rounded-3xl overflow-hidden border border-white/10">
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <img src="/images/car-concept-luxury.png" alt="Luxury Car" className="absolute inset-0 w-full h-full object-cover" />
          
          <div className="relative z-20 p-8 md:p-16 text-center">
            <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 font-poppins">Dein Traumauto wartet.</h3>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Erreiche deine Ziele und lass dich von LR belohnen. Das Autokonzept ist mehr als nur ein Bonus – es ist ein Statement.
            </p>
            <Button size="lg" variant="secondary" className="font-bold text-lg px-8" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              Mehr erfahren
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactSection = () => {
  // const { toast } = useToast(); // Removed in favor of direct import
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      source: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast.success("Anfrage gesendet!", {
      description: "Wir werden uns in Kürze bei dir melden.",
    });
    form.reset();
  }

  return (
    <section id="contact" className="py-24 relative">
      <div className="container max-w-4xl">
        <Card className="bg-card border-primary/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-12 bg-primary/5 flex flex-col justify-center">
              <h2 className="text-3xl font-bold font-poppins mb-4">Bereit für den nächsten Schritt?</h2>
              <p className="text-muted-foreground mb-8">
                Fülle das Formular aus und sichere dir dein kostenloses Erstgespräch mit Mathias.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>100% Kostenlos & Unverbindlich</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>Persönliche Strategie-Session</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>Zugang zu exklusiven Infos</span>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-primary/10">
                <p className="text-sm text-muted-foreground mb-2">Oder direkt per WhatsApp:</p>
                <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/10" onClick={() => window.open('https://wa.me/491715060008', '_blank')}>
                  <MessageCircle className="mr-2 w-4 h-4" />
                  +49 171 5060008
                </Button>
              </div>
            </div>
            
            <div className="p-8 md:p-12 bg-background">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Dein vollständiger Name" {...field} className="bg-muted/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-Mail</FormLabel>
                        <FormControl>
                          <Input placeholder="deine@email.com" {...field} className="bg-muted/50" />
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
                        <FormLabel>Telefon / WhatsApp</FormLabel>
                        <FormControl>
                          <Input placeholder="+49 123 456789" {...field} className="bg-muted/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="source"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Wie bist du auf uns aufmerksam geworden?</FormLabel>
                        <FormControl>
                          <Input placeholder="z.B. Instagram, Facebook, Empfehlung" {...field} className="bg-muted/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full h-12 text-lg font-bold bg-gradient-to-r from-primary to-primary/80 hover:to-primary shadow-lg shadow-primary/20">
                    Jetzt Termin sichern
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    Deine Daten sind sicher. DSGVO-konform.
                  </p>
                </form>
              </Form>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-12 border-t border-white/5 bg-background text-sm text-muted-foreground">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <p className="font-bold text-foreground mb-2">LR Lifestyle AI</p>
          <p>© 2025 Alle Rechte vorbehalten.</p>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-primary transition-colors">Impressum</a>
          <a href="#" className="hover:text-primary transition-colors">Datenschutz</a>
          <a href="#" className="hover:text-primary transition-colors">AGB</a>
        </div>
      </div>
    </footer>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      <HeroSection />
      <SocialProofSection />
      <HowItWorksSection />
      <BenefitsSection />
      <ContactSection />
      <Footer />
      
      {/* Sticky WhatsApp Button for Mobile */}
      <a 
        href="https://wa.me/491715060008" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 md:hidden"
      >
        <MessageCircle className="w-8 h-8 text-white fill-current" />
      </a>
    </div>
  );
}
