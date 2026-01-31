import { motion } from 'framer-motion';

interface ScoreCircleProps {
  score: number;
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ScoreCircle({ score, label, size = 'md' }: ScoreCircleProps) {
  const dimensions = {
    sm: { width: 80, stroke: 6 },
    md: { width: 120, stroke: 8 },
    lg: { width: 160, stroke: 10 },
  };

  const { width, stroke } = dimensions[size];
  const radius = (width - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-oratora-success stroke-oratora-success';
    if (score >= 60) return 'text-oratora-warning stroke-oratora-warning';
    return 'text-destructive stroke-destructive';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width, height: width }}>
        <svg className="transform -rotate-90" width={width} height={width}>
          {/* Background circle */}
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            className="stroke-muted"
          />
          {/* Progress circle */}
          <motion.circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            className={getScoreColor(score)}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className={`font-display font-bold ${size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-2xl' : 'text-xl'} ${getScoreColor(score).split(' ')[0]}`}
          >
            {score}
          </motion.span>
        </div>
      </div>
      <span className="mt-2 text-sm text-muted-foreground text-center">{label}</span>
    </div>
  );
}
