const EmptyGroupDetail = () => (
  <div className="groups-empty text-center py-5">
    <i className="bi bi-diagram-3 fs-2 d-block mb-2 text-secondary" />
    <h6 className="fw-bold mb-1">Group not found</h6>
    <p className="text-secondary mb-0 small">
      The selected group may have been removed or is unavailable.
    </p>
  </div>
);

export default EmptyGroupDetail;
