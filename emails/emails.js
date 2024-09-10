const emails = ({ username, otp }) => {
  return `<!DOCTYPE html>
    <html lang="en" style="font-family: 'Roboto', sans-serif; background-color: #f5f5f5; margin: 0; padding: 0;">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
        body {
          margin: 0;
          padding: 0;
          font-family: 'Roboto', sans-serif;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #333333;
          color: #ffffff;
          text-align: center;
          padding: 25px;
          border-radius: 12px 12px 0 0;
          font-size: 28px;
          font-weight: bold;
        }
        .content {
          padding: 25px;
          text-align: center;
        }
        .content h2 {
          color: #333333;
          font-size: 24px;
          margin-bottom: 15px;
        }
        .content p {
          color: #666666;
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .otp {
          background-color: #007BFF;
          color: #ffffff;
          font-size: 28px;
          font-weight: bold;
          padding: 20px;
          border-radius: 8px;
          letter-spacing: 2px;
          margin: 20px 0;
          display: inline-block;
        }
        .footer {
          margin-top: 20px;
          color: #999999;
          font-size: 14px;
          text-align: center;
        }
        .footer a {
          color: #007BFF;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          Email Verification
        </div>
        <div class="content">
          <h2>Hello ${username},</h2>
          <p>Thank you for joining us! Please use the verification code below to complete your registration:</p>
          <div class="otp">${otp}</div>
          <p>If you did not request this, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>Thank you for being with us!</p>
          <p>© ${new Date().getFullYear()} Mughees. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>`;
};

export default emails;
