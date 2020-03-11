# Playing with Machine Learning in the browser

## What is Machine Learning ?

If you ask Wikipedia, Machine Learning (or ML) is the scientific study of algorithms and statistical models that computer systems use to perform a specific task without using explicit instructions, relying on patterns and inference instead.

In short, predictions are built based on the data given (training data) and builds a model to be used to analyse similar data.

Popular frameworks for Machine Learning are PyTorch, Keras and Tensorflow

## What's TensorFlow.js ?

In the words of Google, TensorFlow is an end-to-end open source platform for machine learning. It has a comprehensive, flexible ecosystem of tools, libraries and community resources that lets researchers push the state-of-the-art in ML and developers easily build and deploy ML powered applications.

It is a popular platform to build & use machine learning algorithms, especially in the front-end (like browsers) with it's brother Tensorflow.js. If you dive deeper in ML, people will often bash on it's performance (or lack of), but it's the only running in a browser, so, you know ;)

## Model training with TeachableMachine & High level Usage with ML5.js (voice-login)

In this example, it's about a login page that will show the login form if you say 'Hello', and will log you out if you say 'Bye'. Creation of the model was done using TeachableMachine and the Frontend code was written using the ML5.js library (built on top of TF.js), to simplify the usage of it.

## Using pretrained models & face recognition with face-api.js (emoji-match)

In this example, I created multiple interactions between images & videos to test the face landmarking & emotion possibilities of face-api.js. Model data was provided from multiple sources, and can be found on the face-api.js repo.

## Yoga pose validator with Tensorflow.js & the PoseNet model (yoga-trainer)

(Unfinished) In this example, the goal is to validate the yoga poses based on the pre-trained PoseNet model.

## References

- https://en.wikipedia.org/wiki/Machine_learning
- https://www.youtube.com/watch?v=P0mfVGtC01s
- https://keras.io/
- https://pytorch.org/
- https://www.tensorflow.org/js/
- https://teachablemachine.withgoogle.com/
- https://ml5js.org/
- https://github.com/justadudewhohacks/face-api.js
