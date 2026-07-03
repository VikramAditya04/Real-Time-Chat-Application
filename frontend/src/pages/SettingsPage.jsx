import { useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { getInitials } from "../lib/utils.js";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export default function SettingsPage({ onGoBack, onLogout }) {
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();
  const [preview, setPreview] = useState(authUser.profilePic || "");
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const inputRef = useRef(null);

  const handleImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > MAX_IMAGE_BYTES) {
      setFeedback({ type: "error", text: "Choose an image smaller than 5 MB." });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => { setPreview(String(reader.result)); setFeedback({ type: "", text: "" }); };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!preview || preview === authUser.profilePic) return;
    const result = await updateProfile(preview);
    setFeedback(result.ok ? { type: "success", text: "Profile photo updated." } : { type: "error", text: result.error });
  };

  return <main className="relative min-h-screen overflow-hidden px-4 py-5 text-slate-100 sm:px-6 lg:px-8"><div className="mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_30px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl"><div className="flex w-full flex-col">
    <header className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-7"><div><p className="text-[10px] uppercase tracking-[0.45em] text-sky-300/70">Account settings</p><h1 className="mt-1 text-lg font-semibold tracking-wide text-white">Chatzy profile</h1></div><div className="flex items-center gap-3"><button type="button" onClick={onGoBack} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:border-sky-400/30">Back</button><button type="button" onClick={onLogout} className="rounded-full border border-rose-400/20 bg-rose-500/10 px-4 py-2 text-sm text-rose-100">Logout</button></div></header>
    <div className="flex flex-1 items-center justify-center p-5 sm:p-8"><div className="glass-panel w-full max-w-2xl rounded-4xl p-6 sm:p-8"><div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(14,20,38,0.98),rgba(9,13,25,0.88))] p-6 sm:p-8"><p className="text-[11px] uppercase tracking-[0.35em] text-sky-300/70">Profile</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-white">Your account</h2><p className="mt-3 text-sm leading-7 text-slate-300">Your identity is stored in MongoDB. Update your profile photo here; your name and email identify this assignment account.</p>
      <div className="mt-8 flex flex-col items-center gap-5 sm:flex-row"><button type="button" onClick={() => inputRef.current?.click()} className="group relative grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-[28px] border border-sky-400/20 bg-gradient-to-br from-sky-500 to-blue-800 text-3xl font-bold text-white">{preview ? <img src={preview} alt="Profile preview" className="h-full w-full object-cover" /> : getInitials(authUser.fullName)}<span className="absolute inset-x-0 bottom-0 bg-black/60 py-1.5 text-[10px] font-medium uppercase tracking-wider opacity-0 transition group-hover:opacity-100">Change</span></button><input ref={inputRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
        <div className="min-w-0 flex-1 space-y-4"><div><label className="text-xs uppercase tracking-[0.3em] text-slate-400">Full name</label><input disabled value={authUser.fullName} className="glass-input mt-2 w-full rounded-2xl px-4 py-3.5 text-sm disabled:opacity-70" /></div><div><label className="text-xs uppercase tracking-[0.3em] text-slate-400">Email address</label><input disabled value={authUser.email} className="glass-input mt-2 w-full rounded-2xl px-4 py-3.5 text-sm disabled:opacity-70" /></div></div>
      </div>
      {feedback.text && <p className={`mt-5 rounded-xl border px-4 py-3 text-sm ${feedback.type === "success" ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200" : "border-rose-400/20 bg-rose-500/10 text-rose-200"}`}>{feedback.text}</p>}
      <button type="button" disabled={isUpdatingProfile || !preview || preview === authUser.profilePic} onClick={handleSave} className="btn-primary mt-7 rounded-2xl px-6 py-4 text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{isUpdatingProfile ? "Uploading…" : "Save profile photo"}</button>
    </div></div></div>
  </div></div></main>;
}
