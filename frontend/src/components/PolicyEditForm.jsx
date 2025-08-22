import { useState, useEffect } from 'react';
import { CATEGORIES, RULE_TYPES, POLICY_TYPES } from "../utils/options.js";

const PolicyEditForm = ({
  formData,
  onSubmit,
  onCancel,
  updating
}) => {
  const [localFormData, setLocalFormData] = useState(formData);

  useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(localFormData);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-3">
      <div>
        <label className="block text-text font-medium mb-1">Name:</label>
        <input name="name" value={localFormData.name} onChange={handleChange} required className="w-full mb-2 p-2 rounded-lg border border-primary/50"/>
      </div>
      <div>
        <label className="block text-text font-medium mb-1">Category:</label>
        <select name="category" value={localFormData.category} onChange={handleChange} required className="w-full mb-2 p-2 rounded-lg border border-primary/50">
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-text font-medium mb-1">Rule Type:</label>
        <select name="rule_type" value={localFormData.rule_type} onChange={handleChange} required className="w-full mb-2 p-2 rounded-lg border border-primary/50">
          {RULE_TYPES.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-text font-medium mb-1">Rule Value:</label>
        <input name="rule_value" value={localFormData.rule_value} onChange={handleChange} required className="w-full mb-2 p-2 rounded-lg border border-primary/50" />
      </div>
      <div>
        <label className="block text-text font-medium mb-1">Policy Type:</label>
        <select name="policy_type" value={localFormData.policy_type} onChange={handleChange} required className="w-full mb-2 p-2 rounded-lg border border-primary/50">
          {POLICY_TYPES.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-text font-medium mb-1">Description:</label>
        <textarea
          name="description"
          value={localFormData.description}
          onChange={handleChange}
          className="w-full mb-2 p-2 rounded-lg border border-primary/50"
        />
      </div>
      <div>
        <button type="submit" disabled={updating} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 mr-2 cursor-pointer">
          {updating ? 'Updating...' : 'Save'}
        </button>
        <button type="button" onClick={onCancel} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-800 cursor-pointer">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default PolicyEditForm;