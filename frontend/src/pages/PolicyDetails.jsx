import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePolicyById, useDeletePolicy, useUpdatePolicy } from '../hooks/usePolicyQueries';
import { useToast } from '../context/ToastContext';
import { useQueryClient } from '@tanstack/react-query';
import { useScrollToTop } from "../hooks/useScrollToTop.js";
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { RULE_TYPES, POLICY_TYPES } from "../utils/options.js";
import { getLabel } from "../utils/helpers.js";
import PolicyEditForm from "../components/PolicyEditForm.jsx";
import Spinner from '../components/Spinner';

const PolicyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: policy, isLoading, error } = usePolicyById(id);

  const { mutate: deletePolicy, isLoading: deleting } = useDeletePolicy({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      queryClient.removeQueries({ queryKey: ['policy', id] });
      navigate('/policies')
    },
    onError: (err) => toast.error(err.message)
  });

  const { mutate: updatePolicy, isLoading: updating } = useUpdatePolicy({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      queryClient.invalidateQueries({ queryKey: ['policy', id] });
      toast.success('Policy updated!');
    },
    onError: (err) => toast.error(err.message)
  });

  useScrollToTop();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    rule_type: '',
    rule_value: '',
    policy_type: ''
  });

  useEffect(() => {
    if (policy) {
      setFormData({
        name: policy.name,
        description: policy.description,
        category: policy.category,
        rule_type: policy.rule_type,
        rule_value: policy.rule_value,
        policy_type: policy.policy_type
      });
    }
  }, [policy]);

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => setEditMode(false);

  if (isLoading) return <Spinner size="lg" />;
  if (error) return <div className="text-red-500">Failed to load policy</div>;
  if (!policy) return <div>Policy not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-text">Policy Details</h1>
        <Link
          to="/policies"
          className="flex items-center bg-primary text-white px-4 py-2 rounded-lg
          hover:bg-primary/80 font-medium transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back
        </Link>
      </div>
      <div className="bg-secondary p-6 rounded-lg shadow-sm space-y-2">
        {editMode ? (
          <PolicyEditForm
            formData={formData}
            onSubmit={(data) => {
              updatePolicy({ id, policyData: data });
              setEditMode(false);
            }}
            onCancel={handleCancel}
            updating={updating}
          />
        ) : (
          <>
            <div className="text-text"><strong>Name:</strong> {policy.name}</div>
            <div className="text-text"><strong>Description:</strong> {policy.description}</div>
            <div className="text-text"><strong>Category:</strong> {policy.category}</div>
            <div className="text-text">
              <strong>Rule Type:</strong> {getLabel(RULE_TYPES, policy.rule_type)}
            </div>
            <div className="text-text"><strong>Rule Value:</strong> {policy.rule_value}</div>
            <div className="text-text">
              <strong>Policy Type:</strong> {getLabel(POLICY_TYPES, policy.policy_type)}
            </div>
            <button
              onClick={handleEdit}
              className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 mr-2 transition-colors cursor-pointer"
            >
              Edit Policy
            </button>
            <button
              onClick={() => deletePolicy(id)}
              disabled={deleting}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors cursor-pointer"
            >
              {deleting ? 'Deleting...' : 'Delete Policy'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PolicyDetails;