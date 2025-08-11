import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { apiConnector } from "../services/apiConnector";
import { GIG_API, UPLOAD_API } from "../services/apis";

const categories = ["Graphics & Design", "Writing", "Video & Animation", "Programming", "Web Development"];

const CreateGig = () => {
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [coverPreview, setCoverPreview] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm({ defaultValues: { features: [""] } });

  useEffect(() => {
    if (user && user.role !== "freelancer") {
      toast.error("Only freelancers can create gigs.");
      navigate("/");
    }
  }, [user, navigate]);

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) setCoverPreview(URL.createObjectURL(file));
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const allowed = 5 - imageFiles.length;
    const selectedFiles = files.slice(0, allowed);

    setImagePreviews((prev) => [
      ...prev,
      ...selectedFiles.map((file) => URL.createObjectURL(file)),
    ]);
    setImageFiles((prev) => [...prev, ...selectedFiles]);
  };

  const onSubmit = async (data) => {
    try {
      setUploading(true);

      const formData = new FormData();
      if (data.cover?.[0]) formData.append("images", data.cover[0]);
      imageFiles.forEach((file) => formData.append("images", file));

      const res = await apiConnector("POST", UPLOAD_API.UPLOAD_IMAGES, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const [coverFile, ...otherFiles] = res.files;

      const payload = {
        title: data.title,
        shortDescription: data.shortDescription,
        description: data.description,
        category: data.category,
        price: Number(data.price),
        deliveryTime: Number(data.deliveryTime),
        revisionNumber: Number(data.revisionNumber),
        cover: coverFile,
        images: otherFiles,
        features: data.features.filter((f) => f.trim() !== ""),
      };

      await apiConnector("POST", GIG_API.CREATE_GIG, payload);
      toast.success("Gig created successfully!");
      navigate("/my-gigs");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to create gig");
    } finally {
      setUploading(false);
    }
  };

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  return (
    <div className="flex justify-center items-start min-h-[90vh] bg-gray-100 p-6">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-extrabold text-green-700 mb-6 text-center">
          Create a New Gig
        </h1>

        <div className="flex mb-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex-1 px-1">
              <div className={`h-2 rounded-full ${n <= step ? "bg-green-600" : "bg-gray-300"}`} />
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {step === 1 && (
            <>
              <label className="block text-sm font-medium">Gig Title</label>
              <input {...register("title", { required: "Title is required" })} className="input" />
              {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}

              <label className="block text-sm font-medium mt-4">Short Description</label>
              <input
                {...register("shortDescription", { required: "Short description is required", maxLength: 120 })}
                className="input"
              />
              {errors.shortDescription && <p className="text-sm text-red-500">{errors.shortDescription.message}</p>}

              <label className="block text-sm font-medium mt-4">Category</label>
              <select {...register("category", { required: "Category is required" })} className="input">
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}

              <label className="block text-sm font-medium mt-4">Description</label>
              <textarea {...register("description", { required: "Description is required" })} rows={5} className="input" />
              {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </>
          )}

          {step === 2 && (
            <>
              <label className="block text-sm font-medium">Cover Image</label>
              <input type="file" accept="image/*" {...register("cover", { required: "Cover image required" })} onChange={handleCoverChange} />
              {coverPreview && <img src={coverPreview} alt="cover" className="h-40 my-2 rounded" />}
              {errors.cover && <p className="text-sm text-red-500">{errors.cover.message}</p>}

              <label className="block text-sm font-medium mt-6">Extra Images (up to 5)</label>
              <input type="file" multiple accept="image/*" onChange={handleImagesChange} />
              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  {imagePreviews.map((src, idx) => (
                    <img key={idx} src={src} alt={`preview-${idx}`} className="h-24 rounded" />
                  ))}
                </div>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <label className="block text-sm font-medium">Price (USD)</label>
              <input type="number" {...register("price", { required: "Price required", min: 5 })} className="input" />
              {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}

              <label className="block text-sm font-medium mt-4">Delivery Time (days)</label>
              <input type="number" {...register("deliveryTime", { required: "Delivery time required", min: 1 })} className="input" />
              {errors.deliveryTime && <p className="text-sm text-red-500">{errors.deliveryTime.message}</p>}

              <label className="block text-sm font-medium mt-4">Number of Revisions</label>
              <input type="number" {...register("revisionNumber", { required: true, min: 0 })} className="input" />
              {errors.revisionNumber && <p className="text-sm text-red-500">Revision count required</p>}

              <label className="block text-sm font-medium mt-4">Key Features</label>
              {watch("features").map((_, idx) => (
                <input
                  key={idx}
                  {...register(`features.${idx}`)}
                  placeholder={`Feature ${idx + 1}`}
                  className="input mb-2"
                />
              ))}
              <button
                type="button"
                onClick={() => setValue("features", [...watch("features"), ""])}
                className="text-sm text-green-700 hover:underline"
              >
                + Add another feature
              </button>
            </>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 && <button type="button" onClick={back} className="btn-outline">Back</button>}
            {step < 3 ? (
              <button type="button" onClick={next} className="btn-primary ml-auto">Next</button>
            ) : (
              <button
                type="submit"
                disabled={uploading}
                className={`ml-auto btn-primary ${uploading && "opacity-50 cursor-not-allowed"}`}
              >
                {uploading ? "Creating..." : "Create Gig"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGig;
