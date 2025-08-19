import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCompanyById, useUpdateCompany, useCreateCompany } from '../hooks/useCompanyQueries';
import CompanyForm from '../components/CompanyForm';
import Spinner from '../components/Spinner';
import { useScrollToTop } from "../hooks/useScrollToTop.js";

const CompanyDetails = () => {
  const { id } = useParams();
  const isUpdate = !!id;
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const toast = useToast();
  useScrollToTop();

  // Check if user is admin
  const isAdmin = currentUser?.role === 'admin';

  // Fetch company data if updating
  const {
    data: company,
    isLoading: companyLoading,
    error: companyError
  } = useCompanyById(id, {
    enabled: isUpdate,
    onError: (error) => {
      toast.error(`Error loading company: ${error.message}`);
    }
  });

  // Create company mutation
  const {
    mutate: createCompany,
    isLoading: createLoading
  } = useCreateCompany({
    onSuccess: () => {
      toast.success('Company created successfully');
      navigate('/dashboard');
    },
    onError: (error) => {
      toast.error(`Error creating company: ${error.message}`);
    }
  });

  // Update company mutation
  const {
    mutate: updateCompany,
    isLoading: updateLoading
  } = useUpdateCompany({
    onSuccess: () => {
      toast.success('Company updated successfully');
      navigate('/dashboard');
    },
    onError: (error) => {
      toast.error(`Error updating company: ${error.message}`);
    }
  });

  // Check permission for updates
  useEffect(() => {
    if (isUpdate && !isAdmin) {
      toast.error('Only administrators can update company information');
      navigate('/dashboard');
    }
  }, [isUpdate, isAdmin, navigate, toast]);

  const handleSubmit = (formData) => {
    if (isUpdate) {
      updateCompany({ id: parseInt(id), companyData: formData });
    } else {
      createCompany(formData);
    }
  };

  if (isUpdate && companyLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-text mb-6">
        {isUpdate ? 'Update Company' : 'Register New Company'}
      </h1>

      <div className="bg-secondary p-6 rounded-lg shadow-sm">
        {isUpdate && !isAdmin ? (
          <p className="text-red-500">Only administrators can update company information.</p>
        ) : (
          <CompanyForm
            initialData={company}
            onSubmit={handleSubmit}
            isUpdate={isUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default CompanyDetails;