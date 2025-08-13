import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-secondary to-background py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-text mb-6">
              Intelligent Expense Management
            </h1>
            <p className="text-lg md:text-xl text-text/80 max-w-2xl mx-auto mb-10">
              AutoAudit uses AI to streamline expense management, automatically flag policy violations, and save your team valuable time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="bg-primary text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors font-medium">
                Get Started
              </Link>
              <Link to="/demo" className="border border-primary text-primary px-6 py-3 rounded-md hover:bg-primary/10 transition-colors font-medium">
                View Demo
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-text text-center mb-12">Key Features</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-secondary p-6 rounded-lg shadow-sm">
                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714a2.25 2.25 0 0 1-.659 1.591L9.5 14.5m3.75-11.396c.251.023.501.05.75.082m-1.5-.082a24.301 24.301 0 0 0-4.5 0m12 0v5.714a2.25 2.25 0 0 1-.659 1.591L17.5 14.5m-3-11.396a24.301 24.301 0 0 0-4.5 0" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-text mb-2">AI-Powered Categorization</h3>
                <p className="text-text/80">Automatically categorize expenses using advanced AI to ensure proper classification.</p>
              </div>

              <div className="bg-secondary p-6 rounded-lg shadow-sm">
                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-text mb-2">Policy Enforcement</h3>
                <p className="text-text/80">Set custom policies and automatically flag expenses that violate company guidelines.</p>
              </div>

              <div className="bg-secondary p-6 rounded-lg shadow-sm">
                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-text mb-2">Bulk CSV Upload</h3>
                <p className="text-text/80">Upload and process multiple expenses at once with our CSV import feature.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-primary/10 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-text mb-6">Ready to streamline your expense management?</h2>
            <p className="text-lg text-text/80 max-w-2xl mx-auto mb-8">
              Join thousands of companies using AutoAudit to save time and ensure compliance.
            </p>
            <Link to="/signup" className="bg-primary text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors font-medium inline-block">
              Get Started Now
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;