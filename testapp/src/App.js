import SingleFileUpload from "./components/SingleFileUpload";
import MultiFileUpload from "./components/MultiFileUpload";

function App() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>AWS S3 Upload System</h1>
      <section>
        <h2>Single File Upload</h2>
        <SingleFileUpload />
      </section>
      <hr />
      <section>
        <h2>Multiple File Upload</h2>
        <MultiFileUpload />
      </section>
    </div>
  );
}

export default App;