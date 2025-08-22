import { Link } from 'react-router-dom';
import { usePolicies } from '../hooks/usePolicyQueries';
import { useScrollToTop}  from "../hooks/useScrollToTop.js";
import Spinner from '../components/Spinner';

const Policies = () => {
  const { data: policies = [], isLoading, error } = usePolicies();
  useScrollToTop();

  if (isLoading) return <Spinner size="lg" />;
  if (error) return <div className="text-red-500">Failed to load policies.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-text">Company Policies</h1>
        <Link to="/policies/create" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors">
            Add Policy
        </Link>
      </div>
      <div className="bg-secondary text-text p-6 rounded-lg shadow-sm">
        {policies.length === 0 ? (
          <div>No policies found</div>
        ) : (
          <ul>
            {policies.map(policy => (
              <li key={policy.id} className="mb-4 border-b border-primary/10 pb-2">
                <Link to={`/policies/${policy.id}`} className="text-primary font-semibold hover:underline">{policy.name}</Link>
                <div className="text-sm text-text/70">{policy.description}</div>
                <div className="text-xs text-text/60">
                  Category: {policy.category} | Restriction: {
                    !isNaN(Number(policy.rule_value))
                      ? `$${Number(policy.rule_value).toFixed(2)}`
                      : policy.rule_value || "N/A"
                  }
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Policies;