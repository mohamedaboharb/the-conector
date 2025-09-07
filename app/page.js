"use client";
import React, { useState, useEffect, useRef } from 'react';

// --- HELPER COMPONENTS ---

// Icon component for better semantics
const Icon = ({ path, className = "w-6 h-6", children, fill = "none", stroke = "currentColor", strokeWidth = 1.5 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill={fill} viewBox="0 0 24 24" strokeWidth={strokeWidth} stroke={stroke} className={className}>
        {path && <path strokeLinecap="round" strokeLinejoin="round" d={path} />}
        {children}
    </svg>
);

// --- MAIN UI COMPONENTS ---

const Header = ({ lang, setLang, page, setPage }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const isArabic = lang === 'ar';
    const dropdownRef = useRef(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if the click is outside the referenced dropdown area
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const navLinks = {
        en: [
            { name: "Home", page: "home", id: "home" },
            {
                name: "Services",
                type: "dropdown",
                id: "services",
                links: [
                    { name: "Software Engineering", page: "swe" },
                    { name: "Outsourcing", page: "outsourcing" }
                ]
            },
            { name: "About Us", page: "about", id: "about" }
        ],
        ar: [
            { name: "الرئيسية", page: "home", id: "home" },
            {
                name: "الخدمات",
                type: "dropdown",
                id: "services",
                links: [
                    { name: "هندسة البرمجيات", page: "swe" },
                    { name: "التوظيف الخارجي", page: "outsourcing" }
                ]
            },
            { name: "من نحن", page: "about", id: "about" }
        ]
    };

    const toggleLanguage = () => {
        setLang(currentLang => currentLang === 'en' ? 'ar' : 'en');
    };

    const handleMobileDropdown = (dropdownName) => {
        setOpenDropdown(prev => (prev === dropdownName ? null : dropdownName));
    };

    return (
        <header dir={isArabic ? 'rtl' : 'ltr'} className="bg-[#2C4257] sticky top-0 z-50 shadow-md">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer" onClick={() => setPage('home')}>
                    <img src="/logo.jpg" alt="The Connector Logo" width="50" height="50" />
                    <div className="flex flex-col items-start leading-tight">
                        <span className="text-sm font-bold text-white tracking-wider" style={{ fontFamily: 'Cairo, sans-serif' }}>THE</span>
                        <span className="text-sm font-bold text-white tracking-wider" style={{ fontFamily: 'Cairo, sans-serif' }}>CONNECTOR</span>
                        <span className="text-[10px] text-gray-300 tracking-[0.1em]" style={{ fontFamily: 'Cairo, sans-serif' }}>CONSULTANCY</span>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex flex-grow items-center justify-center gap-x-8">
                    {navLinks[lang].map(link => (
                        <div
                            key={link.id}
                            className="relative group"
                            ref={link.id === 'services' ? dropdownRef : null}
                        >
                            <button onClick={() => {
                                if (link.type === 'dropdown') {
                                    setOpenDropdown(prev => prev === link.id ? null : link.id);
                                } else {
                                    if (link.page) setPage(link.page);
                                    setOpenDropdown(null);
                                }
                            }} className="text-gray-300 hover:text-white transition-colors duration-300 py-2 flex items-center" style={{ fontFamily: 'Cairo, sans-serif' }}>
                                {link.name}
                                {link.type === 'dropdown' && <Icon path={openDropdown === link.id ? "M4.5 15.75l7.5-7.5 7.5 7.5" : "M19.5 8.25l-7.5 7.5-7.5-7.5"} className="w-4 h-4 ml-2 rtl:mr-2 transition-transform duration-300" />}
                            </button>
                            <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#E2E6E7] transition-transform duration-300 transform ${page === link.page || openDropdown === link.id || ((page === 'swe' || page === 'outsourcing') && link.id === 'services') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                            
                            {link.type === 'dropdown' && openDropdown === link.id && (
                                <div className={`absolute mt-2 w-56 bg-[#2C4257] rounded-md shadow-lg z-20 overflow-hidden ${isArabic ? 'right-0' : 'left-0'}`}>
                                    {link.links.map((subLink, index) => (
                                        <button
                                            key={subLink.name}
                                            onClick={() => { setPage(subLink.page); setOpenDropdown(null); }}
                                            className={`w-full block px-4 py-3 text-sm text-gray-300 hover:bg-[#38536e] transition-colors duration-200 ${isArabic ? 'text-right' : 'text-left'} ${index > 0 ? 'border-t border-gray-600' : ''}`}
                                        >
                                            {subLink.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    <button onClick={toggleLanguage} className="text-gray-300 hover:text-white font-semibold transition-all duration-300" style={{ fontFamily: 'Cairo, sans-serif' }}>
                        {isArabic ? 'English' : 'العربية'}
                    </button>
                </nav>

                <div className="hidden lg:flex items-center gap-x-4">
                    <button onClick={() => { setPage('login'); setOpenDropdown(null); }} className="animated-login-button">
                        <span>{isArabic ? 'تسجيل الدخول' : 'Login'}</span>
                    </button>
                    <button onClick={() => { setPage('contact'); setOpenDropdown(null); }} className="bg-[#E2E6E7] text-[#2C4257] px-5 py-2 rounded-full font-bold hover:bg-opacity-80 transition-all duration-300" style={{ fontFamily: 'Cairo, sans-serif' }}>
                        {isArabic ? 'تواصل معنا' : 'Contact Us'}
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button className="lg:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <Icon path={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div dir={isArabic ? 'rtl' : 'ltr'} className="lg:hidden bg-[#2C4257] py-4 px-6 shadow-lg absolute top-full left-0 w-full border-t border-gray-600">
                    <nav className="flex flex-col space-y-2">
                        {navLinks[lang].map(link => (
                            link.type === 'dropdown' ? (
                                <div key={link.name}>
                                    <button onClick={() => handleMobileDropdown(link.id)} className={`w-full text-gray-300 hover:text-white flex justify-between items-center py-2 ${isArabic ? 'text-right' : 'text-left'}`}>
                                        <span>{link.name}</span>
                                        <Icon path="M19.5 8.25l-7.5 7.5-7.5-7.5" className={`w-4 h-4 transition-transform ${openDropdown === link.id ? 'rotate-180' : ''}`}/>
                                    </button>
                                    {openDropdown === link.id && (
                                        <div className={`pl-4 rtl:pr-4 border-l-2 rtl:border-r-2 rtl:border-l-0 border-gray-500 ml-2 rtl:mr-2`}>
                                            {link.links.map(subLink => (
                                                <button key={subLink.name} onClick={() => { setPage(subLink.page); setIsMenuOpen(false); setOpenDropdown(null); }} className={`block w-full py-2 text-gray-400 hover:text-white ${isArabic ? 'text-right' : 'text-left'}`}>
                                                    {subLink.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button key={link.name} onClick={() => { setPage(link.page); setIsMenuOpen(false); }} className={`text-gray-300 hover:text-white transition-colors duration-300 py-2 ${isArabic ? 'text-right' : 'text-left'}`} style={{ fontFamily: 'Cairo, sans-serif' }}>
                                    {link.name}
                                </button>
                            )
                        ))}
                        <button onClick={() => {setPage('login'); setIsMenuOpen(false);}} className={`text-gray-300 hover:text-white font-bold transition-all duration-300 py-2 ${isArabic ? 'text-right' : 'text-left'}`} style={{ fontFamily: 'Cairo, sans-serif' }}>
                            {isArabic ? 'تسجيل الدخول' : 'Login'}
                        </button>
                        <button onClick={() => {setPage('contact'); setIsMenuOpen(false);}} className="bg-[#E2E6E7] text-[#2C4257] px-5 py-2 rounded-full font-bold hover:bg-opacity-80 transition-all duration-300 mt-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
                            {isArabic ? 'تواصل معنا' : 'Contact Us'}
                        </button>
                        <button onClick={toggleLanguage} className={`text-gray-300 hover:text-white font-semibold transition-all duration-300 py-2 mt-2 ${isArabic ? 'text-right' : 'text-left'}`} style={{ fontFamily: 'Cairo, sans-serif' }}>
                            {isArabic ? 'English' : 'العربية'}
                        </button>
                    </nav>
                </div>
            )}
        </header>
    );
};

const Footer = ({ lang, setPage }) => {
    const isArabic = lang === 'ar';
    const content = {
        en: { 
            rights: "All rights reserved.",
            getInTouch: "Get In Touch",
            mainOffice: "Main Office",
            locations: "UAE - KSA - BHR - EGY",
            emailAddress: "Email Address",
            email: "connect@the-connector.co",
            phone: "Phone Number",
            phoneNumber: "+201234567890",
            usefulLinks: "Useful Links",
            swe: "Software Engineering",
            outsourcing: "Outsourcing",
            bookMeeting: "Book a Meeting",
        },
        ar: { 
            rights: "كل الحقوق محفوظة.",
            getInTouch: "تواصل معنا",
            mainOffice: "المكتب الرئيسي",
            locations: "الإمارات - السعودية - البحرين - مصر",
            emailAddress: "البريد الإلكتروني",
            email: "connect@the-connector.co",
            phone: "رقم الهاتف",
            phoneNumber: "+201234567890",
            usefulLinks: "روابط مفيدة",
            swe: "هندسة البرمجيات",
            outsourcing: "التوظيف الخارجي",
            bookMeeting: "احجز اجتماعًا",
        },
    };

    const socialLinks = [
      { name: "Facebook", href: "#", iconPath: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
      { name: "X", href: "#", iconPath: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.244 2.25zM16.033 19.427h1.868L6.026 4.303H4.062l11.971 15.124z" },
      { name: "Instagram", href: "#", iconPath: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" },
      { name: "Snapchat", href: "#", iconPath: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069s-3.584-.012-4.85-.07c-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85C2.253 3.854 3.774 2.31 6.99 2.163 8.255 2.105 8.635 2.093 12 2.093m0-2.093c-3.53 0-3.953.014-5.338.077-4.529.205-7.75 3.43-7.954 7.954C.014 9.47 0 9.892 0 12.427s.014 2.957.077 4.342c.205 4.529 3.43 7.75 7.954 7.954 1.385.063 1.808.077 5.338.077s3.953-.014 5.338-.077c4.529-.205 7.75-3.43 7.954-7.954.063-1.385.077-1.808.077-4.342s-.014-2.957-.077-4.342c-.205-4.529-3.43-7.75-7.954-7.954C15.953.014 15.53 0 12 0zm0 5.923a6.504 6.504 0 100 13.008A6.504 6.504 0 0012 5.923zm0 10.66a4.157 4.157 0 110-8.314 4.157 4.157 0 010 8.314z" },
    ];


    return (
        <footer dir={isArabic ? 'rtl' : 'ltr'} className="bg-[#2C4257] text-white" style={{ fontFamily: 'Cairo, sans-serif' }}>
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo and Social */}
                    <div className="md:col-span-1">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <img src="/logo.jpg" alt="The Connector Logo" width="50" height="50" />
                            <div className="flex flex-col items-start leading-tight">
                                <span className="text-sm font-bold text-white tracking-wider">THE</span>
                                <span className="text-sm font-bold text-white tracking-wider">CONNECTOR</span>
                                <span className="text-[10px] text-gray-300 tracking-[0.1em]">CONSULTANCY</span>
                            </div>
                        </div>
                         <div className="flex space-x-4 rtl:space-x-reverse mt-6">
                            {socialLinks.map(link => (
                                <a key={link.name} href={link.href} className="hover:text-[#E2E6E7] transition-colors">
                                    <Icon path={link.iconPath} className="w-6 h-6" fill="currentColor" stroke="none" strokeWidth={0}/>
                                </a>
                            ))}
                        </div>
                    </div>
                    {/* Useful Links */}
                    <div className="md:col-span-2">
                        <h3 className="font-bold text-lg mb-4">{content[lang].usefulLinks}</h3>
                        <ul className="space-y-2">
                            <li><button onClick={() => setPage('swe')} className="hover:text-[#E2E6E7] transition-colors">{content[lang].swe}</button></li>
                            <li><button onClick={() => setPage('outsourcing')} className="hover:text-[#E2E6E7] transition-colors">{content[lang].outsourcing}</button></li>
                             <li><button onClick={() => setPage('contact')} className="hover:text-[#E2E6E7] transition-colors">{content[lang].bookMeeting}</button></li>
                        </ul>
                    </div>
                    {/* Get in Touch */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">{content[lang].getInTouch}</h3>
                        <div className="text-gray-300 space-y-3">
                            <p className="font-semibold">{content[lang].mainOffice}</p>
                            <p>{content[lang].locations}</p>
                            <p className="font-semibold mt-2">{content[lang].emailAddress}</p>
                            <p>{content[lang].email}</p>
                            <p className="font-semibold mt-2">{content[lang].phone}</p>
                            <p>{content[lang].phoneNumber}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} The Connector. {content[lang].rights}
                </div>
            </div>
        </footer>
    );
};


// --- PAGE COMPONENTS ---

const HomePage = ({ lang, setPage }) => {
    const isArabic = lang === 'ar';
    const servicesSectionRef = useRef(null);
    const [areServicesVisible, setAreServicesVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setAreServicesVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.2 }
        );

        if (servicesSectionRef.current) {
            observer.observe(servicesSectionRef.current);
        }

        return () => {
            if (servicesSectionRef.current) {
                observer.unobserve(servicesSectionRef.current);
            }
        };
    }, []);

    const content = {
        en: {
            heroTitle: "Connecting Global Talent with Groundbreaking Opportunities",
            heroSubtitle: "We are the bridge between ambitious companies and elite software engineers & outsourced professionals. Discover our world-class services.",
            sweButton: "Explore Software Engineering",
            outsourcingButton: "Discover Outsourcing",
            clientsTitle: "Trusted by Industry Leaders",
            servicesTitle: "Our Core Services",
            sweServiceTitle: "Software Engineering",
            sweServiceDesc: "Building robust, scalable, and innovative digital solutions. From web applications to complex enterprise systems, we deliver excellence.",
            outsourcingServiceTitle: "Outsourcing & Staff Augmentation",
            outsourcingServiceDesc: "Providing top-tier, vetted professionals to seamlessly integrate into your team, boosting productivity and driving growth.",
        },
        ar: {
            heroTitle: "ربط المواهب العالمية بالفرص الرائدة",
            heroSubtitle: "نحن الجسر بين الشركات الطموحة ونخبة مهندسي البرمجيات والمحترفين. اكتشف خدماتنا عالمية المستوى.",
            sweButton: "استكشف هندسة البرمجيات",
            outsourcingButton: "اكتشف التوظيف الخارجي",
            clientsTitle: "موثوق بنا من قبل رواد الصناعة",
            servicesTitle: "خدماتنا الأساسية",
            sweServiceTitle: "هندسة البرمجيات",
            sweServiceDesc: "بناء حلول رقمية قوية وقابلة للتطوير ومبتكرة. من تطبيقات الويب إلى أنظمة الشركات المعقدة ، نقدم التميز.",
            outsourcingServiceTitle: "التوظيف الخارجي ودعم الفرق",
            outsourcingServiceDesc: "توفير محترفين من الطراز الأول للانضمام بسلاسة إلى فريقك ، مما يعزز الإنتاجية ويدفع النمو.",
        },
    };
    
    const clientLogos = [
        { name: "Venttat", img: "/vent.png" },
        { name: "Dallal Personal Website", img: "/dal.png" },
        { name: "Amoramor", img: "/amor.png" },
        {name: "PodEvents",  img: "/por.png" },
        { name: "Mukamil", img: "/mukamil.png" },
        { name: "PodMedia Network", img: "/pod.png" },
        { name: "Scitecs", img: "/sc.png" },
        { name: "D & Partners", img: "/dp.png" },
    ];


    return (
        <div style={{ fontFamily: 'Cairo, sans-serif' }}>
            {/* Hero Section with Video */}
            <section className="relative h-screen flex items-center justify-center text-white overflow-hidden bg-black">
                <video 
                    src="/swee.mp4" 
                    autoPlay 
                    loop 
                    muted 
                    className="absolute z-0 w-auto min-w-full min-h-full max-w-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                ></video>
                <div className="absolute inset-0 bg-black/50 z-10"></div>
                {/* This div creates the smaller, more subtle fading effect */}
                <div className="absolute bottom-0 left-0 right-0 h-1/7 bg-gradient-to-t from-white to-transparent z-10"></div>

                <div dir={isArabic ? 'rtl' : 'ltr'} className="relative z-20 container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                        {content[lang].heroTitle}
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
                        {content[lang].heroSubtitle}
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                        <button onClick={() => setPage('swe')} className="bg-white text-[#2C4257] font-bold py-3 px-8 rounded-full text-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 shadow-lg">
                            {content[lang].sweButton}
                        </button>
                        <button onClick={() => setPage('outsourcing')} className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-white hover:text-[#2C4257] transition-all duration-300 shadow-lg">
                            {content[lang].outsourcingButton}
                        </button>
                    </div>
                </div>
            </section>
            
            {/* Clients Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-10">{content[lang].clientsTitle}</h2>
                    <div className="flex flex-wrap justify-center items-center gap-x-8 md:gap-x-12 gap-y-4">
                        {clientLogos.map((logo, index) => (
                            <div key={index} className="group">
                                <img 
                                    src={logo.img} 
                                    alt={logo.name} 
                                    className="h-10 md:h-12 object-contain grayscale group-hover:grayscale-0 transition-all duration-300" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section ref={servicesSectionRef} dir={isArabic ? 'rtl' : 'ltr'} className="bg-[#f7f9fa] py-20 overflow-x-hidden">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center text-[#2C4257] mb-12">{content[lang].servicesTitle}</h2>
                    <div className="grid md:grid-cols-2 gap-10">
                        {/* SWE Service */}
                        <div className={`corner-container bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-700 ease-out transform hover:-translate-y-2 ${areServicesVisible ? 'translate-x-0 opacity-100' : isArabic ? 'translate-x-full opacity-0' : '-translate-x-full opacity-0'}`}>
                            <div className="flex items-center space-x-4 rtl:space-x-reverse mb-4">
                                <div className="bg-[#E2E6E7] p-3 rounded-full"><Icon path="M6.75 7.5h10.5M6.75 12h10.5m-10.5 4.5h10.5" className="w-8 h-8 text-[#2C4257]" /></div>
                                <h3 className="text-2xl font-bold text-gray-800">{content[lang].sweServiceTitle}</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed">{content[lang].sweServiceDesc}</p>
                        </div>
                        {/* Outsourcing Service */}
                        <div className={`corner-container bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-700 ease-out transform hover:-translate-y-2 ${areServicesVisible ? 'translate-x-0 opacity-100' : isArabic ? '-translate-x-full opacity-0' : 'translate-x-full opacity-0'}`}>
                            <div className="flex items-center space-x-4 rtl:space-x-reverse mb-4">
                               <div className="bg-[#E2E6E7] p-3 rounded-full"><Icon path="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.223c.623.234 1.28.386 1.98.465A9.093 9.093 0 0012 3c-3.39 0-6.285 2.106-7.5 5.039a9.04 9.04 0 002.482 6.062M12 6v6h4.5" className="w-8 h-8 text-[#2C4257]" /></div>
                                <h3 className="text-2xl font-bold text-gray-800">{content[lang].outsourcingServiceTitle}</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed">{content[lang].outsourcingServiceDesc}</p>
                        </div>
                    </div>
                </div>
            </section>

            <DevelopmentLifecycleSection lang={lang} />

            <MobileAppServicesSection lang={lang} setPage={setPage} />

        </div>
    );
};

const DevelopmentLifecycleSection = ({ lang }) => {
    const isArabic = lang === 'ar';

    const content = {
        en: {
            title: "Our Development Lifecycle",
            subtitle: "From a great idea to a stunning live website.",
            steps: [
                { name: "Planning", img: "/planing.jpg" },
                { name: "Designing", img: "/desining.jpg" },
                { name: "Developing", img: "/developing.jpg" },
                { name: "Testing", img: "/testing.jpg" },
                { name: "Deployment", img: "/deployment.png" },
            ]
        },
        ar: {
            title: "دورة حياة التطوير لدينا",
            subtitle: "من فكرة رائعة إلى موقع ويب مذهل.",
            steps: [
                { name: "التخطيط", img: "/planing.jpg" },
                { name: "التصميم", img: "/desining.jpg" },
                { name: "التطوير", img: "/developing.jpg" },
                { name: "الاختبار", img: "/testing.jpg" },
                { name: "النشر", img: "/deployment.png" },
            ]
        }
    };

    return (
        <section className="bg-white py-20">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold text-[#2C4257]">{content[lang].title}</h2>
                <p className="mt-2 text-lg text-gray-600">{content[lang].subtitle}</p>
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                    {content[lang].steps.map((step, index) => (
                        <div key={index} className="group flex flex-col items-center">
                            <div className="relative w-40 h-40">
                                <img src={step.img} alt={step.name} className="w-full h-full object-cover rounded-full shadow-lg" />
                                <div className="absolute inset-0 bg-[#2C4257] rounded-full opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <h3 className="text-white text-xl font-bold transition-transform duration-300 group-hover:scale-110">{step.name}</h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const MobileAppServicesSection = ({ lang, setPage }) => {
    const isArabic = lang === 'ar';
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    const content = {
        en: {
            mainTitle: "Expand Your Reach",
            services: [
                {
                    title: "Mobile App Development",
                    description: "From iOS to Android, we build native and cross-platform apps that deliver seamless user experiences.",
                    buttonText: "Discover More",
                    img: "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1974&auto=format&fit=crop"
                },
                {
                    title: "Mobile UI/UX Design",
                    description: "We design intuitive and beautiful mobile interfaces that captivate users and drive engagement.",
                    buttonText: "See Our Designs",
                    img: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=2070&auto=format&fit=crop"
                }
            ]
        },
        ar: {
            mainTitle: "وسع نطاق وصولك",
            services: [
                {
                    title: "تطوير تطبيقات الموبايل",
                    description: "من iOS إلى Android ، نقوم ببناء تطبيقات أصلية ومتعددة المنصات تقدم تجارب مستخدم سلسة.",
                    buttonText: "اكتشف المزيد",
                    img: "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1974&auto=format&fit=crop"
                },
                {
                    title: "تصميم واجهة وتجربة المستخدم",
                    description: "نحن نصمم واجهات محمولة سهلة الاستخدام وجميلة تأسر المستخدمين وتحفز المشاركة.",
                    buttonText: "شاهد تصميماتنا",
                    img: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=2070&auto=format&fit=crop"
                }
            ]
        }
    };

    return (
        <section ref={sectionRef} dir={isArabic ? 'rtl' : 'ltr'} className="bg-[#f7f9fa] py-20 overflow-x-hidden">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold text-[#2C4257] mb-12">{content[lang].mainTitle}</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    {content[lang].services.map((service, index) => (
                        <div
                            key={index}
                            onClick={() => setPage('swe')}
                            className={`corner-container bg-white p-8 rounded-xl shadow-lg w-full cursor-pointer transition-all duration-700 ease-out transform hover:-translate-y-2 ${
                                isVisible 
                                ? 'translate-x-0 opacity-100' 
                                : index === 0 
                                    ? (isArabic ? 'translate-x-full opacity-0' : '-translate-x-full opacity-0') 
                                    : (isArabic ? '-translate-x-full opacity-0' : 'translate-x-full opacity-0')
                            }`}
                        >
                            <div className="h-64 w-full flex items-center justify-center mb-6 overflow-hidden rounded-lg">
                                 <img 
                                    src={service.img} 
                                    alt={service.title} 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">{service.title}</h3>
                            <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p>
                            <button className="bg-[#2C4257] text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all duration-300">
                                {service.buttonText}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const SpecializedServices = ({ lang, setPage }) => {
    const isArabic = lang === 'ar';
    const content = {
        en: {
            title: "Advanced Solutions",
            services: [
                {
                    name: "Machine Learning & AI",
                    description: "Leverage the power of artificial intelligence to build smart applications that automate processes, provide predictive insights, and create personalized user experiences.",
                    img: "/machine.png",
                    buttonText: "Discover More",
                },
                {
                    name: "Cyber Security",
                    description: "Protect your digital assets with our comprehensive security services, including vulnerability assessments, penetration testing, and robust defense strategies.",
                    img: "/cyber.jpg",
                    buttonText: "Discover More",
                }
            ]
        },
        ar: {
            title: "حلول متقدمة",
            services: [
                {
                    name: "تعلم الآلة والذكاء الاصطناعي",
                    description: "استفد من قوة الذكاء الاصطناعي لبناء تطبيقات ذكية تعمل على أتمتة العمليات وتقديم رؤى تنبؤية وإنشاء تجارب مستخدم مخصصة.",
                    img: "/machine.png",
                    buttonText: "اكتشف المزيد",
                },
                {
                    name: "الأمن السيبراني",
                    description: "قم بحماية أصولك الرقمية من خلال خدماتنا الأمنية الشاملة، بما في ذلك تقييمات الثغرات الأمنية واختبار الاختراق واستراتيجيات الدفاع القوية.",
                    img: "/cyber.jpg",
                    buttonText: "اكتشف المزيد",
                }
            ]
        }
    };

    return (
        <section dir={isArabic ? 'rtl' : 'ltr'} className="bg-[#f7f9fa] py-20">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold text-[#2C4257] mb-12">{content[lang].title}</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    {content[lang].services.map((service, index) => (
                        <div
                            key={index}
                            className="bg-white p-8 rounded-xl shadow-lg w-full transition-all duration-300 transform hover:-translate-y-2 text-center"
                        >
                            <div className="h-64 w-full flex items-center justify-center mb-6 overflow-hidden rounded-lg">
                                 <img 
                                    src={service.img} 
                                    alt={service.name} 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">{service.name}</h3>
                            <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p>
                            <button className="bg-[#2C4257] text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all duration-300">
                                {service.buttonText}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};


const SWEPage = ({ lang, setPage }) => {
    const isArabic = lang === 'ar';
    const content = {
        en: {
            title: "Software Engineering Excellence",
            subtitle: "We craft bespoke digital experiences that are not only visually stunning but also robust, scalable, and secure. Explore our portfolio of delivered projects.",
            portfolioTitle: "Our Work",
        },
        ar: {
            title: "التميز في هندسة البرمجيات",
            subtitle: "نصنع تجارب رقمية مخصصة ليست فقط مذهلة بصريًا ولكنها أيضًا قوية وقابلة للتطوير وآمنة. استكشف مجموعة مشاريعنا المنجزة.",
            portfolioTitle: "أعمالنا",
        }
    };

    const portfolio = [
        { name: "Venttat", link: "https://venttat.sa/en", img: "/vent.png" },
        { name: "Amoramor", link: "https://amoramor.sa/en", img: "/amor.png" },
        { name: "Mukamil", link: "https://www.mukamilagency.com/en", img: "/mukamil.png" },
        { name: "PodMedia Network", link: "https://podmedia.network/", img: "/pod.png" },
        { name: "PodEvents", link: "https://podevents.network/", img: "/por.png" },
        { name: "Dallal Personal Website", link: "https://www.mohamedeldallal.me/", img: "/dal.png" },
        { name: "D & Partners", link: "https://dandpartners.co/en", img: "/dp.png" },
        { name: "Scitecs", link: "https://scitecs.com/", img: "/sc.png" },
    ];

    return (
        <div style={{ fontFamily: 'Cairo, sans-serif' }} dir={isArabic ? 'rtl' : 'ltr'} className="bg-white">
            <section className="bg-[#E2E6E7] py-20">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#2C4257]">{content[lang].title}</h1>
                    <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">{content[lang].subtitle}</p>
                </div>
            </section>

            <SpecializedServices lang={lang} setPage={setPage} />

            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center text-[#2C4257] mb-12">{content[lang].portfolioTitle}</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {portfolio.map((item, index) => (
                           <a 
                                key={index} 
                                href={item.link} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="group flex flex-col items-center justify-start p-6 bg-white rounded-lg hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="h-40 w-full flex items-center justify-center mb-4">
                                     <img 
                                        src={item.img} 
                                        alt={item.name} 
                                        className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-110" 
                                    />
                                </div>
                                <p className="font-bold text-lg text-center text-[#2C4257]">
                                    {item.name}
                                </p>
                            </a>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

const OutsourcingPage = ({ lang }) => {
    const isArabic = lang === 'ar';
    const content = {
        en: {
            title: "Global Outsourcing & Staff Augmentation",
            subtitle: "Unlock cost-efficiency, access specialized skills, and increase your team's flexibility. We connect you with elite talent from Egypt, a growing hub for global clients.",
            whyAugmentationTitle: "Why Staff Augmentation?",
            whyEgyptTitle: "The Egypt Advantage",
            servicesTitle: "Our Outsourcing Services",
            howItWorksTitle: "Our Streamlined Process",
            benefitsTitle: "Employee Benefits & Work Environment",
            pricingTitle: "Transparent Pricing Models",
        },
        ar: {
            title: "التوظيف الخارجي العالمي ودعم الفرق",
            subtitle: "حقق كفاءة التكلفة، واحصل على المهارات المتخصصة، وزد من مرونة فريقك. نوصلك بأفضل المواهب من مصر، المركز المتنامي للعملاء العالميين.",
            whyAugmentationTitle: "لماذا دعم الفرق؟",
            whyEgyptTitle: "ميزة العمل من مصر",
            servicesTitle: "خدمات التوظيف الخارجي لدينا",
            howItWorksTitle: "عمليتنا المبسطة",
            benefitsTitle: "مزايا الموظفين وبيئة العمل",
            pricingTitle: "نماذج تسعير شفافة",

        }
    };

    const augmentationBenefits = {
        en: [
            { title: "Cost Efficiency", text: "Reduce overhead costs associated with full-time hires. Pay only for the skills you need, when you need them.", icon: "M21 12a9 9 0 11-18 0 9 9 0 0118 0zM10 12a2 2 0 114 0 2 2 0 01-4 0z" },
            { title: "Access to Specialized Skills", text: "Instantly bring in experts with skills your current team may lack for high-quality project delivery.", icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75a17.933 17.933 0 01-7.499-1.632z" },
            { title: "Increase Flexibility", text: "Scale your team up or down based on project requirements without the commitment of permanent hires.", icon: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1.5-1.5m1.5 1.5l1.5-1.5m0 0l1.5 1.5m-1.5-1.5l-1.5 1.5" },
            { title: "Fast Hiring", text: "Bypass lengthy hiring and onboarding processes. Our talent is vetted and ready to integrate seamlessly.", icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" }
        ],
        ar: [
            { title: "كفاءة التكلفة", text: "قلل التكاليف العامة المرتبطة بالتعيينات بدوام كامل. ادفع فقط مقابل المهارات التي تحتاجها، عند الحاجة إليها.", icon: "M21 12a9 9 0 11-18 0 9 9 0 0118 0zM10 12a2 2 0 114 0 2 2 0 01-4 0z" },
            { title: "الوصول إلى المهارات المتخصصة", text: "استقطب على الفور خبراء بمهارات قد يفتقر إليها فريقك الحالي لتقديم مشاريع عالية الجودة.", icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75a17.933 17.933 0 01-7.499-1.632z" },
            { title: "زيادة المرونة", text: "قم بتوسيع فريقك أو تقليصه بناءً على متطلبات المشروع دون الالتزام بتعيينات دائمة.", icon: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1.5-1.5m1.5 1.5l1.5-1.5m0 0l1.5 1.5m-1.5-1.5l-1.5 1.5" },
            { title: "توظيف سريع", text: "تجاوز عمليات التوظيف والتأهيل الطويلة. مواهبنا مفحوصة وجاهزة للاندماج بسلاسة.", icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" }
        ]
    }
    
    return (
        <div style={{ fontFamily: 'Cairo, sans-serif' }} dir={isArabic ? 'rtl' : 'ltr'} className="bg-white">
            <section className="bg-[#2C4257] text-white py-20">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold">{content[lang].title}</h1>
                    <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">{content[lang].subtitle}</p>
                </div>
            </section>
            
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-[#2C4257] mb-12">{content[lang].whyAugmentationTitle}</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {augmentationBenefits[lang].map(benefit => (
                            <div key={benefit.title} className="corner-container bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                                <Icon path={benefit.icon} className="w-10 h-10 text-[#2C4257] mb-4" />
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{benefit.title}</h3>
                                <p className="text-gray-600">{benefit.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

const ProcessSection = ({ lang }) => {
    const isArabic = lang === 'ar';

    const content = {
        en: {
            title: "Our Proven Process",
            subtitle: "From Understanding Your Needs to Seamless Integration",
            steps: [
                { name: "Discovery", img: "https://placehold.co/300x300/e2e6e7/2c4257?text=Discovery&font=cairo" },
                { name: "Sourcing", img: "https://placehold.co/300x300/e2e6e7/2c4257?text=Sourcing&font=cairo" },
                { name: "Vetting", img: "https://placehold.co/300x300/e2e6e7/2c4257?text=Vetting&font=cairo" },
                { name: "Integration", img: "https://placehold.co/300x300/e2e6e7/2c4257?text=Integration&font=cairo" },
                { name: "Support", img: "https://placehold.co/300x300/e2e6e7/2c4257?text=Support&font=cairo" },
            ]
        },
        ar: {
            title: "عمليتنا المثبتة",
            subtitle: "من فهم احتياجاتك إلى التكامل السلس",
            steps: [
                { name: "الاكتشاف", img: "https://placehold.co/300x300/e2e6e7/2c4257?text=الاكتشاف&font=cairo" },
                { name: "التوريد", img: "https://placehold.co/300x300/e2e6e7/2c4257?text=التوريد&font=cairo" },
                { name: "الفحص", img: "https://placehold.co/300x300/e2e6e7/2c4257?text=الفحص&font=cairo" },
                { name: "التكامل", img: "https://placehold.co/300x300/e2e6e7/2c4257?text=التكامل&font=cairo" },
                { name: "الدعم", img: "https://placehold.co/300x300/e2e6e7/2c4257?text=الدعم&font=cairo" },
            ]
        }
    };

    return (
        <section className="bg-white py-20">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold text-[#2C4257]">{content[lang].title}</h2>
                <p className="mt-2 text-lg text-gray-600">{content[lang].subtitle}</p>
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                    {content[lang].steps.map((step, index) => (
                        <div key={index} className="group flex flex-col items-center">
                            <div className="relative w-40 h-40">
                                <img src={step.img} alt={step.name} className="w-full h-full object-cover rounded-full shadow-lg" />
                                <div className="absolute inset-0 bg-[#2C4257] rounded-full opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <h3 className="text-white text-xl font-bold transition-transform duration-300 group-hover:scale-110">{step.name}</h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const ValuesSection = ({ lang }) => {
    const isArabic = lang === 'ar';
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

     useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );

        const currentRef = sectionRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    const getAnimationClass = (index) => {
        if (!isVisible) {
            return 'opacity-0';
        }
        let animationClass = 'opacity-100';
        // Top row
        if (index === 0) animationClass += ' translate-x-0'; // Left
        if (index === 1) animationClass += ' translate-y-0'; // Top
        if (index === 2) animationClass += ' translate-x-0'; // Right
        // Bottom row
        if (index === 3) animationClass += ' translate-x-0'; // Left
        if (index === 4) animationClass += ' translate-y-0'; // Bottom
        if (index === 5) animationClass += ' translate-x-0'; // Right
        return animationClass;
    };

     const getInitialPositionClass = (index) => {
        if (isVisible) return '';
        // Top row
        if (index === 0) return '-translate-x-full'; // Left
        if (index === 1) return '-translate-y-full'; // Top
        if (index === 2) return 'translate-x-full'; // Right
        // Bottom row
        if (index === 3) return '-translate-x-full'; // Left
        if (index === 4) return 'translate-y-full'; // Bottom
        if (index === 5) return 'translate-x-full'; // Right
        return '';
    };


    const content = {
        en: {
            title: "Our Core Values",
            values: [
                { name: "Excellence", description: "Delivering the highest quality solutions and services to ensure client success and satisfaction.", iconPath: "M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354l-4.73 2.879c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" },
                { name: "Integrity", description: "Operating with transparency, honesty, and strong ethical principles in all our engagements.", iconPath: "M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.036.243c-2.132 0-4.147-.836-5.657-2.343m-2.62-10.726c-1.01.143-2.01.317-3 .52m3-.52l-2.62 10.726C8.122 15.228 7.894 14.7 7.41 14.526a5.988 5.988 0 00-2.036.243c-2.132 0-4.147-.836-5.657-2.343" },
                { name: "Innovation", description: "Continuously exploring new technologies and ideas to deliver cutting-edge solutions.", iconPath: "M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311V21m-3.75 0h.008v.008h-.008V21zm-3.75 0h.008v.008h-.008V21m16.5-12.75a6 6 0 11-12 0 6 6 0 0112 0z" },
                { name: "Partnership", description: "Building strong, collaborative relationships with our clients to function as a true extension of their teams.", iconPath: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-2.438c.155-.158.291-.326.419-.499a9.58 9.58 0 00-4.962-5.032c-.529-.193-1.09-.326-1.664-.421a9.362 9.362 0 00-3.412-2.333c-.529-.193-1.09-.326-1.664-.421A9.337 9.337 0 004.879 9.332a9.58 9.58 0 00-4.962 5.032c.128.173.264.341.419.499a9.337 9.337 0 004.121 2.438 9.38 9.38 0 002.625.372M8.25 12.075a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0z" },
                { name: "Global Mindset", description: "Connecting businesses with elite talent from around the world, breaking down geographical barriers.", iconPath: "M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" },
                { name: "Impact", description: "Focusing on delivering tangible results that drive growth and create value for our clients' businesses.", iconPath: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" },
            ]
        },
        ar: {
            title: "قيمنا الأساسية",
            values: [
                { name: "التميز", description: "تقديم حلول وخدمات بأعلى جودة لضمان نجاح ورضا العملاء.", iconPath: "M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354l-4.73 2.879c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" },
                { name: "النزاهة", description: "العمل بشفافية وصدق ومبادئ أخلاقية قوية في جميع تعاملاتنا.", iconPath: "M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.036.243c-2.132 0-4.147-.836-5.657-2.343m-2.62-10.726c-1.01.143-2.01.317-3 .52m3-.52l-2.62 10.726C8.122 15.228 7.894 14.7 7.41 14.526a5.988 5.988 0 00-2.036.243c-2.132 0-4.147-.836-5.657-2.343" },
                { name: "الابتكار", description: "استكشاف التقنيات والأفكار الجديدة باستمرار لتقديم حلول متطورة.", iconPath: "M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311V21m-3.75 0h.008v.008h-.008V21zm-3.75 0h.008v.008h-.008V21m16.5-12.75a6 6 0 11-12 0 6 6 0 0112 0z" },
                { name: "الشراكة", description: "بناء علاقات قوية وتعاونية مع عملائنا لنعمل كامتداد حقيقي لفرقهم.", iconPath: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-2.438c.155-.158.291-.326.419-.499a9.58 9.58 0 00-4.962-5.032c-.529-.193-1.09-.326-1.664-.421a9.362 9.362 0 00-3.412-2.333c-.529-.193-1.09-.326-1.664-.421A9.337 9.337 0 004.879 9.332a9.58 9.58 0 00-4.962 5.032c.128.173.264.341.419.499a9.337 9.337 0 004.121 2.438 9.38 9.38 0 002.625.372M8.25 12.075a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0z" },
                { name: "العقلية العالمية", description: "ربط الشركات بالمواهب المتميزة من جميع أنحاء العالم، وكسر الحواجز الجغرافية.", iconPath: "M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" },
                { name: "التأثير", description: "التركيز على تحقيق نتائج ملموسة تدفع النمو وتخلق قيمة لأعمال عملائنا.", iconPath: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" },
            ]
        }
    };

    return (
        <section ref={sectionRef} dir={isArabic ? 'rtl' : 'ltr'} className="bg-white py-20 overflow-hidden">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold text-[#2C4257] mb-12">{content[lang].title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {content[lang].values.map((value, index) => (
                        <div key={value.name} className={`group flex flex-col items-center p-6 transition-all duration-300 ease-out transform hover:-translate-y-2 hover:shadow-xl rounded-lg ${getInitialPositionClass(index)} ${getAnimationClass(index)}`}>
                            <div className="p-4 bg-[#E2E6E7] rounded-full mb-4 transition-all duration-300 group-hover:bg-[#2C4257]">
                                 <Icon path={value.iconPath} className="w-10 h-10 text-[#2C4257] transition-colors duration-300 group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-[#2C4257] mb-2">{value.name}</h3>
                            <p className="text-gray-600 text-center leading-relaxed">{value.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};


const AboutPage = ({ lang }) => {
    const isArabic = lang === 'ar';
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.2 }
        );

        const currentRef = sectionRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    const content = {
        en: {
            title: "About The Connector",
            subtitle: "We are the bridge between ambition and achievement.",
            heroBody: "Discover the story behind our mission to connect the world's most ambitious companies with elite global talent. We're more than a consultancy; we're your strategic partner in growth.",
            heroImage: "/cyber.jpg",
            heroImageAlt: "A diverse team collaborating in a modern office",
            storyTitle: "Our Story",
            storyText: "Founded in 2025, The Connector was born from a simple idea: to break down geographical barriers and connect exceptional talent with the companies that need them most. We saw a world full of brilliant software engineers and professionals limited by location, and visionary companies struggling to find the right skills. We decided to be the bridge.",
            missionTitle: "Our Mission",
            missionText: "Our mission is to empower businesses to achieve their full potential by providing them with world-class, scalable, and reliable software engineering and outsourcing solutions. We are committed to fostering innovation, quality, and lasting partnerships.",
        },
        ar: {
            title: "عن The Connector",
            subtitle: "نحن الجسر بين الطموح والإنجاز.",
            heroBody: "اكتشف القصة وراء مهمتنا لربط الشركات الأكثر طموحًا في العالم مع المواهب العالمية المتميزة. نحن أكثر من مجرد شركة استشارية؛ نحن شريكك الاستراتيجي في النمو.",
            heroImage: "/cyber.jpg",
            heroImageAlt: "فريق متنوع يتعاون في مكتب حديث",
            storyTitle: "قصتنا",
            storyText: "تأسست The Connector في عام 2025، وولدت من فكرة بسيطة: كسر الحواجز الجغرافية وربط المواهب الاستثنائية بالشركات التي هي في أمس الحاجة إليها. رأينا عالماً مليئاً بمهندسي البرمجيات والمحترفين اللامعين الذين تحد من قدرتهم المواقع الجغرافية، والشركات ذات الرؤية التي تكافح للعثور على المهارات المناسبة. قررنا أن نكون الجسر.",
            missionTitle: "مهمتنا",
            missionText: "مهمتنا هي تمكين الشركات من تحقيق إمكاناتها الكاملة من خلال تزويدها بحلول هندسة البرمجيات والتوظيف الخارجي ذات المستوى العالمي والقابلة للتطوير والموثوقة. نحن ملتزمون بتعزيز الابتكار والجودة والشراكات الدائمة.",
        }
    };

    return (
        <div style={{ fontFamily: 'Cairo, sans-serif' }} dir={isArabic ? 'rtl' : 'ltr'}>
            <section ref={sectionRef} className="bg-[#E2E6E7] overflow-x-hidden">
                <div className="container mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
                    <div className={`transform transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-x-0' : (isArabic ? 'opacity-0 translate-x-full' : 'opacity-0 -translate-x-full')} ${isArabic ? 'md:order-2' : ''}`}>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight uppercase text-[#2C4257]">{content[lang].title}</h1>
                        <p className="mt-4 text-xl md:text-2xl font-bold text-gray-700">{content[lang].subtitle}</p>
                        <p className="mt-6 text-lg text-gray-600 leading-relaxed">{content[lang].heroBody}</p>
                    </div>
                    <div className={`mt-10 md:mt-0 transform transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-x-0' : (isArabic ? 'opacity-0 -translate-x-full' : 'opacity-0 translate-x-full')} ${isArabic ? 'md:order-1' : ''}`}>
                        <img 
                            src={content[lang].heroImage} 
                            alt={content[lang].heroImageAlt} 
                            className="rounded-lg shadow-2xl object-cover w-full h-full max-h-[400px]"
                        />
                    </div>
                </div>
            </section>

            <ValuesSection lang={lang} />

            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-center text-[#2C4257] mb-4">{content[lang].storyTitle}</h2>
                        <p className="text-lg text-gray-600 leading-relaxed text-center">{content[lang].storyText}</p>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-center text-[#2C4257] mb-4">{content[lang].missionTitle}</h2>
                        <p className="text-lg text-gray-600 leading-relaxed text-center">{content[lang].missionText}</p>
                    </div>
                </div>
            </section>
        </div>
    );
};


const ContactPage = ({ lang }) => {
    const isArabic = lang === 'ar';
    const [showForm, setShowForm] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);

    const content = {
        en: {
            title: "Get In Touch",
            subtitle: "Have a project in mind, want to book a meeting, or just say hello? We'd love to hear from you.",
            sendMessage: "Send Message",
            bookMeeting: "Book Meeting",
            name: "Your Name",
            email: "Your Email",
            message: "Your Message",
            selectDay: "Select a Day"
        },
        ar: {
            title: "تواصل معنا",
            subtitle: "هل لديك مشروع في ذهنك، تود حجز اجتماع، أو تريد فقط أن تقول مرحباً؟ يسعدنا أن نسمع منك.",
            sendMessage: "إرسال رسالة",
            bookMeeting: "حجز اجتماع",
            name: "اسمك",
            email: "بريدك الإلكتروني",
            message: "رسالتك",
            selectDay: "اختر يوماً"
        }
    };
    
    return (
        <div style={{ fontFamily: 'Cairo, sans-serif' }} dir={isArabic ? 'rtl' : 'ltr'}>
            <section className="bg-gray-100 py-20">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h1 className="text-5xl md:text-6xl font-bold text-[#2C4257]">{content[lang].title}</h1>
                        <p className="mt-4 text-lg text-gray-700 max-w-md">{content[lang].subtitle}</p>
                         <div className="mt-8 flex space-x-4 rtl:space-x-reverse">
                            <button 
                                onClick={() => setShowForm(true)}
                                className={`font-bold py-3 px-6 rounded-full transition-all duration-300 ${showForm ? 'bg-[#2C4257] text-white' : 'bg-transparent border-2 border-[#2C4257] text-[#2C4257]'}`}>
                                {content[lang].sendMessage}
                            </button>
                            <button 
                                onClick={() => { setShowForm(false); setSelectedDate(null); }}
                                className={`font-bold py-3 px-6 rounded-full transition-all duration-300 ${!showForm ? 'bg-[#2C4257] text-white' : 'bg-transparent border-2 border-[#2C4257] text-[#2C4257]'}`}>
                                {content[lang].bookMeeting}
                            </button>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        {showForm ? (
                             <form className="space-y-4">
                                 <div>
                                     <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">{content[lang].name}</label>
                                     <input type="text" id="name" className="shadow-inner appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#2C4257]"/>
                                 </div>
                                 <div>
                                     <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">{content[lang].email}</label>
                                     <input type="email" id="email" className="shadow-inner appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#2C4257]"/>
                                 </div>
                                 <div>
                                     <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">{content[lang].message}</label>
                                     <textarea id="message" rows="4" className="shadow-inner appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#2C4257]"></textarea>
                                 </div>
                                 <button type="submit" className="bg-[#2C4257] text-white font-bold py-3 px-6 rounded-full hover:bg-opacity-90 transition w-full">
                                     {content[lang].sendMessage}
                                 </button>
                             </form>
                        ) : (
                            <div>
                                { !selectedDate ? (
                                    <>
                                        <h3 className="text-lg font-bold text-[#2C4257] mb-4">{content[lang].selectDay}</h3>
                                        <BookingCalendar lang={lang} onDateSelect={setSelectedDate} selectedDate={selectedDate}/>
                                    </>
                                ) : (
                                    <TimeSelectionView lang={lang} selectedDate={selectedDate} onBack={() => setSelectedDate(null)}/>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

const BookingCalendar = ({ lang, onDateSelect, selectedDate: selectedDateProp }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysOfWeek = lang === 'ar' 
        ? ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
        : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const monthNames = lang === 'ar'
        ? ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"]
        : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDateClick = (day) => {
        const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const today = new Date();
        today.setHours(0,0,0,0);
        if (clickedDate >= today) {
            onDateSelect(clickedDate);
        }
    };
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const renderCalendar = () => {
        const dates = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            dates.push(<div key={`empty-${i}`} className="p-2 text-center"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected = selectedDateProp && date.toDateString() === selectedDateProp.toDateString();
            const isPast = date < new Date().setHours(0,0,0,0);

            let classes = "p-2 text-center cursor-pointer rounded-full transition-colors duration-200 flex items-center justify-center w-8 h-8 mx-auto";
            if (isPast) {
                classes += " text-gray-400 cursor-not-allowed";
            } else {
                classes += " hover:bg-gray-200";
            }
            if (isSelected) {
                classes += " bg-[#2C4257] text-white font-bold";
            } else if (isToday) {
                classes += " border border-[#2C4257]";
            }

            dates.push(
                <div key={day} className={classes} onClick={() => handleDateClick(day)}>
                    {day}
                </div>
            );
        }
        return dates;
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <button onClick={handlePrevMonth} className="text-gray-600 hover:text-black"><Icon path="M15.75 19.5L8.25 12l7.5-7.5" /></button>
                <h4 className="font-bold text-gray-800">{monthNames[month]} {year}</h4>
                <button onClick={handleNextMonth} className="text-gray-600 hover:text-black"><Icon path="M8.25 4.5l7.5 7.5-7.5 7.5" /></button>
            </div>
            <div className="grid grid-cols-7 gap-y-2 text-sm text-gray-500">
                {daysOfWeek.map(day => <div key={day} className="text-center font-bold">{day.substring(0,3)}</div>)}
                {renderCalendar()}
            </div>
        </div>
    );
};

const TimeSelectionView = ({ lang, selectedDate, onBack }) => {
    const [timezone, setTimezone] = useState('Africa/Cairo');
    const [selectedTime, setSelectedTime] = useState(null);

    const timezones = [ "Africa/Cairo", "Europe/London", "America/New_York", "UTC-05:00", "UTC+00:00", "UTC+02:00", "UTC+08:00" ];
    const availableTimes = ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00"];

    const content = {
        en: {
            selectTime: "Select a Time",
            duration: "Duration: 30 min",
            timezone: "Time zone",
        },
        ar: {
            selectTime: "اختر وقتاً",
            duration: "المدة: 30 دقيقة",
            timezone: "المنطقة الزمنية",
        }
    };

    const formattedDate = new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(selectedDate);
    
    return (
        <div>
            <div className="flex items-center mb-4">
                <button onClick={onBack} className="text-gray-600 hover:text-black mr-4">
                    <Icon path="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" className="w-5 h-5" />
                </button>
                <div>
                    <h4 className="font-bold text-gray-800">{formattedDate}</h4>
                </div>
            </div>
             <div className="mb-4">
                 <label htmlFor="timezone-select" className="block text-gray-700 text-sm font-bold mb-2">{content[lang].timezone}</label>
                 <select 
                    id="timezone-select"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="shadow-inner appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#2C4257]"
                 >
                    {timezones.map(tz => (
                        <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>
                    ))}
                 </select>
            </div>
            <hr className="my-4"/>
            <h3 className="font-bold text-[#2C4257]">{content[lang].selectTime}</h3>
            <p className="text-sm text-gray-500 mb-4">{content[lang].duration}</p>
            <div className="space-y-2">
                {availableTimes.map(time => (
                    <button 
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`w-full text-center border rounded-md py-2 transition-colors duration-200 ${selectedTime === time ? 'bg-[#2C4257] text-white border-[#2C4257]' : 'border-[#2C4257] text-[#2C4257] hover:bg-gray-200'}`}
                    >
                       {time}
                    </button>
                ))}
            </div>
        </div>
    );
};

const LoginPage = ({ lang }) => {
    const isArabic = lang === 'ar';
    const content = {
        en: {
            title: "Login to your Account",
            email: "Email Address",
            password: "Password",
            login: "Sign In",
            noAccount: "Don't have an account?",
            signUp: "Sign Up"
        },
        ar: {
            title: "تسجيل الدخول إلى حسابك",
            email: "البريد الإلكتروني",
            password: "كلمة المرور",
            login: "تسجيل الدخول",
            noAccount: "ليس لديك حساب؟",
            signUp: "انشاء حساب"
        }
    };
    return (
        <div style={{ fontFamily: 'Cairo, sans-serif' }} dir={isArabic ? 'rtl' : 'ltr'}>
             <div className="bg-gray-100 flex items-center justify-center py-24 min-h-[calc(100vh-160px)]">
                <div className="relative bg-white p-10 rounded-lg shadow-lg max-w-sm w-full overflow-hidden border-2 border-[#2C4257]/30 corner-container">
                    {/* Animated light */}
                    <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-radial-light animate-spin-slow"></div>

                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-center text-[#2C4257] mb-8">{content[lang].title}</h2>
                        <form>
                            <div className="mb-6">
                                <label htmlFor="login-email" className="block text-gray-700 text-sm font-bold mb-2">{content[lang].email}</label>
                                <input type="email" id="login-email" className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                            </div>
                            <div className="mb-6">
                                <label htmlFor="login-password" className="block text-gray-700 text-sm font-bold mb-2">{content[lang].password}</label>
                                <input type="password" id="login-password" className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                            </div>
                            <button type="submit" className="animated-login-button w-full">
                                <span>{content[lang].login}</span>
                            </button>
                            <p className="text-center text-sm text-gray-600 mt-6">
                                {content[lang].noAccount} <a href="#" className="text-[#2C4257] hover:underline font-bold">{content[lang].signUp}</a>
                            </p>
                        </form>
                    </div>
                </div>
             </div>
        </div>
    );
};


// --- MAIN APP COMPONENT ---

export default function App() {
    const [page, setPage] = useState('home');
    const [lang, setLang] = useState('en');

    useEffect(() => {
        document.documentElement.lang = lang;
        document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }, [lang]);
    
    // Add Cairo font from Google Fonts and custom animations
    useEffect(() => {
        const link = document.createElement('link');
        link.href = "https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap";
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes spin-slow {
              from { transform: translate(-50%, -50%) rotate(0deg); }
              to { transform: translate(-50%, -50%) rotate(360deg); }
            }
            .animate-spin-slow {
              animation: spin-slow 10s linear infinite;
            }
            .bg-radial-light {
              background-image: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%);
            }
            .corner-container {
                position: relative;
            }
            .corner-container::before, .corner-container::after {
                content: '';
                position: absolute;
                width: 20px;
                height: 20px;
                border-color: #2C4257;
                border-style: solid;
                transition: all 0.3s ease-in-out;
            }
            .corner-container::before {
                top: -5px;
                left: -5px;
                border-width: 3px 0 0 3px;
            }
            .corner-container::after {
                bottom: -5px;
                right: -5px;
                border-width: 0 3px 3px 0;
            }
             .corner-container:hover::before, .corner-container:hover::after {
                width: calc(100% + 10px);
                height: calc(100% + 10px);
            }
             .animated-login-button {
                position: relative;
                padding: 10px 20px;
                border: none;
                background-color: transparent; 
                color: #E2E6E7;
                font-weight: bold;
                font-family: 'Cairo', sans-serif;
                cursor: pointer;
                overflow: hidden;
                display: inline-block;
                border-radius: 5px; 
            }

            .animated-login-button span {
                position: relative;
                z-index: 2;
            }

            .animated-login-button::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 150%;
                padding-bottom: 150%;
                background: conic-gradient(transparent, rgba(226, 230, 231, 0.9), transparent 30%);
                transform-origin: center;
                transform: translate(-50%, -50%);
                animation: spin-slow 1s linear infinite;
                z-index: 1;
            }
            
            .animated-login-button::after {
                content: '';
                position: absolute;
                top: 2px;
                left: 2px;
                right: 2px;
                bottom: 2px;
                background: #2C4257;
                border-radius: 3px;
                z-index: 1;
            }
        `;
        document.head.appendChild(style);

        // Cleanup function to remove elements on unmount
        return () => {
            document.head.removeChild(link);
            document.head.removeChild(style);
        }
    }, []);

    const renderPage = () => {
        switch (page) {
            case 'swe':
                return <SWEPage lang={lang} setPage={setPage} />;
            case 'outsourcing':
                return <OutsourcingPage lang={lang} />;
            case 'about':
                return <AboutPage lang={lang} />;
            case 'contact':
                return <ContactPage lang={lang} />;
            case 'login':
                return <LoginPage lang={lang} />;
            default:
                return <HomePage lang={lang} setPage={setPage} />;
        }
    };

    return (
        <div className="bg-white min-h-screen">
            <Header lang={lang} setLang={setLang} page={page} setPage={setPage} />
            <main>
                {renderPage()}
            </main>
            <Footer lang={lang} setPage={setPage}/>
        </div>
    );
}

