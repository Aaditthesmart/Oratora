import { motion } from 'framer-motion';
import { Video, Cpu, BarChart3, Target } from 'lucide-react';

const steps = [
  {
    icon: Video,
    step: "01",
    title: "Record Your Speech",
    description: "Use your webcam and microphone to record a 30-90 second speech. Choose your mode and audience type."
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Analysis",
    description: "Our AI analyzes both audio and video streams, detecting pauses, pace, confidence, and visual habits."
  },
  {
    icon: BarChart3,
    step: "03",
    title: "Get Insights",
    description: "Receive detailed scores and a timeline heatmap showing exactly where your delivery shines or needs work."
  },
  {
    icon: Target,
    step: "04",
    title: "Improve & Track",
    description: "Use AI coaching tips to improve. Track your progress over time and watch your scores climb."
  }
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-secondary/30">
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
            How ORATORA Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Four simple steps to transform your speaking skills.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-px bg-gradient-to-r from-primary/50 to-transparent" />
              )}
              
              <div className="glass-card p-6 text-center relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <span className="text-xs font-bold text-primary tracking-widest">
                  STEP {step.step}
                </span>
                <h3 className="font-display font-semibold text-lg mt-2 mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
