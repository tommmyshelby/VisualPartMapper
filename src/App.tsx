
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import VisualPartMapper from './components/VisualPartMapper';

function App() {
  return (
    <Router>
      <Routes>
  

        {/* Route for VisualPartMapper component */}
        <Route path="/" element={<VisualPartMapper />} />
      </Routes>
    </Router>
  );
}

export default App;
