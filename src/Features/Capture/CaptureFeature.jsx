import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Dropdown.css";
import "./CaptureFeature.css";
import * as faceapi from "face-api.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DetectEmotion, SingerListAsync } from "../../App/AsyncSlice/MusicAsyncSlice";
import { useNavigate } from "react-router-dom";
import Loader from "../../Loader/Loader";

const CaptureFeature = () => {
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const videref = useRef(); // Ref for the video element where the webcam feed will be shown
  const canvasref = useRef(); // Ref for the canvas element where detections will be drawn

  // Fetching list of singers from the Redux store
  const singers = useSelector(state => state.music.musicsingers.music_singers);

  // State to manage whether the ML models are loaded, the selected singer, and button state
  const [modelloaded, setmodelloaded] = useState(false);
  const [selectedSinger, setSelectedSinger] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false); // State for button loading

  const handleSingerChange = (e) => {
    setSelectedSinger(e.target.value);
  };

  useEffect(() => {
    dispatch(SingerListAsync());
    const loadModels = async () => {
      const MODEL_URL = "/models";
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ])
        .then(() => {
          setmodelloaded(true);
        })
        .catch((error) => {
          console.error("Failed to load models", error);
          toast.error("Failed to load models");
        });
      } catch (error) {
        console.error("Failed to load models", error);
        toast.error("Failed to load models");
      }
    };
    loadModels();
  }, [dispatch]);

  useEffect(() => {
    const getVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        videref.current.srcObject = stream;
      } catch (error) {
        console.error("Error accessing the camera", error);
      }
    };

    if (modelloaded) {
      getVideo();
      const interval = setInterval(async () => {
        if (videref.current) {
          const option = new faceapi.TinyFaceDetectorOptions();
          const result = await faceapi
            .detectAllFaces(videref.current, option)
            .withFaceLandmarks()
            .withFaceDescriptors();
          const resize = {
            width: videref.current.offsetWidth,
            height: videref.current.offsetHeight,
          };
          faceapi.matchDimensions(canvasref.current, resize);
          const resizedDetections = faceapi.resizeResults(result, resize);
          canvasref.current.getContext("2d").clearRect(0, 0, canvasref.current.width, canvasref.current.height);
          faceapi.draw.drawDetections(canvasref.current, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvasref.current, resizedDetections);
        }
      }, 1000);

      return () => clearInterval(interval);
    }

    return () => {
      if (videref.current && videref.current.srcObject) {
        const tracks = videref.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        videref.current.srcObject = null;
      }
    };
  }, [modelloaded]);

  const Capture = async () => {
    setButtonLoading(true); // Disable button and change text when clicked
    if (modelloaded && videref.current) {
      const options = new faceapi.TinyFaceDetectorOptions();
      const detections = await faceapi
        .detectSingleFace(videref.current, options)
        .withFaceLandmarks();

      if (detections) {
        const face = detections.detection.box;
        const canvas = canvasref.current;
        canvas.width = face.width;
        canvas.height = face.height;
        const ctx = canvas.getContext("2d");

        const scaledX = face.x * (videref.current.videoWidth / videref.current.offsetWidth);
        const scaledY = face.y * (videref.current.videoHeight / videref.current.offsetHeight);
        const scaledWidth = face.width * (videref.current.videoWidth / videref.current.offsetWidth);
        const scaledHeight = face.height * (videref.current.videoHeight / videref.current.offsetHeight);

        ctx.drawImage(
          videref.current,
          scaledX,
          scaledY,
          scaledWidth,
          scaledHeight,
          0,
          0,
          canvas.width,
          canvas.height
        );

        const dataUrl = canvas.toDataURL();
        dispatch(
          DetectEmotion({
            image: dataUrl,
            singer: selectedSinger
          })
        )
        .then((data) => {
          if (data && data.payload.data && data.payload.data[0]) {
            Navigate("/player");
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
    }
  };

  return (
    <>
      {!modelloaded ? 
        <Loader/>
      : (
        <div className="Capture">
          <div className="dropdowns">
            <div>
              <label htmlFor="singers-dropdown">Choose a singer:</label>
              <div className="dropdown">
                <select
                  id="singers-dropdown"
                  value={selectedSinger}
                  onChange={handleSingerChange}
                >
                  <option value="">Any</option>
                  {singers.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="webcamcon">
            <video ref={videref} autoPlay playsInline className="video" />
            <canvas ref={canvasref} className="canvas" />
            <div className="divbtn">
              <button onClick={Capture} className="cbtn" disabled={buttonLoading}>
                {buttonLoading ? "Please wait..." : "Suggest Song"}
              </button>
            </div>
          </div>
          <ToastContainer />
        </div>
      )}
    </>
  );
};

export default CaptureFeature;
