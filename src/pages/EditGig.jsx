import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import { GIG_API, UPLOAD_API } from "../services/apis";
import toast from "react-hot-toast";
import { FiTrash2 } from "react-icons/fi";

const categories = ["Graphics & Design", "Writing", "Video & Animation", "Programming"];

const EditGig = () => {
  const { gigId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [existingCover, setExistingCover] = useState(null); // Cloudinary object: { url, public_id }
  const [existingImages, setExistingImages] = useState([]); // Array of { url, public_id }
  const [newImageFiles, setNewImageFiles] = useState([]);   // Local file objects

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { features: [] } });

  // 🌐 Fetch gig
  useEffect(() => {
    const fetchGig = async () => {
      try {
        const data = await apiConnector("GET", GIG_API.GET_GIG_BY_ID(gigId));
        setValue("title", data.title);
        setValue("shortDescription", data.shortDescription);
        setValue("description", data.description);
        setValue("category", data.category);
        setValue("price", data.price);
        setValue("deliveryTime", data.deliveryTime);
        setValue("revisionNumber", data.revisionNumber);
        setValue("features", data.features || []);
        setExistingCover(data.cover || null);
        setExistingImages(data.images || []);
      } catch (err) {
        toast.error("Failed to load gig");
        navigate("/my-gigs");
      }
    };
    fetchGig();
  }, [gigId, setValue, navigate]);

  const deleteImageFromServer = async (public_id) => {
    try {
      await apiConnector("DELETE", `${UPLOAD_API.DELETE_IMAGE}?public_id=${public_id}`);
    } catch (err) {
      console.error("Failed to delete image:", err);
    }
  };

  const extractFilename = (url) => {
    if (!url) return "unknown";
    return url.split("/").pop().split(".")[0];
  };

  const handleNewCoverChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (existingCover?.public_id) {
      await deleteImageFromServer(existingCover.public_id);
      setExistingCover(null);
    }

    const formData = new FormData();
    formData.append("images", file);

    try {
      const res = await apiConnector("POST", UPLOAD_API.UPLOAD_IMAGES, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setExistingCover(res.files[0]);
      toast.success("Cover image uploaded");
    } catch {
      toast.error("Failed to upload new cover");
    }
  };

  const handleExtraImagesChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setNewImageFiles(files);
  };

  const removeExistingGalleryImage = async (public_id) => {
    await deleteImageFromServer(public_id);
    setExistingImages((prev) => prev.filter((img) => img.public_id !== public_id));
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      let newUploaded = [];

      if (newImageFiles.length > 0) {
        const formData = new FormData();
        newImageFiles.forEach((file) => formData.append("images", file));
        const res = await apiConnector("POST", UPLOAD_API.UPLOAD_IMAGES, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        newUploaded = res.files;
      }

      const payload = {
        title: data.title,
        shortDescription: data.shortDescription,
        description: data.description,
        category: data.category,
        price: Number(data.price),
        deliveryTime: Number(data.deliveryTime),
        revisionNumber: Number(data.revisionNumber),
        features: data.features.filter((f) => f.trim() !== ""),
        cover: existingCover,
        images: [...existingImages, ...newUploaded],
      };

      await apiConnector("PUT", GIG_API.UPDATE_GIG(gigId), payload);
      toast.success("Gig updated successfully!");
      navigate("/my-gigs");
    } catch (err) {
      toast.error(err.message || "Failed to update gig");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-6">
      <h1 className="text-3xl font-extrabold text-green-700 mb-4">Edit Your Gig</h1>

      {/* Step UI */}
      <div className="flex justify-between mb-6">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className={`flex-1 text-center py-2 border-b-2 ${
              step === n ? "border-green-600 font-semibold" : "border-gray-300"
            }`}
          >
            Step {n}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {step === 1 && (
          <>
            <input {...register("title", { required: true })} placeholder="Gig title" className="input" />
            <input {...register("shortDescription", { required: true })} placeholder="Short description" className="input" />
            <textarea {...register("description", { required: true })} placeholder="Detailed description" rows={4} className="input" />
            <select {...register("category", { required: true })} className="input">
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </>
        )}

        {step === 2 && (
          <>
            {/* Cover */}
            <label className="block font-medium">Cover Image</label>
            {existingCover ? (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-700 truncate max-w-[200px]">{extractFilename(existingCover.url)}</span>
                <button
                  type="button"
                  onClick={() => {
                    deleteImageFromServer(existingCover.public_id);
                    setExistingCover(null);
                  }}
                  className="text-red-600 text-sm hover:underline flex items-center gap-1"
                >
                  <FiTrash2 /> Remove
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-2">No cover image uploaded</p>
            )}
            <input type="file" accept="image/*" onChange={handleNewCoverChange} />

            {/* Extra images */}
            <label className="block font-medium mt-6">Extra Images</label>
            {existingImages.length > 0 && (
              <ul className="mb-2 space-y-1">
                {existingImages.map((img) => (
                  <li key={img.public_id} className="flex items-center gap-2">
                    <span className="text-sm truncate max-w-[200px]">{extractFilename(img.url)}</span>
                    <button
                      type="button"
                      onClick={() => removeExistingGalleryImage(img.public_id)}
                      className="text-red-600 text-sm hover:underline flex items-center gap-1"
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {newImageFiles.length > 0 && (
              <div className="mb-2">
                <p className="text-sm font-medium">New Images to Upload:</p>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {newImageFiles.map((file) => (
                    <li key={file.name}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
            <input type="file" multiple accept="image/*" onChange={handleExtraImagesChange} />
          </>
        )}

        {step === 3 && (
          <>
            <input type="number" {...register("price", { required: true, min: 5 })} placeholder="Price" className="input" />
            <input type="number" {...register("deliveryTime", { required: true })} placeholder="Delivery time" className="input" />
            <input type="number" {...register("revisionNumber", { required: true })} placeholder="Revisions" className="input" />

            <label className="block text-sm font-medium mt-2">Features</label>
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
              className="text-green-600 text-sm"
            >
              + Add another feature
            </button>

            <div className="mt-4 flex gap-2">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button type="button" onClick={() => navigate("/my-gigs")} className="btn-outline">
                Cancel
              </button>
            </div>
          </>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          {step > 1 && (
            <button type="button" onClick={() => setStep(step - 1)} className="btn-outline">
              Back
            </button>
          )}
          {step < 3 && (
            <button type="button" onClick={() => setStep(step + 1)} className="btn-primary ml-auto">
              Next
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EditGig;
