import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckCircle2, MessageCircle, Phone, UserPlus } from "lucide-react";
import { useEffect } from "react";

// --- Tracking Helper ---
const trackEvent = (eventName: string, params = {}) => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, params);
  }
  console.log(`Tracking Event: ${eventName}`, params);
};

export default function ThankYou() {
  const whatsappLink = "https://wa.me/491715060008?text=Hi%20Mathias%2C%20ich%20habe%20das%20Formular%20ausgef%C3%BCllt.%20INFO%20%2B%20%5BFast%20Track%2FAuto%2FBeides%5D";

  useEffect(() => {
    // Lead event is already tracked on form submit in Home.tsx
    // Tracking here would cause duplicate events
    trackEvent('CompleteRegistration'); // Track page view as registration complete
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 flex items-center justify-center p-4">
      <div className="container max-w-2xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 text-green-500 mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold font-poppins">
            Perfekt – so geht’s jetzt weiter ✅
          </h1>
          
          <p className="text-lg text-muted-foreground">
            Damit du sofort Klarheit bekommst, machen wir das in 3 Schritten:
          </p>
          
          <div className="grid gap-4 text-left">
            <Card className="bg-card/50 border-primary/20">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Schritt 1: Speicher Mathias als Kontakt</h3>
                  <p className="text-sm text-muted-foreground">Damit wir uns auf WhatsApp schreiben können.</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 border-primary/20">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Schritt 2: Schreib 'INFO' + Interesse</h3>
                  <p className="text-sm text-muted-foreground">z.B. "INFO Fast Track" oder "INFO Auto"</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 border-primary/20">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Schritt 3: Kurz-Check (10–15 Min)</h3>
                  <p className="text-sm text-muted-foreground">Wenn du willst: Terminlink oder Callback vereinbaren.</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-lg px-8 h-14 shadow-lg w-full sm:w-auto" 
              onClick={() => {
                trackEvent('Contact');
                window.open(whatsappLink, '_blank');
              }}
            >
              <MessageCircle className="mr-2 w-6 h-6" />
              Jetzt WhatsApp öffnen
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="h-14 w-full sm:w-auto border-primary/20 hover:bg-primary/5"
              onClick={() => {
                window.open(whatsappLink, '_blank');
              }}
            >
              Kurz-Check anfragen
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground opacity-70 pt-8">
            <p>Kostenlos • unverbindlich • DSGVO • keine Erfolgsgarantie</p>
            <p className="mt-2">Hinweis: Bitte Telefonnummer korrekt angeben, sonst kann ich dich nicht erreichen.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
