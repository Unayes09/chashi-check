/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/utils/api.ts
const BASE =
  process.env.API_ENDPOINT ||
  process.env.NEXT_PUBLIC_API_ENDPOINT ||
  "http://localhost:8080";

export type OtpSendResponse =
  | { status: "registered"; token: string }
  | { status: "unregistered" }
  | { status: "error"; message: string };

// Start OTP (send code to phone)
export async function mobileVerify(phone: string): Promise<{ ok: boolean; message?: string }> {
  const r = await fetch(`${BASE}/api/auth/request-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });
  if (!r.ok) {
    const t = await safeJson(r);
    return { ok: false, message: t?.message || "Failed to start verification" };
  }
  return { ok: true };
}

export async function resendOtp(phone: string): Promise<{ ok: boolean; message?: string }> {
  // Prefer a dedicated resend endpoint if your backend provides it
  // const endpoints = [`${BASE}/mobile/verify/resend`, `${BASE}/mobile/verify`];

  // for (const url of endpoints) {
  //   const r = await fetch(url, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ phone }),
  //   });
  //   if (r.ok) return { ok: true };
  // }

  // return { ok: false, message: "Failed to resend OTP" };
  return { ok: true };
}

// Verify OTP
export async function otpSend(phone: string, code: string): Promise<OtpSendResponse> {
  const r = await fetch(`${BASE}/api/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, otp:code }),
  });

  const data = await safeJson(r);
  
  // Handle different status codes from backend
  if (data?.status === "VERIFIED" && typeof data?.token === "string") {
    return { status: "registered", token: data.token };
  }
  
  if (data?.status === "VERIFIED" && !data?.token) {
    return { status: "unregistered" };
  }
  
  // Handle error cases with specific messages
  if (data?.status === "INVALID_PHONE") {
    return { status: "error", message: data?.message || "Invalid phone number format" };
  }
  
  if (data?.status === "NO_OTP_FOUND") {
    return { status: "error", message: data?.message || "No OTP found for this phone number" };
  }
  
  if (data?.status === "OTP_EXPIRED") {
    return { status: "error", message: data?.message || "The OTP has expired" };
  }
  
  if (data?.status === "INVALID_OTP") {
    return { status: "error", message: data?.message || "The OTP is invalid" };
  }
  
  if (data?.status === "PHONE_NOT_FOUND") {
    return { status: "error", message: data?.message || "No farmer found with this phone number" };
  }
  
  // Handle HTTP error responses
  if (!r.ok) {
    return { status: "error", message: data?.message || "OTP verification failed" };
  }
  
  return { status: "error", message: "Unexpected response from server" };
}

// Register new user (returns JWT)
export async function registerUser(payload: {
  phone: string;
  name: string;
  district: string;    // জেলাঃ in Bangla UI
  preferredCrops: string[];     // preferred crops
}): Promise<{ ok: true; token: string } | { ok: false; message: string }> {
  const r = await fetch(`${BASE}/api/farmers/upsert`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await safeJson(r);
  if (!r.ok || !data?.phone) {
    return { ok: false, message: data?.message || "Registration failed" };
  }
  return { ok: true, token: data.phone };
}

// Helpers
function isJson(res: Response) {
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json");
}
async function safeJson(res: Response): Promise<any> {
  try {
    return isJson(res) ? await res.json() : await res.text();
  } catch {
    return null;
  }
}

// Local storage keys
export const LS_KEYS = {
  PHONE: "cb_phone",
  JWT: "cb_jwt",
};

export function savePhoneLocal(phone: string) {
  try { localStorage.setItem(LS_KEYS.PHONE, phone); } catch {}
}
export function saveJwtLocal(token: string) {
  try { localStorage.setItem(LS_KEYS.JWT, token); } catch {}
}

// ---------- HARD-CODED MOCK API LAYER FOR LEARNING FLOW ----------

export type Lesson = { id: string; title: string; durationSec: number; transcript: string; audioUrl?: string };
export type CropPlan = {
  id: string;
  cropName: string;
  jat: string; // জাত
  area?: string; // optional: bigha/acre
  district?: string;
  startedAt: string; // ISO date
  timeline: Array<{
    id: string;
    date: string;        // ISO date
    title: string;
    adviceTxt: string;
    adviceAudioUrl?: string;
    done?: boolean;
  }>;
};

const mockGeneralLessons: Lesson[] = [
  { id: "L1", title: "ধানের বীজতলা প্রস্তুতি", durationSec: 120, transcript: "বীজতলা প্রস্তুতির সহজ কৌশল..." },
  { id: "L2", title: "জৈব সার ব্যবহার", durationSec: 150, transcript: "জৈব সার কিভাবে তৈরি ও প্রয়োগ করবেন..." },
  { id: "L3", title: "আলুতে লেট ব্লাইট প্রতিকার", durationSec: 140, transcript: "লেট ব্লাইট হলে কী করবেন..." },
];

const mockCrops: CropPlan[] = []; // in-memory for demo

const today = new Date();
function iso(d: Date) { return d.toISOString().slice(0, 10); }
function addDays(d: Date, n: number) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }

// General lessons
export async function getGeneralLessons(): Promise<Lesson[]> {
  await delay(300);
  return mockGeneralLessons;
}

// Create crop plan (voice form) -> returns created plan
export async function createCropPlan(input: { cropName: string; jat: string; area?: string; district?: string }): Promise<CropPlan> {
  try {
    // Get phone from localStorage (which is the token)
    const phone = localStorage.getItem(LS_KEYS.PHONE);
    if (!phone) {
      throw new Error("No phone number found. Please login first.");
    }
    console.log("Phone number found:", phone);

    // Call the real API endpoint
    const r = await fetch(`${BASE}/api/farmers/by-phone/${phone}/crops`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cropName: input.cropName,
        variety: input.jat,
        district: input.district,
        area: input.area,
      }),
    });

    if (!r.ok) {
      throw new Error(`API call failed: ${r.status}`);
    }

    const data = await safeJson(r);
    console.log("Crop plan API response:", data);

    // Transform API response to our CropPlan format
    const id = data?.id || `C${Date.now()}`;
    const start = data?.startedAt ? data.startedAt.split('T')[0] : iso(today);
    
    // Transform timeline from offsetDays to actual dates
    const transformedTimeline = data?.timeline?.map((item: any, index: number) => ({
      id: `${id}-d${item.offsetDays || index}`,
      date: iso(addDays(new Date(start), item.offsetDays || 0)),
      title: item.title,
      adviceTxt: item.adviceTxt,
    })) || [
      {
        id: id + "-d0",
        date: iso(today),
        title: "বীজতলা/মাঠ প্রস্তুতি",
        adviceTxt: `${input.cropName} (${input.jat}) এর জন্য জমি প্রস্তুত করুন। আগাছা পরিষ্কার করুন, মাটি ঝুরঝুরে রাখুন।`,
      },
      {
        id: id + "-d7",
        date: iso(addDays(today, 7)),
        title: "সার প্রয়োগ (প্রথম কিস্তি)",
        adviceTxt: "সুপারিশকৃত ডোজ অনুযায়ী ইউরিয়া/টিএসপি দিন। আবহাওয়া শুষ্ক থাকলে ভালো।",
      },
      {
        id: id + "-d20",
        date: iso(addDays(today, 20)),
        title: "রোগ/পোকা পর্যবেক্ষণ",
        adviceTxt: "পাতায় দাগ, কুঁকড়ে যাওয়া বা পোকা দেখলে ছবি তুলে AI পরামর্শ নিন।",
      },
    ];
    
    const plan: CropPlan = {
      id,
      cropName: data?.cropName || input.cropName,
      jat: data?.jat || input.jat,
      area: data?.area || input.area,
      district: data?.district || input.district,
      startedAt: start,
      timeline: transformedTimeline,
    };

    // Add to mock crops for local state management
    mockCrops.unshift(plan);
    return plan;

  } catch (error) {
    console.error("Failed to create crop plan:", error);
    
    // Fallback to mock data if API fails
    await delay(300);
    const id = `C${Date.now()}`;
    const start = iso(today);
    const plan: CropPlan = {
      id,
      cropName: input.cropName,
      jat: input.jat,
      area: input.area,
      district: input.district,
      startedAt: start,
      timeline: [
        {
          id: id + "-d0",
          date: iso(today),
          title: "বীজতলা/মাঠ প্রস্তুতি",
          adviceTxt: `${input.cropName} (${input.jat}) এর জন্য জমি প্রস্তুত করুন। আগাছা পরিষ্কার করুন, মাটি ঝুরঝুরে রাখুন।`,
        },
        {
          id: id + "-d7",
          date: iso(addDays(today, 7)),
          title: "সার প্রয়োগ (প্রথম কিস্তি)",
          adviceTxt: "সুপারিশকৃত ডোজ অনুযায়ী ইউরিয়া/টিএসপি দিন। আবহাওয়া শুষ্ক থাকলে ভালো।",
        },
        {
          id: id + "-d20",
          date: iso(addDays(today, 20)),
          title: "রোগ/পোকা পর্যবেক্ষণ",
          adviceTxt: "পাতায় দাগ, কুঁকড়ে যাওয়া বা পোকা দেখলে ছবি তুলে AI পরামর্শ নিন।",
        },
      ],
    };
    mockCrops.unshift(plan);
    return plan;
  }
}

// List crops for this user/device
export async function listCrops(): Promise<CropPlan[]> {
  try {
    // Get phone from localStorage (which is the token)
    const phone = localStorage.getItem(LS_KEYS.PHONE);
    if (!phone) {
      console.log("No phone number found, returning mock data");
      return mockCrops;
    }

    // Call the real API endpoint
    const r = await fetch(`${BASE}/api/farmers/by-phone/${phone}/crops`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!r.ok) {
      throw new Error(`API call failed: ${r.status}`);
    }

    const data = await safeJson(r);
    console.log("List crops API response:", data);

    // Transform API response to our CropPlan format
    const crops: CropPlan[] = data?.map((crop: any) => {
      const id = crop.id;
      const start = crop.startedAt ? crop.startedAt.split('T')[0] : iso(today);
      
      // Transform timeline from offsetDays to actual dates
      const transformedTimeline = crop.timeline?.map((item: any, index: number) => ({
        id: `${id}-d${item.offsetDays || index}`,
        date: iso(addDays(new Date(start), item.offsetDays || 0)),
        title: item.title,
        adviceTxt: item.adviceTxt,
      })) || [];

      return {
        id,
        cropName: crop.cropName,
        jat: crop.jat || "",
        area: crop.area,
        district: crop.district,
        startedAt: start,
        timeline: transformedTimeline,
      };
    }) || [];

    // Update mock crops for local state management
    mockCrops.length = 0;
    mockCrops.push(...crops);
    
    return crops;

  } catch (error) {
    console.error("Failed to fetch crops:", error);
    // Return existing mock crops as fallback
    return mockCrops;
  }
}

// Get single crop plan
export async function getCropPlan(id: string): Promise<CropPlan | null> {
  try {
    // First try to find in local mockCrops (which might be updated from listCrops)
    const localCrop = mockCrops.find(c => c.id === id);
    if (localCrop) {
      return localCrop;
    }

    // If not found locally, try to fetch from API
    const phone = localStorage.getItem(LS_KEYS.PHONE);
    if (!phone) {
      console.log("No phone number found, returning null");
      return null;
    }

    // Call the real API endpoint for specific crop
    const r = await fetch(`${BASE}/api/farmers/by-phone/${phone}/crops/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!r.ok) {
      throw new Error(`API call failed: ${r.status}`);
    }

    const data = await safeJson(r);
    console.log("Get crop plan API response:", data);

    // Transform API response to our CropPlan format
    const id_from_api = data.id;
    const start = data.startedAt ? data.startedAt.split('T')[0] : iso(today);
    
    // Transform timeline from offsetDays to actual dates
    const transformedTimeline = data.timeline?.map((item: any, index: number) => ({
      id: `${id_from_api}-d${item.offsetDays || index}`,
      date: iso(addDays(new Date(start), item.offsetDays || 0)),
      title: item.title,
      adviceTxt: item.adviceTxt,
    })) || [];

    const crop: CropPlan = {
      id: id_from_api,
      cropName: data.cropName,
      jat: data.jat || "",
      area: data.area,
      district: data.district,
      startedAt: start,
      timeline: transformedTimeline,
    };

    // Add to mock crops for future reference
    const existingIndex = mockCrops.findIndex(c => c.id === id);
    if (existingIndex >= 0) {
      mockCrops[existingIndex] = crop;
    } else {
      mockCrops.push(crop);
    }

    return crop;

  } catch (error) {
    console.error("Failed to fetch crop plan:", error);
    // Return null if not found
    return null;
  }
}

// Toggle timeline item done
export async function markTimelineItem(cropId: string, itemId: string, done: boolean): Promise<void> {
  await delay(120);
  const c = mockCrops.find(x => x.id === cropId);
  if (!c) return;
  const it = c.timeline.find(t => t.id === itemId);
  if (it) it.done = done;
}

// ----- "Server AI" responses (hardcoded) -----

// 1) AI advice for a given day/task
export async function serverAiAdvice(params: { cropName: string; jat: string; date: string; district?: string }): Promise<{ text: string; audioUrl?: string }> {
  await delay(350);
  const { cropName, jat, district } = params;
  return {
    text:
      `${district ? district + " অঞ্চলের জন্য " : ""}${cropName} (${jat}) আজকের পরামর্শ:\n` +
      `• জমি হালকা ভেজা রাখুন\n• আগাছা উঠিয়ে ফেলুন\n• রোগের লক্ষণ দেখলে দ্রুত ছবি তুলুন\n• অতিরিক্ত বৃষ্টি হলে পানি নিকাশ নিশ্চিত করুন`,
  };
}

// 2) Image analysis (leaf/crop photo)
export async function analyzeCropImage(file: File, cropName: string): Promise<{ finding: string; remedy: string }> {
  await delay(500);
  // demo: pretend it's leaf blight if filename contains "leaf"
  const isLeaf = /leaf|পাতা/i.test(file.name);
  return isLeaf
    ? {
        finding: `${cropName} এ পাতায় দাগ (সম্ভবত ব্লাইট) শনাক্ত হয়েছে`,
        remedy: "৭-১০ দিন অন্তর সুপারিশকৃত ফাঙ্গিসাইড/নিম তেল স্প্রে করুন। আক্রান্ত পাতা অপসারণ করুন।",
      }
    : {
        finding: "বিশেষ কোনো দাগ শনাক্ত হয়নি",
        remedy: "নিয়মিত পর্যবেক্ষণ করুন, প্রয়োজনে AI পরামর্শ নিন।",
      };
}

function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }

// ---------- MARKET (hardcoded demo API) ----------
export type MarketItem = {
  name: string;          // e.g., "পটল"
  unit: string;          // e.g., "kg", "ডজন"
  price: number;         // BDT
  changePct?: number;    // optional daily change in %
};

export type MarketCategory = {
  key: string;           // slug key
  title: string;         // বাংলা title to show
  emoji?: string;        // optional emoji
  items: MarketItem[];
};

export type MarketSnapshot = {
  date: string;          // ISO date (yyyy-mm-dd)
  district?: string;     // optional location scope
  categories: MarketCategory[];
};

export async function getMarketSnapshot(district?: string): Promise<MarketSnapshot> {
  try {
    // Call the real API endpoint
    console.log("Calling market snapshot API");
    const r = await fetch(`${BASE}/api/market/generate`, {

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang: "bn" }),
    });
    // console.log("Market snapshot API called");
    // console.log(r);
    if (!r.ok) {
      throw new Error(`API call failed`);
    }

    const data = await safeJson(r);
    // console.log("API Response data:", data);
    
    // Transform the API response to match our expected format
    const today = new Date().toISOString().slice(0, 10);
    
    return {
      date: today,
      district,
      categories: data?.categories || [],
    };
  } catch (error) {
    console.error("Failed to fetch market data:", error);
    
    // Fallback to mock data if API fails
    const today = new Date().toISOString().slice(0, 10);
    const fallbackCategories: MarketCategory[] = [
      {
        key: "rice",
        title: "চাল",
        emoji: "🍚",
        items: [
          { name: "চাল (স্বাভাবিক)", unit: "kg", price: 52, changePct: 0 },
          { name: "চাল (মাঝারি মান)", unit: "kg", price: 56, changePct: 1 },
          { name: "চাল (উচ্চমান/মিনিকেট)", unit: "kg", price: 68, changePct: -1 },
          { name: "আটা", unit: "kg", price: 48, changePct: 0 },
        ],
      },
      {
        key: "pulses",
        title: "ডাল",
        emoji: "🥣",
        items: [
          { name: "মসুর ডাল", unit: "kg", price: 120, changePct: 2 },
          { name: "মুগ ডাল", unit: "kg", price: 130, changePct: 0 },
          { name: "ছোলা", unit: "kg", price: 95, changePct: -1 },
        ],
      },
      {
        key: "spices",
        title: "মসলা",
        emoji: "🌶️",
        items: [
          { name: "পেঁয়াজ", unit: "kg", price: 65, changePct: 3 },
          { name: "রসুন", unit: "kg", price: 180, changePct: -2 },
          { name: "শুকনা মরিচ", unit: "kg", price: 380, changePct: 0 },
          { name: "হলুদ", unit: "kg", price: 220, changePct: 1 },
        ],
      },
      {
        key: "oil",
        title: "খাদ্যতেল",
        emoji: "🛢️",
        items: [
          { name: "সয়াবিন তেল (খোলা)", unit: "litre", price: 140, changePct: 0 },
          { name: "সরিষার তেল (খাঁটি)", unit: "litre", price: 300, changePct: 1 },
        ],
      },
      {
        key: "vegetables",
        title: "সবজি",
        emoji: "🥦",
        items: [
          { name: "আলু", unit: "kg", price: 38, changePct: -2 },
          { name: "বেগুন", unit: "kg", price: 60, changePct: -1 },
          { name: "টমেটো", unit: "kg", price: 70, changePct: 2 },
          { name: "কপি/বাঁধাকপি", unit: "kg", price: 55, changePct: 0 },
          { name: "পটল", unit: "kg", price: 48, changePct: 1 },
          { name: "শসা", unit: "kg", price: 45, changePct: 0 },
        ],
      },
      {
        key: "fish",
        title: "মাছ",
        emoji: "🐟",
        items: [
          { name: "রুই", unit: "kg", price: 350, changePct: 0 },
          { name: "কাতলা", unit: "kg", price: 360, changePct: 1 },
          { name: "পাঙ্গাস", unit: "kg", price: 190, changePct: 0 },
          { name: "তেলাপিয়া", unit: "kg", price: 180, changePct: -1 },
          { name: "ইলিশ (মৌসুমি)", unit: "kg", price: 1200, changePct: 2 },
        ],
      },
      {
        key: "meat_eggs",
        title: "মাংস/ডিম",
        emoji: "🍖",
        items: [
          { name: "ব্রয়লার মুরগি", unit: "kg", price: 200, changePct: 1 },
          { name: "দেশি মুরগি", unit: "kg", price: 500, changePct: 0 },
          { name: "গরুর মাংস", unit: "kg", price: 750, changePct: 0 },
          { name: "খাসির মাংস", unit: "kg", price: 1100, changePct: 0 },
          { name: "ডিম", unit: "ডজন", price: 130, changePct: -1 },
        ],
      },
      {
        key: "fruits",
        title: "ফল",
        emoji: "🍌",
        items: [
          { name: "কলা", unit: "ডজন", price: 60, changePct: 0 },
          { name: "আপেল (আমদানি)", unit: "kg", price: 240, changePct: 0 },
          { name: "আম (মৌসুমি)", unit: "kg", price: 160, changePct: 0 },
          { name: "পেঁপে", unit: "kg", price: 40, changePct: 0 },
        ],
      },
    ];

    return {
      date: today,
      district,
      categories: fallbackCategories,
    };
  }
}

export async function chatWithAi(prompt: string): Promise<{ text: string }> {
  console.log(prompt);
  const r = await fetch(`${BASE}/api/chat/respond`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message:prompt }),
  });
  const data = await (async () => {
    try { return await r.json(); } catch { return null; }
  })();
  console.log(data);
  if (!r.ok || !data) {
    return { text: "দুঃখিত, আপনার প্রশ্নের উত্তর পাওয়া গেল না। পরে আবার চেষ্টা করুন।" };
  }
  // Expect server to return { text: string }
  return { text: String(data.content || "") };
}

