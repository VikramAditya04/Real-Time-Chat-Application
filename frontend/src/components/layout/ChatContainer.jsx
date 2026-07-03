import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore.js";
import { useChatStore } from "../../store/useChatStore.js";
import { formatMessageTime } from "../../lib/utils.js";
import MessageSkeleton from "../skeletons/MessageSkeleton.jsx";
import NoChatSelected from "./NoChatSelected.jsx";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export default function ChatContainer({ selectedUser }) {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [localError, setLocalError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { authUser } = useAuthStore();
  const { messages, isMessagesLoading, sendError, getMessages, sendMessage, emitTyping } = useChatStore();

  useEffect(() => {
    if (selectedUser?._id) getMessages(selectedUser._id);
  }, [selectedUser?._id, getMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => () => {
    clearTimeout(typingTimeoutRef.current);
    emitTyping(false);
  }, [emitTyping]);

  if (!selectedUser) return <NoChatSelected />;

  const handleTextChange = (event) => {
    setText(event.target.value);
    emitTyping(true);
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => emitTyping(false), 900);
  };

  const handleImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return setLocalError("Please select an image file");
    if (file.size > MAX_IMAGE_BYTES) return setLocalError("Image must be smaller than 5 MB");
    const reader = new FileReader();
    reader.onload = () => { setImagePreview(String(reader.result)); setLocalError(""); };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!text.trim() && !imagePreview) return;
    clearTimeout(typingTimeoutRef.current);
    emitTyping(false);
    setIsSending(true);
    const result = await sendMessage({ text: text.trim(), image: imagePreview || undefined });
    setIsSending(false);
    if (result.ok) { setText(""); clearImage(); setLocalError(""); }
    else setLocalError(result.error);
  };

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        {isMessagesLoading ? <MessageSkeleton /> : messages.length === 0 ? <div className="grid h-full place-items-center p-6 text-center"><div><div className="text-4xl">👋</div><h2 className="mt-4 text-xl font-semibold text-white">Start the conversation</h2><p className="mt-2 text-sm text-slate-400">Send {selectedUser.fullName} a message. It will be saved to your chat history.</p></div></div> : (
          <div className="space-y-4 p-4 sm:p-7">{messages.map((message) => {
            const mine = String(message.senderId) === String(authUser._id);
            return <div key={message._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}><div className={`max-w-[85%] rounded-2xl border px-4 py-3 shadow-lg sm:max-w-[70%] ${mine ? "border-sky-400/20 bg-[linear-gradient(135deg,rgba(37,99,235,0.82),rgba(14,116,144,0.72))]" : "border-white/10 bg-white/6"}`}>
              {message.image && <a href={message.image} target="_blank" rel="noreferrer"><img src={message.image} alt="Shared attachment" className="mb-2 max-h-80 w-full rounded-xl object-cover" /></a>}
              {message.text && <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-50">{message.text}</p>}
              <div className={`mt-1.5 flex items-center justify-end gap-1.5 text-[10px] ${mine ? "text-sky-100/75" : "text-slate-400"}`}><span>{formatMessageTime(message.createdAt)}</span>{mine && <span title={message.status}>{message.status === "read" ? "✓✓" : message.status === "delivered" ? "✓✓" : "✓"}</span>}</div>
            </div></div>;
          })}<div ref={bottomRef} /></div>
        )}
      </div>

      <div className="border-t border-white/10 bg-slate-950/40 p-3 sm:p-5">
        {imagePreview && <div className="relative mb-3 inline-block"><img src={imagePreview} alt="Attachment preview" className="h-24 w-24 rounded-2xl border border-white/10 object-cover" /><button type="button" onClick={clearImage} aria-label="Remove attachment" className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-rose-500 text-sm text-white">×</button></div>}
        {(localError || sendError) && <p role="alert" className="mb-3 text-sm text-rose-300">{localError || sendError}</p>}
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <input ref={fileInputRef} onChange={handleImage} className="hidden" type="file" accept="image/*" />
          <button type="button" onClick={() => fileInputRef.current?.click()} aria-label="Attach an image" className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5 text-xl text-slate-200 transition hover:border-sky-400/30">＋</button>
          <textarea value={text} onChange={handleTextChange} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} rows={1} maxLength={2000} placeholder={`Message ${selectedUser.fullName}`} className="glass-input min-h-12 max-h-32 flex-1 resize-none rounded-2xl px-4 py-3 text-sm leading-6" />
          <button disabled={isSending || (!text.trim() && !imagePreview)} type="submit" className="btn-primary h-12 shrink-0 rounded-2xl px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{isSending ? "Sending…" : "Send"}</button>
        </form>
      </div>
    </section>
  );
}
