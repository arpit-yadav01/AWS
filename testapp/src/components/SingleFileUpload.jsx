import { useState } from "react";
import axios from "axios";

export default function SingleFileUpload() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/upload",
        formData
      );

      console.log(res.data); // 🔎 Debug view

      alert("Upload success! Signed URL: " + res.data.signedUrl);

      // Optional: open automatically
      window.open(res.data.signedUrl, "_blank");

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