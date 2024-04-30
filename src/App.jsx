import { useState } from "react";
import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Onboarding from "./Screens/onBoarding/Onboarding";
import Homescreen from "./Screens/Homescreen/Homescreen";
import FriendPost from "./Screens/FriendPost/FriendPost";

function App() {
  const [imgModal, setImgModal] = useState(false);
  const [modalCond, setModalCond] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Onboarding setImgModal={setImgModal} setModalCond={setModalCond} />
          }
        />
        <Route
          path="/home"
          element={
            <Homescreen
              imgModal={imgModal}
              modalCond={modalCond}
              setImgModal={setImgModal}
              setModalCond={setModalCond}
            />
          }
        />
        <Route path="/friendpost" element={<FriendPost />} />
      </Routes>
    </Router>
  );
}

export default App;
