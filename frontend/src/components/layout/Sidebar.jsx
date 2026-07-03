import { useMemo, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore.js";
import { useChatStore } from "../../store/useChatStore.js";
import { formatRelativeTime, getInitials } from "../../lib/utils.js";
import SidebarSkeleton from "../skeletons/SidebarSkeleton.jsx";

const filterLabels = [{ key: "chats", label: "Chats" }, { key: "users", label: "Users" }];

function Avatar({ user, online, size = "h-11 w-11" }) {
  return (
    <div className={`${size} relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 text-sm font-semibold text-white`}>
      {user.profilePic ? <img src={user.profilePic} alt="" className="h-full w-full object-cover" /> : getInitials(user.fullName)}
      {online && <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-slate-950 bg-emerald-400" />}
    </div>
  );
}

export default function Sidebar({ currentFilter, onFilterChange, users, selectedUserId, onUserSelect, onOpenSettings, onLogout, hiddenOnMobile }) {
  const [search, setSearch] = useState("");
  const { authUser, onlineUsers } = useAuthStore();
  const { isUsersLoading } = useChatStore();
  const filteredUsers = useMemo(() => users.filter((user) => user.fullName.toLowerCase().includes(search.trim().toLowerCase())), [search, users]);

  return (
    <aside className={`${hiddenOnMobile ? "hidden md:flex" : "flex"} w-full shrink-0 flex-col bg-[linear-gradient(180deg,rgba(7,11,20,0.96),rgba(5,8,16,0.92))] md:w-[340px]`}>
      <div className="border-b border-white/10 px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div><p className="text-[10px] uppercase tracking-[0.45em] text-sky-300/70">Real-time workspace</p><h1 className="mt-1 text-2xl font-black tracking-tight text-white">Chatzy</h1></div>
          <button type="button" onClick={onOpenSettings} title="Open profile settings" className="rounded-2xl transition hover:ring-2 hover:ring-sky-400/40"><Avatar user={authUser} size="h-10 w-10" /></button>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
          {filterLabels.map((filter) => <button key={filter.key} type="button" onClick={() => onFilterChange(filter.key)} className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium transition ${currentFilter === filter.key ? "bg-sky-500/15 text-white" : "text-slate-400 hover:text-slate-100"}`}>{filter.label}</button>)}
        </div>
        <input value={search} onChange={(event) => setSearch(event.target.value)} type="search" placeholder="Search people" className="glass-input mt-4 w-full rounded-2xl px-4 py-3 text-sm" />
      </div>

      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 text-xs uppercase tracking-[0.3em] text-slate-400 sm:px-6"><span>{currentFilter === "chats" ? "Recent chats" : "All users"}</span><span>{filteredUsers.length}</span></div>

      <div className="flex-1 overflow-y-auto px-3 py-3 sm:px-4">
        {isUsersLoading ? <SidebarSkeleton /> : filteredUsers.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm leading-6 text-slate-400">{search ? "No people match your search." : currentFilter === "chats" ? "No conversations yet. Open Users and say hello." : "No other users have signed up yet."}</div>
        ) : <div className="space-y-2">{filteredUsers.map((user) => {
          const online = onlineUsers.includes(String(user._id));
          const lastText = user.lastMessage?.image && !user.lastMessage?.text ? "📷 Photo" : user.lastMessage?.text;
          return <button key={user._id} type="button" onClick={() => onUserSelect(user)} className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${user._id === selectedUserId ? "border-sky-400/30 bg-sky-500/10" : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"}`}>
            <Avatar user={user} online={online} />
            <div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><p className="truncate text-sm font-semibold text-white">{user.fullName}</p><span className="shrink-0 text-[11px] text-slate-400">{formatRelativeTime(user.lastMessage?.createdAt)}</span></div><p className="mt-1 truncate text-xs text-slate-400">{currentFilter === "chats" ? lastText || "Start a conversation" : online ? "Online now" : "Offline"}</p></div>
            {user.unreadCount > 0 ? <span className="grid min-h-5 min-w-5 place-items-center rounded-full bg-sky-500 px-1 text-[10px] font-bold text-white">{user.unreadCount > 99 ? "99+" : user.unreadCount}</span> : <span className={`h-2.5 w-2.5 rounded-full ${online ? "bg-emerald-400" : "bg-slate-600"}`} />}
          </button>;
        })}</div>}
      </div>

      <div className="border-t border-white/10 p-4"><div className="mb-3 min-w-0 px-1"><p className="truncate text-sm font-semibold text-white">{authUser.fullName}</p><p className="truncate text-xs text-slate-400">{authUser.email}</p></div><div className="flex gap-2"><button type="button" onClick={onOpenSettings} className="btn-secondary flex-1 rounded-2xl px-4 py-3 text-sm font-medium text-slate-100">Settings</button><button type="button" onClick={onLogout} className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-100 transition hover:bg-rose-500/20">Logout</button></div></div>
    </aside>
  );
}
