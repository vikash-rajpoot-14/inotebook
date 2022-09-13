import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Welcome to Gold Gym</h1>
      <p>Enter the detail below</p>
      <div className="container">
        <div className="input">
          <input className='name' type="text" placeholder='enter name' />
        </div>
        <div className="input">
          <input className='email' type="text" placeholder='enter eamil' />
        </div>
        <div className="input">
          <input className='password' type="text" placeholder='enter password' />
        </div>
        <div className="button">
          <button className="btn">login</button>
        </div>
      </div>
    </div>
  );
}

export default App;
