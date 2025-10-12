const jsonwebtoken = (user, message, res, statusCode) => {
  const token = user.generateJwtToken(user._id);
  res
    .status(statusCode)
    .cookie('token', token, {
      expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    })
    .json({
      success: true,
      message,
      token,
      user,
    });
};

module.exports = { jsonwebtoken };
