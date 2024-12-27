import { useRef, useState } from "react";

export const useHandleForm = (initialFormState) => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          file: { name: file.name, type: name, path: reader.result },
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleMediaFile = (e) => {
    e.preventDefault();

    let files = [];
    if (e.dataTransfer) {
      files = Array.from(e.dataTransfer.files);
    } else {
      files = Array.from(e.target.files);
    }
    const newMediaFiles = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type,
    }));
    setFormData((prev) => [...prev, [e.target.name], ...newMediaFiles]);
  };

  const handleValidate = () => {
    for (const key in formData) {
      // eslint-disable-next-line no-prototype-builtins
      if (formData.hasOwnProperty(key) && !formData[key]) {
        return false;
      }
    }
    return true;
  };

  const handleRemove = () => {
    setFormData((prev) => ({ ...prev, file: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e, action) => {
    e.preventDefault();
    action();
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleValidate,
    handleRemove,
    handleSubmit,
    fileInputRef,
    handleMediaFile,
  };
};
