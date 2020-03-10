import React, { useState, useEffect } from "react";
import "./App.scss";
import { soundClassifier } from "ml5";

function App() {
	const [username, setUsername] = useState("");
	const [loginWindow, setLoginWindow] = useState(false);
	const [voiceListenerReady, setVoiceListenerReady] = useState(false);
	const [voiceListener, setVoiceListener] = useState(false);

	const gotResult = (error, result) => {
		if (error) {
			console.log(error);
			return;
		}
		// log the result
		console.log(result, username);
		if (result[0].label === "Hello") {
			console.log("hello");
			setLoginWindow(true);
		}
		if (result[0].label === "Bye") {
			console.log("bye");
			setUsername("");
			setLoginWindow(false);
		}
	};

	const formSubmit = event => {
		event.preventDefault();
		setLoginWindow(!loginWindow);
	};

	useEffect(() => {
		setVoiceListener(
			soundClassifier(
				// 	"https://teachablemachine.withgoogle.com/models/IoAT1PCX/model.json",
				"http://localhost:3000/models/hello-bye-v1/model.json",
				{ probabilityThreshold: 0.85 },
				() => setVoiceListenerReady(true)
			)
		);
	}, []);

	useEffect(() => {
		if (voiceListener) {
			voiceListener.classify((error, result) =>
				gotResult(error, result, username)
			);
			console.log(voiceListener);

			return function cleanup() {
				navigator.mediaDevices
					.getUserMedia({ audio: true })
					.then(mediaStream =>
						mediaStream.getTracks().forEach(track => track.stop())
					);
			};
		}
	}, [voiceListenerReady]);

	return (
		<div className="App">
			<h1>Voice login</h1>
			{!voiceListenerReady && <h2>Hold on !</h2>}
			{voiceListenerReady && (
				<h2>Say 'Hello' to open the login form, and 'Bye' to to logout !</h2>
			)}
			{loginWindow && (
				<section className="login-window">
					<h2>Please login with any username</h2>
					<form onSubmit={formSubmit}>
						<input
							onChange={e => setUsername(e.target.value)}
							value={username}
							type="text"
							placeholder="Username"
						/>
						<input type="submit" />
					</form>
				</section>
			)}
			{!loginWindow && username && <h2>Hello {username} !</h2>}
		</div>
	);
}

export default App;
