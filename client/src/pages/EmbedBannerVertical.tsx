export default function EmbedBannerVertical() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=300, initial-scale=1.0" />
        <meta name="robots" content="noindex, nofollow" />
        <title>Dyneros Banner 300x600</title>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { background: transparent; overflow: hidden; font-family: Arial, Helvetica, sans-serif; }
          a { text-decoration: none; display: block; }
          .banner {
            width: 300px; height: 600px;
            background: linear-gradient(180deg, #050816, #0d1f35, #050816);
            color: #fff;
            border-radius: 0;
            padding: 32px 24px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            border: 1px solid rgba(255,255,255,0.1);
          }
          .logo { width: 48px; height: 48px; background: #f59e0b; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 24px; color: #000; margin-bottom: 20px; }
          .title { font-size: 28px; font-weight: 900; color: #fff; line-height: 1.2; margin-bottom: 12px; }
          .sub { font-size: 13px; color: rgba(255,255,255,0.55); line-height: 1.7; margin-bottom: 24px; }
          .features { list-style: none; margin-bottom: 0; }
          .feature { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; font-size: 13px; color: rgba(255,255,255,0.7); }
          .dot { width: 7px; height: 7px; background: #f59e0b; border-radius: 50%; flex-shrink: 0; }
          .cta { display: block; background: #f59e0b; color: #000; padding: 14px; border-radius: 12px; font-weight: 800; font-size: 14px; text-align: center; }
        `}</style>
      </head>
      <body>
        <a href="https://dyneros.com/en/dyneros-landing" target="_blank" rel="noopener">
          <div className="banner">
            <div>
              <div className="logo">D</div>
              <div className="title">Dyneros</div>
              <div className="sub">The complete digital ecosystem for modern businesses.</div>
              <ul className="features">
                {["AI & Automation", "Blockchain & Smart Contracts", "Web Platforms", "Digital Wallets", "Marketing Tools", "Digital Consulting"].map((f) => (
                  <li key={f} className="feature">
                    <span className="dot" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <span className="cta">Discover Dyneros →</span>
          </div>
        </a>
      </body>
    </html>
  );
}
