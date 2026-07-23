function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2>ACE</h2>

          <p>
            AI-powered study companion built to help students learn faster,
            revise smarter, and stay organized.
          </p>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h5>Navigation</h5>

            <a href="#">Home</a>
            <a href="#">Features</a>
            <a href="#">FAQ</a>
          </div>

          <div className="footer-column">
            <h5>Resources</h5>

            <a
              href="https://github.com/AbrarH4"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>

            <a href="#">Privacy Policy</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">© 2026 ACE • Built with React + AI</div>
    </footer>
  );
}

export default Footer;
