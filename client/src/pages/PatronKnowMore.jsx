import { motion } from 'framer-motion';

const PatronKnowMore = () => {
    return (
        <div className="min-h-screen bg-emerald-700/95 py-24 px-4">
            <div className="max-w-4xl mx-auto space-y-16">
                <div>
                    <h1 className="text-4xl font-merriweather font-black text-white mb-8">Who is a Patron?</h1>
                    <p className="text-white/90 leading-relaxed font-bold">A Patron is an individual who supports the organization through a monthly contribution of ₹500 or more and participates in an advisory capacity within a chosen wing of the organization. Patrons play a guidance and mentorship role, helping strengthen initiatives through experience, insight, and leadership — without being involved in daily administration.</p>
                </div>

                <div className="h-px bg-white/20" />

                <div>
                    <h2 className="text-4xl font-merriweather font-black text-white mb-8">What does a Patron do?</h2>
                    <p className="text-white/80 mb-6 text-sm">As a Patron, you may:</p>
                    <ul className="text-white/90 space-y-3 font-medium text-xs leading-relaxed">
                        <li>Provide strategic guidance and suggestions for programs and initiatives.</li>
                        <li>Share professional expertise, experience, or insights when required.</li>
                        <li>Lead or mentor volunteers for specific assigned initiatives.</li>
                        <li>Coordinate with volunteers and core team members to ensure smooth execution.</li>
                        <li>Review progress and provide timely feedback or reports.</li>
                        <li>Patrons contribute through thought leadership, not operational control.</li>
                    </ul>
                </div>

                <div className="h-px bg-white/20" />

                <div>
                    <h2 className="text-4xl font-merriweather font-black text-white mb-8">What recognition does a Patron receive?</h2>
                    <ul className="text-white/90 space-y-3 font-medium text-xs leading-relaxed">
                        <li>Auto-generated Patron Certificate.</li>
                        <li>Advisory Recognition on the website (optional and consent-based).</li>
                        <li>Invitations to consultations, reviews, and planning discussions.</li>
                        <li>Respectful acknowledgment without public or administrative pressure.</li>
                    </ul>
                </div>

                <div className="h-px bg-white/20" />

                <div>
                    <h2 className="text-4xl font-merriweather font-black text-white mb-8">Important to Know</h2>
                    <ul className="text-white/90 space-y-3 font-medium text-xs leading-relaxed">
                        <li>Patrons do not handle daily administration.</li>
                        <li>Patrons hold no legal or financial liability in operations.</li>
                        <li>Patrons are not expected to interfere unless specifically assigned a role.</li>
                        <li>The advisory role is non-executive and non-operational.</li>
                    </ul>
                </div>

                <div className="h-px bg-white/20" />

                <div className="space-y-10">
                    <h2 className="text-3xl font-merriweather font-black text-yellow-400">Is this Role right for you?</h2>
                    <div className="space-y-4">
                        <p className="text-white font-bold">This role is ideal if you:</p>
                        <ul className="text-white/90 space-y-3 font-medium text-xs leading-relaxed">
                            <li>Want to support social work through guidance and leadership.</li>
                            <li>Prefer contributing experience rather than daily fieldwork.</li>
                            <li>Value structured, ethical, and impact-driven involvement.</li>
                        </ul>
                    </div>
                </div>

                <div className="flex justify-end pt-12 pb-20">
                    <button
                        onClick={() => window.history.back()}
                        className="bg-orange-500 text-white font-black px-12 py-4 rounded-full shadow-2xl hover:bg-orange-600 transition-all text-sm"
                    >
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PatronKnowMore;
