export const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const buttonVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    y: -3,
    transition: { type: "spring", stiffness: 300 },
  },
  tap: { scale: 0.95 },
};
