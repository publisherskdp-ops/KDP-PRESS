'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';

interface Props {
  html: string;
}

export default function ThankYouPageClient({ html }: Props) {
  useEffect(() => {
    (window as any).toggleLiveChat = function () {
      if (typeof (window as any).__lcLoad === 'function') {
        (window as any).__lcLoad();
      }
      if (typeof (window as any).LiveChatWidget !== 'undefined' && typeof (window as any).LiveChatWidget.call === 'function') {
        (window as any).LiveChatWidget.call('maximize');
      }
    };

    (window as any).toggleChat = (window as any).toggleLiveChat;
    (window as any).setButtonURL = (window as any).toggleLiveChat;
  }, []);

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <Script id="livechat-thankyou" strategy="afterInteractive">
        {`(function(n,t,c){function i(n){return e._h?e._h.apply(null,n):e._q.push(n)}var e={_q:[],_h:null,_v:"2.0",on:function(){i(["on",c.call(arguments)])},once:function(){i(["once",c.call(arguments)])},off:function(){i(["off",c.call(arguments)])},get:function(){if(!e._h)throw new Error("[LiveChatWidget] You can't use getters before load.");return i(["get",c.call(arguments)])},call:function(){i(["call",c.call(arguments)])},init:function(){if(t.getElementById("livechat-tracking"))return;var n=t.createElement("script");n.id="livechat-tracking";n.async=!0;n.type="text/javascript";n.src="https://cdn.livechatinc.com/tracking.js";t.head.appendChild(n)}};n.LiveChatWidget=n.LiveChatWidget||e;if(!n.__lc.asyncInit){var s=!1;var r=function(){if(s)return;s=!0;e.init()};n.__lcLoad=r;["click","touchstart"].forEach(function(t){n.addEventListener(t,r,{once:!0,passive:!0})})}})(window,document,[].slice);`}
      </Script>
    </>
  );
}
