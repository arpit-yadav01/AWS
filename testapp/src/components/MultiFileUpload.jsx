import { useState } from "react";
import axios from "axios";

export default function MultiFileUpload() {
  const [files, setFiles] = useState([]);

  const handleUpload = async () => {
    if (files.length === 0) return alert("Select files");

    const formData = new FormData();
    for (let f of files) formData.append("files", f); // must match backend: "files"

    try {
      const res = await axios.post("http://localhost:5000/api/upload/multiple", formData); // ✅ add /api
      alert("Upload success! URLs: " + res.data.urls.join(", "));
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div>
      <input type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files))} />
      <button onClick={handleUpload}>Upload Multiple</button>
    </div>
  );
}