export default function EmbedBannerHorizontal() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=728, initial-scale=1.0" />
        <meta name="robots" content="noindex, nofollow" />
        <title>Dyneros Banner 728x90</title>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { background: transparent; overflow: hidden; font-family: Arial, Helvetica, sans-serif; }
          a { text-decoration: none; display: block; }
          .banner {
            width: 728px; height: 90px;
            background: linear-gradient(135deg, #050816, #102a43);
            color: #fff;
            border-radius: 0;
            padding: 0 28px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border: 1px solid rgba(255,255,255,0.1);
          }
          .left { display: flex; align-items: center; gap: 16px; }
          .logo { width: 36px; height: 36px; background: #f59e0b; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 18px; color: #000; flex-shrink: 0; }
          .title { font-size: 18px; font-weight: 800; color: #fff; }
          .sub { font-size: 12px; color: rgba(255,255,255,0.55); margin-top: 2px; }
          .cta { background: #f59e0b; color: #000; padding: 10px 22px; border-radius: 999px; font-weight: 700; font-size: 13px; white-space: nowrap; }
        `}</style>
      </head>
      <body>
        <a href="https://dyneros.com/en/dyneros-landing" target="_blank" rel="noopener">
          <div className="banner">
            <div className="left">
              <div className="logo">D</div>
              <div>
                <div className="title">Dyneros Digital Ecosystem</div>
                <div className="sub">AI · Blockchain · Web Platforms · Automation · Marketing</div>
              </div>
            </div>
            <span className="cta">Discover Dyneros</span>
          </div>
        </a>
      </body>
    </html>
  );
}
