import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { 
  Target, 
  Lightbulb, 
  Users,
  Zap,
  Heart,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function About() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
              Why <span className="gradient-text">ORATORA</span> Exists
            </h1>
            <p className="text-xl text-muted-foreground">
              We believe great speaking isn't about perfect grammar or extensive vocabulary. 
              It's about <span className="text-foreground font-medium">delivery</span> — the pauses, the confidence, the presence.
            </p>
          </motion.div>

          {/* The Problem */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8 md:p-12 mb-12"
          >
            <div className="max-w-3xl mx-auto">
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-6 text-center">
                The Problem with Traditional Speaking Feedback
              </h2>
              
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  Most speaking coaches and apps focus on <em>what</em> you say — your word choice, 
                  grammar, and vocabulary. But research shows that <span className="text-foreground font-medium">93% of communication 
                  is non-verbal</span>.
                </p>
                <p>
                  Great speakers fail not because of bad words, but because of broken delivery. 
                  They rush through points, fill silences with "uh" and "um", avoid eye contact, 
                  and let nervousness show in their body language.
                </p>
                <p>
                  Traditional feedback misses all of this. A mentor might say "you seemed nervous" 
                  without telling you <em>exactly when</em> your confidence dropped or <em>why</em> 
                  that pause felt awkward.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Our Solution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-8 text-center">
              Our Approach
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Zap,
                  title: 'Real-Time Analysis',
                  description: 'Our AI watches and listens to your speech, analyzing both audio and video simultaneously for complete insight.'
                },
                {
                  icon: Target,
                  title: 'Precise Feedback',
                  description: 'Know exactly when your confidence dipped, which pauses felt awkward, and where your eye contact dropped.'
                },
                {
                  icon: Lightbulb,
                  title: 'Actionable Insights',
                  description: 'Get specific tips tailored to your speaking patterns, not generic advice that doesn\'t apply to you.'
                }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 md:p-12 mb-12 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
              Our Mission
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              "To help people master delivery, not just language. Because the pause between 
              your words matters as much as the words themselves."
            </p>
          </motion.div>

          {/* Who It's For */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-8 text-center">
              Built For
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                {
                  title: 'Students & Academics',
                  description: 'Nail thesis defenses, class presentations, and academic conferences.'
                },
                {
                  title: 'Founders & Entrepreneurs',
                  description: 'Perfect your pitch for investors, demos, and stakeholder meetings.'
                },
                {
                  title: 'Debaters & MUN Delegates',
                  description: 'Command the floor with confidence and precise delivery.'
                },
                {
                  title: 'Professionals',
                  description: 'Level up your presence in meetings, talks, and leadership moments.'
                }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 p-6 bg-secondary/30 rounded-xl"
                >
                  <Users className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
              Ready to Transform Your Speaking?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Join speakers who've discovered that confidence isn't born — it's built.
            </p>
            <Link to="/signup">
              <Button variant="hero" size="xl">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
