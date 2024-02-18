import {useAuth} from '@/components/user'
import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

const LogoutPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    void auth.logout();
    navigate("/login");
  }, []);
  return null;
}

export default LogoutPage;
