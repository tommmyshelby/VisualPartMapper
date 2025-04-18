
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ExportList from './components/MappedExports/ExportList';
import VisualPartMapper from './components/VisualPartMapper';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for ExportList component */}
        <Route path="/exports" element={<ExportList />} />

        {/* Route for VisualPartMapper component */}
        <Route path="/" element={<VisualPartMapper />} />
      </Routes>
    </Router>
  );
}

export default App;
