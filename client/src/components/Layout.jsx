import React, { useState } from 'react';
import Navbar from './Navbar';
import DonateModal from './DonateModal';
import FloatingDock from './FloatingDock';

const Layout = ({ children }) => {
    const [isModalOpen, setModalOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Global Navbar */}
            <Navbar onDonateClick={() => setModalOpen(true)} />

            {/* 
                Standardized Spacer 
                Matches the fixed Navbar height (80px) 
            */}
            <div className="h-[80px] w-full shrink-0" />

            {/* Main Content Area */}
            <main className="flex-grow relative">
                {children}
            </main>

            {/* Floating Social Media Dock */}
            <FloatingDock />

            {/* Global Donate Modal */}
            <DonateModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
        </div>
    );
};

export default Layout;
