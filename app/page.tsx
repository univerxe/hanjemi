import { VideoPlayer } from "@/components/video-player"
import { EarlyAccessForm } from "@/components/early-access-form"
import { Navigation } from "@/components/navigation"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <Navigation />
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="main-title">Master Korean, Your Way</h1>
          <p className="main-subtitle">
            Interactive learning platform combining entertainment and structured lessons for TOPIK success
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Feature 1: YouTube Learning */}
          <div className="feature-card">
            <h3 className="feature-title">Learn from K-Content</h3>
            <p className="feature-text">Master Korean through K-dramas, music videos, and variety shows with interactive subtitles and vocabulary tracking.</p>
            <div className="feature-link">Coming Soon →</div>
          </div>

          {/* Feature 2: Structured Learning */}
          <div className="feature-card">
            <h3 className="feature-title">Personalized Learning Path</h3>
            <p className="feature-text">Choose your difficulty level and topics. From beginner conversations to advanced business Korean.</p>
            <div className="feature-link">Explore Courses →</div>
          </div>

          {/* Feature 3: TOPIK Prep */}
          <div className="feature-card">
            <h3 className="feature-title">TOPIK Success Guide</h3>
            <p className="feature-text">Structured preparation with past papers, mock tests, and specialized vocabulary lists for each TOPIK level.</p>
            <div className="feature-link">Start Prep →</div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mb-16 bg-white rounded-2xl shadow-lg overflow-hidden">
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

        <div className="max-w-md mx-auto">
          <div className="beta-container">
            <h2 className="text-2xl font-semibold mb-4">Join the Beta</h2>
            <p className="text-slate-600 mb-6">Get exclusive early access to our platform and 3 months free premium membership.</p>
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

