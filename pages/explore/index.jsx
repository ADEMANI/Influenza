import HomeCard from "@/components/home/HomeCard";
import React, { useState } from "react";
import mongoose from "mongoose";
import Creator from "@/model/Creator";
import Link from "next/link";

const AVATARS = [
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/68.jpg",
  "https://randomuser.me/api/portraits/men/75.jpg",
  "https://randomuser.me/api/portraits/women/26.jpg",
  "https://randomuser.me/api/portraits/men/52.jpg",
  "https://randomuser.me/api/portraits/women/55.jpg",
  "https://randomuser.me/api/portraits/men/15.jpg",
  "https://randomuser.me/api/portraits/women/33.jpg",
  "https://randomuser.me/api/portraits/men/67.jpg",
  "https://randomuser.me/api/portraits/women/72.jpg",
  "https://randomuser.me/api/portraits/men/43.jpg",
];

const Explore = ({ creators }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = creators.filter((c) => {
    const matchSearch =
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.username?.toLowerCase().includes(search.toLowerCase()) ||
      c.city?.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      category === "all" || c.category?.toLowerCase() === category.toLowerCase();
    return matchSearch && matchCategory;
  });

  // Get stable avatar using original index from creators array (not filtered index)
  const getAvatar = (item) => {
    if (item.profileImage && item.profileImage !== "") return item.profileImage;
    const originalIndex = creators.findIndex(c => c._id === item._id);
    return AVATARS[originalIndex % AVATARS.length];
  };

  return (
    <section className="min-h-screen pt-10 flex flex-col gap-y-10 max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row gap-4 mt-4">
        <input
          type="text"
          placeholder="Search by name, username or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gray-400"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border-2 border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gray-400"
        >
          <option value="all">All Categories</option>
          <option value="fashion">Fashion</option>
          <option value="fitness">Fitness</option>
          <option value="comedy">Comedy</option>
          <option value="tech">Tech</option>
          <option value="food">Food</option>
          <option value="travel">Travel</option>
          <option value="beauty">Beauty</option>
          <option value="gaming">Gaming</option>
          <option value="education">Education</option>
          <option value="lifestyle">Lifestyle</option>
        </select>
      </div>

      <div>
        <h1 className="text-xl font-semibold">
          {filtered.length} Creator{filtered.length !== 1 ? "s" : ""} Found
        </h1>
        <p className="text-zinc-400 text-sm mt-1">Click on any creator to view their profile and packages</p>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-20">
          {filtered.map((item) => (
            <Link key={item._id} href={`/creator/${item.username}`}>
              <div className="cursor-pointer hover:scale-105 transition-transform duration-200">
                <HomeCard
                  imageLink={getAvatar(item)}
                  platform={item.platforms?.map((p) => p.platform).join(", ") || "—"}
                  price={item.packages?.[0]?.price || "Contact"}
                  categories={[item.category || "Creator"]}
                />
                <div className="mt-2 px-1">
                  <p className="font-semibold text-sm">{item.name}</p>
                  <p className="text-xs text-gray-400">@{item.username}</p>
                  {item.city && <p className="text-xs text-gray-400">📍 {item.city}{item.state ? `, ${item.state}` : ""}</p>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold text-gray-400">No creators found</h2>
          <p className="text-gray-400 mt-2">
            {creators.length === 0 ? "No creators yet. Be the first!" : "Try a different search or category"}
          </p>
          {creators.length === 0 && (
            <Link href="/creator/signup">
              <button className="mt-4 px-6 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800">
                Join as Creator
              </button>
            </Link>
          )}
        </div>
      )}
    </section>
  );
};

export default Explore;

export async function getServerSideProps() {
  try {
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
    const creators = await Creator.find({});
    return { props: { creators: JSON.parse(JSON.stringify(creators)) } };
  } catch (err) {
    return { props: { creators: [] } };
  }
}
