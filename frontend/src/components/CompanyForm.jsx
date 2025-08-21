import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

const CompanyForm = ({ initialData = {}, onSubmit, isUpdate = false }) => {
  const { currentUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: initialData.name || '',
    industry: initialData.industry || '',
    website: initialData.website || '',
    description: initialData.description || ''
  });

  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    if (isUpdate && !isAdmin) {
      toast.error('Only administrators can update company information');
      navigate('/dashboard');
    }
  }, [isUpdate, isAdmin, toast, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

    return (
      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        <div>
          <label className="block text-text font-medium mb-2">Company Name*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-primary/20 rounded bg-transparent text-text"
            placeholder="Enter company name"
          />
        </div>

        <div>
          <label className="block text-text font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 border border-primary/20 rounded bg-transparent text-text"
            placeholder="Briefly describe your company"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-text font-medium mb-2">Industry</label>
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="w-full p-3 border border-primary/20 rounded bg-transparent text-text"
              placeholder="e.g. Technology, Healthcare, Finance"
            />
          </div>

          <div>
            <label className="block text-text font-medium mb-2">Website URL</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full p-3 border border-primary/20 rounded bg-transparent text-text"
            />
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="
            px-5 py-3 border border-primary/20 rounded-lg text-text mr-4
            hover:bg-primary/10 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="
            bg-primary text-white px-6 py-3 rounded-lg
            hover:bg-primary/80 transition-colors font-medium cursor-pointer"
          >
            {isUpdate ? 'Update Company' : 'Register Company'}
          </button>
        </div>
      </form>
    );
};

export default CompanyForm;