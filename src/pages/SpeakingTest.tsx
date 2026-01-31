import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { 
  Video, 
  Mic, 
  Square, 
  Play,
  Users,
  GraduationCap,
  Rocket,
  MessageSquare,
  ThumbsUp,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

type SpeechMode = 'academic' | 'startup_pitch' | 'debate_mun';
type AudienceType = 'neutral' | 'supportive' | 'critical';

const speechModes = [
  { id: 'academic' as SpeechMode, label: 'Academic', icon: GraduationCap, description: 'Lectures, presentations, thesis defense' },
  { id: 'startup_pitch' as SpeechMode, label: 'Startup Pitch', icon: Rocket, description: 'Investor pitches, product demos' },
  { id: 'debate_mun' as SpeechMode, label: 'Debate / MUN', icon: MessageSquare, description: 'Debates, Model UN, public speaking' },
];

const audienceTypes = [
  { id: 'neutral' as AudienceType, label: 'Neutral', icon: Users, description: 'Objective listeners' },
  { id: 'supportive' as AudienceType, label: 'Supportive', icon: ThumbsUp, description: 'Friendly audience' },
  { id: 'critical' as AudienceType, label: 'Critical', icon: AlertCircle, description: 'Tough crowd' },
];

export default function SpeakingTest() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<'setup' | 'recording' | 'processing'>('setup');
  const [speechMode, setSpeechMode] = useState<SpeechMode>('academic');
  const [audienceType, setAudienceType] = useState<AudienceType>('neutral');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

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

  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setHasPermission(true);
    } catch (error) {
      console.error('Permission denied:', error);
      setHasPermission(false);
      toast.error('Please allow camera and microphone access to continue');
    }
  };

  const startRecording = useCallback(async () => {
    if (!streamRef.current) {
      await requestPermissions();
      if (!streamRef.current) return;
    }

    chunksRef.current = [];
    
    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: 'video/webm;codecs=vp9,opus'
    });
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      processRecording();
    };
    
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start(1000); // Collect data every second
    
    setIsRecording(true);
    setRecordingTime(0);
    
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 90) {
          stopRecording();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsRecording(false);
  }, []);

  const processRecording = async () => {
    setStep('processing');
    stopStream();

    // Simulate AI analysis (in production, you'd send the video/audio to an AI service)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate mock analysis results
    const analysis = generateMockAnalysis();

    // Save to database
    const { data, error } = await supabase
      .from('speech_tests')
      .insert({
        user_id: user!.id,
        speech_mode: speechMode,
        audience_type: audienceType,
        duration_seconds: recordingTime,
        flow_continuity_score: analysis.flowContinuity,
        pause_control_score: analysis.pauseControl,
        vocal_confidence_score: analysis.vocalConfidence,
        visual_confidence_score: analysis.visualConfidence,
        overall_score: analysis.overall,
        audio_analysis: analysis.audioAnalysis,
        video_analysis: analysis.videoAnalysis,
        insights: analysis.insights,
        timeline_data: analysis.timeline
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to save test results');
      setStep('setup');
      return;
    }

    toast.success('Analysis complete!');
    navigate(`/test-results/${data.id}`);
  };

  const generateMockAnalysis = () => {
    // Generate realistic mock scores
    const flowContinuity = Math.floor(Math.random() * 30) + 65;
    const pauseControl = Math.floor(Math.random() * 35) + 55;
    const vocalConfidence = Math.floor(Math.random() * 25) + 70;
    const visualConfidence = Math.floor(Math.random() * 30) + 60;
    const overall = Math.round((flowContinuity + pauseControl + vocalConfidence + visualConfidence) / 4);

    // Generate timeline segments
    const segmentTypes = ['smooth', 'smooth', 'smooth', 'natural', 'awkward'];
    const timeline = Array.from({ length: 12 }, (_, i) => ({
      start: i * (recordingTime / 12),
      end: (i + 1) * (recordingTime / 12),
      type: segmentTypes[Math.floor(Math.random() * segmentTypes.length)],
      confidence: Math.floor(Math.random() * 40) + 60
    }));

    // Generate insights based on scores
    const insights = [];
    
    if (pauseControl < 70) {
      insights.push({
        type: 'improvement',
        title: 'Pause Control',
        message: 'You had a few awkward silences. Try to fill pauses with intentional breaths rather than letting silence linger.'
      });
    }
    
    if (vocalConfidence > 80) {
      insights.push({
        type: 'strength',
        title: 'Vocal Confidence',
        message: 'Your voice projection was strong and consistent throughout the speech.'
      });
    }
    
    if (visualConfidence < 70) {
      insights.push({
        type: 'improvement',
        title: 'Eye Contact',
        message: 'Your eye contact dropped after the midpoint. Practice maintaining camera focus during key points.'
      });
    }

    insights.push({
      type: 'tip',
      title: 'Pace Variation',
      message: 'Consider slowing down slightly when making important points to emphasize them.'
    });

    return {
      flowContinuity,
      pauseControl,
      vocalConfidence,
      visualConfidence,
      overall,
      audioAnalysis: {
        averagePitch: 150 + Math.floor(Math.random() * 50),
        pitchVariance: 20 + Math.floor(Math.random() * 30),
        wordsPerMinute: 120 + Math.floor(Math.random() * 40),
        fillerWordCount: Math.floor(Math.random() * 5),
        silencePercentage: 10 + Math.floor(Math.random() * 15)
      },
      videoAnalysis: {
        eyeContactPercentage: 60 + Math.floor(Math.random() * 30),
        headMovementScore: 50 + Math.floor(Math.random() * 40),
        facePresencePercentage: 90 + Math.floor(Math.random() * 10)
      },
      insights,
      timeline
    };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTest = async () => {
    await requestPermissions();
    if (hasPermission !== false) {
      setStep('recording');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          {step === 'setup' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-8">
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                  Start Your Speaking Test
                </h1>
                <p className="text-muted-foreground text-lg">
                  Choose your mode and audience, then record a 30-90 second speech
                </p>
              </div>

              {/* Speech Mode Selection */}
              <div className="glass-card p-6 mb-6">
                <Label className="text-lg font-display font-semibold mb-4 block">
                  Speech Mode
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {speechModes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setSpeechMode(mode.id)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        speechMode === mode.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <mode.icon className={`w-6 h-6 mb-2 ${speechMode === mode.id ? 'text-primary' : 'text-muted-foreground'}`} />
                      <h4 className="font-semibold">{mode.label}</h4>
                      <p className="text-sm text-muted-foreground">{mode.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Audience Type Selection */}
              <div className="glass-card p-6 mb-8">
                <Label className="text-lg font-display font-semibold mb-4 block">
                  Audience Type
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {audienceTypes.map((audience) => (
                    <button
                      key={audience.id}
                      onClick={() => setAudienceType(audience.id)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        audienceType === audience.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <audience.icon className={`w-6 h-6 mb-2 ${audienceType === audience.id ? 'text-primary' : 'text-muted-foreground'}`} />
                      <h4 className="font-semibold">{audience.label}</h4>
                      <p className="text-sm text-muted-foreground">{audience.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Start Button */}
              <div className="text-center">
                <Button variant="hero" size="xl" onClick={handleStartTest}>
                  <Video className="w-5 h-5" />
                  Start Recording
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  You'll need to allow camera and microphone access
                </p>
              </div>
            </motion.div>
          )}

          {step === 'recording' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              {/* Video Preview */}
              <div className="glass-card overflow-hidden mb-6">
                <div className="aspect-video bg-secondary relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Recording indicator */}
                  {isRecording && (
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-destructive px-3 py-1.5 rounded-full">
                      <div className="w-2 h-2 rounded-full bg-destructive-foreground recording-pulse" />
                      <span className="text-sm font-medium text-destructive-foreground">REC</span>
                    </div>
                  )}

                  {/* Timer */}
                  <div className="absolute top-4 right-4 glass-card !rounded-lg px-4 py-2">
                    <span className="font-mono text-xl font-bold">
                      {formatTime(recordingTime)}
                    </span>
                    <span className="text-muted-foreground text-sm ml-2">/ 1:30</span>
                  </div>

                  {/* Duration guidance */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-background/80 backdrop-blur rounded-lg p-3">
                      <div className="flex justify-between text-sm mb-2">
                        <span className={recordingTime >= 30 ? 'text-oratora-success' : 'text-muted-foreground'}>
                          Min: 30s {recordingTime >= 30 && '✓'}
                        </span>
                        <span className={recordingTime >= 90 ? 'text-oratora-warning' : 'text-muted-foreground'}>
                          Max: 90s
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div 
                          className={`h-full transition-all ${recordingTime >= 30 ? 'bg-oratora-success' : 'bg-primary'}`}
                          style={{ width: `${Math.min((recordingTime / 90) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                {!isRecording ? (
                  <Button variant="hero" size="xl" onClick={startRecording}>
                    <Play className="w-5 h-5" />
                    Start Speaking
                  </Button>
                ) : (
                  <Button 
                    variant="destructive" 
                    size="xl" 
                    onClick={stopRecording}
                    disabled={recordingTime < 30}
                  >
                    <Square className="w-5 h-5" />
                    Stop Recording
                  </Button>
                )}
              </div>

              {isRecording && recordingTime < 30 && (
                <p className="text-center text-muted-foreground text-sm mt-4">
                  Speak for at least 30 seconds before stopping
                </p>
              )}
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto text-center py-16"
            >
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
              <h2 className="font-display text-2xl font-bold mb-2">Analyzing Your Speech</h2>
              <p className="text-muted-foreground">
                Our AI is examining your audio and video for insights...
              </p>
              
              <div className="mt-8 space-y-3 text-left max-w-xs mx-auto">
                <div className="flex items-center gap-3">
                  <Mic className="w-5 h-5 text-primary" />
                  <span className="text-sm">Analyzing voice patterns...</span>
                </div>
                <div className="flex items-center gap-3">
                  <Video className="w-5 h-5 text-primary" />
                  <span className="text-sm">Detecting visual cues...</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
