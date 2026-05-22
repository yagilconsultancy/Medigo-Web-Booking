'use client';
import Script from 'next/script';

function getTawkChatId(): string | null {
  const id = process.env.NEXT_PUBLIC_TAWK_CHAT_ID?.trim();
  return id ? id : null;
}

/**
 * tawk.to live chat widget
 *
 * Set `NEXT_PUBLIC_TAWK_CHAT_ID` to the portion after `https://tawk.to/chat/`
 * (it contains both the Property ID and Widget ID).
 */
export function TawkToWidget() {
  const chatId = getTawkChatId();
  if (!chatId) return null;

  return (
    <Script
      id="tawk-to-widget"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
          (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/${chatId}';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
          })();
        `,
      }}
    />
  );
}
