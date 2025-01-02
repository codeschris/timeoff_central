import withAuth from "@/components/context/HOC/withAuth";
import { RegisterForm } from "@/components/register-form";

const RegisterEmployeePage = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <RegisterForm />
    </div>
  );
}

export default withAuth(RegisterEmployeePage);