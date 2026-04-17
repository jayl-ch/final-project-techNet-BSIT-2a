const TaskWiseIcon = ({ bg = "#4F46E5", size = 40 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
    >
      <rect width="100" height="100" rx="20" fill={bg} />
      <circle
        cx="50"
        cy="36"
        r="18"
        fill="none"
        stroke="#ffffff"
        stroke-width="3.5"
        opacity="0.25"
      />
      <circle
        cx="50"
        cy="36"
        r="18"
        fill="none"
        stroke="#ffffff"
        stroke-width="3.5"
        stroke-dasharray="113"
        stroke-dashoffset="28"
        stroke-linecap="round"
        transform="rotate(-90 50 36)"
      />
      <polyline
        points="41,36 47.5,42.5 59,30"
        fill="none"
        stroke="#ffffff"
        stroke-width="3.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <rect
        x="23"
        y="64"
        width="54"
        height="5"
        rx="2.5"
        fill="#ffffff"
        opacity="0.9"
      />
      <rect
        x="23"
        y="74"
        width="40"
        height="5"
        rx="2.5"
        fill="#ffffff"
        opacity="0.55"
      />
      <rect
        x="23"
        y="84"
        width="46"
        height="5"
        rx="2.5"
        fill="#ffffff"
        opacity="0.35"
      />
      <circle cx="77" cy="86.5" r="4" fill="#A5F3FC" />
    </svg>
  );
};

export default TaskWiseIcon;
