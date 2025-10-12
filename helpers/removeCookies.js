const removeCookie = (res, message) => {
  res
    .status(200)
    .cookie('token', '', {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    })
    .json({
      success: true,
      message: message,
    });
};

module.exports = { removeCookie };
