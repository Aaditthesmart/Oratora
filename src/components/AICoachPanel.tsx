import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, Brain, Target, Dumbbell, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TestData {
  flow_continuity_score: number | null;
  pause_control_score: number | null;
  vocal_confidence_score: number | null;
  visual_confidence_score: number | null;
  timeline_data: any[];
  audio_analysis: any;
  video_analysis: any;
  duration_seconds: number;
}

interface AICoachPanelProps {
  testData: TestData;
  onClose: () => void;
}

interface ParsedFeedback {
  issue: string;
  explanation: string;
  practiceTask: string;
  howThisHelps: string;
}

export function AICoachPanel({ testData, onClose }: AICoachPanelProps) {
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<ParsedFeedback | null>(null);
  const [weakestMetric, setWeakestMetric] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCoachFeedback();
  }, []);

  const fetchCoachFeedback = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('ai-coach', {
        body: {
          testData: {
            flow_continuity_score: testData.flow_continuity_score || 0,
            pause_control_score: testData.pause_control_score || 0,
            vocal_confidence_score: testData.vocal_confidence_score || 0,
            visual_confidence_score: testData.visual_confidence_score || 0,
            timeline_data: testData.timeline_data || [],
            audio_analysis: testData.audio_analysis || {},
            video_analysis: testData.video_analysis || {},
            duration_seconds: testData.duration_seconds,
          },
        },
      });

      if (fnError) {
        throw fnError;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setWeakestMetric(data.weakestMetric);
      
      // Parse the structured feedback
      const parsed = parseFeedback(data.feedback);
      setFeedback(parsed);
    } catch (err) {
      console.error('AI Coach error:', err);
      const message = err instanceof Error ? err.message : 'Failed to get coaching feedback';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const parseFeedback = (raw: string): ParsedFeedback => {
    const sections = {
      issue: '',
      explanation: '',
      practiceTask: '',
      howThisHelps: '',
    };

    const issueMatch = raw.match(/Issue:\s*\n?([\s\S]*?)(?=\n\s*Explanation:|$)/i);
    const explanationMatch = raw.match(/Explanation:\s*\n?([\s\S]*?)(?=\n\s*Practice Task:|$)/i);
    const practiceMatch = raw.match(/Practice Task:\s*\n?([\s\S]*?)(?=\n\s*How This Helps:|$)/i);
    const helpsMatch = raw.match(/How This Helps:\s*\n?([\s\S]*?)$/i);

    sections.issue = issueMatch?.[1]?.trim() || 'Unable to identify specific issue';
    sections.explanation = explanationMatch?.[1]?.trim() || '';
    sections.practiceTask = practiceMatch?.[1]?.trim() || '';
    sections.howThisHelps = helpsMatch?.[1]?.trim() || '';

    return sections;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="glass-card p-6 h-fit"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="font-display font-semibold">AI Coach</h3>
        </div>
        <button 
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {loading ? (
        <div className="py-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Analyzing your delivery...</p>
        </div>
      ) : error ? (
        <div className="py-6 text-center">
          <p className="text-sm text-destructive mb-4">{error}</p>
          <button 
            onClick={fetchCoachFeedback}
            className="text-sm text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      ) : feedback ? (
        <div className="space-y-4">
          {/* Weakest Metric Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-full text-sm">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-primary font-medium">Focus: {weakestMetric}</span>
          </div>

          {/* Issue */}
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4">
            <h4 className="font-semibold text-destructive text-sm mb-1.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
              Issue
            </h4>
            <p className="text-sm text-foreground leading-relaxed">{feedback.issue}</p>
          </div>

          {/* Explanation */}
          <div className="bg-secondary/50 border border-border rounded-xl p-4">
            <h4 className="font-semibold text-sm mb-1.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Explanation
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{feedback.explanation}</p>
          </div>

          {/* Practice Task */}
          <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
            <h4 className="font-semibold text-primary text-sm mb-1.5 flex items-center gap-2">
              <Dumbbell className="w-4 h-4" />
              Practice Task
            </h4>
            <p className="text-sm text-foreground leading-relaxed">{feedback.practiceTask}</p>
          </div>

          {/* How This Helps */}
          <div className="bg-oratora-success/10 border border-oratora-success/30 rounded-xl p-4">
            <h4 className="font-semibold text-oratora-success text-sm mb-1.5 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              How This Helps
            </h4>
            <p className="text-sm text-foreground leading-relaxed">{feedback.howThisHelps}</p>
          </div>
        </div>
      ) : null}
    </motion.div>
  );
}
