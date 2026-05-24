import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              静谧花园
            </Link>
            <p className="footer-desc">一个关于设计、技术与生活的写作空间。</p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4>导航</h4>
              <Link href="/">首页</Link>
              <Link href="/diary">日记</Link>
              <Link href="/maker">制作器</Link>
            </div>
            <div className="footer-col">
              <h4>联系</h4>
              <a href="#">Twitter</a>
              <a href="#">GitHub</a>
              <a href="#">RSS</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 静谧花园 · Tranquil Garden. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
