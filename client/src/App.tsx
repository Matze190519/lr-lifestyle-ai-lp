import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ThankYou from "./pages/ThankYou";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import About from "./pages/About";
import LiveAvatar from "./pages/LiveAvatar";
import LiveAvatarFAB from "./components/LiveAvatarFAB";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/danke"} component={ThankYou} />
      <Route path={"/impressum"} component={Impressum} />
      <Route path={"/datenschutz"} component={Datenschutz} />
      <Route path={"/about"} component={About} />
      <Route path={"/ueber-uns"} component={About} />
      <Route path={"/liveavatar"} component={LiveAvatar} />
      <Route path={"/avatar"} component={LiveAvatar} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// Component to conditionally show FAB only on Home page
function ConditionalFAB() {
  const [location] = useLocation();
  // Only show FAB on home page, not on the dedicated LiveAvatar page
  if (location === '/' || location === '') {
    return <LiveAvatarFAB />;
  }
  return null;
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
          <ConditionalFAB />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
