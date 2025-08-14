import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">AutoAudit</h3>
            <p className="text-text text-sm">
              Streamline expense management with AI-powered auditing and policy enforcement
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-text text-sm hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/expenses" className="text-text text-sm hover:text-primary transition-colors">Expenses</Link></li>
              <li><Link to="/policies" className="text-text text-sm hover:text-primary transition-colors">Policies</Link></li>
              <li><Link to="/dashboard" className="text-text text-sm hover:text-primary transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">Contact</h3>
            <ul className="space-y-2 text-sm text-text">
              <li>Email: support@autoaudit.com</li>
              <li>Phone: (123) 456-7890</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-6 pt-6 text-center text-sm text-text">
          <p>&copy; {currentYear} AutoAudit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;