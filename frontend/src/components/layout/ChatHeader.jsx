import { useAuthStore } from "../../store/useAuthStore.js";
import { useChatStore } from "../../store/useChatStore.js";
import { getInitials } from "../../lib/utils.js";

export default function ChatHeader({ selectedUser, onBack, onOpenSettings, onLogout }) {
  const { onlineUsers, socketStatus, socketError } = useAuthStore();
  const { typingUsers } = useChatStore();
  const online = selectedUser && onlineUsers.includes(String(selectedUser._id));
  const typing = selectedUser && typingUsers.includes(String(selectedUser._id));

  const connectionMessage = socketError || (socketStatus !== "connected" ? "Reconnecting live chat…" : "");

  return (
    <header className="flex min-h-[73px] items-center justify-between border-b border-white/10 px-4 py-4 sm:px-7">
      <div className="flex min-w-0 items-center gap-3">
        {selectedUser && <button onClick={onBack} type="button" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-200 md:hidden" aria-label="Back to conversations">←</button>}
        {selectedUser?.profilePic ? <img src={selectedUser.profilePic} alt="" className="h-10 w-10 shrink-0 rounded-2xl object-cover" /> : <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-semibold text-white">{getInitials(selectedUser?.fullName, "CZ")}</div>}
        <div className="min-w-0"><p className="truncate text-sm font-semibold text-white">{selectedUser?.fullName || "Your conversations"}</p><p className={`truncate text-xs ${connectionMessage ? "text-amber-300" : typing ? "text-sky-300" : "text-slate-400"}`}>{connectionMessage || (selectedUser ? typing ? "typing…" : online ? "Online" : "Offline" : "Choose someone to begin chatting.")}</p></div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3"><button type="button" onClick={onOpenSettings} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-100 transition hover:border-sky-400/30 hover:bg-sky-400/10 sm:px-4 sm:text-sm">Settings</button><button type="button" onClick={onLogout} className="hidden rounded-full border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-100 transition hover:bg-rose-500/20 sm:block sm:px-4 sm:text-sm">Logout</button></div>
    </header>
  );
}
