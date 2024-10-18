import React from "react";
import Home from "./Components/Home/Home";
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginPage from "./Components/Login/LoginPage";

function App(){
  return (
  
    <Router>
      <div className='App'>
        <Routes>
          <Route  path='/home' element={<Home />}/>
          <Route path="/" element={<LoginPage/>}/>
        </Routes>
      </div>
    </Router>
   
  )
}

export default App;
