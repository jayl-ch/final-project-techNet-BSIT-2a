const AuthHeader = ({ icon, iconClass = "text-primary", title, subtitle }) => {
  return (
    <div className="text-center mb-5">
      <div className="mb-3">
        <i className={`bi ${icon} fs-1 ${iconClass}`}></i>
      </div>
      <h1 className="h2 fw-bold mb-2">{title}</h1>
      <p className="text-muted small">{subtitle}</p>
    </div>
  );
};

export default AuthHeader;
