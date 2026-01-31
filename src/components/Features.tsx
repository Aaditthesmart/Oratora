import { motion } from 'framer-motion';
import { 
  Timer, 
  TrendingUp, 
  Gauge, 
  Eye, 
  Activity, 
  Sparkles 
} from 'lucide-react';

const features = [
  {
    icon: Timer,
    title: "Pause & Silence Detection",
    description: "Identify natural vs awkward pauses. Learn when silence strengthens your message and when it breaks momentum.",
    category: "Audio"
  },
  {
    icon: TrendingUp,
    title: "Confidence Drift Analysis",
    description: "Track vocal pitch variance over time. Detect when your confidence wavers and learn to maintain composure.",
    category: "Audio"
  },
  {
    icon: Gauge,
    title: "Pace Control Tracking",
    description: "Monitor words per minute with speed spike detection. Master the rhythm that keeps audiences engaged.",
    category: "Audio"
  },
  {
    icon: Eye,
    title: "Eye Contact Estimation",
    description: "Measure camera-facing consistency. Build the visual connection that commands attention.",
    category: "Video"
  },
  {
    icon: Activity,
    title: "Nervous Motion Detection",
    description: "Track head movement and fidgeting patterns. Develop the stillness that projects authority.",
    category: "Video"
  },
  {
    icon: Sparkles,
    title: "Visual Confidence Score",
    description: "Combine face stability and movement frequency into actionable insights for presence improvement.",
    category: "Video"
  },
];

export function Features() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Beyond Words, Beyond Voice
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            ORATORA analyzes both audio and video to give you a complete picture of your speaking performance.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="feature-card group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <span className="text-xs font-medium text-primary uppercase tracking-wider">
                    {feature.category}
                  </span>
                  <h3 className="font-display font-semibold text-lg mt-1 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
