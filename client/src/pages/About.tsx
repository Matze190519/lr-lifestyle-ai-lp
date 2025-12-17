import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, MessageCircle, Users, Award, Heart, Target, ArrowRight } from "lucide-react";
import { Link } from "wouter";

const About = () => {
  const whatsappLink = "https://wa.me/491715060008?text=Hi%20Mathias%2C%20ich%20will%20das%20LR%2BKI%20Info-Paket.%20Interesse%3A%20%5BFast%20Track%2FAuto%2FBeides%5D.%20Vorname%3A%20____";

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(201, 168, 108, 0.1) 0%, rgba(0, 0, 0, 1) 60%)'
          }}
        />
        <div className="container max-w-4xl relative z-10 text-center">
          <p className="text-[#C9A86C] text-sm mb-4">Das Team hinter deinem Erfolg</p>
          <h1 className="text-3xl md:text-5xl font-bold font-poppins mb-6">
            <span className="gold-gradient-text">LR Lifestyle Team</span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            Dein Partner für finanzielle Freiheit
          </p>
          {/* Team Logo */}
          <div className="flex justify-center">
            <img 
              src="/images/logo-team.png" 
              alt="Löwenstarkes Team - LR Lifestyle Team" 
              className="w-32 h-32 md:w-40 md:h-40 rounded-full"
              style={{ boxShadow: '0 0 30px rgba(201, 168, 108, 0.4)' }}
            />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold font-poppins mb-8 text-center">
            <span className="gold-gradient-text">Dein LR Lifestyle Team</span>
          </h2>
          
          <div className="space-y-6 text-white/80 leading-relaxed">
            <p>
              Wir sind mehr als nur ein Team – wir sind eine <strong className="text-white">Familie von Gleichgesinnten</strong>, die gemeinsam an ihren Zielen arbeiten. Bei uns steht der Mensch im Mittelpunkt, und wir unterstützen uns gegenseitig auf dem Weg zur finanziellen Freiheit.
            </p>
            
            <p>
              Unser Team basiert auf <strong className="text-white">Vertrauen, Respekt und Ehrlichkeit</strong>. Wir glauben daran, dass echter Erfolg nur durch Zusammenarbeit und gegenseitige Unterstützung entsteht. Jeder im Team hat die gleichen Chancen – egal ob du gerade erst startest oder schon Erfahrung hast.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-10">
            <Card className="bg-black/80 border border-[#C9A86C]/30" style={{ boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)' }}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#C9A86C]/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#C9A86C]" />
                  </div>
                  <h3 className="font-bold gold-gradient-text">Events & Meetings</h3>
                </div>
                <p className="text-sm text-white/70">
                  Regelmäßige Team-Events, wo wir Erfolge feiern, neue Strategien besprechen und uns gegenseitig motivieren.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/80 border border-[#C9A86C]/30" style={{ boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)' }}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#C9A86C]/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-[#C9A86C]" />
                  </div>
                  <h3 className="font-bold gold-gradient-text">Online-Schulungen</h3>
                </div>
                <p className="text-sm text-white/70">
                  Wöchentliche Webinare: Produktwissen, Verkaufsstrategien, digitales Marketing. Von überall teilnehmen.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/80 border border-[#C9A86C]/30" style={{ boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)' }}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#C9A86C]/20 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-[#C9A86C]" />
                  </div>
                  <h3 className="font-bold gold-gradient-text">Immer erreichbar</h3>
                </div>
                <p className="text-sm text-white/70">
                  Starke WhatsApp-Gruppe für täglichen Austausch. Fragen, Unterstützung, Motivation – wir sind da.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/80 border border-[#C9A86C]/30" style={{ boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)' }}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#C9A86C]/20 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-[#C9A86C]" />
                  </div>
                  <h3 className="font-bold gold-gradient-text">Klare Ziele</h3>
                </div>
                <p className="text-sm text-white/70">
                  Wir helfen dir, deine Ziele zu definieren und zu erreichen. Bewährte Strategien, individuelle Betreuung.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mathias Section */}
      <section className="py-16 bg-gradient-to-b from-black to-[#0a0a0a]">
        <div className="container max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold font-poppins mb-2">
              <span className="gold-gradient-text">Mathias Vinzing</span>
            </h2>
            <p className="text-sm text-[#C9A86C]">Vom Dachdecker zum Platin-Orgaleiter</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            {/* Mathias Bild mit weißem Glow */}
            <div className="md:col-span-1">
              <div className="aspect-square rounded-full bg-gradient-to-br from-[#C9A86C]/20 to-black border-2 border-[#C9A86C]/50 flex items-center justify-center overflow-hidden" style={{ boxShadow: '0 0 30px rgba(255, 255, 255, 0.5), 0 0 60px rgba(255, 255, 255, 0.3), 0 0 90px rgba(255, 255, 255, 0.2)' }}>
                <img 
                  src="/images/mathias.png" 
                  alt="Mathias Vinzing" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<div class="text-center p-4"><p class="text-[#C9A86C] text-sm">Bild folgt</p></div>';
                  }}
                />
              </div>
            </div>

            {/* Story */}
            <div className="md:col-span-2 space-y-4 text-white/80 leading-relaxed">
              <p>
                <strong className="text-white">Hallo, ich bin Mathias</strong> – 50 Jahre, verheiratet, und seit 2023 lebe ich mit meiner Frau und unserem Hund auf <strong className="gold-gradient-text">Mallorca</strong>.
              </p>
              
              <p>
                Ursprünglich komme ich aus Schwerin, habe dort eine Ausbildung zum Dachdecker gemacht und bin später nach Hannover gezogen, um neue Perspektiven zu finden.
              </p>
              
              <p>
                Heute betreibe ich mein LR-Business von überall auf der Welt – dank digitalem System und <strong className="text-[#C9A86C]">LINA</strong>, unserer KI-Assistentin, die mir 24/7 bei Posts, Training und Teamaufbau hilft.
              </p>
            </div>
          </div>

          {/* Der Weg */}
          <div className="mt-12 space-y-8">
            <div className="bg-black/60 p-6 rounded-xl border border-[#C9A86C]/20">
              <h3 className="font-bold text-lg mb-4 gold-gradient-text">Der Weg aus dem Hamsterrad</h3>
              <p className="text-white/80 mb-4">
                Nach meinem Umzug nach Hannover dachte ich, ich hätte es geschafft: erst ein Job im Callcenter, dann mein eigenes Callcenter und ein Handyladen. Klingt nach Erfolg, oder?
              </p>
              <p className="text-white/80 mb-4"><strong className="text-white">War es nicht.</strong></p>
              <ul className="space-y-2 text-white/70">
                <li className="flex items-center gap-2">
                  <span className="text-red-400">•</span> Mitarbeiter bezahlen müssen
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-400">•</span> Ständig neuen Umsatz generieren
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-400">•</span> Keine Zeit für mich, keine Zeit für meine Familie
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-400">•</span> Am Ende des Monats mehr Stress als Geld
                </li>
              </ul>
              <p className="text-white/80 mt-4 italic">
                Das war kein Unternehmen – das war ein goldenes Hamsterrad.
              </p>
            </div>

            <div className="bg-black/60 p-6 rounded-xl border border-[#C9A86C]/20">
              <h3 className="font-bold text-lg mb-4 gold-gradient-text">Der Durchbruch</h3>
              <p className="text-white/80 mb-4">
                Ein Bekannter erzählte mir von LR Health & Beauty. Ich war skeptisch. Network Marketing? Klingt nach Kaffeefahrt.
              </p>
              <p className="text-white/80 mb-4">
                Aber zwei Worte weckten mein Interesse: <strong className="gold-gradient-text">Finanzielle Freiheit. Passives Einkommen.</strong>
              </p>
              <p className="text-white/80">
                Im ersten Jahr: <strong className="text-white">5.000€ passives Einkommen pro Monat</strong> – und die Qualifikation zum Silber-Orgaleiter. Dann kam Corona. Viele brachen ein. Ich machte Attacke.
              </p>
            </div>

            <div className="bg-black/60 p-6 rounded-xl border border-[#C9A86C]/20">
              <h3 className="font-bold text-lg mb-4 gold-gradient-text">Was uns unterscheidet</h3>
              <p className="text-white/80 mb-4">Unser Team ist nicht wie andere LR-Teams. Wir sind fortschrittlich:</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-white/80">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A86C]" />
                  Digitale Vertriebswege (kein Klinkenputzen)
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A86C]" />
                  KI-Tools wie LINA (24/7 Support für dich)
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A86C]" />
                  Schulungen, Webinare, Vorlagen – alles, was funktioniert
                </li>
              </ul>
            </div>
          </div>

          {/* Was du bekommst */}
          <div className="mt-12">
            <h3 className="font-bold text-xl mb-6 text-center gold-gradient-text">Was du von mir bekommst</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-black/40 rounded-lg border border-[#C9A86C]/20">
                <CheckCircle2 className="w-5 h-5 text-[#C9A86C] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Persönliches Onboarding</p>
                  <p className="text-sm text-white/60">Schritt-für-Schritt-Plan für die ersten 30 Tage</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-black/40 rounded-lg border border-[#C9A86C]/20">
                <CheckCircle2 className="w-5 h-5 text-[#C9A86C] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Regelmäßige Webinare</p>
                  <p className="text-sm text-white/60">Produktwissen, Marketingplan, Teamaufbau</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-black/40 rounded-lg border border-[#C9A86C]/20">
                <CheckCircle2 className="w-5 h-5 text-[#C9A86C] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">LINA KI-Support</p>
                  <p className="text-sm text-white/60">Deine 24/7 Assistentin für Bilder, Texte, Videos</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-black/40 rounded-lg border border-[#C9A86C]/20">
                <CheckCircle2 className="w-5 h-5 text-[#C9A86C] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Bewährte Vorlagen</p>
                  <p className="text-sm text-white/60">100+ Posts, Scripts, Checklisten</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lina Section */}
      <section className="py-16 bg-gradient-to-b from-black to-[#0a0a0a]">
        <div className="container max-w-4xl">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Lina Bild */}
            <div className="shrink-0">
              <div 
                className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-2 border-[#C9A86C]/50"
                style={{ boxShadow: '0 0 30px rgba(201, 168, 108, 0.4), 0 0 60px rgba(201, 168, 108, 0.2)' }}
              >
                <img 
                  src="/images/lina.png" 
                  alt="Lina - KI-Assistentin" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Text */}
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold font-poppins mb-2">
                <span className="gold-gradient-text">Lina – Vertrieb 2.0</span>
              </h2>
              <p className="text-sm text-[#C9A86C] mb-4">Deine KI-Assistentin | 24/7 verfügbar</p>
              <p className="text-white/80 leading-relaxed mb-4 max-w-lg">
                <strong className="text-white">Ruf Lina an!</strong> Sie führt Coaching-Gespräche, Geschäftsvorstellungen und bespricht mit dir deine Ziele – mit einem klaren Plan zur Umsetzung.
              </p>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A86C]" />
                  Live-Anrufe für Coaching & Termine
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A86C]" />
                  Bilder, Texte & Videos erstellen
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A86C]" />
                  Ziele besprechen & Pläne erstellen
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container max-w-2xl text-center">
          <h2 className="text-2xl font-bold font-poppins mb-4">
            <span className="gold-gradient-text">Bist du bereit?</span>
          </h2>
          <p className="text-white/80 mb-8">
            Wenn du nebenberuflich etwas Eigenes aufbauen willst, bereit bist ein bewährtes System zu lernen und nicht mehr Zeit gegen Geld tauschen willst – dann lass uns reden.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="h-12 px-8 rounded-lg font-semibold"
              style={{
                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                color: 'white'
              }}
              onClick={() => window.open(whatsappLink, '_blank')}
            >
              <MessageCircle className="mr-2 w-5 h-5" />
              WhatsApp: Jetzt starten
            </Button>
            <Link href="/">
              <Button 
                variant="outline"
                className="h-12 px-8 rounded-lg font-semibold border-[#C9A86C]/50 text-[#C9A86C] hover:bg-[#C9A86C]/10"
              >
                Zurück zur Startseite
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Link */}
      <div className="py-8 border-t border-[#C9A86C]/20">
        <div className="container text-center">
          <Link href="/">
            <span className="text-[#C9A86C] hover:underline cursor-pointer">← Zurück zur Startseite</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
