import React, { useState, useEffect } from "react";
import "./App.scss";
import * as faceapi from "face-api.js";
function App() {
	const [isLoading, setIsLoading] = useState(false);
	const [videoCanvas, setVideoCanvas] = useState(undefined);
	console.log("videyo", videoCanvas);
	useEffect(() => {
		faceapi.nets.faceLandmark68Net
			.loadFromUri("/models")
			.then(e => console.log("Load FaceLandmark complete", e));
		faceapi.nets.ssdMobilenetv1
			.loadFromUri("/models")
			.then(e => console.log("Load ssdMobilenetv1 complete", e));
		faceapi.nets.faceExpressionNet
			.loadFromUri("/models")
			.then(e => console.log("Load FaceExpression complete", e));
	}, []);

	const testFace = () => {
		setIsLoading(true);

		const input = document.getElementById("test");
		const canvas = document.getElementById("test_canvas");
		const displaySize = { width: input.width, height: input.height };
		faceapi.matchDimensions(canvas, displaySize);

		// const detections = faceapi.detectAllFaces(input).then(e => console.log(e));
		// const detections = faceapi.detectAllFaces.withFaceLandmarks()(input).then(e => console.log(e));
		faceapi
			.detectAllFaces(input)
			.withFaceLandmarks()
			.then(detections => {
				return faceapi.resizeResults(detections, displaySize);
			})
			.then(resizedResults => {
				faceapi.draw.drawDetections(canvas, resizedResults);
				faceapi.draw.drawFaceLandmarks(canvas, resizedResults);
				setIsLoading(false);
			});
	};

	const testFaceDeux = () => {
		setIsLoading(true);

		const input = document.getElementById("test2");
		const canvas = document.getElementById("test_canvas2");
		const displaySize = { width: input.width, height: input.height };
		const minProbability = 0.5;

		faceapi.matchDimensions(canvas, displaySize);

		// const detections = faceapi.detectAllFaces(input).then(e => console.log(e));
		// const detections = faceapi.detectAllFaces.withFaceLandmarks()(input).then(e => console.log(e));
		faceapi
			.detectAllFaces(input)
			.withFaceLandmarks()
			.withFaceExpressions()
			.then(detections => {
				return faceapi.resizeResults(detections, displaySize);
			})
			.then(resizedResults => {
				faceapi.draw.drawDetections(canvas, resizedResults);
				faceapi.draw.drawFaceLandmarks(canvas, resizedResults);
				faceapi.draw.drawFaceExpressions(
					canvas,
					resizedResults,
					minProbability
				);
				setIsLoading(false);
			});
	};

	const testFaceVideo = () => {
		const video = document.getElementById("camera");
		// const canvas = faceapi.createCanvasFromMedia(
		// 	document.getElementById("camera")
		// );
		const canvas = document.getElementById("test_canvas_video");

		const displaySize = { width: 640, height: 480 };
		const minProbability = 0.5;

		faceapi
			.detectSingleFace(video)
			.withFaceLandmarks()
			.withFaceExpressions()
			.then(detections => {
				console.log(detections);
				return faceapi.resizeResults(detections, displaySize);
			})
			.then(resizedResults => {
				faceapi.draw.drawDetections(canvas, resizedResults);
				faceapi.draw.drawFaceLandmarks(canvas, resizedResults);
				faceapi.draw.drawFaceExpressions(
					canvas,
					resizedResults,
					minProbability
				);
			})
			.then(() => setVideoCanvas(canvas));
	};

	const startVideo = () => {
		const constraints = { video: true };
		const video = document.getElementById("camera");
		navigator.mediaDevices.getUserMedia(constraints).then(stream => {
			video.srcObject = stream;
		});
	};
	return (
		<div className="App">
			<header>
				<h1>Emoji Matcher !</h1>
				<section>
					<h2>Test of face landmark</h2>
					<div className="testImage">
						<canvas onClick={testFace} id="test_canvas"></canvas>
						<img
							id="test"
							style={{ height: "50vh" }}
							src="/francis_bourgouin.jpg"
						/>
					</div>
					{isLoading && <p>Wait it's loading !</p>}
				</section>
				<section>
					<h2>Test of face emotion</h2>
					<div className="testImage">
						<canvas onClick={testFaceDeux} id="test_canvas2"></canvas>
						<img
							id="test2"
							style={{ height: "50vh" }}
							src="/francis_fache_2.jpg"
						/>
					</div>
					{isLoading && <p>Wait it's loading !</p>}
				</section>
				<section>
					<h2>Test of video feed !</h2>
					<button onClick={startVideo}>Start Video feed</button>
					<button onClick={testFaceVideo}>Start Capture</button>
					<div className="testImage">
						<canvas
							style={{ width: 640, height: 480 }}
							id="test_canvas_video"
						></canvas>
						<video
							style={{ width: 640, height: 480 }}
							autoPlay
							id="camera"
						></video>
					</div>
				</section>
			</header>
		</div>
	);
}

export default App;
