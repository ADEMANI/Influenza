import Image from "next/image";
import mongoose from "mongoose";
import Creator from "@/model/Creator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BiLogoInstagramAlt, BiLogoYoutube, BiLogoFacebook } from "react-icons/bi";
import Link from "next/link";

const PLACEHOLDER_IMG = "https://t4.ftcdn.net/jpg/01/89/74/15/360_F_189741513_VVidINOxRfACG5H3kypVufaGMbFjBq7X.jpg";
const PLACEHOLDER_BANNER = "https://t4.ftcdn.net/jpg/02/26/41/21/360_F_226412196_AOqkTJMlDl5lfOhBBMgpSuimHqsRpHUD.jpg";

const PlatformIcon = ({ platform }) => {
  const p = platform?.toLowerCase();
  if (p === "instagram") return <BiLogoInstagramAlt />;
  if (p === "youtube") return <BiLogoYoutube />;
  if (p === "facebook") return <BiLogoFacebook />;
  return null;
};

export default function Page({ creator, notFound }) {
  if (notFound || !creator) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Creator not found</h1>
        <Link href="/explore" className="text-blue-500 hover:underline">Browse all creators</Link>
      </div>
    );
  }

  const { name, profileImage, bannerImage, category, city, state, description } = creator;

  return (
    <div className="w-full md:w-3/4 mx-auto flex flex-col gap-y-3 pb-20">
      {/* Banner */}
      <div className="w-full h-48 relative">
        <Image
          src={bannerImage || PLACEHOLDER_BANNER}
          fill
          alt="Banner"
          className="object-cover"
        />
      </div>

      {/* Profile header */}
      <div className="mt-4 px-6 flex items-center justify-between gap-x-5 flex-wrap gap-y-3">
        <div className="flex items-center gap-x-5">
          <Image
            src={profileImage || PLACEHOLDER_IMG}
            height={112}
            width={112}
            alt={name}
            className="rounded-full object-cover h-28 w-28 border-4 border-white shadow-md -mt-10"
          />
          <div>
            <h3 className="text-xl font-bold">
              {name?.toUpperCase()}{" "}
              {category && (
                <Badge variant="secondary" className="shadow-lg ml-1">
                  {category}
                </Badge>
              )}
            </h3>
            {(city || state) && (
              <span className="text-gray-500 text-sm">
                {city}{city && state ? ", " : ""}{state}
              </span>
            )}
            <div className="flex gap-x-2 items-center justify-start text-2xl mt-1">
              {creator.platforms?.map((p, i) => (
                <a key={i} href={p.profile || "#"} target="_blank" rel="noreferrer" className="hover:opacity-70">
                  <PlatformIcon platform={p.platform} />
                </a>
              ))}
            </div>
          </div>
        </div>
        <a href={`mailto:${creator.email}?subject=${encodeURIComponent("Collaboration with " + name + " - NotSocial")}&body=${encodeURIComponent("Hi " + name + ",\n\nI found your profile on NotSocial and would love to collaborate with you.\n\nPlease let me know your availability and rates.\n\nLooking forward to working with you!\n\nBest regards")}`}>
          <Button className="ml-auto">📧 Contact Creator</Button>
        </a>
      </div>

      {/* Description */}
      {description && (
        <div className="px-6">
          <p className="w-full md:w-4/5 text-gray-600">{description}</p>
        </div>
      )}

      {/* Packages */}
      {creator.packages?.length > 0 && (
        <div className="px-6">
          <h3 className="text-3xl font-bold mt-4 mb-2">Packages</h3>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3 p-4">
            {creator.packages.map((item, idx) => (
              <div key={idx} className="package p-6 border rounded-xl hover:shadow-md transition-shadow">
                <h1 className="text-2xl font-bold">{item.title || "Package"}</h1>
                <p className="text-gray-500 mt-1">{item.description}</p>
                <p className="text-sm text-gray-400 mt-2 capitalize">{item.platform}</p>
                <h1 className="text-2xl font-bold mt-3">₹{item.price}</h1>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Platforms */}
      {creator.platforms?.length > 0 && (
        <div className="px-6">
          <h3 className="text-3xl font-bold mt-4 mb-2">Platforms</h3>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3 p-4">
            {creator.platforms.map((item, idx) => (
              <div key={idx} className="p-6 border rounded-xl">
                <div className="flex items-center gap-2 text-2xl mb-2">
                  <PlatformIcon platform={item.platform} />
                  <span className="text-lg capitalize">{item.platform}</span>
                </div>
                {item.profile && (
                  <a href={item.profile} target="_blank" rel="noreferrer" className="text-blue-500 text-sm hover:underline break-all">
                    {item.profile}
                  </a>
                )}
                {item.followers && (
                  <h1 className="text-lg font-bold mt-2">Followers: {item.followers}</h1>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps({ params }) {
  try {
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
    let creator = await Creator.findOne({ username: params.slug });
    if (!creator) return { props: { notFound: true, creator: null } };
    return {
      props: { creator: JSON.parse(JSON.stringify(creator)), notFound: false },
    };
  } catch (err) {
    return { props: { notFound: true, creator: null } };
  }
}
