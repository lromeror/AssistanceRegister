import Sistema from "./Sistem/Sistema"
import Homepage from "./Home/Homepage";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

export default function App() {
    return (
        <>
            <Router>
                <div className='-z-1000'>
                    <Routes>
                        <Route exact path='/' element={<Homepage />} />
                        <Route path='/Sistem' element={<Sistema />} />
                    </Routes>
                </div>
            </Router>
        </>
    )
}