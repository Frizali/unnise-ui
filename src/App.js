import './App.css';
import { Routes, Route } from 'react-router-dom';
import SignUp from './features/auth/pages/SignUp';
import SignIn from './features/auth/pages/SignIn';

function App() {
  return (
    <Routes>
      <Route path='/' element={<SignUp/>}/>
      <Route path='/signin' element={<SignIn/>}/>
    </Routes>
  );
}

export default App;
