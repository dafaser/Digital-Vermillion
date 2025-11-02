

import React, { useState, useEffect, createContext, useContext, useRef, useCallback } from 'react';
import type { Language, AppContextType } from './types';
import { content, WHATSAPP_LINK } from './constants';
import { 
    WhatsAppIcon, InstagramIcon, LinkedInIcon, 
    CheckIcon, QuoteIcon, EmailIcon, CodeBracketIcon, PaintBrushIcon,
    WrenchScrewdriverIcon, CloudArrowUpIcon, ClipboardDocumentCheckIcon,
    BuildingLibraryIcon
} from './components/Icons';

// --- CONTEXTS ---
const AppContext = createContext<AppContextType | null>(null);

// --- HELPER HOOKS ---
const useAppData = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppProvider');
  }
  return context;
};

// Helper hook for scroll animations
// Fix: Made the hook generic to accept any HTMLElement type.
const useScrollAnimation = <T extends HTMLElement>(options?: IntersectionObserverInit) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<T>(null);

    useEffect(() => {
        const element = ref.current;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (element) {
                        observer.unobserve(element);
                    }
                }
            },
            { threshold: 0.1, ...options }
        );

        if (element) {
            observer.observe(element);
        }

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [options]);

    return { ref, isVisible };
};


// --- BACKGROUND COMPONENT ---
const AnimatedBackground: React.FC = () => (
  <div className="fixed top-0 left-0 w-full h-full -z-50 overflow-hidden">
    {/* Gradient Mesh */}
    <div className="absolute inset-0 bg-gradient-to-br from-vermillion/50 via-pink-900/20 to-charcoal opacity-40"></div>
    {/* Animated Grid */}
    <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] animate-grid-pan"
    ></div>
    <div className="absolute inset-0 bg-charcoal -z-10"></div>
  </div>
);

// --- HEADER COMPONENT ---
const Header: React.FC = () => {
    const { language, setLanguage, content } = useAppData();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const NavLinks: React.FC<{onLinkClick?: () => void}> = ({ onLinkClick }) => (
        <>
            {Object.entries(content.nav).map(([key, value]) => (
                <a key={key} href={`#${key}`} onClick={onLinkClick} className="px-3 py-2 text-sm font-medium transition-colors hover:text-vermillion">{value as string}</a>
            ))}
        </>
    );

    return (
        <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-black/20 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <a href="#home" className="text-xl font-bold tracking-wider">
                        Digital<span className="text-vermillion">Vermillion</span>
                    </a>
                    <nav className="hidden md:flex items-center space-x-2">
                       <NavLinks />
                    </nav>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <button onClick={() => setLanguage(language === 'en' ? 'id' : 'en')} className="flex items-center space-x-1 p-2 rounded-full hover:bg-gray-500/20 transition-colors text-sm font-semibold">
                                <span>{language.toUpperCase()}</span>
                            </button>
                        </div>
                         <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md hover:bg-gray-500/20">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
             {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-black/50 backdrop-blur-lg pb-4">
                    <nav className="flex flex-col items-center space-y-2">
                        <NavLinks onLinkClick={() => setIsMenuOpen(false)} />
                    </nav>
                </div>
            )}
        </header>
    );
};


// --- SECTION WRAPPER ---
const SectionWrapper: React.FC<{id: string; children: React.ReactNode; className?: string}> = ({ id, children, className = '' }) => (
    <section id={id} className={`py-20 md:py-32 ${className}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {children}
        </div>
    </section>
);

// --- HERO SECTION ---
const HeroSection: React.FC = () => {
    const { content } = useAppData();
    const [offsetY, setOffsetY] = useState(0);
    const handleScroll = () => setOffsetY(window.pageYOffset);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-20">
            <div className="relative z-10 p-4">
                <div 
                    className="absolute inset-0 bg-black/10 backdrop-blur-xl rounded-3xl border border-white/20"
                    style={{ transform: `translateY(${offsetY * 0.3}px)` }}
                ></div>
                <div 
                    className="relative p-8 md:p-16"
                    style={{ transform: `translateY(-${offsetY * 0.15}px)` }}
                >
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
                        {content.hero.headline}
                    </h1>
                    <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-300 mb-10">
                        {content.hero.subheadline}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="inline-block bg-vermillion text-white font-semibold py-3 px-8 rounded-full shadow-glow-vermillion-normal hover:shadow-glow-vermillion-hover hover:bg-vermillion-dark transition duration-500 ease-in-out transform hover:scale-105">
                            <span className="sm:hidden">{content.hero.ctaPrimaryMobile}</span>
                            <span className="hidden sm:inline">{content.hero.ctaPrimary}</span>
                        </a>
                        <a href="#portfolio" className="inline-block border border-vermillion text-vermillion font-semibold py-3 px-8 rounded-full hover:bg-vermillion hover:text-white hover:shadow-[0_0_25px_#E34234] transition duration-300 ease-in-out transform hover:scale-105">
                             {content.hero.ctaSecondary}
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};


// --- ABOUT SECTION ---
const AboutSection: React.FC = () => {
    const { content } = useAppData();
    const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });
    return (
        <SectionWrapper id="about">
            <div ref={ref} className={`max-w-4xl mx-auto text-center transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">{content.about.title}</h2>
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                    {content.about.text}
                </p>
            </div>
        </SectionWrapper>
    );
};

// --- SERVICES SECTION ---
const serviceIcons = [
    CodeBracketIcon,
    PaintBrushIcon,
    WrenchScrewdriverIcon,
    CloudArrowUpIcon,
    ClipboardDocumentCheckIcon,
    BuildingLibraryIcon
];

const ServiceCard: React.FC<{ service: string; index: number }> = ({ service, index }) => {
    const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();
    const IconComponent = serviceIcons[index] || CheckIcon;

    return (
        <div 
            ref={ref}
            className={`p-6 bg-black/20 backdrop-blur-md rounded-2xl border border-white/20 transition-all duration-500 ease-out hover:border-vermillion/50 hover:shadow-2xl hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 bg-vermillion/20 text-vermillion rounded-full p-2">
                    <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold">{service}</h3>
            </div>
        </div>
    );
};

const ServicesSection: React.FC = () => {
    const { content } = useAppData();
    const { ref: titleRef, isVisible: isTitleVisible } = useScrollAnimation<HTMLDivElement>();
    return (
        <SectionWrapper id="services" className="bg-black/10">
            <div ref={titleRef} className={`text-center mb-16 transition-all duration-700 ease-out ${isTitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h2 className="text-3xl md:text-4xl font-bold">{content.services.title}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {content.services.list.map((service: string, index: number) => (
                    <ServiceCard key={index} service={service} index={index} />
                ))}
            </div>
        </SectionWrapper>
    );
};

// --- PORTFOLIO SECTION ---
const PortfolioCard: React.FC<{ item: { name: string; category: string; url: string; image: string; }, index: number }> = ({ item, index }) => {
    const { ref, isVisible } = useScrollAnimation<HTMLAnchorElement>({ threshold: 0.2 });
    return (
        <a 
            ref={ref}
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={`group block overflow-hidden rounded-2xl border border-white/20 bg-black/10 backdrop-blur-md transition-all duration-500 ease-out hover:shadow-2xl hover:border-vermillion/50 hover:scale-105 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            style={{ transitionDelay: `${index * 150}ms` }}
        >
            <img src={item.image} alt={item.name} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" />
            <div className="p-6">
                <h3 className="text-xl font-bold mb-1">{item.name}</h3>
                <p className="text-vermillion font-medium">{item.category}</p>
            </div>
        </a>
    );
};

const PortfolioSection: React.FC = () => {
    const { content } = useAppData();
    const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();
    return (
        <SectionWrapper id="portfolio">
            <div ref={ref} className={`text-center mb-16 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h2 className="text-3xl md:text-4xl font-bold">{content.portfolio.title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
                {content.portfolio.items.map((item: any, index: number) => (
                    <PortfolioCard key={index} item={item} index={index} />
                ))}
            </div>
        </SectionWrapper>
    );
};

// --- TESTIMONIALS SECTION ---
const TestimonialCard: React.FC<{ item: { quote: string; author: string; }, index: number }> = ({ item, index }) => {
    const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.3 });
    const slideInClass = index % 2 === 0 ? 'translate-x-[-50px]' : 'translate-x-[50px]';
    const finalClass = isVisible ? 'opacity-100 translate-x-0' : `opacity-0 ${slideInClass}`;
    
    return (
        <div ref={ref} className={`p-8 rounded-2xl bg-black/20 backdrop-blur-md border border-white/20 relative transition-all duration-700 ease-out ${finalClass}`}>
            <QuoteIcon className="absolute top-4 left-4 w-10 h-10 text-vermillion/20" />
            <p className="text-lg italic mb-6 relative z-10">"{item.quote}"</p>
            <p className="font-bold text-right">— {item.author}</p>
        </div>
    );
};

const TestimonialsSection: React.FC = () => {
    const { content } = useAppData();
    const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();
    return (
        <SectionWrapper id="testimonials" className="bg-black/10">
            <div ref={ref} className={`text-center mb-16 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h2 className="text-3xl md:text-4xl font-bold">{content.testimonials.title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                {content.testimonials.list.map((item: any, index: number) => (
                    <TestimonialCard key={index} item={item} index={index}/>
                ))}
            </div>
        </SectionWrapper>
    );
};

// --- CONTACT SECTION ---
const ContactSection: React.FC = () => {
    const { content } = useAppData();
    const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });
    return (
        <SectionWrapper id="contact" className="bg-black/10">
            <div ref={ref} className={`text-center max-w-3xl mx-auto transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h2 className="text-3xl md:text-4xl font-bold">{content.contact.title}</h2>
                <p className="text-lg my-6 text-gray-300">{content.contact.subheadline}</p>
                 <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-10 my-8 text-sm">
                    <div className="flex items-center gap-3">
                        <WhatsAppIcon className="w-5 h-5 text-green-500" />
                        <span>WhatsApp: <strong>085155060832</strong></span>
                    </div>
                    <div className="flex items-center gap-3">
                        <EmailIcon className="w-5 h-5 text-vermillion" />
                        <span>Email: <strong>anandafa.syukur@alumni.ui.ac.id</strong></span>
                    </div>
                </div>
                 <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="inline-block bg-vermillion text-white font-semibold py-3 px-8 rounded-full shadow-glow-vermillion-normal hover:shadow-glow-vermillion-hover hover:bg-vermillion-dark transition duration-500 ease-in-out transform hover:scale-105">
                    {content.contact.cta}
                </a>
            </div>
        </SectionWrapper>
    );
};

// --- FOOTER COMPONENT ---
const Footer: React.FC = () => {
    const { content } = useAppData();
    const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.1 });
    return (
        <footer ref={ref} className={`bg-transparent text-sm transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <a href="#home" className="text-lg font-bold">Digital<span className="text-vermillion">Vermillion</span></a>
                        <p className="text-gray-400 mt-1">{content.footer.tagline}</p>
                    </div>
                    <div className="flex items-center space-x-6">
                        <a href="https://www.instagram.com/dafasr/" target="_blank" rel="noopener noreferrer" className="hover:text-vermillion transition-colors"><InstagramIcon className="w-6 h-6" /></a>
                        <a href="https://www.linkedin.com/in/dafasr/" target="_blank" rel="noopener noreferrer" className="hover:text-vermillion transition-colors"><LinkedInIcon className="w-6 h-6" /></a>
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t border-white/5 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Digital Vermillion — {content.footer.rights}</p>
                </div>
            </div>
        </footer>
    );
};

// --- FLOATING WHATSAPP BUTTON ---
const FloatingWhatsApp: React.FC = () => (
    <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-30 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform"
    >
        <WhatsAppIcon className="w-8 h-8" />
    </a>
);


// --- MAIN APP COMPONENT ---
export default function App() {
  const [language, setLanguageState] = useState<Language>('en');
  const currentContent = content[language];

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  // Fix: Corrected typo in the type name from `AppC_ontextType` to `AppContextType`.
  const contextValue: AppContextType = {
    language,
    setLanguage,
    content: currentContent,
  };

  return (
    <AppContext.Provider value={contextValue}>
        <AnimatedBackground />
        <Header />
        <main>
            <HeroSection />
            <AboutSection />
            <ServicesSection />
            <PortfolioSection />
            <TestimonialsSection />
            <ContactSection />
        </main>
        <Footer />
        <FloatingWhatsApp />
    </AppContext.Provider>
  );
}
