import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import ChatWithNotes from "./pages/chat_with_notes";
import Flashcards from "./pages/Flashcard";
import Quiz from "./pages/Quiz";
import Register from "./pages/Register";
import Login from "./pages/login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<ChatWithNotes />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
