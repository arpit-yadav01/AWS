import { useState } from "react";
import axios from "axios";

function S3Upload() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Select file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // MUST match backend

    try {
      const res = await axios.post(
        "http://localhost:5000/upload",
        formData
      );

      console.log(res.data);
      alert("Upload success");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>S3 Upload</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={handleUpload}>
        Upload to S3 from here
      </button>
    </div>
  );
}



export default S3Upload;