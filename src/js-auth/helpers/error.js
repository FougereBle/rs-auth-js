export default function (err) {
  if (err.response) {
    return {
      error: true,
      response: true,
      code: err.response.status,
      message: err.response.data[config.errorVar],
    };
  } else {
    return {
      error: true,
      response: false,
      code: 409,
      message: "Service Unavailable",
    };
  }
}
