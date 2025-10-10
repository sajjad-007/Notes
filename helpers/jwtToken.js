const jsonwebtoken = (token, message, user, res, statusCode) => {
  res
    .statusCode(statusCode)
    .cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    })
    .json({
      success: true,
      messaeg: message,
      user,
    });
};

module.exports = { jsonwebtoken };
