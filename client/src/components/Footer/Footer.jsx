import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <h2 className="footer-title">✂️ Haircut Workshop</h2>
        <p className="footer-intro">
          Ready for a fresh look? Get in touch with our team to book your
          appointment today.
        </p>

        {/* Business Info */}
        <div className="footer-business-info">
          <div className="business-info-item">
            <span className="info-icon">📍</span>
            <div>
              <strong>Location</strong>
              <p>Amman - LTUC</p>
            </div>
          </div>
          <div className="business-info-item">
            <span className="info-icon">🕒</span>
            <div>
              <strong>Hours</strong>
              <p>Everyday: 12:00 PM - 9:00 PM</p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="footer-team-section">
          <h3 className="team-title">Our Development Team</h3>
          <div className="footer-team-grid">
            {/* Saif */}
            <div className="team-member-card">
              <div className="member-avatar">S</div>
              <h4 className="member-name">Saif</h4>
              <p className="member-role">Lead Developer</p>
              <div className="member-contacts">
                <a href="tel:0778522281" className="contact-link">
                  📞 0778522281
                </a>
                <a
                  href="mailto:saifalkurdi66@gmail.com"
                  className="contact-link"
                >
                  ✉️ saifalkurdi66@gmail.com
                </a>
              </div>
            </div>

            {/* Hammam */}
            <div className="team-member-card">
              <div className="member-avatar">H</div>
              <h4 className="member-name">Hammam</h4>
              <p className="member-role">Full-Stack Developer</p>
              <div className="member-contacts">
                <a href="tel:0785329757" className="contact-link">
                  📞 0785329757
                </a>
                <a
                  href="mailto:hammamnababteh098@gmail.com"
                  className="contact-link"
                >
                  ✉️ hammamnababteh098@gmail.com
                </a>
              </div>
            </div>

            {/* Naser */}
            <div className="team-member-card">
              <div className="member-avatar">N</div>
              <h4 className="member-name">Naser</h4>
              <p className="member-role">Full-Stack Developer</p>
              <div className="member-contacts">
                <a href="tel:0787614615" className="contact-link">
                  📞 0787614615
                </a>
                <a
                  href="mailto:naser.musleh120@gmail.com"
                  className="contact-link"
                >
                  ✉️ naser.musleh120@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>
            {new Date().getFullYear()} Haircut Workshop. All rights reserved.
          </p>
          <p className="made-with-love">Made with ❤️ by Saif, Hammam & Naser</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
