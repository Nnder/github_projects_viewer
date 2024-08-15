import { Outlet } from 'react-router-dom';
import { Search } from './pages/Search';
import './App.scss';

function App() {
    return (
        <>
            <Search />
            <Outlet />
        </>
    );
}

export default App;
