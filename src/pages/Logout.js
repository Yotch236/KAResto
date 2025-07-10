import { Navigate } from 'react-router-dom';
import { useEffect, useContext, useState } from 'react';
import { toast } from "react-toastify";
import UserContext from '../context/UserContext';

export default function Logout() {
  const { setUser, unsetUser } = useContext(UserContext);
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    unsetUser();
    setUser({ id: null, isAdmin: null });
    toast.success("You have been logged out.");
    setLoggedOut(true);
  }, [unsetUser, setUser]);

  return loggedOut ? <Navigate to="/login" replace /> : null;
}
