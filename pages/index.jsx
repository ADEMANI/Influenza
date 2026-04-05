import React from "react";
import HowItWorks from "@/components/home/HowItWorks";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import HomeCard from "@/components/home/HomeCard";
import mongoose from "mongoose";
import Creator from "@/model/Creator";
import Link from "next/link";

const PLACEHOLDER_IMG = "https://randomuser.me/api/portraits/men/1.jpg";

const CreatorGrid = ({ creators }) => {
  if (!creators || creators.length === 0) return null;
  return (
    <div className="m-2 justify-evenly gap-4 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4 grid grid-cols-2 md:grid-cols-4">
      {creators.map((item) => (
        <Link key={item._id} href={`/creator/${item.username}`}>
          <HomeCard
            imageLink={item.profileImage || PLACEHOLDER_IMG}
            platform={item.platforms?.map((cur) => `${cur.platform} `).join(", ") || "—"}
            price={item.packages?.[0]?.price || "Contact for price"}
            categories={[item.category || "Creator"]}
          />
        </Link>
      ))}
    </div>
  );
};

const index = ({ creator }) => {
  const hasCreators = creator && creator.length > 0;

  return (
    <>
      <MaxWidthWrapper className="mb-12 mt-20 sm:mt-40 flex flex-col items-center justify-center text-center">
        <div className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-[#7042f88b] bg-white px-7 py-2 shadow-md transition-all Welcome-box">
          <p className="Welcome-text text-sm font-semibold cursor-pointer">
            Influenzar is now public!
          </p>
        </div>
        <h1 className="max-w-6xl text-5xl h-14 font-bold md:text-6xl lg:text-5xl bg-gradient-to-l from-[#e73ade] to-[#f6517d] bg-clip-text text-transparent">
          Influencer Marketing Made Easy.
        </h1>
        <p className="mt-5 max-w-prose text-zinc-400 sm:text-lg">
          Find and hire top Instagram, YouTube and Facebook influencers to
          create unique content for your brand
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/explore" className="px-6 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
            Explore Creators
          </Link>
          <Link href="/creator/signup" className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            Join as Creator
          </Link>
        </div>
      </MaxWidthWrapper>

      <div>
        <div className="relative isolate">
          <div>
            {hasCreators ? (
              <>
                <div className="mx-auto max-w-7xl px-6 my-4">
                  <h1 className="text-xl font-semibold">Featured Creators</h1>
                  <p className="max-w-prose text-zinc-400">Hire top influencers across all platforms</p>
                  <div className="mt-10 flow-root">
                    <CreatorGrid creators={creator.slice(0, 4)} />
                  </div>
                </div>

                {creator.length > 4 && (
                  <div className="mx-auto max-w-7xl px-6 my-16">
                    <h1 className="text-xl font-semibold">More Creators</h1>
                    <p className="max-w-prose text-zinc-400">Discover more influencers</p>
                    <div className="mt-10 flow-root">
                      <CreatorGrid creators={creator.slice(4, 8)} />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="mx-auto max-w-7xl px-6 my-16 text-center">
                <h1 className="text-xl font-semibold text-gray-500">No creators yet</h1>
                <p className="text-zinc-400 mt-2">Be the first to join as a creator!</p>
                <Link href="/creator/signup" className="mt-4 inline-block px-6 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800">
                  Join as Creator
                </Link>
              </div>
            )}

            <HowItWorks />
          </div>
        </div>
      </div>
    </>
  );
};

export default index;

export async function getServerSideProps() {
  try {
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
    let creator = await Creator.find({});
    return {
      props: {
        creator: JSON.parse(JSON.stringify(creator)),
      },
    };
  } catch (err) {
    return { props: { creator: [] } };
  }
}
