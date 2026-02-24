import { motion } from 'framer-motion';

const VolunteerKnowMore = () => {
    return (
        <div className="min-h-screen bg-emerald-700/95 py-24 px-4">
            <div className="max-w-4xl mx-auto space-y-16">
                <div>
                    <h1 className="text-4xl font-merriweather font-black text-white mb-8">Who is a Volunteer?</h1>
                    <p className="text-white/90 leading-relaxed font-bold">A Volunteer is an individual who supports the organization through direct action and participation in various initiatives. Volunteers are the backbone of our groundwork, helping execute programs, organize events, and reach out to communities in need.</p>
                </div>

                <div className="h-px bg-white/20" />

                <div>
                    <h2 className="text-4xl font-merriweather font-black text-white mb-8">What does a Volunteer do?</h2>
                    <p className="text-white/80 mb-6 text-sm">As a Volunteer, you may:</p>
                    <ul className="text-white/90 space-y-3 font-medium text-xs leading-relaxed">
                        <li>Participate in on-ground activities and community outreach programs.</li>
                        <li>Assist in organizing and managing social awareness events.</li>
                        <li>Work closely with core team members to implement strategic initiatives.</li>
                        <li>Support departmental operations like legal aid, education, or healthcare wings.</li>
                        <li>Contribute time and skills to help the organization achieve its social goals.</li>
                    </ul>
                </div>

                <div className="h-px bg-white/20" />

                <div>
                    <h2 className="text-4xl font-merriweather font-black text-white mb-8">What recognition does a Volunteer receive?</h2>
                    <ul className="text-white/90 space-y-3 font-medium text-xs leading-relaxed">
                        <li>Official Volunteer Recognition Certificate.</li>
                        <li>Practical experience in social work and community leadership.</li>
                        <li>Networking opportunities with professionals and social activists.</li>
                        <li>A platform to make a tangible difference in society.</li>
                    </ul>
                </div>

                <div className="h-px bg-white/20" />

                <div>
                    <h2 className="text-4xl font-merriweather font-black text-white mb-8">Important to Know</h2>
                    <ul className="text-white/90 space-y-3 font-medium text-xs leading-relaxed">
                        <li>Volunteering is a commitment to service and social impact.</li>
                        <li>Volunteers must adhere to the organization's ethical guidelines and code of conduct.</li>
                        <li>Active participation and regular updates are expected for assigned tasks.</li>
                    </ul>
                </div>

                <div className="h-px bg-white/20" />

                <div className="space-y-10">
                    <h2 className="text-3xl font-merriweather font-black text-yellow-400">Is this Role right for you?</h2>
                    <div className="space-y-4">
                        <p className="text-white font-bold">This role is ideal if you:</p>
                        <ul className="text-white/90 space-y-3 font-medium text-xs leading-relaxed">
                            <li>Are passionate about direct social change and community service.</li>
                            <li>Can commit time and energy for on-field or operational activities.</li>
                            <li>Enjoy working in teams and engaging with diverse groups of people.</li>
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

export default VolunteerKnowMore;
