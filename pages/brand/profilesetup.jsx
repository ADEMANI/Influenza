import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function BrandProfileSetup() {
  const [info, setInfo] = useState({
    name: "", email: "", location: "", description: "",
    category: [], website: "", phone: "", city: "", state: "", pincode: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.email) {
      fetch("/api/brand/getbrand", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa("junaid:2002")}`,
        },
        body: JSON.stringify({ email: user.email }),
      })
        .then((r) => r.json())
        .then((d) => { if (d.success && d.brand) setInfo({ ...info, ...d.brand, email: user.email }); })
        .catch(() => {});
      setInfo((prev) => ({ ...prev, email: user.email }));
    }
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/brand/profileupdate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa("junaid:2002")}`,
        },
        body: JSON.stringify(info),
      });
      const data = await res.json();
      if (data.success) toast.success("Profile saved!");
      else toast.error(data.message || "Error saving");
    } catch {
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-bold mb-6">Brand Profile Setup</h1>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
              <input
                type="text" value={info.name}
                onChange={(e) => setInfo({ ...info, name: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                placeholder="Your brand name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email" value={info.email} disabled
                className="w-full border-2 border-gray-100 rounded-lg px-3 py-2 text-sm bg-gray-50 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text" value={info.phone}
                onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                placeholder="Phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                type="text" value={info.website}
                onChange={(e) => setInfo({ ...info, website: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                placeholder="https://yourbrand.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Office Address</label>
            <input
              type="text" value={info.location}
              onChange={(e) => setInfo({ ...info, location: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
              placeholder="Full office address"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text" value={info.city}
                onChange={(e) => setInfo({ ...info, city: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <select
                value={info.state}
                onChange={(e) => setInfo({ ...info, state: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
              >
                <option value="">Select state</option>
                <option value="AP">Andhra Pradesh</option>
                <option value="AR">Arunachal Pradesh</option>
                <option value="AS">Assam</option>
                <option value="BR">Bihar</option>
                <option value="CG">Chhattisgarh</option>
                <option value="DL">Delhi</option>
                <option value="GA">Goa</option>
                <option value="GJ">Gujarat</option>
                <option value="HR">Haryana</option>
                <option value="HP">Himachal Pradesh</option>
                <option value="JK">Jammu and Kashmir</option>
                <option value="JH">Jharkhand</option>
                <option value="KA">Karnataka</option>
                <option value="KL">Kerala</option>
                <option value="MP">Madhya Pradesh</option>
                <option value="MH">Maharashtra</option>
                <option value="MN">Manipur</option>
                <option value="ML">Meghalaya</option>
                <option value="MZ">Mizoram</option>
                <option value="NL">Nagaland</option>
                <option value="OR">Odisha</option>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
              <input
                type="text" value={info.pincode}
                onChange={(e) => setInfo({ ...info, pincode: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                placeholder="PIN code"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category / Industry</label>
            <select
              value={info.category?.[0] || ""}
              onChange={(e) => setInfo({ ...info, category: [e.target.value] })}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            >
              <option value="">Select your industry</option>
              <option value="fashion">Fashion & Apparel</option>
              <option value="food">Food & Beverage</option>
              <option value="tech">Technology</option>
              <option value="beauty">Beauty & Cosmetics</option>
              <option value="health">Health & Wellness</option>
              <option value="travel">Travel & Hospitality</option>
              <option value="education">Education</option>
              <option value="finance">Finance</option>
              <option value="ecommerce">E-Commerce</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">About Your Brand</label>
            <textarea
              rows={4} value={info.description}
              onChange={(e) => setInfo({ ...info, description: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
              placeholder="Tell creators about your brand, products and what kind of collaborations you're looking for..."
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Brand Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
