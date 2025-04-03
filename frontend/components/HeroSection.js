export default function HeroSection() {
    return (
      <section className="text-center py-20 bg-gradient-to-r from-blue-50 to-blue-100">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">Real-time Vehicle Tracking</h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
          Monitor, track and manage your fleet with precision and ease – anytime, anywhere.
        </p>
        <div className="space-x-4">
          <a href="/signup" className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700">Get Started</a>
          <a href="/login" className="border border-blue-600 text-blue-600 px-6 py-3 rounded-full hover:bg-blue-100">Login</a>
        </div>
      </section>
    );
  }
  