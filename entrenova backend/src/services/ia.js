import { GoogleGenerativeAI } from "@google/generative-ai";
// esse import é por conta do .env pra criptografar a key mas ele n ta sendo usado
// import dotenv from 'dotenv'; // Import dotenv

//dotenv.config(); // Load environment variables from .env file --> mesma coisa

const API_KEY = "AIzaSyBhE1iWZDZa-T23RUyTSxJwLQRVK7NHCGc"; // Access API_KEY ---from process.env

const genAI = new GoogleGenerativeAI(API_KEY); // Use the variable here

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash"});

async function run() {
  const prompt = "Fale brevemente sobre oque é uma bola"
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}

run();