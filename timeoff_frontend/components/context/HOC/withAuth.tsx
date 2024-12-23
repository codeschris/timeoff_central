import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Cookies from 'universal-cookie';

const withAuth = (WrappedComponent: React.FC) => {
  const AuthComponent: React.FC = (props) => {
    const router = useRouter();
    const cookies = new Cookies();
    const token = cookies.get('token');

    useEffect(() => {
      if (!token) {
        router.push('/auth/login');
      }
    }, [token, router]);

    if (!token) return null;
    return <WrappedComponent {...props} />;
  };

  AuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return AuthComponent;
};

export default withAuth;