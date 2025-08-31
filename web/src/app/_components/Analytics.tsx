'use client'

import Script from 'next/script'

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

const Analytics = () => {
  if (!GA_TRACKING_ID) {
    return null
  }

  return (
    <>
      <Script
        id="ga-loader"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(){
              var s = document.createElement('script');
              s.async = true;
              s.src = 'https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}';
              document.head.appendChild(s);
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);} 
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', { page_path: window.location.pathname });
            })();
          `,
        }}
      />
    </>
  )
}

export default Analytics
