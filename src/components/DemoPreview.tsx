import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useState } from 'react';

export function DemoPreview() {
  const [isPlaying, setIsPlaying] = useState(false);

  // Mock timeline data
  const timelineSegments = [
    { type: 'smooth', width: 15 },
    { type: 'smooth', width: 10 },
    { type: 'natural', width: 5 },
    { type: 'smooth', width: 20 },
    { type: 'awkward', width: 8 },
    { type: 'smooth', width: 12 },
    { type: 'natural', width: 4 },
    { type: 'smooth', width: 18 },
    { type: 'natural', width: 3 },
    { type: 'smooth', width: 5 },
  ];

  const scores = [
    { label: 'Flow Continuity', score: 85, color: 'bg-oratora-success' },
    { label: 'Pause Control', score: 72, color: 'bg-oratora-warning' },
    { label: 'Vocal Confidence', score: 88, color: 'bg-oratora-success' },
    { label: 'Visual Confidence', score: 76, color: 'bg-oratora-warning' },
  ];

  return (
    <section className="py-24">
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
            See It In Action
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Experience how ORATORA breaks down your speech performance.
          </p>
        </motion.div>

        {/* Demo interface */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="glass-card overflow-hidden">
            {/* Mock video area */}
            <div className="aspect-video bg-secondary/50 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    animate={isPlaying ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4 mx-auto cursor-pointer"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-primary" />
                    ) : (
                      <Play className="w-8 h-8 text-primary ml-1" />
                    )}
                  </motion.div>
                  <p className="text-muted-foreground">Demo Preview</p>
                </div>
              </div>

              {/* Live analysis overlay */}
              <div className="absolute top-4 right-4 glass-card p-3 !rounded-lg">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-oratora-success recording-pulse' : 'bg-muted-foreground'}`} />
                  <span className="text-xs font-medium">
                    {isPlaying ? 'Analyzing...' : 'Ready'}
                  </span>
                </div>
              </div>
            </div>

            {/* Analysis results */}
            <div className="p-6">
              {/* Timeline */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-display font-semibold text-sm">Speech Flow Timeline</h4>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded segment-smooth" /> Smooth
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded segment-natural" /> Natural Pause
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded segment-awkward" /> Awkward
                    </span>
                  </div>
                </div>
                <div className="h-8 rounded-lg overflow-hidden flex">
                  {timelineSegments.map((segment, index) => (
                    <motion.div
                      key={index}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`segment-${segment.type}`}
                      style={{ width: `${segment.width}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Scores */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {scores.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    className="text-center p-4 bg-secondary/30 rounded-xl"
                  >
                    <div className="text-3xl font-display font-bold mb-1">
                      {item.score}
                    </div>
                    <div className="text-xs text-muted-foreground">{item.label}</div>
                    <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.score}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className={item.color}
                        style={{ height: '100%' }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
