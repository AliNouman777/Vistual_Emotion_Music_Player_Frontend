import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as faceapi from "face-api.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DetectEmotion, SingerListAsync } from "../../App/AsyncSlice/MusicAsyncSlice";
import { useNavigate } from "react-router-dom";
import Loader from "../../Loader/Loader";
import "./CaptureFeature.css";

const CaptureFeature = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const videoRef = useRef(null);
  const captureCanvasRef = useRef(null);
  const landmarkCanvasRef = useRef(null);

  // State management
  const singers = useSelector((state) => state.music.musicsingers.music_singers);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [selectedSinger, setSelectedSinger] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState("");

  const handleSingerChange = (e) => {
    setSelectedSinger(e.target.value);
  };

  // Load models and fetch singer list
  useEffect(() => {
    dispatch(SingerListAsync());
    const loadModels = async () => {
      const MODEL_URL = "/models";
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setModelLoaded(true);
      } catch (error) {
        console.error("Failed to load models", error);
        toast.error("Failed to load models");
      }
    };
    loadModels();
  }, [dispatch]);

  // Start video stream
  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing the camera", error);
        toast.error("Error accessing the camera");
      }
    };

    if (modelLoaded) {
      startVideo();

      const interval = setInterval(async () => {
        if (videoRef.current && landmarkCanvasRef.current) {
          const options = new faceapi.TinyFaceDetectorOptions();
          const detections = await faceapi
            .detectAllFaces(videoRef.current, options)
            .withFaceLandmarks();

          if (detections.length > 0) {
            const resizedDetections = faceapi.resizeResults(detections, {
              width: videoRef.current.videoWidth,
              height: videoRef.current.videoHeight,
            });

            landmarkCanvasRef.current.width = videoRef.current.videoWidth;
            landmarkCanvasRef.current.height = videoRef.current.videoHeight;

            const ctx = landmarkCanvasRef.current.getContext("2d");
            ctx.clearRect(0, 0, landmarkCanvasRef.current.width, landmarkCanvasRef.current.height);
            faceapi.draw.drawFaceLandmarks(landmarkCanvasRef.current, resizedDetections);
          }
        }
      }, 100);

      return () => clearInterval(interval);
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, [modelLoaded]);

  // Capture image and send it to the backend
  const captureFace = async () => {
    setButtonLoading(true);

    if (modelLoaded && videoRef.current && videoRef.current.readyState >= 2) {  // Ensure the video is ready
      const options = new faceapi.TinyFaceDetectorOptions();
      const detections = await faceapi
        .detectSingleFace(videoRef.current, options)
        .withFaceLandmarks();

      if (detections) {
        const face = detections.detection.box;
        const canvas = captureCanvasRef.current;
        const ctx = canvas.getContext("2d");

        // Adjust canvas dimensions to match the video element
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        // Draw the entire video frame on the canvas
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        // Now crop to the face region
        const imageData = ctx.getImageData(face.x, face.y, face.width, face.height);

        // Clear the canvas and adjust its dimensions to the face size
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = face.width;
        canvas.height = face.height;

        // Draw the cropped face on the canvas
        ctx.putImageData(imageData, 0, 0);

        // Convert canvas to a data URL
        const dataUrl = canvas.toDataURL();
        setCapturedImage(dataUrl);

        // Send the captured image to the backend
        dispatch(
          DetectEmotion({
            image: dataUrl,
            singer: selectedSinger,
          })
        )
          .then((data) => {
            if (data && data.payload.data && data.payload.data[0]) {
              navigate("/player");
            } else {
              toast.info("Sorry: No music found for the detected mood.");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            toast.error("Error sending image to server.");
          })
          .finally(() => {
            setButtonLoading(false); // Re-enable button and reset text
          });
      } else {
        toast.error("Face not detected. Please make sure your face is in the frame and try again.");
        setButtonLoading(false); // Re-enable button if face not detected
      }
    } else {
      toast.error("Video not ready. Please try again.");
      setButtonLoading(false);
    }
  };

  return (
    <>
      {!modelLoaded ? (
        <Loader />
      ) : (
        <div className="capture-container">
          <div className="dropdown-container">
            <div className="dropdowns">
              <label className="singerlab" htmlFor="singers-dropdown">Choose a singer:</label>
              <div className="dropdown">
                <select id="singers-dropdown" value={selectedSinger} onChange={handleSingerChange}>
                  <option value="">Any</option>
                  {singers &&
                    singers.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="video-container">
              <video ref={videoRef} autoPlay playsInline muted className="video-element" />
              <canvas ref={landmarkCanvasRef} className="landmark-canvas" />
              <canvas ref={captureCanvasRef} className="capture-canvas" style={{ display: "none" }} />
            </div>
          </div>

          <button className="capture-button" onClick={captureFace} disabled={buttonLoading}>
            {buttonLoading ? "Please wait..." : "Suggest Song"}
          </button>

          {capturedImage && (
            <div className="captured-image-container">
              <h3>Captured Image:</h3>
              <img src={capturedImage} alt="Captured Face" className="captured-image" />
            </div>
          )}
          <ToastContainer />
        </div>
      )}
    </>
  );
};

export default CaptureFeature;
