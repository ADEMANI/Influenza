import React, { useState } from "react";
import mongoose from "mongoose";
import Creator from "@/model/Creator";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

const DUMMY_CREATORS = [
  { _id:"d1", username:"priya_fashion", name:"Priya Sharma", profileImage:"https://randomuser.me/api/portraits/women/44.jpg", category:"fashion", city:"Mumbai", state:"MH", platforms:[{platform:"Instagram",followers:"50-100k"}], packages:[{title:"Instagram Post",price:"8500",platform:"instagram",description:"Sponsored post with story mention"},{title:"Reel",price:"5000",platform:"instagram",description:"60 second product reel"}], description:"Fashion & lifestyle creator with 80K+ followers on Instagram." },
  { _id:"d2", username:"rahul_fitness", name:"Rahul Verma", profileImage:"https://randomuser.me/api/portraits/men/32.jpg", category:"fitness", city:"Delhi", state:"DL", platforms:[{platform:"YouTube",followers:"100k+"},{platform:"Instagram",followers:"50-100k"}], packages:[{title:"YouTube Review",price:"15000",platform:"youtube",description:"Full product review video"},{title:"Instagram Reel",price:"6000",platform:"instagram",description:"60 second reel"}], description:"Fitness coach and YouTuber with 120K subscribers." },
  { _id:"d3", username:"sneha_food", name:"Sneha Patel", profileImage:"https://randomuser.me/api/portraits/women/68.jpg", category:"food", city:"Ahmedabad", state:"GJ", platforms:[{platform:"Instagram",followers:"10-50k"}], packages:[{title:"Recipe Feature",price:"4500",platform:"instagram",description:"Feature your product in my recipe"}], description:"Food blogger with 35K Instagram followers." },
  { _id:"d4", username:"arjun_tech", name:"Arjun Nair", profileImage:"https://randomuser.me/api/portraits/men/75.jpg", category:"tech", city:"Bangalore", state:"KA", platforms:[{platform:"YouTube",followers:"100k+"}], packages:[{title:"Product Review",price:"20000",platform:"youtube",description:"Detailed tech product review"},{title:"Shorts",price:"5000",platform:"youtube",description:"60 second YouTube Short"}], description:"Tech reviewer with 200K YouTube subscribers." },
  { _id:"d5", username:"meera_beauty", name:"Meera Singh", profileImage:"https://randomuser.me/api/portraits/women/26.jpg", category:"beauty", city:"Jaipur", state:"RJ", platforms:[{platform:"Instagram",followers:"100k+"}], packages:[{title:"Makeup Tutorial",price:"12000",platform:"instagram",description:"Tutorial featuring your product"},{title:"Story Set",price:"3500",platform:"instagram",description:"5 story swipe-up campaign"}], description:"Beauty influencer with 150K Instagram followers." },
  { _id:"d6", username:"vikram_travel", name:"Vikram Mehta", profileImage:"https://randomuser.me/api/portraits/men/52.jpg", category:"travel", city:"Pune", state:"MH", platforms:[{platform:"Instagram",followers:"50-100k"},{platform:"YouTube",followers:"10-50k"}], packages:[{title:"Travel Vlog",price:"18000",platform:"youtube",description:"Destination vlog featuring your brand"}], description:"Travel vlogger who has visited 30+ countries." },
  { _id:"d7", username:"kavya_lifestyle", name:"Kavya Reddy", profileImage:"https://randomuser.me/api/portraits/women/55.jpg", category:"lifestyle", city:"Hyderabad", state:"TS", platforms:[{platform:"Instagram",followers:"10-50k"}], packages:[{title:"Lifestyle Post",price:"3000",platform:"instagram",description:"Aesthetic product placement post"}], description:"Lifestyle creator with 28K followers." },
  { _id:"d8", username:"rohan_comedy", name:"Rohan Das", profileImage:"https://randomuser.me/api/portraits/men/15.jpg", category:"comedy", city:"Kolkata", state:"WB", platforms:[{platform:"Instagram",followers:"100k+"},{platform:"YouTube",followers:"50-100k"}], packages:[{title:"Comedy Skit",price:"25000",platform:"instagram",description:"Brand integrated comedy skit"},{title:"Reel",price:"8000",platform:"instagram",description:"Funny brand mention reel"}], description:"Comedy creator with 200K+ Instagram followers." },
  { _id:"d9", username:"ananya_dance", name:"Ananya Iyer", profileImage:"https://randomuser.me/api/portraits/women/33.jpg", category:"lifestyle", city:"Chennai", state:"TN", platforms:[{platform:"Instagram",followers:"50-100k"}], packages:[{title:"Dance Reel",price:"7000",platform:"instagram",description:"Dance video featuring your brand"}], description:"Dance and lifestyle creator with 65K followers." },
  { _id:"d10", username:"deepak_gaming", name:"Deepak Sharma", profileImage:"https://randomuser.me/api/portraits/men/67.jpg", category:"tech", city:"Noida", state:"UP", platforms:[{platform:"YouTube",followers:"50-100k"}], packages:[{title:"Game Review",price:"10000",platform:"youtube",description:"In-game brand integration"}], description:"Gaming YouTuber with 80K subscribers." },
  { _id:"d11", username:"ritu_parenting", name:"Ritu Agarwal", profileImage:"https://randomuser.me/api/portraits/women/72.jpg", category:"lifestyle", city:"Lucknow", state:"UP", platforms:[{platform:"Instagram",followers:"10-50k"}], packages:[{title:"Product Feature",price:"2500",platform:"instagram",description:"Organic product mention"}], description:"Parenting blogger with 22K followers." },
  { _id:"d12", username:"sameer_music", name:"Sameer Khan", profileImage:"https://randomuser.me/api/portraits/men/43.jpg", category:"lifestyle", city:"Mumbai", state:"MH", platforms:[{platform:"Instagram",followers:"50-100k"}], packages:[{title:"Song Feature",price:"9000",platform:"youtube",description:"Brand in music video"}], description:"Independent musician with 55K Instagram followers." },
];

export default function BrandDashboard({ dbCreators }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [firstMsg, setFirstMsg] = useState("");
  const [budget, setBudget] = useState("");
  const [sending, setSending] = useState(false);

  const allCreators = [...dbCreators, ...DUMMY_CREATORS];

  const filtered = allCreators.filter((c) => {
    const matchSearch =
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.username?.toLowerCase().includes(search.toLowerCase()) ||
      c.city?.toLowerCase().includes(search.toLowerCase()) ||
      c.category?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || c.category?.toLowerCase() === category;
    return matchSearch && matchCat;
  });

  const startChat = async () => {
    if (!firstMsg.trim()) { toast.error("Please write a message"); return; }
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.email) { toast.error("Please login first"); router.push("/login"); return; }
    setSending(true);
    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Basic ${btoa("junaid:2002")}` },
        body: JSON.stringify({
          from: user.email,
          fromName: user.email,
          fromRole: "brand",
          to: selected.email || selected.username + "@notsocial.app",
          toName: selected.name,
          toUsername: selected.username,
          body: firstMsg,
          budget: budget,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Message sent! Opening chat... 💬");
        setTimeout(() => router.push("/messages"), 1000);
      } else toast.error("Failed to send");
    } catch { toast.error("Error. Please try again."); }
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="bg-white border-b px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Find Creators</h1>
          <p className="text-gray-500 mt-1">Discover and collaborate with top influencers across India</p>
        </div>
        <a href="/messages" className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition-colors flex items-center gap-2">
          💬 My Chats
        </a>
      </div>

      <div className="px-8 py-4 flex flex-col md:flex-row gap-4 bg-white border-b">
        <input type="text" placeholder="Search by name, city or category..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gray-400" />
        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className="border-2 border-gray-200 rounded-lg px-4 py-2 text-sm">
          <option value="all">All Categories</option>
          <option value="fashion">Fashion</option>
          <option value="fitness">Fitness</option>
          <option value="food">Food</option>
          <option value="tech">Tech</option>
          <option value="beauty">Beauty</option>
          <option value="travel">Travel</option>
          <option value="lifestyle">Lifestyle</option>
          <option value="comedy">Comedy</option>
        </select>
      </div>

      <div className="px-8 py-6">
        <p className="text-sm text-gray-500 mb-4">{filtered.length} creators found</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((creator) => (
            <div key={creator._id} className="bg-white rounded-xl border hover:shadow-lg transition-all duration-200 overflow-hidden">
              <img src={creator.profileImage} alt={creator.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-lg">{creator.name}</h3>
                <p className="text-gray-400 text-sm">@{creator.username}</p>
                <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">{creator.category}</span>
                {creator.city && <p className="text-xs text-gray-400 mt-1">📍 {creator.city}</p>}
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-gray-400">Starting from</p>
                  <p className="font-bold text-lg text-green-600">₹{creator.packages?.[0]?.price || "Contact"}</p>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => { setSelected(creator); setShowChat(false); }}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50">
                    View
                  </button>
                  <button onClick={() => { setSelected(creator); setShowChat(true); }}
                    className="flex-1 bg-black text-white py-2 rounded-lg text-sm hover:bg-gray-800">
                    💬 Chat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Creator Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-2xl relative">
              <button onClick={() => setSelected(null)} className="absolute top-3 right-3 bg-white rounded-full w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100">✕</button>
            </div>
            <div className="px-6 pb-6">
              <div className="flex items-end gap-4 -mt-10 mb-4">
                <img src={selected.profileImage} alt={selected.name} className="w-20 h-20 rounded-full border-4 border-white object-cover" />
                <div className="mb-2">
                  <h2 className="text-2xl font-bold">{selected.name}</h2>
                  <p className="text-gray-400">@{selected.username}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap mb-4">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm capitalize">{selected.category}</span>
                {selected.city && <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">📍 {selected.city}</span>}
              </div>
              {selected.description && <p className="text-gray-600 mb-4">{selected.description}</p>}

              {selected.platforms?.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-bold text-lg mb-2">Platforms</h3>
                  <div className="flex gap-3 flex-wrap">
                    {selected.platforms.map((p, i) => (
                      <div key={i} className="px-4 py-2 border rounded-lg text-sm">
                        <span className="font-medium capitalize">{p.platform}</span>
                        {p.followers && <span className="text-gray-400 ml-2">{p.followers} followers</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selected.packages?.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-bold text-lg mb-2">Packages & Pricing</h3>
                  <div className="grid gap-3">
                    {selected.packages.map((pkg, i) => (
                      <div key={i} className="border rounded-xl p-4 flex justify-between items-start">
                        <div>
                          <h4 className="font-bold">{pkg.title}</h4>
                          <p className="text-gray-500 text-sm mt-1">{pkg.description}</p>
                          <span className="text-xs text-gray-400 capitalize">{pkg.platform}</span>
                        </div>
                        <span className="text-2xl font-bold text-green-600">₹{pkg.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* In-app Chat */}
              {showChat ? (
                <div className="mt-4 border-t pt-4">
                  <h3 className="font-bold text-lg mb-3">💬 Start Chat with {selected.name}</h3>
                  <div className="space-y-3">
                    <input type="text" placeholder="Your budget (₹) — optional"
                      value={budget} onChange={(e) => setBudget(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
                    <textarea rows={3} placeholder="Introduce yourself and describe your campaign..."
                      value={firstMsg} onChange={(e) => setFirstMsg(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
                    <div className="flex gap-3">
                      <button onClick={startChat} disabled={sending}
                        className="flex-1 bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50">
                        {sending ? "Opening chat..." : "💬 Send & Open Chat"}
                      </button>
                      <button onClick={() => setShowChat(false)} className="px-4 py-3 border rounded-xl text-sm hover:bg-gray-50">Cancel</button>
                    </div>
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowChat(true)} className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 mt-4">
                  💬 Start Chat
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps() {
  try {
    if (!mongoose.connections[0].readyState) await mongoose.connect(process.env.MONGODB_URI);
    const creators = await Creator.find({});
    return { props: { dbCreators: JSON.parse(JSON.stringify(creators)) } };
  } catch { return { props: { dbCreators: [] } }; }
}
