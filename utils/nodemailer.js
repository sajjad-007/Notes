const nodemailer = require('nodemailer');

const SendEmail = async (userEmail, message, emailTemplate) => {
  const transport = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    service: 'gmail',
    secure: false,
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_PASSWORD,
    },
  });
  try {
    const messageInfo = await transport.sendMail({
      from: process.env.ADMIN_EMAIL,
      to: userEmail,
      subject: message,
      html: emailTemplate,
    });
    // console.log(messageInfo.messageId);
    // return next(new ErrorHandler(`Otp sent at ${userEmail}`, 200));
  } catch (error) {
    console.error('Error', error);
    // return next(new ErrorHandler('Error from nodemailer', 500));
  }
};

module.exports = { SendEmail };
