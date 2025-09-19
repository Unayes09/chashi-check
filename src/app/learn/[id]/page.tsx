/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import CropTimeline from "@/app/components/CropTimeline";
import {
  getCropPlan,
  markTimelineItem,
  serverAiAdvice,
  analyzeCropImage,
  type CropPlan,
} from "@/app/utils/api";

export default function CropDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  const [plan, setPlan] = useState<CropPlan | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [aiMsg, setAiMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [speakingText, setSpeakingText] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Resolve params promise (Next.js 15)
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!id) return;
    
    const loadCropPlan = async () => {
      try {
          setErr(null);
        const cropPlan = await getCropPlan(id);
        setPlan(cropPlan);
      } catch (error) {
        setErr("ফসলের তথ্য লোড করতে সমস্যা হয়েছে");
        console.error("Error loading crop plan:", error);
      }
    };
    
    loadCropPlan();
  }, [id]);

  // Load voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        // Voices might not be loaded yet, try again after a short delay
        setTimeout(loadVoices, 100);
      }
    };
    
    loadVoices();
    
    // Also listen for voice changes
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  async function toggle(itemId: string, done: boolean) {
    if (!id) return;
    setBusy(true);
    try {
    await markTimelineItem(id, itemId, done);
      // Update local state immediately for better UX
      if (plan) {
        const updatedPlan = { ...plan };
        const item = updatedPlan.timeline.find(t => t.id === itemId);
        if (item) {
          item.done = done;
          setPlan(updatedPlan);
        }
      }
      // Also fetch fresh data from API
    const fresh = await getCropPlan(id);
    setPlan(fresh);
    } catch (error) {
      setErr("কাজ সম্পন্ন করতে সমস্যা হয়েছে");
      console.error("Error toggling item:", error);
    } finally {
    setBusy(false);
    }
  }

  async function askAi(itemId: string) {
    if (!plan) return;
    setBusy(true);
    setErr(null);
    const item = plan.timeline.find(t => t.id === itemId)!;
    const ai = await serverAiAdvice({
      cropName: plan.cropName,
      jat: plan.jat,
      date: item.date,
      district: plan.district,
    });
    setAiMsg(ai.text);
    speak(ai.text);
    setBusy(false);
  }

  function speak(text: string) {
    try {
      setSpeaking(true);
      setSpeakingText(text);
      
      // Check if ResponsiveVoice is available
      if (typeof window !== 'undefined' && (window as any).responsiveVoice) {
        // Use ResponsiveVoice for better Bengali support
        (window as any).responsiveVoice.speak(text, "Bangla Bangladesh Female", {
          rate: 0.8,
          pitch: 1.0,
          volume: 1.0,
          onstart: () => {
            console.log("ResponsiveVoice started");
            setSpeaking(true);
            setSpeakingText(text);
          },
          onend: () => {
            console.log("ResponsiveVoice ended");
            setSpeaking(false);
            setSpeakingText(null);
          },
          onerror: (error: any) => {
            console.log("ResponsiveVoice error:", error);
            setSpeaking(false);
            setSpeakingText(null);
          }
        });
        return;
      }

      // Fallback to browser's speech synthesis
      const s = window.speechSynthesis;
      
      // Get available voices
      const voices = s.getVoices();
      
      // Try to find Bengali voice (bn-BD)
      let bengaliVoice = voices.find(voice => 
        voice.lang === 'bn-BD' || 
        voice.name.toLowerCase().includes('bengali') ||
        voice.lang.includes('bn')
      );
      
      // If no Bengali voice, try Hindi (hi-IN) as a fallback
      if (!bengaliVoice) {
        bengaliVoice = voices.find(voice => 
          voice.lang === 'hi-IN' ||
          voice.name.toLowerCase().includes('hindi')
        );
      }
      
      // If no Bengali or Hindi voice, try any Indian language
      if (!bengaliVoice) {
        bengaliVoice = voices.find(voice => 
          voice.lang.includes('in') || 
          voice.name.toLowerCase().includes('india')
        );
      }
      
      // If no suitable voice is found, use the default voice
      if (!bengaliVoice) {
        bengaliVoice = voices.find(voice => voice.default) || voices[0];
      }
      
      // Create the speech synthesis utterance
      const u = new SpeechSynthesisUtterance(text);
      
      if (bengaliVoice) {
        u.lang = bengaliVoice.lang;
        u.voice = bengaliVoice;
      } else {
        u.lang = "bn-BD";  // Default to Bengali (Bangladesh) if no suitable voice is found
      }
      
      // Adjust speech properties
      u.rate = 0.7; // Slower speech for better understanding
      u.pitch = 1.0;
      u.volume = 1.0;
      
      // Log the voice being used
      console.log("Using voice:", bengaliVoice?.name || "default", "Language:", bengaliVoice?.lang || "bn-BD");
      
      // Speak the text
      s.speak(u);
      
      // Set speaking state for browser speech synthesis
      u.onstart = () => {
        setSpeaking(true);
        setSpeakingText(text);
      };
      u.onend = () => {
        setSpeaking(false);
        setSpeakingText(null);
      };
      u.onerror = () => {
        setSpeaking(false);
        setSpeakingText(null);
      };
      
    } catch (error) {
      console.log("Speech synthesis not available:", error);
      setSpeaking(false);
      setSpeakingText(null);
    }
  }
  

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !plan) return;
    
    setAnalyzing(true);
    setErr(null);
    
    try {
      // Minimum loading time of 2 seconds for better UX
      const [res] = await Promise.all([
        analyzeCropImage(file, plan.cropName),
        new Promise(resolve => setTimeout(resolve, 2000))
      ]);
      
      const msg = `${res.finding}।\n ${res.remedy}।`;
      console.log(msg);
      setAiMsg(msg);
      speak(msg);
    } catch (e: any) {
      setErr(e.message || "ছবি বিশ্লেষণ ব্যর্থ");
    } finally {
      setAnalyzing(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  if (!plan) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-10">
          <div className="flex items-center justify-center py-20">
          <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">লোড হচ্ছে...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500">{plan.startedAt}</div>
            <h1 className="text-2xl font-semibold">{plan.cropName} {plan.jat && `(${plan.jat})`}</h1>
            <p className="text-gray-600">{plan.district ? `জেলা: ${plan.district}` : null}</p>
            {plan.area && <p className="text-sm text-gray-600">এলাকা: {plan.area}</p>}
          </div>
          <div className="flex items-center gap-2">
            <label className="relative cursor-pointer">
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm font-medium text-emerald-700">ফসলের ছবি</span>
              </div>
              <input 
                ref={fileRef} 
                type="file" 
                accept="image/*" 
                onChange={handleImage}
                className="hidden" 
                aria-label="ফসলের ছবি আপলোড করুন"
              />
            </label>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 bg-gray-100 rounded-full h-2">
          <div 
            className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${plan.timeline.filter(item => item.done).length / plan.timeline.length * 100}%` 
            }}
          ></div>
        </div>
        <div className="mt-2 text-sm text-gray-600 text-center">
          {plan.timeline.filter(item => item.done).length} / {plan.timeline.length} কাজ সম্পন্ন
        </div>

        {/* Image Upload Instructions */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-800 mb-1">ফসলের ছবি দিয়ে সমস্যা খুঁজুন</h3>
              <p className="text-blue-700 text-sm">
                উপরের &quot;ফসলের ছবি&quot; বাটনে ক্লিক করে আপনার ফসলের ছবি আপলোড করুন। 
                AI আপনার ফসলের রোগ, পোকা বা অন্যান্য সমস্যা শনাক্ত করে উপযুক্ত পরামর্শ দেবে।
              </p>
            </div>
          </div>
        </div>

        {aiMsg && (
          <div className="mt-6 rounded-xl border p-4 bg-emerald-50 whitespace-pre-line">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-emerald-800 mb-2">AI পরামর্শ</h3>
                <p className="text-emerald-700">{aiMsg}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6">
          <CropTimeline plan={plan} onToggle={toggle} onAskAi={askAi} />
        </div>

        
        
        {err && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-600 text-sm">{err}</span>
            </div>
          </div>
        )}
        
        {analyzing && (
          <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-600"></div>
              <span className="text-orange-600 text-sm font-medium">ছবি বিশ্লেষণ হচ্ছে...</span>
            </div>
            <div className="mt-2 text-orange-700 text-xs">
              AI আপনার ফসলের ছবি দেখে রোগ ও পোকা শনাক্ত করছে
            </div>
          </div>
        )}

        {speaking && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="animate-pulse w-3 h-3 bg-green-600 rounded-full"></div>
                <div className="animate-pulse w-2 h-2 bg-green-600 rounded-full" style={{animationDelay: '0.2s'}}></div>
                <div className="animate-pulse w-2 h-2 bg-green-600 rounded-full" style={{animationDelay: '0.4s'}}></div>
              </div>
              <span className="text-green-600 text-sm font-medium">AI পরামর্শ শুনুন...</span>
            </div>
            
            {speakingText && (
              <div className="bg-white p-3 rounded-lg border border-green-200">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">
                      {speakingText}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-2 text-green-700 text-xs">
              ResponsiveVoice-এর মাধ্যমে বাংলায় পরামর্শ দেওয়া হচ্ছে
            </div>
          </div>
        )}

        {busy && !analyzing && !speaking && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-blue-600 text-sm">প্রসেস হচ্ছে...</span>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
