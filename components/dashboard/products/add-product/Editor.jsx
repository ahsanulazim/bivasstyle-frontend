"use client";

import dynamic from "next/dynamic";
import { Controller } from "react-hook-form";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const Editor = ({ control, errors }) => {
  //quill formats
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "align",
    "blockquote",
    "code-block",
    "link",
    "image",
  ];

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }], // Heading options
      ["bold", "italic", "underline", "strike"], // Text styles
      [{ list: "ordered" }, { list: "bullet" }], // Lists
      [{ align: [] }], // Alignment
      ["blockquote", "code-block"], // Block styles
      ["link", "image"], // Links & Images
      ["clean"], // Remove formatting
    ],
  };

  return (
    <>
      <Controller
        name="productDescription"
        rules={{ required: "Product Description is required" }}
        control={control}
        render={({ field }) => (
          <ReactQuill
            theme="snow"
            className="border border-gray-300 rounded-md"
            {...field}
            modules={modules}
            formats={formats}
          />
        )}
      />
      {errors.productDescription && (
        <p className="text-red-600">{errors.productDescription.message}</p>
      )}
    </>
  );
};

export default Editor;
