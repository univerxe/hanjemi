import { VideoPlayer } from "@/components/video-player"
import { EarlyAccessForm } from "@/components/early-access-form"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Master Korean, Your Way</h1>
          <p className="text-xl text-slate-600 max-w-2xl mb-8">
            Interactive learning platform combining entertainment and structured lessons for TOPIK success
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Feature 1: YouTube Learning */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-semibold mb-3">Learn from K-Content</h3>
            <p className="text-slate-600 mb-4">Master Korean through K-dramas, music videos, and variety shows with interactive subtitles and vocabulary tracking.</p>
            <div className="text-blue-600 font-medium">Coming Soon →</div>
          </div>

          {/* Feature 2: Structured Learning */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-semibold mb-3">Personalized Learning Path</h3>
            <p className="text-slate-600 mb-4">Choose your difficulty level and topics. From beginner conversations to advanced business Korean.</p>
            <div className="text-blue-600 font-medium">Explore Courses →</div>
          </div>

          {/* Feature 3: TOPIK Prep */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-semibold mb-3">TOPIK Success Guide</h3>
            <p className="text-slate-600 mb-4">Structured preparation with past papers, mock tests, and specialized vocabulary lists for each TOPIK level.</p>
            <div className="text-blue-600 font-medium">Start Prep →</div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-semibold text-center mb-8">See How It Works</h2>
          <VideoPlayer />
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
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

