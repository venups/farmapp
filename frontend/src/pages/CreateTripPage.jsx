"""
Create trip page component.
"""
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { tripsApi } from "../api/client";
import styles from "./CreateTripPage.module.css";

function CreateTripPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    destinations: [""],
    start_date: "",
    end_date: "",
    notes: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDestinationChange = (index, value) => {
    const newDestinations = [...formData.destinations];
    newDestinations[index] = value;
    setFormData(prev => ({ ...prev, destinations: newDestinations }));
  };

  const addDestination = () => {
    setFormData(prev => ({
      ...prev,
      destinations: [...prev.destinations, ""]
    }));
  };

  const removeDestination = (index) => {
    if (formData.destinations.length > 1) {
      const newDestinations = formData.destinations.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, destinations: newDestinations }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Trip name is required";
    if (formData.destinations.some(d => !d.trim())) newErrors.destinations = "All destinations must be filled";
    if (!formData.start_date) newErrors.start_date = "Start date is required";
    if (!formData.end_date) newErrors.end_date = "End date is required";
    else if (new Date(formData.end_date) < new Date(formData.start_date)) {
      newErrors.end_date = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Filter out empty destinations
      const cleanedData = {
        ...formData,
        destinations: formData.destinations.filter(d => d.trim() !== "")
      };
      
      await tripsApi.create(cleanedData);
      navigate("/trips");
    } catch (err) {
      alert(`Failed to create trip: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Create New Trip</h2>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Trip Name*</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? styles.errorInput : ""}
          />
          {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
        </div>

        <div className={styles.formGroup}>
          <label>Destinations*</label>
          {formData.destinations.map((destination, index) => (
            <div key={index} className={styles.destinationInput}>
              <input
                type="text"
                value={destination}
                onChange={(e) => handleDestinationChange(index, e.target.value)}
                placeholder={`Destination ${index + 1}`}
                className={errors.destinations ? styles.errorInput : ""}
              />
              {formData.destinations.length > 1 && (
                <button type="button" onClick={() => removeDestination(index)} className={styles.removeButton}>×</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addDestination} className={styles.addButton}>+ Add Destination</button>
          {errors.destinations && <span className={styles.errorMessage}>{errors.destinations}</span>}
        </div>

        <div className={styles.dateGroup}>
          <div className={styles.formGroup}>
            <label htmlFor="start_date">Start Date*</label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className={errors.start_date ? styles.errorInput : ""}
            />
            {errors.start_date && <span className={styles.errorMessage}>{errors.start_date}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="end_date">End Date*</label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className={errors.end_date ? styles.errorInput : ""}
            />
            {errors.end_date && <span className={styles.errorMessage}>{errors.end_date}</span>}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Trip"}
        </button>
      </form>
    </div>
  );
}

export default CreateTripPage;
