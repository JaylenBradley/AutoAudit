import { useCreatePolicy } from '../hooks/usePolicyQueries';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { useScrollToTop } from "../hooks/useScrollToTop.js";
import { useQueryClient } from '@tanstack/react-query';
import { CATEGORIES, RULE_TYPES, POLICY_TYPES } from "../utils/options.js";

const AddPolicy = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: createPolicy, isLoading } = useCreatePolicy({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      toast.success('Policy added!');
      navigate('/policies');
    },
    onError: (err) => toast.error(err.message)
  });
  useScrollToTop();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const ruleType = form.rule_type.value;
    const ruleValue = form.rule_value.value;

    if (ruleType === 'amount_max') {
      const num = Number(ruleValue);
      if (isNaN(num) || num < 0) {
        toast.error('For Amount Max, the rule value must be a number greater than or equal to 0');
        return;
      }
    }

    createPolicy({
      name: form.name.value,
      description: form.description.value,
      category: form.category.value,
      rule_type: ruleType,
      rule_value: ruleValue,
      policy_type: form.policy_type.value
    });
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-secondary rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Policy Name" required className="w-full mb-3 p-2 rounded-lg border border-primary/30"/>
        <select name="category" required className="w-full mb-3 p-2 rounded-lg border border-primary/30 cursor-pointer">
          <option value="">Select Category</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
          ))}
        </select>
        <select name="rule_type" required className="w-full mb-3 p-2 rounded-lg border border-primary/30 cursor-pointer">
          <option value="">Select Rule Type</option>
          {RULE_TYPES.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
        <input name="rule_value" placeholder="Rule Value (e.g. 100, Starbucks)" required className="w-full mb-3 p-2 rounded-lg border border-primary/30"/>
        <select name="policy_type" required className="w-full mb-3 p-2 rounded-lg border border-primary/30 cursor-pointer">
          <option value="">Select Policy Type</option>
          {POLICY_TYPES.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
        <textarea name="description" placeholder="Description" className="w-full mb-3 p-2 rounded-lg border border-primary/30"/>
        <button type="submit" disabled={isLoading} className="bg-primary text-text px-4 py-2 hover:bg-primary/80 rounded-lg border border-primary/30 cursor-pointer transition-colors">
          Add Policy
        </button>
      </form>
    </div>
  );
};

export default AddPolicy;