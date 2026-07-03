import { useEffect, useMemo, useState } from "react";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import ChatHeader from "./components/layout/ChatHeader.jsx";
import Sidebar from "./components/layout/Sidebar.jsx";
import ChatContainer from "./components/layout/ChatContainer.jsx";
import { useAuthStore } from "./store/useAuthStore.js";
import { useChatStore } from "./store/useChatStore.js";

function App() {
  const [screen, setScreen] = useState("home");
  const [chatFilter, setChatFilter] = useState("chats");
  const { authUser, isCheckingAuth, checkAuth, logout, socket } = useAuthStore();
  const { users, selectedUser, setSelectedUser, getUsers, subscribeToMessages, unsubscribeFromMessages, reset } = useChatStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!authUser) return;
    getUsers();
  }, [authUser, getUsers]);

  useEffect(() => {
    if (!socket) return;
    subscribeToMessages();
    return unsubscribeFromMessages;
  }, [socket, subscribeToMessages, unsubscribeFromMessages]);

  const visibleUsers = useMemo(
    () => (chatFilter === "chats" ? users.filter((user) => user.lastMessage) : users),
    [chatFilter, users],
  );

  const sharedProps = {
    onGoHome: () => setScreen("home"),
    onGoLogin: () => setScreen("login"),
    onGoSignUp: () => setScreen("signup"),
  };

  const openChatShell = () => setScreen("chat");
  const handleLogout = async () => {
    await logout();
    reset();
    setScreen("home");
  };

  if (isCheckingAuth) {
    return (
      <div className="grid min-h-screen place-items-center text-slate-200">
        <div className="text-center"><div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" /><p className="mt-4 text-sm">Opening your session…</p></div>
      </div>
    );
  }

  const chatShell = (
    <div className="relative min-h-screen overflow-hidden px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex h-[calc(100vh-2.5rem)] w-full max-w-[1400px] overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_30px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
        <Sidebar
          currentFilter={chatFilter}
          onFilterChange={setChatFilter}
          users={visibleUsers}
          selectedUserId={selectedUser?._id}
          onUserSelect={setSelectedUser}
          onOpenSettings={() => setScreen("settings")}
          onLogout={handleLogout}
          hiddenOnMobile={Boolean(selectedUser)}
        />

        <div className={`${selectedUser ? "flex" : "hidden md:flex"} min-w-0 flex-1 flex-col border-l border-white/10 bg-[linear-gradient(180deg,rgba(10,16,30,0.8),rgba(5,8,18,0.95))]`}>
          <ChatHeader selectedUser={selectedUser} onBack={() => setSelectedUser(null)} onOpenSettings={() => setScreen("settings")} onLogout={handleLogout} />
          <ChatContainer key={selectedUser?._id || "no-chat"} selectedUser={selectedUser} />
        </div>
      </div>
    </div>
  );

  if (!authUser && screen === "login") {
    return (
      <LoginPage
        {...sharedProps}
        onGoHome={() => setScreen("home")}
        onSwitchAuth={() => setScreen("signup")}
        onLoginSuccess={openChatShell}
      />
    );
  }

  if (!authUser && screen === "signup") {
    return (
      <SignUpPage
        {...sharedProps}
        onGoHome={() => setScreen("home")}
        onSwitchAuth={() => setScreen("login")}
        onSignupSuccess={openChatShell}
      />
    );
  }

  if (authUser && screen !== "settings") {
    return chatShell;
  }

  if (authUser && screen === "settings") {
    return <SettingsPage onGoBack={() => setScreen("chat")} onLogout={handleLogout} />;
  }

  return <HomePage {...sharedProps} />;
}

export default App;
