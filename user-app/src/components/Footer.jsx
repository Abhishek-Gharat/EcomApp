import { Link } from 'react-router-dom';
import { Send, Share2, Globe, MessageCircle, ShieldCheck, Truck, RefreshCw, CreditCard } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  const columns = [
    {
      title: 'Shop',
      links: [
        { label: 'All Products', to: '/' },
        { label: 'Headphones', to: '/' },
        { label: 'Speakers', to: '/' },
        { label: 'Accessories', to: '/' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', to: '/' },
        { label: 'Careers', to: '/' },
        { label: 'Press', to: '/' },
        { label: 'Contact', to: '/' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', to: '/' },
        { label: 'Shipping', to: '/' },
        { label: 'Returns', to: '/' },
        { label: 'Warranty', to: '/' },
      ],
    },
  ];

  const trustItems = [
    { Icon: Truck, label: 'Free shipping over Rs. 5,000' },
    { Icon: RefreshCw, label: '30-day easy returns' },
    { Icon: ShieldCheck, label: '1-year warranty' },
    { Icon: CreditCard, label: 'Secure checkout' },
  ];

  const socials = [Send, Share2, Globe, MessageCircle];

  return (
    <footer className="bg-pulse-bg-dark border-t border-pulse-border">
      {/* Trust strip */}
      <div className="border-b border-pulse-border">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map(({ Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pulse-gold/15 text-pulse-gold shrink-0">
                <Icon className="w-5 h-5" />
              </span>
              <span className="text-sm text-pulse-text-secondary">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-2 md:grid-cols-5 gap-10">
        {/* Brand */}
        <div className="col-span-2">
          <Link to="/" className="flex items-center gap-2 text-2xl font-black tracking-tight mb-4">
            <span className="h-2.5 w-2.5 rounded-full bg-pulse-gold" />
            <span className="text-pulse-text">
              Pulse<span className="text-pulse-accent">Bay</span>
            </span>
          </Link>
          <p className="text-pulse-text-secondary text-sm leading-relaxed max-w-xs mb-6">
            Premium audio tech built for people who move. Charged, focused, and always ready.
          </p>
          <div className="flex gap-3">
            {socials.map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-pulse-gray border border-pulse-border text-pulse-text-secondary transition-all hover:border-pulse-gold/50 hover:text-pulse-gold hover:-translate-y-0.5"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-bold uppercase tracking-wider text-pulse-text mb-4">{col.title}</h4>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-pulse-text-secondary hover:text-pulse-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-pulse-border">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-pulse-text-muted">
            © {year} PulseBay. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-pulse-text-muted">
            <Link to="/" className="hover:text-pulse-text transition-colors">Privacy</Link>
            <Link to="/" className="hover:text-pulse-text transition-colors">Terms</Link>
            <Link to="/" className="hover:text-pulse-text transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
