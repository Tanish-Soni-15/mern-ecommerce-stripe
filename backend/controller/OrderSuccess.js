import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendConfirmationEmail = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
    } else {
      const data = jwt.verify(token, "shhhhh");

      const { totalAmount, selectedAddress } = req.body;

      const toEmail = data?.email || "test@example.com";

      const paymentDetails = {
        orderId: "ORD" + Math.floor(Math.random() * 100000),
        amount: totalAmount,
        date: new Date().toLocaleString(),
      };

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GOOGLE_ACOUNT_USER,
          pass: process.env.GOOGLE_ACOUNT_PASS,
        },
      });

      const mailOptions = {
        from: '"Tanish Store" <no-reply@tanishstore.com>',
        to: toEmail,
        subject: "✅ Payment Successful",
        html: `
        <h2>Thank You for Your Order! 🎉</h2>
        <p><strong>Order ID:</strong> ${paymentDetails.orderId}</p>
        <p><strong>Total:</strong> $${paymentDetails.amount}</p>
       
        <p><strong>Date:</strong> ${paymentDetails.date}</p>
        <hr />
        <h4>Shipping To:</h4>
        <p>${selectedAddress?.firstName + selectedAddress?.lastName}<br/>${
          selectedAddress?.address
        }<br/>${selectedAddress?.city}, ${selectedAddress?.state} - ${
          selectedAddress?.zipCode
        }</p>
      `,
      };

      const info = await transporter.sendMail(mailOptions);

      

      res.status(200).json({
        success: true,
        message: "Email sent successfully"
      });
    }
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
};

export { sendConfirmationEmail };
