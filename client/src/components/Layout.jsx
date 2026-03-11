import React, { useState } from 'react';
import Navbar from './Navbar';
import DonateModal from './DonateModal';
import FloatingDock from './FloatingDock';

const Layout = ({ children }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Global Navbar */}
            <Navbar
                onDonateClick={() => setModalOpen(true)}
                mobileMenuOpen={isMobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
            />

            {/* 
                Standardized Spacer 
                Matches the fixed Navbar height (80px) 
            */}
            <div className="h-[80px] w-full shrink-0" />

            {/* Main Content Area - Added bottom padding for mobile to prevent FloatingDock overlap */}
            <main className="flex-grow relative pb-[112px] sm:pb-0">
                {children}
            </main>

            {/* Floating Social Media Dock */}
            <FloatingDock hide={isModalOpen || isMobileMenuOpen} />

            {/* Global Donate Modal */}
            <DonateModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
        </div>
    );
};

export default Layout;
