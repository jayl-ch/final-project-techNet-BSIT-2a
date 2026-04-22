import { Card } from "react-bootstrap";

const AuthCard = ({ children, name }) => {
  return (
    <Card className="auth-card border-0" role="region" aria-label={name}>
      <Card.Body className="p-4 p-sm-5">{children}</Card.Body>
    </Card>
  );
};

export default AuthCard;
