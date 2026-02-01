import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Banners from "./pages/Banners";
import PrivateRoute from "./pages/PrivateRoute";
import ArticleList from "./pages/ArticleList"; // example
import Vice from "./pages/Vice"
import Mission from "./pages/Mission"
import Success from "./pages/Success";
import Cafeteria from "./pages/Cafeteria"
import Calendar from "./pages/Calendar"
import Activities from "./pages/Activities"
import SpecialPrograms from "./pages/SpecialPrograms"
import Volunteer from "./pages/Volunteer"
import Process from "./pages/Process"
import Application from "./pages/Application"
import Tuition from "./pages/Tuition"
import News from "./pages/News"


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Banners page */}
        <Route
          path="/banners"
          element={
            <PrivateRoute>
              <Banners />
            </PrivateRoute>
          }
        />

        <Route
          path="/vice"
          element={
            <PrivateRoute>
              <Vice />
            </PrivateRoute>
          }
        />

        <Route
          path="/mission"
          element={
            <PrivateRoute>
              <Mission />
            </PrivateRoute>
          }
        />

          <Route
          path="/success"
          element={
            <PrivateRoute>
              <Success />
            </PrivateRoute>
          }
        />

        <Route
          path="/cafe"
          element={
            <PrivateRoute>
              <Cafeteria />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/calendar"
          element={
            <PrivateRoute>
              <Calendar />
            </PrivateRoute>
          }
        />

        <Route
          path="/activities"
          element={
            <PrivateRoute>
              <Activities />
            </PrivateRoute>
          }
        />"
        
        <Route
          path="/special"
          element={
            <PrivateRoute>
              <SpecialPrograms />
            </PrivateRoute>
          }
        />"
        
        "        
          <Route
          path="/volunteer"
          element={
            <PrivateRoute>
              <Volunteer />
            </PrivateRoute>
          }
        />

        <Route
          path="/process"
          element={
            <PrivateRoute>
              <Process />
            </PrivateRoute>
          }
        />

        <Route
          path="/application"
          element={
            <PrivateRoute>
              <Application />
            </PrivateRoute>
          }
        />


        
        <Route
          path="/tuition"
          element={
            <PrivateRoute>
              <Tuition />
            </PrivateRoute>
          }
        />


          <Route
          path="/news"
          element={
            <PrivateRoute>
              <News />
            </PrivateRoute>
          }
        />


      </Routes>
    </BrowserRouter>
  );
}

export default App;

