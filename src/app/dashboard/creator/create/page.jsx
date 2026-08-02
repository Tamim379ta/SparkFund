"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { FiUpload } from "react-icons/fi";

const categories = ["Technology", "Health", "Art & Music", "Community", "Education", "Environment"];

export default function CreateCampaignPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    image: "",
    goalCredits: "",
    deadline: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageUploading(true);
    setPreview(URL.createObjectURL(file));

    const data = new FormData();
    data.append("image", file);

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
        { method: "POST", body: data }
      );
      const json = await res.json();
      setForm((prev) => ({ ...prev, image: json.data.url }));
      toast.success("Image uploaded!");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) return toast.error("Please upload a campaign image");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...form, goalCredits: Number(form.goalCredits) }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      toast.success("Campaign submitted for review!");
      router.refresh();
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "bg-transparent outline-none text-text w-full text-sm placeholder:text-muted/50";
  const wrapperClass = "flex items-center gap-3 bg-surface border border-white/10 hover:border-primary/50 focus-within:border-primary rounded-xl px-4 py-3 transition-all";

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-text">Create Campaign</h1>
        <p className="text-muted mt-1">Fill in the details below and submit for admin approval.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Title */}
        <div className="flex flex-col gap-1">
          <label className="text-muted text-sm">Campaign Title</label>
          <div className={wrapperClass}>
            <input
              type="text"
              name="title"
              placeholder="Enter campaign title"
              value={form.title}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-muted text-sm">Description</label>
          <textarea
            name="description"
            placeholder="Describe your campaign in detail..."
            value={form.description}
            onChange={handleChange}
            required
            rows={5}
            className="bg-surface border border-white/10 hover:border-primary/50 focus:border-primary rounded-xl px-4 py-3 text-text text-sm placeholder:text-muted/50 outline-none transition-all resize-none"
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1">
          <label className="text-muted text-sm">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="bg-surface border border-white/10 hover:border-primary/50 focus:border-primary rounded-xl px-4 py-3 text-text text-sm outline-none transition-all"
          >
            <option value="" disabled>Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Goal Credits */}
        <div className="flex flex-col gap-1">
          <label className="text-muted text-sm">Funding Goal (Credits)</label>
          <div className={wrapperClass}>
            <input
              type="number"
              name="goalCredits"
              placeholder="e.g. 5000"
              value={form.goalCredits}
              onChange={handleChange}
              required
              min={100}
              className={inputClass}
            />
          </div>
        </div>

        {/* Deadline */}
        <div className="flex flex-col gap-1">
          <label className="text-muted text-sm">Deadline</label>
          <div className={wrapperClass}>
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              required
              min={new Date().toISOString().split("T")[0]}
              className={inputClass}
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="flex flex-col gap-1">
          <label className="text-muted text-sm">Campaign Image</label>
          <label className="cursor-pointer">
            <div className={`${wrapperClass} justify-center flex-col py-8 border-dashed`}>
              {preview ? (
                <img src={preview} alt="preview" className="w-full h-48 object-cover rounded-lg" />
              ) : (
                <>
                  <FiUpload className="text-muted text-3xl mb-2" />
                  <p className="text-muted text-sm">Click to upload image</p>
                  <p className="text-muted/50 text-xs mt-1">PNG, JPG up to 10MB</p>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          {imageUploading && (
            <p className="text-primary text-xs mt-1 animate-pulse">Uploading image...</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || imageUploading}
          className="bg-primary text-white font-semibold rounded-full py-4 mt-2 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Submit for Review"}
        </button>
      </form>
    </div>
  );
}