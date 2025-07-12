import nodemailer from 'nodemailer'

async function createTestTransporter() {
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });


  return transporter;
}

const sendConfirmationEmail = async (req, res) => {
    
  try {
    const {  totalAmount, selectedAddress } = req.body;

   
    

    const toEmail = selectedAddress?.email || "test@example.com"; 

    const paymentDetails = {
      orderId: "ORD" + Math.floor(Math.random() * 100000),
      amount: totalAmount,
      date: new Date().toLocaleString(),
      
    };

    const transporter = await createTestTransporter();

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
        <p>${selectedAddress?.firstName + selectedAddress?.lastName}<br/>${selectedAddress?.address}<br/>${selectedAddress?.city}, ${selectedAddress?.state} - ${selectedAddress?.zipCode}</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("📨 Email sent:", info.messageId);
    console.log("🔍 Preview URL:", nodemailer.getTestMessageUrl(info));

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
      preview: nodemailer.getTestMessageUrl(info),
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
};

export {sendConfirmationEmail}
