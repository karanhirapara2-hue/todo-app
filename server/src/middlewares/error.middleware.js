const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongo invalid ID
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
export default errorMiddleware;