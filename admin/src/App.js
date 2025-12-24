// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NewArticle from "./pages/NewArticle";
import ArticleList from "./pages/ArticleList";

// Protect pages unless logged in
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/new"
          element={
            <PrivateRoute>
              <NewArticle />
            </PrivateRoute>
          }
        />

        <Route
          path="/articles"
          element={
            <PrivateRoute>
              <ArticleList />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
