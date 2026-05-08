export default function EmbedBannerSocial() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=1200, initial-scale=1.0" />
        <meta name="robots" content="noindex, nofollow" />
        <title>Dyneros Banner 1200x628</title>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { background: transparent; overflow: hidden; font-family: Arial, Helvetica, sans-serif; }
          a { text-decoration: none; display: block; }
          .banner {
            width: 1200px; height: 628px;
            background: linear-gradient(135deg, #050816 0%, #0d1f35 50%, #050816 100%);
            color: #fff;
            border-radius: 0;
            padding: 64px 80px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 48px;
            border: 1px solid rgba(255,255,255,0.08);
          }
          .left { flex: 1; }
          .eyebrow { font-size: 14px; color: #f59e0b; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 16px; }
          .title { font-size: 52px; font-weight: 900; line-height: 1.1; color: #fff; margin-bottom: 20px; }
          .title span { color: #f59e0b; }
          .sub { font-size: 18px; color: rgba(255,255,255,0.6); line-height: 1.6; max-width: 560px; margin-bottom: 36px; }
          .tags { display: flex; gap: 10px; flex-wrap: wrap; }
          .tag { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.7); padding: 6px 14px; border-radius: 999px; font-size: 13px; }
          .right { flex-shrink: 0; text-align: center; }
          .logo-big { width: 100px; height: 100px; background: #f59e0b; border-radius: 24px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 52px; color: #000; margin: 0 auto 24px; }
          .cta { display: block; background: #f59e0b; color: #000; padding: 18px 44px; border-radius: 999px; font-weight: 800; font-size: 18px; white-space: nowrap; }
        `}</style>
      </head>
      <body>
        <a href="https://dyneros.com/en/dyneros-landing" target="_blank" rel="noopener">
          <div className="banner">
            <div className="left">
              <div className="eyebrow">Digital Ecosystem</div>
              <div className="title">Dyneros: Innovate,<br /><span>Connect & Grow</span></div>
              <div className="sub">AI, Blockchain, Web Platforms, Automation and Marketing Tools for forward-thinking companies.</div>
              <div className="tags">
                <span className="tag">AI & Automation</span>
                <span className="tag">Blockchain</span>
                <span className="tag">Web Platforms</span>
                <span className="tag">Digital Wallets</span>
                <span className="tag">Marketing</span>
              </div>
            </div>
            <div className="right">
              <div className="logo-big">D</div>
              <span className="cta">Get Started →</span>
            </div>
          </div>
        </a>
      </body>
    </html>
  );
}
