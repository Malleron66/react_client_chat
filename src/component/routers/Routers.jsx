import { createBrowserRouter } from "react-router-dom";
import { Home } from '../pages/Home';
import { WrapperChat } from '../chat/WrapperChat';

export const Routers = createBrowserRouter([
    {
      path: '/',
      element: <Home head='Welcome' title='Добро пожаловать' pageType='login'/>,
    },
    {
      path: '/registration',
      element: <Home head='&#60; Назад' title='Регистрация' pageType='registration'/>,
    },
    {
      path: '/user/:id',
      element: <WrapperChat/>,
    },
]);