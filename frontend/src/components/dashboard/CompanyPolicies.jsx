import { Link } from 'react-router-dom';
import Spinner from '../Spinner';

const CompanyPolicies = ({
  policies = [],
  isLoading = false,
  error = null,
  canAddPolicy = false,
  addPolicyLink = "/policies/create",
  emptyMessage = "No company policies found",
  currentUser = null,
  limit = 3
}) => {
  if (error) {
    return (
      <div className="text-center py-6 text-red-500">
        Failed to load company policies.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Spinner size="lg" />
      </div>
    );
  }

  const displayedPolicies = limit ? policies.slice(0, limit) : policies;

  return (
    <div className="bg-secondary p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-text">Company Policies</h2>
        <Link to="/policies" className="text-primary hover:underline text-sm">View All</Link>
      </div>

      <div className="divide-y divide-primary/10">
        {displayedPolicies.length > 0 ? (
          displayedPolicies.map(policy => (
            <div key={policy.id} className="py-3">
              <h3 className="font-medium text-text">{policy.name}</h3>
              <p className="text-sm text-text/70 mt-1">{policy.description}</p>
              <div className="flex items-center mt-2">
                <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary mr-2">
                  {policy.category}
                </span>
                <span className="text-xs text-text/60">
                  Restriction: {
                    !isNaN(Number(policy.rule_value))
                      ? `$${Number(policy.rule_value).toFixed(2)}`
                      : policy.rule_value || "N/A"
                  }
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-text/60">
            <p>{emptyMessage}</p>
            {canAddPolicy && (
              <Link
                to={addPolicyLink}
                className="inline-block mt-2 text-primary hover:underline"
              >
                Create your first policy
              </Link>
            )}
            {!canAddPolicy && !currentUser?.company_id && (
              <p className="mt-1">
                Join a company in your <Link to="/profile" className="text-primary hover:underline">profile settings</Link> to view policies
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyPolicies;