import * as faceapi from 'face-api.js';
import { tinyFaceDetector } from 'face-api.js';

// Load models and weights
export async function loadModels() {
  const MODEL_URL = '../../../models';
  // await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
  // await faceapi.loadFaceLandmarkTinyModel(MODEL_URL);
  // await faceapi.loadFaceRecognitionModel(MODEL_URL);
  // await faceapi.loadFaceExpressionModel(MODEL_URL);
  // await faceapi.loadFaceLandmarkModel(MODEL_URL);
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
  await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
  await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
  await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
}

export async function getFullFaceDescription(blob, inputSize = 512) {
  // tiny_face_detector options
  let scoreThreshold = 0.5;
  const OPTION = new faceapi.TinyFaceDetectorOptions({
    inputSize,
    scoreThreshold
  });
  const useTinyModel = true;

  // fetch image to api
  let img = await faceapi.fetchImage(blob);

  // detect all faces and generate full description from image
  // including landmark and descriptor of each face
  let fullDesc = await faceapi
  .detectAllFaces(img, OPTION)
  .withFaceExpressions()
  .withFaceLandmarks()
  .withFaceDescriptors();

  const resizedResults = faceapi.resizeResults(fullDesc, img)
  return resizedResults;
}

const maxDescriptorDistance = 0.5;
export async function createMatcher(faceProfile) {
  // Create labeled descriptors of member from profile
  let members = Object.keys(faceProfile);
  let labeledDescriptors = members.map(
    member =>
      new faceapi.LabeledFaceDescriptors(
        faceProfile[member].name,
        faceProfile[member].descriptors.map(
          descriptor => new Float32Array(descriptor)
        )
      )
  );

  // Create face matcher (maximum descriptor distance is 0.5)
  let faceMatcher = new faceapi.FaceMatcher(
    labeledDescriptors,
    maxDescriptorDistance
  );
  return faceMatcher;
}
