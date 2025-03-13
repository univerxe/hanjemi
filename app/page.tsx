import { VideoPlayer } from "@/components/video-player"
import { EarlyAccessForm } from "@/components/early-access-form"
import { Navigation } from "@/components/navigation"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-4 py-16 md:py-24">
        {/* Hero Section */}
        <div className="hero-section mb-24">
          <div className="hero-bg"></div>
          <div className="relative flex flex-col items-center text-center mb-12">
            <h1 className="main-title">
              <span className="gradient-text">Master Korean</span>, Your Way
            </h1>
            <p className="main-subtitle animate-float">
              Interactive learning platform combining entertainment and structured lessons for TOPIK success
            </p>
            <div className="mt-8 space-x-4">
              <a href="#beta-section" className="nav-button-primary px-8 py-3">
                Get Started
              </a>
              <button className="nav-button-secondary px-8 py-3">Learn More</button>
            </div>
          </div>
        </div>

        {/* Solutions Section */}
        <div id="solutions" className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="feature-card group">
              <div className="mb-4 text-blue-600">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-text">{feature.description}</p>
              <div className="feature-link group-hover:translate-x-2 transition-transform">
                {feature.action} →
              </div>
            </div>
          ))}
        </div>

        {/* Benefits & How it Works Section */}
        <div id="how-it-works" className="max-w-7xl mx-auto mb-16 bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-transform">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-6">See How It Works</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">1</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Choose Your Content</h3>
                    <p className="text-gray-600">Select from K-dramas, music videos, or variety shows that match your level.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">2</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Interactive Learning</h3>
                    <p className="text-gray-600">Click any word for instant translations and add to your vocabulary list.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">3</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Track Progress</h3>
                    <p className="text-gray-600">Monitor your learning journey with detailed progress analytics.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 bg-gray-50 p-6">
              <VideoPlayer />
            </div>
          </div>
        </div>

        {/* Beta Section */}
        <div id="beta-section" className="max-w-md mx-auto transform hover:scale-105 transition-transform">
          <div className="beta-container relative">
            <div className="absolute -top-6 right-6 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center transform rotate-12 animate-bounce-slow">
              <svg 
                className="w-6 h-6 text-blue-600 transform -rotate-45" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-4">Be Among the First</h2>
            <p className="text-slate-600 mb-6">
              Join our exclusive beta program and receive a complimentary 3-month premium 
              membership. Start your Korean learning journey today!
            </p>
            <EarlyAccessForm />
          </div>
        </div>
      </main>
      <footer className="py-8 text-center text-slate-500">
        <p>© {new Date().getFullYear()} HanJaemi. All rights reserved.</p>
      </footer>
    </div>
  )
}

const features = [
  {
    title: "Learn from K-Content",
    description: "Master Korean through K-dramas, music videos, and variety shows with interactive subtitles and vocabulary tracking.",
    action: "Coming Soon",
    icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
  },
  {
    title: "Personalized Learning Path",
    description: "Choose your difficulty level and topics. From beginner conversations to advanced business Korean.",
    action: "Explore Courses",
    icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
  },
  {
    title: "TOPIK Success Guide",
    description: "Structured preparation with past papers, mock tests, and specialized vocabulary lists for each TOPIK level.",
    action: "Start Prep",
    icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
  }
];

