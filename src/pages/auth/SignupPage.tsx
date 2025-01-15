import Signup from "../../Components/Signup";
import { useSearchParams } from "react-router-dom";

export default function SignupPage() {
  const [searchParams] = useSearchParams();
  const isSignup = !searchParams.has("signin");

  return <Signup isSignup={isSignup} />;
}
