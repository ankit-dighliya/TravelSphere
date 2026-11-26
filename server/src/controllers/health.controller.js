export const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: "TravelSphere API is running successfully.",
  });
};