
import { Routes, Route } from "react-router-dom";
import {  Suspense } from "react";
import './App.css'
import Home from './page/Home';
import MovieDetails from './page/MovieDetails';

function App() {

       return (
         <div className="w-full overflow-hidden">
           <Suspense fallback={<div className="">Loading....</div>}>
             <Routes>
               
                 <Route index element={<Home />} />
                 <Route path="/movie-detail/:id" element={<MovieDetails />} />
               
             </Routes>
           </Suspense> 
         </div>
  )
}

export default App
