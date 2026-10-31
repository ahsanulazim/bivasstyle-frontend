"use client";
import { useState } from "react";
import { LuCloudUpload, LuX } from "react-icons/lu";

const VariantImageUploader = ({ register, variantType, options }) => {
  const [images, setImages] = useState({});

  const handleImageUpload = (optionValue, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setImages((prev) => ({
      ...prev,
      [optionValue]: { file, preview },
    }));
  };

  const removeImage = (optionValue) => {
    setImages((prev) => {
      const updated = { ...prev };
      delete updated[optionValue];
      return updated;
    });
  };

  return (
    <div className="fieldset bg-base-100 p-5 rounded-box mt-3">
      <h3 className="font-bold text-lg">{variantType} Option Images</h3>

      <div className="grid gap-4">
        {options.map((opt) => (
          <div key={opt.value} className="flex items-center gap-3">
            <span className="w-10 font-semibold">{opt.label}</span>

            {/* Upload */}
            <label className="btn btn-info btn-square">
              <LuCloudUpload />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(opt.value, e)}
              />
            </label>

            {/* Preview */}
            {images[opt.value] && (
              <div className="relative">
                <img
                  src={images[opt.value].preview}
                  alt={opt.label}
                  className="w-20 h-20 object-cover rounded-box"
                />
                <button
                  type="button"
                  onClick={() => removeImage(opt.value)}
                  className="absolute top-1 right-1 btn btn-error btn-xs btn-square"
                >
                  <LuX />
                </button>
              </div>
            )}

            {/* Hidden field for react-hook-form */}
            <input
              type="hidden"
              {...register(`variantImages.${variantType}.${opt.value}`)}
              value={images[opt.value]?.file?.name || ""}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VariantImageUploader;
