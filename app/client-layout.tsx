'use client';

import { useEffect } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import "@/styles/chatbot-animations.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserProvider } from "@/contexts/UserContext";
import { SurveyProvider } from "@/contexts/SurveyContext";
import NextAuthProvider from "@/components/providers/session-provider";
import ChatbotProvider from "@/components/providers/ChatbotProvider";

const inter = Inter({ subsets: ["latin"] });

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fix hydration issues by removing fdprocessedid attributes
  useEffect(() => {
    // Remove any fdprocessedid attributes from the DOM after hydration
    const removeFdProcessedIds = () => {
      document.querySelectorAll('[fdprocessedid]').forEach(element => {
        element.removeAttribute('fdprocessedid');
      });
    };
    
    // Run once after hydration
    removeFdProcessedIds();
    
    // Also set up a mutation observer to handle dynamically added elements
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'fdprocessedid') {
          const element = mutation.target as HTMLElement;
          element.removeAttribute('fdprocessedid');
        }
      });
    });
    
    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['fdprocessedid']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className} suppressHydrationWarning={true}>
        <NextAuthProvider>
          <AuthProvider>
            <UserProvider>
              <SurveyProvider>
                <Navbar />
                <ChatbotProvider>
                  {children}
                </ChatbotProvider>
                <Toaster />
              </SurveyProvider>
            </UserProvider>
          </AuthProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}