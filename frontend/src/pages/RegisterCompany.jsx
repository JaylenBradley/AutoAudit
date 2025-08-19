// src/pages/RegisterCompany.jsx
import { useNavigate } from 'react-router-dom';
import { useCreateCompany } from '../hooks/useCompanyQueries';
import { useAuth } from '../context/AuthContext';
import { useUpdateUser } from '../hooks/useUserQueries';
import { useToast } from '../context/ToastContext';
import { useScrollToTop } from '../hooks/useScrollToTop';
import Spinner from '../components/Spinner';
import CompanyForm from '../components/CompanyForm';

const RegisterCompany = () => {
  const navigate = useNavigate();
  const { currentUser, updateUserData } = useAuth();
  const toast = useToast();
  useScrollToTop();

  const {
    mutate: createCompany,
    isLoading: isCreating,
    error: createError
  } = useCreateCompany({
    onSuccess: async (data) => {
      toast.success('Company registered successfully!');

      if (currentUser) {
        updateUser({
          id: currentUser.id,
          userData: {
            company_id: data.id,
            role: 'admin'
          }
        });
      } else {
        navigate('/dashboard');
      }
    },
    onError: (error) => {
      toast.error(`Failed to register company: ${error.message}`);
    }
  });

  const {
    mutate: updateUser,
    isLoading: isUpdating,
    error: updateError
  } = useUpdateUser({
    onSuccess: () => {
      updateUserData();
      navigate('/dashboard');
      toast.success('You are now an admin of the new company!');
    },
    onError: (error) => {
      toast.error(`Failed to update user: ${error.message}`);
    }
  });

  const handleSubmit = (formData) => {
    createCompany(formData);
  };

  const isLoading = isCreating || isUpdating;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-text mb-6">Register New Company</h1>

      <div className="bg-secondary p-6 rounded-lg shadow-sm">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        ) : (
          <CompanyForm
            onSubmit={handleSubmit}
            isUpdate={false}
          />
        )}
      </div>
    </div>
  );
};

export default RegisterCompany;