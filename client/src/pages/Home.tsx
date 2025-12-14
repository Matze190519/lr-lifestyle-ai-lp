import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, MessageCircle, ShieldCheck, Zap } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useEffect } from "react";

// --- Schema & Types ---
const formSchema = z.object({
  name: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein"),
  phone: z.string().min(6, "Telefonnummer muss mindestens 6 Zeichen lang sein"),
  interest: z.string().optional(),
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
  const whatsappLink = "https://wa.me/491715060008?text=Hi%20Mathias%2C%20ich%20will%20Infos%20zu%20LR%20%2B%20KI%20(Lina).%20Mich%20interessiert%3A%20Fast%20Track%20/%20Autokonzept%20/%20Beides.%20Vorname%3A%20___";

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-10 pb-10">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-background z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-60"></div>
      </div>

      <div className="container relative z-10 grid lg:grid-cols-2 gap-8 items-center max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium font-mono mx-auto lg:mx-0">
            <Zap className="w-3 h-3" />
            <span>AI POWERED BUSINESS</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins leading-tight">
            Starte dein LR-Business – <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">mit KI, System & Team.</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
            Hol dir WhatsApp-Infos + einen kurzen Check, ob das Modell zu dir passt.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center lg:justify-start">
            <Button 
              size="lg" 
              className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-lg px-8 h-14 shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:shadow-[0_0_30px_rgba(37,211,102,0.5)] transition-all duration-300 w-full sm:w-auto" 
              onClick={() => {
                trackEvent('Contact');
                window.open(whatsappLink, '_blank');
              }}
            >
              <MessageCircle className="mr-2 w-6 h-6" />
              Infos per WhatsApp
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-xs text-muted-foreground pt-2">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> LR seit 1985</span>
            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> DSGVO-konform</span>
            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Kostenlos & unverbindlich</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="relative rounded-2xl overflow-hidden border border-primary/20 shadow-2xl shadow-primary/5 aspect-[4/5] max-w-md mx-auto">
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent z-10"></div>
            <img 
              src="/images/hero-ai-lifestyle.png" 
              alt="Entrepreneur with AI Interface" 
              className="w-full h-full object-cover"
            />
            
            {/* Floating UI Element */}
            <div className="absolute bottom-8 left-8 right-8 z-20 bg-background/60 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="font-bold text-foreground text-sm">Fast Track Active*</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const ProofAndClaritySection = () => {
  const benefits = [
    {
      title: "System statt Chaos",
      desc: "Schritt-für-Schritt Plan + Vorlagen für deinen Start.",
      icon: <CheckCircle2 className="w-5 h-5 text-primary" />
    },
    {
      title: "KI-Support (Lina)",
      desc: "Hilfe bei Content, FAQ und Follow-up – 24/7 verfügbar.",
      icon: <Zap className="w-5 h-5 text-primary" />
    },
    {
      title: "Ziele greifbar",
      desc: "Fast Track* & Autokonzept* als klare Motivation.",
      icon: <ArrowRight className="w-5 h-5 text-primary" />
    }
  ];

  const steps = [
    "WhatsApp schreiben",
    "Infos + Kurz-Check",
    "Wenn’s passt: Start & Setup"
  ];

  return (
    <section className="py-16 bg-card/30 border-y border-white/5">
      <div className="container max-w-4xl">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {benefits.map((b, i) => (
            <Card key={i} className="bg-background/40 border-primary/10 backdrop-blur-sm hover:border-primary/30 transition-all">
              <CardContent className="p-6">
                <div className="mb-3">{b.icon}</div>
                <h3 className="font-bold font-poppins mb-2 text-lg">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <h3 className="text-xl font-bold mb-6">So einfach geht's:</h3>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-3 bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">{i + 1}</span>
                <span className="text-sm font-medium">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const FinalCTASection = () => {
  const whatsappLink = "https://wa.me/491715060008?text=Hi%20Mathias%2C%20ich%20will%20Infos%20zu%20LR%20%2B%20KI%20(Lina).%20Mich%20interessiert%3A%20Fast%20Track%20/%20Autokonzept%20/%20Beides.%20Vorname%3A%20___";
  
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
    // Optional: Open WhatsApp after submit
    // window.open(whatsappLink, '_blank');
  }

  return (
    <section id="contact" className="py-16 relative">
      <div className="container max-w-3xl">
        <div className="text-center mb-10">
          <Button 
            size="lg" 
            className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-lg px-10 h-16 shadow-xl w-full md:w-auto mb-8" 
            onClick={() => {
              trackEvent('Contact');
              window.open(whatsappLink, '_blank');
            }}
          >
            <MessageCircle className="mr-2 w-6 h-6" />
            Infos per WhatsApp anfordern
          </Button>
          
          <div className="flex items-center justify-center gap-4 opacity-50">
            <div className="h-px bg-border w-20"></div>
            <span className="text-xs uppercase tracking-widest">Oder</span>
            <div className="h-px bg-border w-20"></div>
          </div>
        </div>

        <Card className="bg-card border-primary/10 shadow-lg overflow-hidden max-w-md mx-auto">
          <div className="p-6 bg-muted/30 border-b border-white/5">
            <h3 className="font-bold text-center">Kein WhatsApp?</h3>
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
                
                <Button type="submit" variant="secondary" className="w-full font-bold">
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
    <footer className="py-8 border-t border-white/5 bg-background text-xs text-muted-foreground text-center">
      <div className="container space-y-4">
        <p>*Details zu Voraussetzungen, Fast Track Bonus und Autokonzept erhältst du im kostenlosen Info-Paket. Es gibt keine Erfolgsgarantie; Ergebnisse hängen von individuellem Einsatz ab.</p>
        <div className="flex justify-center gap-6">
          <a href="#" className="hover:text-primary transition-colors">Impressum</a>
          <a href="#" className="hover:text-primary transition-colors">Datenschutz</a>
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
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 pb-20 md:pb-0">
      <HeroSection />
      <ProofAndClaritySection />
      <FinalCTASection />
      <Footer />
      
      {/* Sticky WhatsApp Button for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-white/10 md:hidden z-50">
        <Button 
          className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold h-12 shadow-lg"
          onClick={() => {
            trackEvent('Contact');
            window.open("https://wa.me/491715060008?text=Hi%20Mathias%2C%20ich%20will%20Infos%20zu%20LR%20%2B%20KI%20(Lina).%20Mich%20interessiert%3A%20Fast%20Track%20/%20Autokonzept%20/%20Beides.%20Vorname%3A%20___", '_blank');
          }}
        >
          <MessageCircle className="mr-2 w-5 h-5" />
          WhatsApp Infos
        </Button>
      </div>
    </div>
  );
}
