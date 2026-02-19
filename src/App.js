import './App.css';
import { Routes, Route } from 'react-router-dom';
import SignUp from './features/auth/pages/SignUp';
import SignIn from './features/auth/pages/SignIn';
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <Routes>
      <Route path='/' element={<SignUp/>}/>
      <Route path='/signin' element={<SignIn/>}/>
      <Route path='/main' element={<MainLayout/>}/>
    </Routes>
  );
}

export default App;
