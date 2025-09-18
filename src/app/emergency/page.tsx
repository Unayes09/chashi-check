"use client"; // Add this directive to make the file a Client Component

import React, { useState, useEffect } from "react";
import "./styles.css"; // Assuming your TailwindCSS setup is here

const EmergencyPage = () => {
  // State to manage the active tab
  const [activeTab, setActiveTab] = useState("before"); 
  
  // State to manage the loading simulation for crop-specific advice
  const [isCropDataLoading, setIsCropDataLoading] = useState(true);

  // Simulate a 2.5-second data fetch ONLY when the component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCropDataLoading(false);
    }, 2500); // 2.5 seconds

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []); // The empty array ensures this effect runs only once

  return (
    <div className="emergency-page bg-gray-100 min-h-screen">
      {/* Main container updated to reduce left-side space */}
      <div className="flex flex-col md:flex-row gap-8 px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ====================================================================== */}
        {/* ======================= Left Sidebar Navigation ====================== */}
        {/* ====================================================================== */}
        <aside className="w-full md:w-64">
          <nav className="bg-white shadow-lg rounded-lg p-4 sticky top-8">
            <div className="flex flex-row md:flex-col justify-around md:justify-start md:space-y-2">
              <button
                className={`flex items-center w-full p-3 rounded-lg transition-all duration-300 ${
                  activeTab === "before"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("before")}
              >
                <span className="text-2xl mr-3">🛡️</span>
                <span className="font-semibold text-sm">পূর্ব-প্রস্তুতি</span>
              </button>
              <button
                className={`flex items-center w-full p-3 rounded-lg transition-all duration-300 ${
                  activeTab === "during"
                    ? "bg-red-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("during")}
              >
                <span className="text-2xl mr-3">⚠️</span>
                <span className="font-semibold text-sm">দুর্যোগকালীন</span>
              </button>
              <button
                className={`flex items-center w-full p-3 rounded-lg transition-all duration-300 ${
                  activeTab === "after"
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("after")}
              >
                <span className="text-2xl mr-3">🌱</span>
                <span className="font-semibold text-sm">পুনরুদ্ধার</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* ====================================================================== */}
        {/* ========================== Main Content Area ========================= */}
        {/* ====================================================================== */}
        <main className="flex-1">
          {/* ==================== দুর্যোগপূর্ব (Before Disaster) ==================== */}
          {activeTab === "before" && (
            <section className="space-y-8 animate-fadeIn">
              <div className="text-center bg-blue-100 p-4 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-blue-800">দুর্যোগ পূর্ববর্তী প্রস্তুতি</h2>
                <p className="mt-2 text-gray-700">
                  সঠিক প্রস্তুতি পারে আপনার জীবন ও ফসলের ঝুঁকি কমাতে। সতর্ক থাকুন, নিরাপদ থাকুন।
                </p>
              </div>

              {/* Weather Alerts - Cleaner UI */}
              <div className="p-6 bg-white rounded-lg shadow-lg border-l-4 border-blue-500">
                <h3 className="text-xl font-bold text-blue-800 flex items-center">
                  <span className="text-2xl mr-3">🌦️</span> সিলেটের আবহাওয়ার পূর্বাভাস (৪৮ ঘন্টা)
                </h3>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center justify-between p-3 border rounded-md">
                      <span className="font-medium text-yellow-800">💨 ঝোড়ো হাওয়া (৩০-৪০ কিমি/ঘন্টা)</span>
                      <span className="text-sm text-gray-600 font-semibold">আজ রাত ৯টা</span>
                  </li>
                  <li className="flex items-center justify-between p-3 border border-red-300 bg-red-50 rounded-md">
                      <span className="font-medium text-red-800">⛈️ ভারী বর্ষণের সতর্কতা</span>
                      <span className="text-sm text-gray-600 font-semibold">আগামীকাল, ভোর ৫টা - দুপুর ১২টা</span>
                  </li>
                  <li className="flex items-center justify-between p-3 border rounded-md">
                      <span className="font-medium text-green-800">☀️ রৌদ্রোজ্জ্বল</span>
                      <span className="text-sm text-gray-600 font-semibold">পরশুদিন</span>
                  </li>
                </ul>
              </div>

              {/* CROP-SPECIFIC WARNINGS - With Loading Simulation */}
              <div className="p-6 bg-white rounded-lg shadow-lg border-l-4 border-yellow-500 min-h-[200px]">
                <h3 className="text-xl font-bold text-yellow-800 flex items-center">
                  <span className="text-2xl mr-3">🌾</span> আপনার নিবন্ধিত ফসলের জন্য বিশেষ পরামর্শ
                </h3>
                
                {isCropDataLoading ? (
                  // Loading State
                  <div className="flex flex-col items-center justify-center pt-10 text-center animate-pulse">
                    <p className="text-lg font-semibold text-gray-500">
                      🔄 আপনার ফসলের তথ্য লোড করা হচ্ছে...
                    </p>
                    <p className="text-sm text-gray-400">অনুগ্রহ করে অপেক্ষা করুন</p>
                  </div>
                ) : (
                  // Content Loaded State
                  <div>
                    <p className="text-sm mt-2 text-gray-600">আপনার প্রোফাইলে দেওয়া তথ্যের ভিত্তিতে এই পরামর্শগুলো তৈরি করা হয়েছে।</p>
                    <div className="mt-4 space-y-6">
                      {/* Advice for Rice */}
                      <div>
                        <h4 className="font-bold text-lg text-green-800">🔰 বোরো ও আমন ধান</h4>
                        <ul className="mt-3 space-y-2 text-gray-700">
                          <li className="flex items-start"><span className="mr-2 mt-1">✔️</span> <strong>দ্রুত ফসল কর্তন:</strong> জমিতে থাকা ধানের ৮০% পেকে গেলে কালক্ষেপণ না করে দ্রুত কেটে ফেলুন।</li>
                          <li className="flex items-start"><span className="mr-2 mt-1">✔️</span> <strong>আইল উঁচু ও মেরামত:</strong> জমির চারপাশে থাকা আইল বা বাঁধগুলো মাটি দিয়ে উঁচু ও মজবুত করুন।</li>
                          <li className="flex items-start"><span className="mr-2 mt-1">✔️</span> <strong>নালা পরিষ্কার:</strong> জমির সাথে সংযুক্ত প্রধান এবং শাখা নালাগুলো পরিষ্কার করে পানি প্রবাহের পথ সুগম করুন।</li>
                        </ul>
                      </div>
                      {/* Advice for Fruit Trees */}
                      <div>
                        <h4 className="font-bold text-lg text-lime-800">🍋 লেবু ও ফলজ গাছ (আম, পেয়ারা)</h4>
                        <ul className="mt-3 space-y-2 text-gray-700">
                          <li className="flex items-start"><span className="mr-2 mt-1">✔️</span> <strong>ডালপালা ছাঁটাই:</strong> গাছের অতিরিক্ত ও অপ্রয়োজনীয় ডালপালা ছেঁটে দিন। এতে ঝোড়ো বাতাসে গাছের উপর চাপ কমবে।</li>
                          <li className="flex items-start"><span className="mr-2 mt-1">✔️</span> <strong>ফল সংগ্রহ:</strong> গাছে থাকা পরিপক্ব বা আধা-পাকা ফল পেড়ে ফেলুন।</li>
                          <li className="flex items-start"><span className="mr-2 mt-1">✔️</span> <strong>চারা গাছকে সুরক্ষা:</strong> নতুন বা অল্প বয়সী চারা গাছগুলোকে শক্ত খুঁটির সাথে বেঁধে দিন।</li>
                        </ul>
                      </div>
                      {/* Advice for Vegetables */}
                      <div>
                        <h4 className="font-bold text-lg text-orange-800">🍅 শাক-সবজি (লাউ, কুমড়া, টমেটো)</h4>
                        <ul className="mt-3 space-y-2 text-gray-700">
                          <li className="flex items-start"><span className="mr-2 mt-1">✔️</span> <strong>মাচা শক্তিশালীকরণ:</strong> মাচাগুলো বাঁশ বা দড়ি দিয়ে মজবুত করে বেঁধে দিন।</li>
                          <li className="flex items-start"><span className="mr-2 mt-1">✔️</span> <strong>ফলন সংগ্রহ:</strong> বিক্রয়যোগ্য বা খাওয়ার উপযোগী সকল সবজি ক্ষেত থেকে তুলে ফেলুন।</li>
                          <li className="flex items-start"><span className="mr-2 mt-1">✔️</span> <strong>পানি নিষ্কাশন:</strong> প্রতিটি বেডের পাশে নালা কেটে দিন।</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Livestock & General Preparation */}
              <div className="p-6 bg-white rounded-lg shadow-lg border-l-4 border-gray-500">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <span className="text-2xl mr-3">🐄</span> গবাদি পশু ও অন্যান্য প্রস্তুতি
                </h3>
                <ul className="list-disc list-inside mt-4 space-y-2 text-gray-700">
                  <li>গবাদি পশুকে উঁচু ও নিরাপদ স্থানে সরিয়ে নিন।</li>
                  <li>পরিবারের জন্য শুকনো খাবার, বিশুদ্ধ পানি ও জরুরি ঔষধপত্র হাতের কাছে রাখুন।</li>
                  <li>জমির দলিল, ব্যাংক কাগজপত্র ও জরুরি ডকুমেন্টস প্লাস্টিকের ব্যাগে মুড়িয়ে সংরক্ষণ করুন।</li>
                </ul>
              </div>
            </section>
          )}

          {/* ==================== দুর্যোগকালীন (During Disaster) ================== */}
          {activeTab === "during" && (
            <section className="space-y-8 animate-fadeIn">
               <div className="text-center bg-red-100 p-4 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-red-800">দুর্যোগকালীন করণীয়</h2>
                <p className="mt-2 text-gray-700">
                  শান্ত থাকুন এবং নির্দেশনা মেনে চলুন। আপনার নিরাপত্তাই সর্বাগ্রে।
                </p>
              </div>
              {/* Personal Safety First */}
              <div className="p-6 bg-white rounded-lg shadow-lg border-l-4 border-red-500">
                <h3 className="text-xl font-bold text-red-800 flex items-center">
                  <span className="text-2xl mr-3">❤️</span> নিজের ও পরিবারের সুরক্ষা
                </h3>
                <ul className="list-disc list-inside mt-4 space-y-2 text-gray-700">
                  <li>নিজে এবং পরিবারের সদস্যদের নিকটতম আশ্রয়কেন্দ্রে নিয়ে যান।</li>
                  <li>বৈদ্যুতিক মেইন সুইচ ও গ্যাসের লাইন বন্ধ রাখুন।</li>
                  <li>কোনো গুজবে কান দেবেন না। সরকারী উৎস থেকে তথ্য যাচাই করুন।</li>
                  <li>টিউবওয়েলের পানি পান করুন, বন্যার পানি নয়।</li>
                </ul>
              </div>
              {/* Emergency Contacts with Direct Numbers */}
              <div className="p-6 bg-red-50 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-red-800 flex items-center">
                  <span className="text-2xl mr-3">📞</span> জরুরি হটলাইন নম্বর
                </h3>
                <div className="mt-4 space-y-4">
                  <a href="tel:999" className="block w-full text-center bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-bold text-lg shadow-md">
                   জাতীয় জরুরি সেবা: ৯৯৯
                  </a>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <a href="tel:1090" className="block p-3 bg-white border rounded-lg text-center hover:bg-gray-100">
                        <span className="font-semibold text-gray-800">দুর্যোগের তথ্য ও পূর্বাভাস</span><br/>
                        <span className="font-bold text-blue-700 text-lg">১০৯০</span>
                    </a>
                    <a href="tel:16123" className="block p-3 bg-white border rounded-lg text-center hover:bg-gray-100">
                        <span className="font-semibold text-gray-800"> কৃষি কল সেন্টার</span><br/>
                        <span className="font-bold text-green-700 text-lg">১৬১২৩</span>
                    </a>
                     <a href="tel:16263" className="block p-3 bg-white border rounded-lg text-center hover:bg-gray-100">
                        <span className="font-semibold text-gray-800">স্বাস্থ্য বাতায়ন</span><br/>
                        <span className="font-bold text-purple-700 text-lg">১৬২৬৩</span>
                    </a>
                     <a href="tel:105" className="block p-3 bg-white border rounded-lg text-center hover:bg-gray-100">
                        <span className="font-semibold text-gray-800">ফায়ার সার্ভিস</span><br/>
                        <span className="font-bold text-orange-700 text-lg">১০৫</span>
                    </a>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ==================== দুর্যোগপরবর্তী (After Disaster) ================= */}
          {activeTab === "after" && (
            <section className="space-y-8 animate-fadeIn">
              <div className="text-center bg-green-100 p-4 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-green-800">দুর্যোগ পরবর্তী পুনরুদ্ধার ও করণীয়</h2>
                <p className="mt-2 text-gray-700">
                  ধৈর্য ধরে সঠিক পদক্ষেপে ক্ষতির পরিমাণ কমানো এবং ঘুরে দাঁড়ানো সম্ভব।
                </p>
              </div>
              {/* Step 1: Damage Assessment */}
              <div className="p-6 bg-white rounded-lg shadow-lg border-l-4 border-gray-500">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <span className="text-2xl mr-3">📝</span> ধাপ ১: ক্ষয়ক্ষতি নিরূপণ ও প্রাথমিক ব্যবস্থা
                </h3>
                <ul className="list-disc list-inside mt-4 space-y-2 text-gray-700">
                  <li>জমির পানি দ্রুত নিষ্কাশনের ব্যবস্থা করুন।</li>
                  <li>গাছের পাতা ও কান্ডে লেগে থাকা পলিমাটি বা বালি পরিষ্কার পানি দিয়ে ধুয়ে দিন।</li>
                  <li>গবাদি পশুর মৃতদেহ মাটিতে পুঁতে ফেলুন বা যথাযথ কর্তৃপক্ষের সাহায্যে সৎকার করুন।</li>
                </ul>
              </div>
              {/* Step 2: Crop Recovery */}
              <div className="p-6 bg-white rounded-lg shadow-lg border-l-4 border-green-500">
                <h3 className="text-xl font-bold text-green-800 flex items-center">
                  <span className="text-2xl mr-3">🌱</span> ধাপ ২: ফসল পুনরুদ্ধার (বিশেষ পরামর্শ)
                </h3>
                 <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="font-bold text-lg">বন্যা পরবর্তী ধানের যত্ন</h4>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                      <li>পানি নেমে যাওয়ার পর গাছ হেলে পড়লে ৫-৭টি গাছ একসাথে বেঁধে দিন।</li>
                      <li>জমিতে ইউরিয়া ও পটাশ সার (বিঘা প্রতি প্রায় ৩ কেজি ইউরিয়া ও ২ কেজি পটাশ) ছিটিয়ে দিন।</li>
                      <li>আংশিক ক্ষতিগ্রস্ত বীজতলা থেকে চারা তুলে ফাঁকা জায়গায় পুনরায় রোপণ করুন।</li>
                    </ul>
                  </div>
                   <div>
                    <h4 className="font-bold text-lg">সবজি ও অন্যান্য ফসলের যত্ন</h4>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                      <li>গাছের পচা বা ক্ষতিগ্রস্ত ডালপালা ও পাতা ছেঁটে ফেলুন।</li>
                      <li>ছত্রাকনাশক স্প্রে করুন (যেমন ম্যানকোজেব গ্রুপের ঔষধ) যাতে পচন রোগ না ছড়ায়।</li>
                      <li>দ্রুত বর্ধনশীল স্বল্পমেয়াদী সবজি (যেমন লালশাক, ডাঁটাশাক) চাষের জন্য জমি প্রস্তুত করুন।</li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* Damage Report Form */}
              {/* <div className="p-6 bg-gray-50 rounded-lg shadow-lg border-l-4 border-blue-500">
                <h3 className="text-xl font-bold text-blue-800 flex items-center">
                   <span className="text-2xl mr-3">📤</span> ক্ষতির রিপোর্ট ও সহায়তার আবেদন
                </h3>
                <p className="text-sm text-gray-600 mt-2">আপনার ক্ষতির সঠিক তথ্য দিয়ে স্থানীয় কৃষি অফিসে যোগাযোগ করুন। এটি সরকারি সহায়তা পেতে সাহায্য করবে।</p>
                <form className="mt-4 space-y-4">
                   <select className="w-full border border-gray-300 rounded-lg p-3">
                    <option>দুর্যোগের ধরন নির্বাচন করুন</option>
                    <option value="flood">বন্যা</option>
                    <option value="cyclone">ঘূর্ণিঝড়/ঝড়</option>
                    <option value="drought">খরা</option>
                    <option value="pest">পোকামাকড়ের আক্রমণ</option>
                   </select>
                  <input
                    type="text"
                    placeholder="ক্ষতিগ্রস্ত ফসলের নাম"
                    className="w-full border border-gray-300 rounded-lg p-3"
                  />
                   <input
                    type="text"
                    placeholder="ক্ষতির পরিমাণ (আনুমানিক)"
                    className="w-full border border-gray-300 rounded-lg p-3"
                  />
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ক্ষতির ছবি/ভিডিও (যদি থাকে)</label>
                      <input
                        type="file"
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                   </div>
                  <textarea
                    placeholder="বিস্তারিত বিবরণ লিখুন..."
                    rows="4"
                    className="w-full border border-gray-300 rounded-lg p-3"
                  ></textarea>
                  <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-bold text-lg">
                    রিপোর্ট জমা দিন
                  </button>
                </form>
              </div> */}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default EmergencyPage;