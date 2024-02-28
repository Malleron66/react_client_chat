import { createBrowserRouter } from "react-router-dom";
import { Home } from '../pages/Home';
import { WrapperGamePage } from '../pages/gamePage/WrapperGamePage';

export const server = `http://localhost:3000`;
export const Routers = createBrowserRouter([
    {
      path: '/',
      element: <Home head='Welcome' title='Welcome' pageType='login'/>,
    },
    {
      path: '/registration',
      element: <Home head='&#60; Back' title='Registration' pageType='registration'/>,
    },
    {
      path: '/user/:fullName',
      element: <WrapperGamePage/>,
    },
]);