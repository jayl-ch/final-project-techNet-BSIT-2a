import { Container } from "react-bootstrap";
import AuthCard from "./AuthCard";

const AuthPageShell = ({ children, cardName, className = "" }) => {
  return (
    <main
      className={`min-vh-100 d-flex justify-content-center align-items-center ${className}`.trim()}
    >
      <Container fluid="sm" style={{ maxWidth: "45rem" }}>
        <div className="row justify-content-center">
          <div className="col-12">
            <AuthCard name={cardName}>{children}</AuthCard>
          </div>
        </div>
      </Container>
    </main>
  );
};

export default AuthPageShell;
