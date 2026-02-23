import { useState } from "react";
import axios from "axios";

export default function SingleFileUpload() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Select a file");

    const formData = new FormData();
    formData.append("file", file); // must match backend: "file"

    try {
      const res = await axios.post("http://localhost:5000/api/upload", formData); // ✅ add /api
      alert("Upload success! URL: " + res.data.url);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}