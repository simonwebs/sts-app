import React from 'react';

const AdditionalDetails = ({ formData, handleChange }) => {
  return (
    <div>
       <div className="form-group">
        <label className='dark:text-gray-300'>Grade</label>
        <select className="form-control" name="grade" value={formData.grade} onChange={handleChange}>
          <option value="">Select grade</option>
          <option value="nursery 1">Nursery</option>
            <option value="nursery 2">Nursery</option>
          <option value="grade 1">Grade 1</option>
          <option value="grade 2">Grade 2</option>
          <option value="grade 3">Grade 3</option>
          <option value="grade 4">Grade 4</option>
          <option value="grade 5">Grade 5</option>
          <option value="grade 6">Grade 6</option>
          <option value="grade 7">Grade 7</option>
          <option value="grade 8">Grade 8</option>
          <option value="grade 9">Grade 9</option>
          <option value="grade 10">Grade 10</option>
          <option value="grade 11">Grade 11</option>
          <option value="grade 12">Grade 12</option>
        </select>
      </div>
      <div className="form-group">
        <label className='dark:text-gray-300'>Teacher Name</label>
        <input type="text" className="border rounded w-full px-4 py-2 dark:bg-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" name="teacherName" value={formData.teacherName} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label className='dark:text-gray-300'>Telephone</label>
        <input type="number"className="border rounded w-full px-4 py-2 dark:bg-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" name="telephone" value={formData.telephone} onChange={handleChange} />
      </div>
    </div>
  );
};

export default AdditionalDetails;
