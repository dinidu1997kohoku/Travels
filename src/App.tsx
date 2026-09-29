import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingButtons from './components/FloatingButtons';
import Home from './pages/Home';
import { Destinations, DestinationDetail } from './pages/Destinations';
import { Packages, PackageDetail } from './pages/Packages';
import { Booking } from './pages/Booking';
import { PlanTrip } from './pages/PlanTrip';
import { Transport } from './pages/Transport';
import { Hotels } from './pages/Hotels';
import { Gallery } from './pages/Gallery';
import { BlogList, BlogDetail } from './pages/Blog';
import { Reviews } from './pages/Reviews';
import { FaqPage } from './pages/Faq';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Admin } from './pages/Admin';
import { SettingsProvider } from './lib/settings';
import { LangProvider } from './i18n/lang';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <div className="container-x flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
      <p className="font-display text-8xl font-bold text-jungle-900/15">404</p>
      <h1 className="font-display mt-2 text-3xl font-semibold text-jungle-950">Lost in the jungle?</h1>
      <p className="mt-2 text-ink-900/60">This page wandered off the trail. Let's get you back to paradise.</p>
      <Link to="/" className="btn-ocean mt-6">Back to Home</Link>
    </div>
  );
}

export default function App() {
  return (
    <LangProvider>
      <SettingsProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Header />
          <main className="min-h-screen">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/destinations/:slug" element={<DestinationDetail />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/packages/:slug" element={<PackageDetail />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/plan-trip" element={<PlanTrip />} />
              <Route path="/transport" element={<Transport />} />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <FloatingButtons />
        </BrowserRouter>
      </SettingsProvider>
    </LangProvider>
  );
}
