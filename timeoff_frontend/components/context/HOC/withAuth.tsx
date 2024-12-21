import React, { useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import { useRouter } from "next/router";

const withAuth = (WrappedComponent: React.ComponentType) => {
    const WithAuthComponent: React.FC = (props) => {
        const { isAuthenticated, whoami } = useContext(AuthContext);
        const router = useRouter();

        useEffect(() => {
            const checkAuth = async () => {
                await whoami();
                if (!isAuthenticated) {
                    router.push("/auth/login");
                }
            };

            checkAuth();
        }, [isAuthenticated, whoami, router]);

        if (!isAuthenticated) {
            return null; // or a loading spinner
        }

        return <WrappedComponent {...props} />;
    };

    return WithAuthComponent;
};

export default withAuth;