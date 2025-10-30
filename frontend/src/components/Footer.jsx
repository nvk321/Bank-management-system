export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
          <div>© {new Date().getFullYear()} MyBank. All rights reserved.</div>
          <div className="muted" style={{display:'flex',gap:12,alignItems:'center'}}>
            <a href="#" style={{color:'inherit',textDecoration:'none'}}>Privacy</a>
            <a href="#" style={{color:'inherit',textDecoration:'none'}}>Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
