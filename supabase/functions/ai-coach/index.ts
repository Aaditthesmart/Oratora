import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TestData {
  flow_continuity_score: number;
  pause_control_score: number;
  vocal_confidence_score: number;
  visual_confidence_score: number;
  timeline_data: Array<{ type: string; start: number; end: number }>;
  audio_analysis: {
    wordsPerMinute?: number;
    silencePercentage?: number;
    fillerWordCount?: number;
  };
  video_analysis: {
    eyeContactPercentage?: number;
    headMovementScore?: number;
  };
  duration_seconds: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { testData } = await req.json() as { testData: TestData };
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Find the weakest metric
    const scores = {
      "Flow Continuity": testData.flow_continuity_score,
      "Pause Control": testData.pause_control_score,
      "Vocal Confidence": testData.vocal_confidence_score,
      "Visual Confidence": testData.visual_confidence_score,
    };

    const weakestMetric = Object.entries(scores).reduce((min, [key, val]) => 
      val < min.score ? { metric: key, score: val } : min,
      { metric: "", score: 101 }
    );

    // Analyze timeline for issue locations
    const awkwardSegments = testData.timeline_data.filter(s => s.type === "awkward");
    const totalDuration = testData.duration_seconds;
    
    const issueLocations = awkwardSegments.map(s => {
      const position = s.start / totalDuration;
      if (position < 0.33) return "intro";
      if (position < 0.66) return "body";
      return "conclusion";
    });

    const primaryLocation = issueLocations.length > 0 
      ? issueLocations.reduce((acc, loc) => {
          acc[loc] = (acc[loc] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      : null;

    const mostProblematicSection = primaryLocation 
      ? Object.entries(primaryLocation).sort((a, b) => b[1] - a[1])[0]?.[0] 
      : "throughout";

    const systemPrompt = `You are ORATORA's AI Speaking Coach. You analyze delivery metrics ONLY - pauses, pace, silence, and confidence.

CRITICAL RULES:
- Focus ONLY on delivery (pauses, pace, silence, visual/vocal confidence)
- Do NOT rewrite speech content or suggest different words
- Do NOT give motivational or generic advice like "practice more" or "believe in yourself"
- Keep responses SHORT (max 4-5 lines per section)
- Be specific about WHERE in the speech the issue occurred
- Give ONE clear, actionable practice task

You MUST respond in EXACTLY this format:
Issue:
[One sentence identifying the specific delivery problem]

Explanation:
[2-3 sentences explaining why this metric is low and where in the speech it occurred]

Practice Task:
[One specific 30-60 second drill to improve this issue]

How This Helps:
[One sentence explaining the benefit]`;

    const userPrompt = `Analyze this speaking test data:

WEAKEST METRIC: ${weakestMetric.metric} (Score: ${weakestMetric.score}/100)

ALL SCORES:
- Flow Continuity: ${testData.flow_continuity_score}/100
- Pause Control: ${testData.pause_control_score}/100
- Vocal Confidence: ${testData.vocal_confidence_score}/100
- Visual Confidence: ${testData.visual_confidence_score}/100

TIMELINE DATA:
- Total duration: ${testData.duration_seconds} seconds
- Awkward silences: ${awkwardSegments.length} occurrences
- Most problematic section: ${mostProblematicSection}

AUDIO METRICS:
- Words per minute: ${testData.audio_analysis?.wordsPerMinute || "N/A"}
- Silence percentage: ${testData.audio_analysis?.silencePercentage || "N/A"}%
- Filler words: ${testData.audio_analysis?.fillerWordCount || 0}

VIDEO METRICS:
- Eye contact: ${testData.video_analysis?.eyeContactPercentage || "N/A"}%
- Head movement score: ${testData.video_analysis?.headMovementScore || "N/A"}

Provide targeted coaching for the weakest metric: ${weakestMetric.metric}.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const coachingFeedback = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ 
      feedback: coachingFeedback,
      weakestMetric: weakestMetric.metric,
      weakestScore: weakestMetric.score,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI Coach error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
