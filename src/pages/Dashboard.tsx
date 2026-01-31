import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { 
  Mic, 
  TrendingUp, 
  Calendar, 
  Award,
  Clock,
  ChevronRight,
  Play
} from 'lucide-react';
import { ScoreCircle } from '@/components/ScoreCircle';

interface Profile {
  full_name: string | null;
}

interface TestSummary {
  id: string;
  speech_mode: string;
  overall_score: number | null;
  created_at: string;
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [recentTests, setRecentTests] = useState<TestSummary[]>([]);
  const [stats, setStats] = useState({
    averageScore: 0,
    totalTests: 0,
    bestArea: 'N/A'
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchRecentTests();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('user_id', user!.id)
      .maybeSingle();
    
    if (data) setProfile(data);
  };

  const fetchRecentTests = async () => {
    const { data } = await supabase
      .from('speech_tests')
      .select('id, speech_mode, overall_score, created_at')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (data) {
      setRecentTests(data);
      
      // Calculate stats
      if (data.length > 0) {
        const validScores = data.filter(t => t.overall_score !== null);
        const avg = validScores.length > 0 
          ? Math.round(validScores.reduce((sum, t) => sum + (t.overall_score || 0), 0) / validScores.length)
          : 0;
        
        setStats({
          averageScore: avg,
          totalTests: data.length,
          bestArea: avg >= 80 ? 'Vocal Confidence' : 'Pause Control'
        });
      }
    }
  };

  const formatMode = (mode: string) => {
    const modes: Record<string, string> = {
      academic: 'Academic',
      startup_pitch: 'Startup Pitch',
      debate_mun: 'Debate/MUN'
    };
    return modes[mode] || mode;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const firstName = profile?.full_name?.split(' ')[0] || 'Speaker';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Welcome back, <span className="gradient-text">{firstName}</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Ready to improve your speaking today?
            </p>
          </motion.div>

          {/* Main CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8 mb-8"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Mic className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold mb-1">Start New Speaking Test</h2>
                  <p className="text-muted-foreground">Record a 30-90 second speech and get AI-powered feedback</p>
                </div>
              </div>
              <Link to="/speaking-test">
                <Button variant="hero" size="lg">
                  <Play className="w-5 h-5" />
                  Start Recording
                </Button>
              </Link>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1 space-y-6"
            >
              {/* Average Score */}
              <div className="glass-card p-6 text-center">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Average Score</h3>
                <ScoreCircle score={stats.averageScore} label="" size="lg" />
              </div>

              {/* Quick Stats */}
              <div className="glass-card p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">Total Tests</span>
                    </div>
                    <span className="font-display font-bold text-xl">{stats.totalTests}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-oratora-success/10 flex items-center justify-center">
                        <Award className="w-5 h-5 text-oratora-success" />
                      </div>
                      <span className="text-sm text-muted-foreground">Best Area</span>
                    </div>
                    <span className="font-medium text-sm">{stats.bestArea}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recent Tests */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display font-semibold text-lg">Recent Tests</h3>
                  <Link to="/test-history" className="text-primary text-sm hover:underline flex items-center gap-1">
                    View All <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {recentTests.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                      <Mic className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h4 className="font-medium mb-2">No tests yet</h4>
                    <p className="text-muted-foreground text-sm mb-4">
                      Complete your first speaking test to see your results here
                    </p>
                    <Link to="/speaking-test">
                      <Button variant="outline">Start Your First Test</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentTests.map((test, index) => (
                      <motion.div
                        key={test.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <Link
                          to={`/test-results/${test.id}`}
                          className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                              <TrendingUp className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{formatMode(test.speech_mode)}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {formatDate(test.created_at)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-display font-bold text-2xl">
                                {test.overall_score ?? '--'}
                              </p>
                              <p className="text-xs text-muted-foreground">Score</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
