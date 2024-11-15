import { useEffect, useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateCar() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    images: [],
    title: '',
    description: '',
    tags: [],
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await fetch(`/api/car/get/${params.carId}`);
        const data = await res.json();
        if (!data.success) {
          setError('Failed to fetch car details');
          return;
        }
        setFormData(data);
      } catch (error) {
        setError('Failed to fetch car details');
      }
    };
    fetchCar();
  }, [params.carId]);

  const handleImageUpload = async (file) => {
    const storage = getStorage(app);
    const fileName = `${new Date().getTime()}-${file.name}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        null,
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const handleImageUploadSubmit = async () => {
    setUploading(true);
    try {
      const urls = await Promise.all(
        [...files].map((file) => handleImageUpload(file))
      );
      setFormData({ ...formData, images: [...formData.images, ...urls] });
    } catch {
      setError('Image upload failed');
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      setError('At least one image is required');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/car/update/${params.carId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message);
      } else {
        navigate(`/car/${data._id}`);
      }
    } catch (err) {
      setError('Failed to update the car listing');
    }
    setLoading(false);
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Update Car Listing</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Title"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="border p-3 rounded-lg"
          required
        />
        <textarea
          placeholder="Description"
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="border p-3 rounded-lg"
          required
        />
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          id="tags"
          value={formData.tags.join(', ')}
          onChange={(e) =>
            setFormData({ ...formData, tags: e.target.value.split(',').map((tag) => tag.trim()) })
          }
          className="border p-3 rounded-lg"
        />
        <input
          type="file"
          multiple
          onChange={(e) => setFiles([...e.target.files])}
          className="border p-3 rounded-lg"
        />
        <button
          type="button"
          onClick={handleImageUploadSubmit}
          disabled={uploading}
          className="bg-slate-700 text-white p-3 rounded-lg"
        >
          {uploading ? 'Uploading Images...' : 'Upload Images'}
        </button>
        {formData.images.length > 0 && (
          <div>
            <p>Uploaded Images:</p>
            <div className="flex gap-3">
              {formData.images.map((url, idx) => (
                <img key={idx} src={url} alt={`Car ${idx}`} className="w-20 h-20 object-cover" />
              ))}
            </div>
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg"
        >
          {loading ? 'Updating...' : 'Update Car'}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </main>
  );
}
