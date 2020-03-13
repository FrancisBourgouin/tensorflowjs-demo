import React, { useState, useEffect } from "react";
import "./App.scss";
import * as faceapi from "face-api.js";
function App() {
	const [isLoading, setIsLoading] = useState(false);
	const [videoCanvas, setVideoCanvas] = useState(undefined);
	const [currentEmoji, setCurrentEmoji] = useState("");

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
				console.log(detections)
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
				console.log(detections)
				return faceapi.resizeResults(detections, displaySize);
			})
			.then(resizedResults => {
				console.log(resizedResults)
				faceapi.draw.drawDetections(canvas, resizedResults);
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
		const context = canvas.getContext("2d");
		const displaySize = { width: 640, height: 480 };
		const minProbability = 0.5;

		const scanInterval = setInterval(() => {
			faceapi
				.detectSingleFace(video)
				.withFaceLandmarks()
				.withFaceExpressions()
				.then(detections => {
					console.log(detections);
					if (detections) {
						return faceapi.resizeResults(detections, displaySize);
					}
				})
				.then(resizedResults => {
					if (resizedResults) {
						context.clearRect(0, 0, canvas.width, canvas.height);

						faceapi.draw.drawDetections(canvas, resizedResults);
						faceapi.draw.drawFaceLandmarks(canvas, resizedResults);
						faceapi.draw.drawFaceExpressions(
							canvas,
							resizedResults,
							minProbability
						);
					}
				})
				.then(() => setVideoCanvas(canvas));
		}, 100);
	};

	const testFaceVideoEmoji = () => {
		const video = document.getElementById("camera_emoji");
		const emojiMatch = {
			neutral: "😐",
			happy: "😊",
			sad: "😟",
			angry: "😠",
			fearful: "😱",
			disgusted: "🤢",
			surprised: "😲"
		};
		const scanInterval = setInterval(() => {
			faceapi
				.detectSingleFace(video)
				.withFaceLandmarks()
				.withFaceExpressions()
				.then(detections => {
					// console.log(detections);
					let emotion = "neutral";
					if (detections) {
						for (const emotionKey in detections.expressions) {
							emotion =
								detections.expressions[emotionKey] >
								detections.expressions[emotion]
									? emotionKey
									: emotion;
						}
						console.log(emotion);
					}
					// const emotion = Object.keys(detections.expressions)[0];
					setCurrentEmoji(emojiMatch[emotion]);
				});
		}, 100);
	};

	const startVideo = () => {
		const constraints = { video: true };
		const video = document.getElementById("camera");
		navigator.mediaDevices.getUserMedia(constraints).then(stream => {
			video.srcObject = stream;
		});
	};
	const startVideoEmoji = () => {
		const constraints = { video: true };
		const video = document.getElementById("camera_emoji");
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
					<div>
						<button onClick={startVideo}>Start Video feed</button>
						<button onClick={testFaceVideo}>Start Capture</button>
					</div>
					<div className="testImage">
						<canvas
							style={{ width: 640, height: 480 }}
							width="640px"
							height="480px"
							id="test_canvas_video"
						></canvas>
						<video
							style={{ width: 640, height: 480, backgroundColor: "black" }}
							width="640px"
							height="480px"
							autoPlay
							id="camera"
						></video>
					</div>
				</section>
				<section>
					<h2>Test of video emoji</h2>
					<div>
						<button onClick={startVideoEmoji}>Start Video feed</button>
						<button onClick={testFaceVideoEmoji}>Start Capture</button>
					</div>
					<div>
						<span style={{ fontSize: "4em" }}>{currentEmoji}</span>
					</div>
					<div className="testImage">
						<canvas
							style={{ width: 640, height: 480 }}
							width="640px"
							height="480px"
							id="test_canvas_video_emoji"
						></canvas>
						<video
							style={{ width: 640, height: 480, backgroundColor: "black" }}
							width="640px"
							height="480px"
							autoPlay
							id="camera_emoji"
						></video>
					</div>
				</section>
			</header>
		</div>
	);
}

export default App;
