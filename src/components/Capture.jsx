import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import "./Capture.css";

const Capture = () => {
  const [formData, setFormData] = useState({
    number: "",
    company_id: "",
    invoice_numbers: "",
  });
  const [companies, setCompanies] = useState([]);
  const [capturedImage, setCapturedImage] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const [loadingCamera, setLoadingCamera] = useState(false);
  const webcamRef = useRef(null);
  const mediaStream = useRef(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/companies")
      .then((response) => setCompanies(response.data))
      .catch((error) => console.error("Error fetching companies:", error));
  }, []);

  useEffect(() => {
    checkFormCompletion(formData, capturedImage);
  }, [capturedImage]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "number" && (value && (!/^\d+$/.test(value) || value === "0"))) return;

    if (name === "invoice_numbers" && (value && !/^[0-9,]*$/.test(value))) return;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    checkFormCompletion({ ...formData, [name]: value });
  };

  const enableCamera = async () => {
    if (showWebcam) return;
    try {
      setLoadingCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      mediaStream.current = stream;
      setShowWebcam(true);
    } catch (error) {
      console.error("Error accessing webcam:", error);
      alert("Please allow camera access to proceed.");
    } finally {
      setLoadingCamera(false);
    }
  };

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setShowWebcam(false);

      if (mediaStream.current) {
        mediaStream.current.getTracks().forEach((track) => track.stop());
        mediaStream.current = null;
      }
    }
  };

  const retakeImage = () => {
    setCapturedImage(null);
    enableCamera();
  };

  const checkFormCompletion = (data, image = capturedImage) => {
    if (data.number && data.company_id && data.invoice_numbers && image) {
      setIsFormComplete(true);
    } else {
      setIsFormComplete(false);
    }
  };

  const dataURItoBlob = (dataURI) => {
    let byteString = atob(dataURI.split(",")[1]);
    let mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    let arrayBuffer = new ArrayBuffer(byteString.length);
    let uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([arrayBuffer], { type: mimeString });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    const formDataToSend = new FormData();
    formDataToSend.append("check[number]", formData.number);
    formDataToSend.append("check[company_id]", formData.company_id);
    formDataToSend.append("check[invoice_numbers]", formData.invoice_numbers);

    if (capturedImage) {
      const blob = dataURItoBlob(capturedImage);
      formDataToSend.append("check[image]", blob, "captured_image.jpg");
    }

    try {
      await axios.post("http://localhost:3000/checks/", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSubmitted(true);
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error submitting check:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNewCheck = () => {
    setSubmitted(false);
    setFormData({ number: "", company_id: "", invoice_numbers: "" });
    setCapturedImage(null);
    setIsFormComplete(false);
    setShowWebcam(false);
  };

  if (submitted) {
    return (
      <div className="capture-wrapper">
        <div className="capture-card">
          <h2 className="capture-title">
            {companies.find((c) => c.id === parseInt(formData.company_id))?.name}
          </h2>
          <h3 className="capture-subtext">
            Check # {formData.number} <br /> Uploaded! 😊
          </h3>
          <p className="capture-invoice">
            <strong>Invoices:</strong> {formData.invoice_numbers}
          </p>
        </div>
        <button className="capture-button" onClick={handleNewCheck}>
          Upload New Check
        </button>
      </div>
    );
  }

  return (
    <div className="capture-container">
      <h2 className="capture-title">Capture Check</h2>

      {!showWebcam && !capturedImage && (
        <button className="capture-button" onClick={enableCamera} disabled={loadingCamera}>
          {loadingCamera ? "Starting Camera..." : "Capture Image"}
        </button>
      )}

      {showWebcam && (
        <div className="camera-container">
          <Webcam
            className="capture-webcam"
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "user" }}
          />
          <button type="button" className="capture-button" onClick={captureImage}>
            Capture Image
          </button>
        </div>
      )}

      {capturedImage && (
        <div className="captured-image-section">
          <img className="captured-image" src={capturedImage} alt="Captured" />
          <button className="retake-button" onClick={() => setCapturedImage(null)}>Retake</button>
        </div>
      )}

      <div className="form-group">
        <label>Check #:</label>
        <input type="text" name="number" value={formData.number} onChange={handleChange} required />
        {errors.number == 'Check' && <span className="error-message">Check Number has already been taken</span>}
        {errors.number == 'Check Positive' && <span className="error-message">Check Number must be number and greater than 0</span>}
      </div>

      <div className="form-group">
        <label>Company:</label>
        <select name="company_id" value={formData.company_id} onChange={handleChange} required>
          <option value="">Select Company</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>{company.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Invoice Numbers:</label>
        <input type="text" name="invoice_numbers" value={formData.invoice_numbers} onChange={handleChange} required />
        {errors.number == 'Invoice' && <span className="error-message">Invoice Number has already been taken</span>}
        {errors.number == 'Invoice Positive' && <span className="error-message">Invoice Numbers must be numbers and greater than 0</span>}
      </div>

      <button
        type="submit"
        className="capture-button"
        onClick={handleSubmit}
        disabled={loading || !isFormComplete}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
};

export default Capture;
