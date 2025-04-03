'use client'
import "@/styles/features.css"; // Import the styles

export default function Features() {
  const features = [
    {
      title: "Live GPS Tracking",
      desc: "See your vehicles in real-time on an interactive map.",
    },
    {
      title: "Distance Analytics",
      desc: "Track distance travelled and fuel efficiency over time.",
    },
    {
      title: "Smart Alerts",
      desc: "Receive notifications on route deviation or idle time.",
    },
  ];

  return (
    <section id="features" className="features-section">
      <h2 className="features-heading">Powerful Features</h2>
      <div className="features-grid">
        {features.map((f, i) => (
          <div key={i} className="feature-card">
            <h3 className="feature-title">{f.title}</h3>
            <p className="feature-desc">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
