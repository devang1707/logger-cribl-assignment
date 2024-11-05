import './styles/App.css';
import LogTable from './components/LogTable';
import LogGraph from './components/LogGraph';

function App() {
  return (
    <div className="App">
      <h1> Cribl Logger App</h1>

      <LogGraph />
      <LogTable />
    </div>
  );
}

export default App;
