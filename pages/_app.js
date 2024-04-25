import { AuthProvider } from "@/context/AuthContext";
import { ChatProvider } from "@/context/ChatContext";
import { ProfileProvider } from "@/context/ProfileContext";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ProfileProvider>
        <ChatProvider>
          <Component {...pageProps} />
        </ChatProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}
