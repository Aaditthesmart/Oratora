import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dumbbell, 
  Play, 
  Square, 
  RotateCcw, 
  TrendingUp, 
  TrendingDown,
  Minus,
  Video,
  Timer,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScoreCircle } from '@/components/ScoreCircle';

interface TestData {
  flow_continuity_score: number | null;
  pause_control_score: number | null;
  vocal_confidence_score: number | null;
  visual_confidence_score: number | null;
}

interface PracticeTask {
  id: string;
  title: string;
  metric: string;
  description: string;
  instructions: string[];
  duration: number; // seconds
}

interface PracticeTaskPanelProps {
  testData: TestData;
  onPracticeComplete: (newScores: TestData) => void;
}

const PRACTICE_TASKS: Record<string, PracticeTask> = {
  'pause_control': {
    id: 'pause_drill',
    title: 'Intentional Pause Drill',
    metric: 'Pause Control',
    description: 'Practice deliberate pausing between key points to eliminate awkward silences.',
    instructions: [
      'Take a deep breath before starting',
      'Speak one sentence, then pause for 2 full seconds',
      'Use the pause to look at the camera',
      'Repeat for the next sentence',
    ],
    duration: 45,
  },
  'flow_continuity': {
    id: 'metronome_drill',
    title: 'Metronome Speaking Drill',
    metric: 'Flow Continuity',
    description: 'Maintain steady rhythm to improve speech flow and reduce speed variations.',
    instructions: [
      'Imagine a slow, steady beat (60 BPM)',
      'Speak one word per beat for the first 15 seconds',
      'Gradually speed up while maintaining rhythm',
      'Focus on smooth transitions between words',
    ],
    duration: 45,
  },
  'vocal_confidence': {
    id: 'emphasis_drill',
    title: 'Emphasis Repetition Drill',
    metric: 'Vocal Confidence',
    description: 'Practice projecting key words to build vocal confidence and clarity.',
    instructions: [
      'Pick a simple phrase: "This is important"',
      'Say it normally, then emphasize "THIS"',
      'Say it again, emphasizing "IMPORTANT"',
      'Vary your pitch and volume deliberately',
    ],
    duration: 40,
  },
  'visual_confidence': {
    id: 'camera_focus_drill',
    title: 'Camera Lock Drill',
    metric: 'Visual Confidence',
    description: 'Train consistent eye contact by focusing on the camera without looking away.',
    instructions: [
      'Look directly at the camera lens',
      'Speak about any topic for 30 seconds',
      'Do not look away, even during pauses',
      'Breathe and stay relaxed while maintaining focus',
    ],
    duration: 35,
  },
};

export function PracticeTaskPanel({ testData, onPracticeComplete }: PracticeTaskPanelProps) {
  const [phase, setPhase] = useState<'task' | 'recording' | 'comparison'>('task');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [beforeScores] = useState<TestData>(testData);
  const [afterScores, setAfterScores] = useState<TestData | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Determine weakest metric and corresponding practice task
  const scores = {
    pause_control: testData.pause_control_score || 0,
    flow_continuity: testData.flow_continuity_score || 0,
    vocal_confidence: testData.vocal_confidence_score || 0,
    visual_confidence: testData.visual_confidence_score || 0,
  };

  const weakestKey = Object.entries(scores).reduce((min, [key, val]) => 
    val < scores[min as keyof typeof scores] ? key : min,
    'pause_control'
  ) as keyof typeof PRACTICE_TASKS;

  const practiceTask = PRACTICE_TASKS[weakestKey];

  useEffect(() => {
    return () => {
      stopStream();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startPractice = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setPhase('recording');
    } catch (error) {
      console.error('Camera access error:', error);
    }
  };

  const startRecording = useCallback(() => {
    setIsRecording(true);
    setRecordingTime(0);
    
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= practiceTask.duration) {
          stopRecording();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  }, [practiceTask.duration]);

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
    stopStream();
    
    // Generate simulated improvement scores
    // In production, this would analyze the actual recording
    const improvement = Math.floor(Math.random() * 15) + 5; // 5-20 point improvement
    const newScores: TestData = {
      flow_continuity_score: Math.min(100, (testData.flow_continuity_score || 0) + (weakestKey === 'flow_continuity' ? improvement : Math.floor(improvement / 3))),
      pause_control_score: Math.min(100, (testData.pause_control_score || 0) + (weakestKey === 'pause_control' ? improvement : Math.floor(improvement / 3))),
      vocal_confidence_score: Math.min(100, (testData.vocal_confidence_score || 0) + (weakestKey === 'vocal_confidence' ? improvement : Math.floor(improvement / 3))),
      visual_confidence_score: Math.min(100, (testData.visual_confidence_score || 0) + (weakestKey === 'visual_confidence' ? improvement : Math.floor(improvement / 3))),
    };
    
    setAfterScores(newScores);
    setPhase('comparison');
  }, [testData, weakestKey]);

  const resetPractice = () => {
    setPhase('task');
    setAfterScores(null);
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const ScoreComparison = ({ label, before, after }: { label: string; before: number; after: number }) => {
    const diff = after - before;
    return (
      <div className="flex items-center justify-between py-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="flex items-center gap-3">
          <span className="text-sm">{before}</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-semibold">{after}</span>
          {diff > 0 ? (
            <span className="flex items-center gap-1 text-oratora-success text-xs">
              <TrendingUp className="w-3 h-3" />
              +{diff}
            </span>
          ) : diff < 0 ? (
            <span className="flex items-center gap-1 text-destructive text-xs">
              <TrendingDown className="w-3 h-3" />
              {diff}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-muted-foreground text-xs">
              <Minus className="w-3 h-3" />
              0
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Dumbbell className="w-5 h-5 text-primary" />
        <h3 className="font-display font-semibold">Personalized Practice</h3>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'task' && (
          <motion.div
            key="task"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Task Card */}
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-5 mb-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-xs text-primary font-medium uppercase tracking-wider">
                    Target: {practiceTask.metric}
                  </span>
                  <h4 className="font-display font-semibold text-lg mt-1">
                    {practiceTask.title}
                  </h4>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                  <Timer className="w-4 h-4" />
                  {practiceTask.duration}s
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                {practiceTask.description}
              </p>

              <div className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Instructions
                </span>
                <ol className="space-y-2">
                  {practiceTask.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      {instruction}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <Button variant="hero" className="w-full" onClick={startPractice}>
              <Play className="w-4 h-4" />
              Practice Now
            </Button>
          </motion.div>
        )}

        {phase === 'recording' && (
          <motion.div
            key="recording"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Video Preview */}
            <div className="relative aspect-video bg-secondary rounded-xl overflow-hidden mb-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              
              {isRecording && (
                <div className="absolute top-3 left-3 flex items-center gap-2 bg-destructive px-2.5 py-1 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-destructive-foreground recording-pulse" />
                  <span className="text-xs font-medium text-destructive-foreground">REC</span>
                </div>
              )}

              <div className="absolute top-3 right-3 glass-card !rounded-lg px-3 py-1.5">
                <span className="font-mono text-lg font-bold">
                  {formatTime(recordingTime)}
                </span>
                <span className="text-muted-foreground text-xs ml-1.5">
                  / {formatTime(practiceTask.duration)}
                </span>
              </div>

              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-muted">
                <div 
                  className="h-full bg-primary transition-all"
                  style={{ width: `${(recordingTime / practiceTask.duration) * 100}%` }}
                />
              </div>
            </div>

            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground">
                {practiceTask.title} — Focus on {practiceTask.metric.toLowerCase()}
              </p>
            </div>

            <div className="flex gap-3">
              {!isRecording ? (
                <Button variant="hero" className="flex-1" onClick={startRecording}>
                  <Play className="w-4 h-4" />
                  Start Drill
                </Button>
              ) : (
                <Button 
                  variant="destructive" 
                  className="flex-1" 
                  onClick={stopRecording}
                  disabled={recordingTime < 10}
                >
                  <Square className="w-4 h-4" />
                  Finish Early
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {phase === 'comparison' && afterScores && (
          <motion.div
            key="comparison"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-oratora-success/10 border border-oratora-success/30 rounded-full mb-3">
                <TrendingUp className="w-4 h-4 text-oratora-success" />
                <span className="text-sm font-medium text-oratora-success">Practice Complete!</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Compare your before and after scores
              </p>
            </div>

            {/* Score Comparison */}
            <div className="bg-secondary/30 rounded-xl p-4 mb-4">
              <div className="flex justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                <span>Metric</span>
                <span>Before → After</span>
              </div>
              <div className="divide-y divide-border">
                <ScoreComparison 
                  label="Flow Continuity" 
                  before={beforeScores.flow_continuity_score || 0} 
                  after={afterScores.flow_continuity_score || 0} 
                />
                <ScoreComparison 
                  label="Pause Control" 
                  before={beforeScores.pause_control_score || 0} 
                  after={afterScores.pause_control_score || 0} 
                />
                <ScoreComparison 
                  label="Vocal Confidence" 
                  before={beforeScores.vocal_confidence_score || 0} 
                  after={afterScores.vocal_confidence_score || 0} 
                />
                <ScoreComparison 
                  label="Visual Confidence" 
                  before={beforeScores.visual_confidence_score || 0} 
                  after={afterScores.visual_confidence_score || 0} 
                />
              </div>
            </div>

            {/* Overall Improvement */}
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="text-center">
                <ScoreCircle 
                  score={Math.round(
                    ((beforeScores.flow_continuity_score || 0) + 
                     (beforeScores.pause_control_score || 0) + 
                     (beforeScores.vocal_confidence_score || 0) + 
                     (beforeScores.visual_confidence_score || 0)) / 4
                  )} 
                  label="Before" 
                  size="sm" 
                />
              </div>
              <ChevronRight className="w-6 h-6 text-muted-foreground" />
              <div className="text-center">
                <ScoreCircle 
                  score={Math.round(
                    ((afterScores.flow_continuity_score || 0) + 
                     (afterScores.pause_control_score || 0) + 
                     (afterScores.vocal_confidence_score || 0) + 
                     (afterScores.visual_confidence_score || 0)) / 4
                  )} 
                  label="After" 
                  size="sm" 
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={resetPractice}>
                <RotateCcw className="w-4 h-4" />
                Practice Again
              </Button>
              <Button 
                variant="hero" 
                className="flex-1" 
                onClick={() => onPracticeComplete(afterScores)}
              >
                <Video className="w-4 h-4" />
                Take Full Test
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
