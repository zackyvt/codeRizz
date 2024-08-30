// src/index.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import App from "./App";
import "tailwindcss/tailwind.css"; // Import Tailwind CSS

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getVertexAI, getGenerativeModel } from "firebase/vertexai-preview";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8HhWjKkOQwmwP9cDSomCoAukiZ1yMrT8",
  authDomain: "skibidicoders.firebaseapp.com",
  projectId: "skibidicoders",
  storageBucket: "skibidicoders.appspot.com",
  messagingSenderId: "903554523797",
  appId: "1:903554523797:web:96c46dccc3df14b33f719c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize the Vertex AI service
const vertexAI = getVertexAI(app);

// Initialize the generative model with a model that supports your use case
// Gemini 1.5 models are versatile and can be used with all API capabilities
const model = getGenerativeModel(vertexAI, { model: "gemini-1.5-flash" });

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App model={model} />
  </React.StrictMode>,
);
