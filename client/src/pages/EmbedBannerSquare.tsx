export default function EmbedBannerSquare() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=300, initial-scale=1.0" />
        <meta name="robots" content="noindex, nofollow" />
        <title>Dyneros Banner 300x300</title>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { background: transparent; overflow: hidden; font-family: Arial, Helvetica, sans-serif; }
          a { text-decoration: none; display: block; }
          .banner {
            width: 300px; height: 300px;
            background: linear-gradient(160deg, #050816, #0d1f35);
            color: #fff;
            border-radius: 0;
            padding: 28px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            border: 1px solid rgba(255,255,255,0.1);
          }
          .logo { width: 40px; height: 40px; background: #f59e0b; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 20px; color: #000; margin-bottom: 14px; }
          .title { font-size: 24px; font-weight: 900; color: #fff; line-height: 1.2; margin-bottom: 8px; }
          .sub { font-size: 12px; color: rgba(255,255,255,0.55); line-height: 1.6; }
          .cta { display: block; background: #f59e0b; color: #000; padding: 12px 20px; border-radius: 999px; font-weight: 700; font-size: 13px; text-align: center; }
        `}</style>
      </head>
      <body>
        <a href="https://dyneros.com/en/dyneros-landing" target="_blank" rel="noopener">
          <div className="banner">
            <div>
              <div className="logo">D</div>
              <div className="title">Dyneros</div>
              <div className="sub">AI · Blockchain · Web · Automation · Marketing</div>
            </div>
            <span className="cta">Discover Dyneros →</span>
          </div>
        </a>
      </body>
    </html>
  );
}
