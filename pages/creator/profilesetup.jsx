import { UploadButton } from "@/utils/uploadthing";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProfileSetup() {

  const [userinfo, setUserinfo] = useState({
    name: "",
    username: "",
    email: "",
    role: "creator",
    profileImage: "",
    bannerImage: "",
    phone: "",
    city: "",
    state: "",
    category: "fashion",
    description: "",
    platforms: [
      { platform: "instagram", followers: "", profile: "" },
      { platform: "youtube", followers: "", profile: "" },
      { platform: "facebook", followers: "", profile: "" },
    ],
    packages: [],
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      fetch("/api/creator/getcreator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa("junaid:2002")}`,
        },
        body: JSON.stringify({ email: user.email }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.creator) {
            setUserinfo(data.creator);
          }
        });
    }
  }, []);

  const handleProfileImage = async (email, image) => {
    await fetch("/api/creator/profileImageupdate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa("junaid:2002")}`,
      },
      body: JSON.stringify({ email, profileImage: image }),
    });
  };

  const handleBannerImage = async (email, image) => {
    await fetch("/api/creator/bannerimage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa("junaid:2002")}`,
      },
      body: JSON.stringify({ email, bannerImage: image }),
    });
  };

  const handlePersonalInfo = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/creator/profileupdate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa("junaid:2002")}`,
      },
      body: JSON.stringify({
        email: userinfo.email,
        name: userinfo.name,
        phone: userinfo.phone,
        city: userinfo.city,
        state: userinfo.state,
      }),
    });
    const data = await res.json();
    if (data.success) toast.success("Personal info saved!");
    else toast.error(data.message || "Error saving");
  };

  const handleContentInfo = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/creator/addcontentinfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa("junaid:2002")}`,
      },
      body: JSON.stringify({
        email: userinfo.email,
        category: userinfo.category,
        description: userinfo.description,
        platforms: userinfo.platforms,
      }),
    });
    const data = await res.json();
    if (data.success) toast.success("Content info saved!");
    else toast.error(data.message || "Error saving");
  };

  const handlePackagesInfo = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/creator/addpackages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa("junaid:2002")}`,
      },
      body: JSON.stringify({
        email: userinfo.email,
        packages: userinfo.packages,
      }),
    });
    const data = await res.json();
    if (data.success) toast.success("Packages saved!");
    else toast.error(data.message || "Error saving");
  };

  return (
    <div className="min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      <div className="space-y-6 p-10">

        {/* ── PERSONAL INFO ── */}
        <div className="px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
              <p className="mt-1 text-sm text-gray-500">Use a permanent address where you can receive mail.</p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">

              {/* Banner Image */}
              <div className="w-full block gap-5 items-center justify-between px-20">
                {userinfo?.bannerImage ? (
                  <Image src={userinfo.bannerImage} width={800} height={200} alt="banner"
                    className="w-full h-28 object-cover rounded-sm mx-auto m-2 bg-gray-300" />
                ) : (
                  <div className="w-full h-28 bg-gray-300 rounded-sm mx-auto m-2 flex items-center justify-center text-gray-500">
                    No banner yet
                  </div>
                )}
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={async (res) => {
                    await handleBannerImage(userinfo.email, res[0].fileUrl);
                    setUserinfo({ ...userinfo, bannerImage: res[0].fileUrl });
                    toast.success("Banner updated!");
                  }}
                  onUploadError={(error) => toast.error(`Upload error: ${error.message}`)}
                />
              </div>

              {/* Profile Image */}
              <div className="w-full block gap-5 items-center justify-between px-20 mt-4">
                {userinfo?.profileImage ? (
                  <Image src={userinfo.profileImage} width={200} height={200} alt="profile"
                    className="w-28 h-28 object-cover rounded-full mx-auto m-2 bg-gray-300" />
                ) : (
                  <div className="w-28 h-28 bg-gray-300 rounded-full mx-auto m-2 flex items-center justify-center text-gray-500 text-xs">
                    No photo
                  </div>
                )}
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    handleProfileImage(userinfo.email, res[0].fileUrl);
                    setUserinfo({ ...userinfo, profileImage: res[0].fileUrl });
                    toast.success("Profile photo updated!");
                  }}
                  onUploadError={(error) => toast.error(`Upload error: ${error.message}`)}
                />
              </div>

              <form onSubmit={handlePersonalInfo}>
                <div className="grid grid-cols-6 gap-6 mt-4">

                  <div className="col-span-6 sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input type="text" disabled value={userinfo.username}
                      className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-200 cursor-not-allowed p-2" />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" value={userinfo.name}
                      onChange={(e) => setUserinfo({ ...userinfo, name: e.target.value })}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2" />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Email address</label>
                    <input type="email" disabled value={userinfo.email}
                      className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-200 cursor-not-allowed p-2" />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Phone No.</label>
                    <input type="text" value={userinfo.phone}
                      onChange={(e) => setUserinfo({ ...userinfo, phone: e.target.value })}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2" />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input type="text" value={userinfo.city}
                      onChange={(e) => setUserinfo({ ...userinfo, city: e.target.value })}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2" />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">State</label>
                    <select value={userinfo.state}
                      onChange={(e) => setUserinfo({ ...userinfo, state: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2">
                      <option value="">Select state</option>
                      <option value="AN">Andaman and Nicobar Islands</option>
                      <option value="AP">Andhra Pradesh</option>
                      <option value="AR">Arunachal Pradesh</option>
                      <option value="AS">Assam</option>
                      <option value="BR">Bihar</option>
                      <option value="CH">Chandigarh</option>
                      <option value="CG">Chhattisgarh</option>
                      <option value="DN">Dadra and Nagar Haveli</option>
                      <option value="DD">Daman and Diu</option>
                      <option value="DL">Delhi</option>
                      <option value="GA">Goa</option>
                      <option value="GJ">Gujarat</option>
                      <option value="HR">Haryana</option>
                      <option value="HP">Himachal Pradesh</option>
                      <option value="JK">Jammu and Kashmir</option>
                      <option value="JH">Jharkhand</option>
                      <option value="KA">Karnataka</option>
                      <option value="KL">Kerala</option>
                      <option value="LA">Ladakh</option>
                      <option value="LD">Lakshadweep</option>
                      <option value="MP">Madhya Pradesh</option>
                      <option value="MH">Maharashtra</option>
                      <option value="MN">Manipur</option>
                      <option value="ML">Meghalaya</option>
                      <option value="MZ">Mizoram</option>
                      <option value="NL">Nagaland</option>
                      <option value="OR">Odisha</option>
                      <option value="PY">Puducherry</option>
                      <option value="PB">Punjab</option>
                      <option value="RJ">Rajasthan</option>
                      <option value="SK">Sikkim</option>
                      <option value="TN">Tamil Nadu</option>
                      <option value="TS">Telangana</option>
                      <option value="TR">Tripura</option>
                      <option value="UP">Uttar Pradesh</option>
                      <option value="UK">Uttarakhand</option>
                      <option value="WB">West Bengal</option>
                    </select>
                  </div>

                </div>
                <div className="flex justify-start my-4">
                  <button type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                    Save Personal Info
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* ── CONTENT INFO ── */}
        <div className="px-4 py-5 sm:rounded-lg sm:p-6 border-t">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Content Info</h3>
              <p className="mt-1 text-sm text-gray-500">Info about your content</p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form onSubmit={handleContentInfo}>
                <div className="grid grid-cols-6 gap-6">

                  <div className="col-span-6 sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select value={userinfo.category}
                      onChange={(e) => setUserinfo({ ...userinfo, category: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2">
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

                  <div className="col-span-6">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea rows="3" value={userinfo.description}
                      onChange={(e) => setUserinfo({ ...userinfo, description: e.target.value })}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                      placeholder="Tell brands about yourself..." />
                  </div>

                  <div className="col-span-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Platforms</label>
                    {userinfo.platforms.map((item, index) => (
                      <div key={index} className="mt-2 flex gap-2 items-center">
                        <input type="text" disabled value={item.platform}
                          className="w-1/4 border-gray-300 rounded-md sm:text-sm p-2 bg-gray-100 capitalize" />
                        <input type="text" value={item.profile} placeholder={`${item.platform} profile URL`}
                          onChange={(e) => {
                            const updated = [...userinfo.platforms];
                            updated[index] = { ...updated[index], profile: e.target.value };
                            setUserinfo({ ...userinfo, platforms: updated });
                          }}
                          className="w-1/2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md sm:text-sm p-2" />
                        <select value={item.followers}
                          onChange={(e) => {
                            const updated = [...userinfo.platforms];
                            updated[index] = { ...updated[index], followers: e.target.value };
                            setUserinfo({ ...userinfo, platforms: updated });
                          }}
                          className="w-1/4 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md sm:text-sm p-2">
                          <option value="">Followers</option>
                          <option value="0-1k">0–1k</option>
                          <option value="1-5k">1k–5k</option>
                          <option value="5-10k">5k–10k</option>
                          <option value="10-50k">10k–50k</option>
                          <option value="50-100k">50k–100k</option>
                          <option value="100k+">100k+</option>
                        </select>
                      </div>
                    ))}
                  </div>

                </div>
                <div className="flex justify-start my-4">
                  <button type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                    Save Content Info
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* ── PACKAGES / PRICING ── */}
        <div className="px-4 py-5 sm:rounded-lg sm:p-6 border-t">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Packages &amp; Pricing</h3>
              <p className="mt-1 text-sm text-gray-500">Add your packages here for brands to see</p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form onSubmit={handlePackagesInfo}>
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Packages</label>

                    {userinfo.packages.map((item, index) => (
                      <div key={index} className="mt-3 p-4 border border-gray-200 rounded-lg grid grid-cols-6 gap-2">
                        <input type="text" value={item.title} placeholder="Package title"
                          onChange={(e) => {
                            const updated = [...userinfo.packages];
                            updated[index] = { ...updated[index], title: e.target.value };
                            setUserinfo({ ...userinfo, packages: updated });
                          }}
                          className="col-span-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md sm:text-sm p-2" />

                        <select value={item.platform}
                          onChange={(e) => {
                            const updated = [...userinfo.packages];
                            updated[index] = { ...updated[index], platform: e.target.value };
                            setUserinfo({ ...userinfo, packages: updated });
                          }}
                          className="col-span-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md sm:text-sm p-2">
                          <option value="">Platform</option>
                          <option value="instagram">Instagram</option>
                          <option value="facebook">Facebook</option>
                          <option value="youtube">YouTube</option>
                        </select>

                        <input type="text" value={item.price} placeholder="Price (₹)"
                          onChange={(e) => {
                            const updated = [...userinfo.packages];
                            updated[index] = { ...updated[index], price: e.target.value };
                            setUserinfo({ ...userinfo, packages: updated });
                          }}
                          className="col-span-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md sm:text-sm p-2" />

                        <textarea rows="2" value={item.description} placeholder="Describe your package"
                          onChange={(e) => {
                            const updated = [...userinfo.packages];
                            updated[index] = { ...updated[index], description: e.target.value };
                            setUserinfo({ ...userinfo, packages: updated });
                          }}
                          className="col-span-5 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md sm:text-sm p-2" />

                        <button type="button"
                          onClick={() => {
                            const updated = userinfo.packages.filter((_, i) => i !== index);
                            setUserinfo({ ...userinfo, packages: updated });
                          }}
                          className="col-span-1 text-red-500 hover:text-red-700 font-bold text-lg">✕</button>
                      </div>
                    ))}

                    <button type="button"
                      onClick={() => setUserinfo({
                        ...userinfo, packages: [...userinfo.packages, {
                          title: "", platform: "instagram", price: "", description: ""
                        }]
                      })}
                      className="mt-3 flex items-center gap-1 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium">
                      + Add Package
                    </button>
                  </div>
                </div>
                <div className="flex justify-start my-4">
                  <button type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                    Save Packages
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
