'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';

interface Props {
  html: string;
}

function animateCounter(el: HTMLElement, target: number, suffix: string) {
  let start = 0;
  const duration = 2000;
  const increment = target / (duration / 16);

  function update() {
    start += increment;
    if (start < target) {
      el.textContent = Math.floor(start).toLocaleString() + suffix;
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toLocaleString() + suffix;
    }
  }

  update();
}

export default function PublishingPageClient({ html }: Props) {
  useEffect(() => {
    // Hidden route input for forms
    const inputs = Array.from(document.querySelectorAll('input[name="route"]')) as HTMLInputElement[];
    const routeValue = window.location.href;
    inputs.forEach((input) => {
      input.value = routeValue;
    });

    // Custom window functions
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

    // Year element
    const yearElement = document.getElementById('year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear().toString();
    }

    // Counter animation logic
    const counters = [
      { selector: '.counter:nth-child(1) .counter-number', target: 6000, suffix: '+' },
      { selector: '.counter:nth-child(2) .counter-number', target: 1000, suffix: '+' },
      { selector: '.counter:nth-child(3) .counter-number', target: 600, suffix: '+' },
    ];

    const section = document.querySelector('.counter_sec');
    if (section) {
      let started = false;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !started) {
              started = true;
              counters.forEach(({ selector, target, suffix }) => {
                const el = document.querySelector(selector) as HTMLElement;
                if (el) animateCounter(el, target, suffix);
              });
              observer.disconnect();
            }
          });
        },
        { threshold: 0.4 }
      );
      observer.observe(section);
      return () => observer.disconnect();
    }
  }, []);

  return (
    <>
      <style>{`
        .payment-methods-grid img {
          height: 24px !important;
          width: auto !important;
          max-width: 60px !important;
          object-fit: contain !important;
        }
        .publishing-subproject footer {
          padding: 40px 0 !important;
        }
        .get-a-quote {
          display: none !important;
        }
      `}</style>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      
      {/* Loading subproject scripts */}
      <Script
        strategy="afterInteractive"
        src="https://code.jquery.com/jquery-3.6.0.min.js"
      />
      <Script
        strategy="afterInteractive"
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
      />
      <Script strategy="afterInteractive" src="/assets/js/slick.js" />
      <Script strategy="afterInteractive" src="/assets/js/custom.new.js" />
      
      <Script id="livechat-init" strategy="afterInteractive">
        {`(function(n,t,c){function i(n){return e._h?e._h.apply(null,n):e._q.push(n)}var e={_q:[],_h:null,_v:"2.0",on:function(){i(["on",c.call(arguments)])},once:function(){i(["once",c.call(arguments)])},off:function(){i(["off",c.call(arguments)])},get:function(){if(!e._h)throw new Error("[LiveChatWidget] You can't use getters before load.");return i(["get",c.call(arguments)])},call:function(){i(["call",c.call(arguments)])},init:function(){if(t.getElementById("livechat-tracking"))return;var n=t.createElement("script");n.id="livechat-tracking";n.async=!0;n.type="text/javascript";n.src="https://cdn.livechatinc.com/tracking.js";t.head.appendChild(n)}};n.LiveChatWidget=n.LiveChatWidget||e;if(!n.__lc.asyncInit){var s=!1;var r=function(){if(s)return;s=!0;e.init()};n.__lcLoad=r;["click","touchstart"].forEach(function(t){n.addEventListener(t,r,{once:!0,passive:!0})})}})(window,document,[].slice);`}
      </Script>
    </>
  );
}
