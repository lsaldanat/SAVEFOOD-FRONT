import { useNavigate } from "react-router-dom";
import LoginForm from "../LoginForm";

export default function LoginPage({ onLogin }) {
  return <LoginForm onLogin={onLogin} />;
}
