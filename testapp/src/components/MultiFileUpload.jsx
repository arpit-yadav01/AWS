import { useState } from "react";
import axios from "axios";

export default function MultiFileUpload() {
  const [files, setFiles] = useState([]);

  const handleUpload = async () => {
    if (files.length === 0) return alert("Select files");

    const formData = new FormData();
    for (let f of files) {
      formData.append("files", f);
    }

    try {
      const res = await axios.post(
        "http://43.205.215.233/api/upload/multiple",
        formData
      );

      console.log(res.data); // 🔎 Debug

      alert("Upload success! Signed URLs generated.");

      // Open first file automatically (optional)
      if (res.data.signedUrls.length > 0) {
        window.open(res.data.signedUrls[0], "_blank");
      }

    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div>
      <input
        type="file"
        multiple
        onChange={(e) => setFiles(Array.from(e.target.files))}
      />
      <button onClick={handleUpload}>Upload Multiple</button>
    </div>
  );
}