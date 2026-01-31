-- Create profiles table for user data
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT,
    email TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create speech_tests table
CREATE TABLE public.speech_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    speech_mode TEXT NOT NULL CHECK (speech_mode IN ('academic', 'startup_pitch', 'debate_mun')),
    audience_type TEXT NOT NULL CHECK (audience_type IN ('neutral', 'supportive', 'critical')),
    duration_seconds INTEGER NOT NULL,
    
    -- Scores (0-100)
    flow_continuity_score INTEGER CHECK (flow_continuity_score >= 0 AND flow_continuity_score <= 100),
    pause_control_score INTEGER CHECK (pause_control_score >= 0 AND pause_control_score <= 100),
    vocal_confidence_score INTEGER CHECK (vocal_confidence_score >= 0 AND vocal_confidence_score <= 100),
    visual_confidence_score INTEGER CHECK (visual_confidence_score >= 0 AND visual_confidence_score <= 100),
    overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
    
    -- Analysis data (JSON)
    audio_analysis JSONB,
    video_analysis JSONB,
    insights JSONB,
    timeline_data JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.speech_tests ENABLE ROW LEVEL SECURITY;

-- Speech tests policies
CREATE POLICY "Users can view their own tests" 
ON public.speech_tests FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tests" 
ON public.speech_tests FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tests" 
ON public.speech_tests FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, full_name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for auto-creating profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply to profiles
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();