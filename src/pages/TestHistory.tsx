import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  ChevronRight,
  TrendingUp,
  Filter,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

interface Test {
  id: string;
  speech_mode: string;
  audience_type: string;
  duration_seconds: number;
  overall_score: number | null;
  created_at: string;
}

export default function TestHistory() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchTests();
    }
  }, [user]);

  const fetchTests = async () => {
    const { data, error } = await supabase
      .from('speech_tests')
      .select('id, speech_mode, audience_type, duration_seconds, overall_score, created_at')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load test history');
      return;
    }

    setTests(data || []);
    setLoading(false);
  };

  const deleteTest = async (testId: string) => {
    const { error } = await supabase
      .from('speech_tests')
      .delete()
      .eq('id', testId)
      .eq('user_id', user!.id);

    if (error) {
      toast.error('Failed to delete test');
      return;
    }

    setTests(tests.filter(t => t.id !== testId));
    toast.success('Test deleted');
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
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredTests = filter === 'all' 
    ? tests 
    : tests.filter(t => t.speech_mode === filter);

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-muted-foreground';
    if (score >= 80) return 'text-oratora-success';
    if (score >= 60) return 'text-oratora-warning';
    return 'text-destructive';
  };

  if (authLoading || loading) {
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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="font-display text-3xl font-bold mb-2">Test History</h1>
              <p className="text-muted-foreground">
                View and analyze all your past speaking tests
              </p>
            </div>
            
            <Link to="/speaking-test">
              <Button variant="hero">
                <TrendingUp className="w-4 h-4" />
                New Test
              </Button>
            </Link>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 mb-6 overflow-x-auto pb-2"
          >
            <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            {['all', 'academic', 'startup_pitch', 'debate_mun'].map((mode) => (
              <button
                key={mode}
                onClick={() => setFilter(mode)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  filter === mode
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {mode === 'all' ? 'All Tests' : formatMode(mode)}
              </button>
            ))}
          </motion.div>

          {/* Tests List */}
          {filteredTests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-12 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">No tests found</h3>
              <p className="text-muted-foreground mb-6">
                {filter === 'all' 
                  ? "You haven't taken any speaking tests yet."
                  : `No ${formatMode(filter)} tests found.`}
              </p>
              <Link to="/speaking-test">
                <Button variant="hero">Start Your First Test</Button>
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredTests.map((test, index) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="glass-card p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                        <TrendingUp className="w-7 h-7 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{formatMode(test.speech_mode)}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(test.created_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(test.created_at)}
                          </span>
                          <span>{test.duration_seconds}s</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`font-display font-bold text-3xl ${getScoreColor(test.overall_score)}`}>
                          {test.overall_score ?? '--'}
                        </p>
                        <p className="text-xs text-muted-foreground">Overall Score</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => deleteTest(test.id)}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <Link to={`/test-results/${test.id}`}>
                          <Button variant="ghost" size="icon">
                            <ChevronRight className="w-5 h-5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
