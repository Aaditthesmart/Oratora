import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { 
  PlayCircle, 
  BookOpen, 
  Mic, 
  Target,
  ExternalLink,
  Clock
} from 'lucide-react';

const resources = [
  {
    category: 'Videos',
    icon: PlayCircle,
    items: [
      {
        title: 'TED: The Secret Structure of Great Talks',
        author: 'Nancy Duarte',
        duration: '18 min',
        description: 'Learn the hidden structure behind the most powerful presentations.',
        url: 'https://www.ted.com/talks/nancy_duarte_the_secret_structure_of_great_talks'
      },
      {
        title: 'Your Body Language May Shape Who You Are',
        author: 'Amy Cuddy',
        duration: '21 min',
        description: 'Discover how power posing can change your confidence before speaking.',
        url: 'https://www.ted.com/talks/amy_cuddy_your_body_language_may_shape_who_you_are'
      },
      {
        title: 'How to Speak So That People Want to Listen',
        author: 'Julian Treasure',
        duration: '10 min',
        description: 'Practical tips for making your voice more engaging and powerful.',
        url: 'https://www.ted.com/talks/julian_treasure_how_to_speak_so_that_people_want_to_listen'
      }
    ]
  },
  {
    category: 'Articles',
    icon: BookOpen,
    items: [
      {
        title: 'The Art of the Pause',
        author: 'Harvard Business Review',
        duration: '8 min read',
        description: 'Why strategic silence is your most powerful speaking tool.',
        url: '#'
      },
      {
        title: 'Conquering Stage Fright',
        author: 'Psychology Today',
        duration: '6 min read',
        description: 'Science-backed techniques to manage speaking anxiety.',
        url: '#'
      },
      {
        title: 'The Power of Vocal Variety',
        author: 'Toastmasters International',
        duration: '5 min read',
        description: 'How to use pitch, pace, and volume to captivate audiences.',
        url: '#'
      }
    ]
  },
  {
    category: 'Practice Drills',
    icon: Target,
    items: [
      {
        title: 'The 60-Second Elevator Pitch',
        author: 'ORATORA Team',
        duration: '5 min',
        description: 'Practice delivering your core message in under a minute.',
        url: '#'
      },
      {
        title: 'Pause Power Exercise',
        author: 'ORATORA Team',
        duration: '10 min',
        description: 'Build comfort with strategic silence through guided practice.',
        url: '#'
      },
      {
        title: 'Eye Contact Challenge',
        author: 'ORATORA Team',
        duration: '7 min',
        description: 'Strengthen your visual connection with audiences.',
        url: '#'
      }
    ]
  },
  {
    category: 'Debate & MUN Tips',
    icon: Mic,
    items: [
      {
        title: 'Mastering Points of Information',
        author: 'World Schools Debate',
        duration: '12 min',
        description: 'How to handle and deliver POIs with confidence.',
        url: '#'
      },
      {
        title: 'MUN Opening Speech Guide',
        author: 'Best Delegate',
        duration: '10 min read',
        description: 'Craft opening speeches that command attention.',
        url: '#'
      },
      {
        title: 'Rebuttal Frameworks',
        author: 'ORATORA Team',
        duration: '8 min',
        description: 'Structure your responses for maximum impact.',
        url: '#'
      }
    ]
  }
];

export default function Resources() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Learning <span className="gradient-text">Resources</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Curated content to help you master public speaking, from TED talks to practice drills.
            </p>
          </motion.div>

          {/* Resources Grid */}
          <div className="space-y-12">
            {resources.map((section, sectionIndex) => (
              <motion.div
                key={section.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-display text-2xl font-bold">{section.category}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.items.map((item, itemIndex) => (
                    <motion.a
                      key={item.title}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: sectionIndex * 0.1 + itemIndex * 0.05 }}
                      className="glass-card p-6 group hover:border-primary/30 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold group-hover:text-primary transition-colors pr-4">
                          {item.title}
                        </h3>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{item.author}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.duration}
                        </span>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 glass-card p-8 text-center"
          >
            <h3 className="font-display text-2xl font-bold mb-4">
              Ready to Apply What You've Learned?
            </h3>
            <p className="text-muted-foreground mb-6">
              Put these techniques into practice with a speaking test and get AI feedback.
            </p>
            <a href="/speaking-test" className="btn-hero inline-flex items-center gap-2">
              <Mic className="w-5 h-5" />
              Start Speaking Test
            </a>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
