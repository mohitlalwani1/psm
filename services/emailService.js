import nodemailer from "nodemailer";

// Create transporter
const transporter = nodemailer.createTransporter({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use app password for Gmail
  },
});

// Email templates
export const emailTemplates = {
  welcome: (userName) => ({
    subject: "Welcome to Project Management Platform",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to Project Management Platform!</h2>
        <p>Hello ${userName},</p>
        <p>Thank you for registering with our Project Management Platform. Your account has been successfully created.</p>
        <p>You can now:</p>
        <ul>
          <li>Create and manage projects</li>
          <li>Assign tasks to team members</li>
          <li>Track project progress</li>
          <li>Manage budgets and expenses</li>
        </ul>
        <p>If you have any questions, please don't hesitate to contact our support team.</p>
        <p>Best regards,<br>Project Management Team</p>
      </div>
    `,
  }),

  passwordReset: (resetLink) => ({
    subject: "Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Password Reset Request</h2>
        <p>You have requested to reset your password.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
        <p>Best regards,<br>Project Management Team</p>
      </div>
    `,
  }),

  taskAssignment: (taskTitle, assigneeName) => ({
    subject: `New Task Assigned: ${taskTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Task Assignment</h2>
        <p>Hello ${assigneeName},</p>
        <p>You have been assigned a new task: <strong>${taskTitle}</strong></p>
        <p>Please log in to your dashboard to view the task details and update the progress.</p>
        <p>Best regards,<br>Project Management Team</p>
      </div>
    `,
  }),

  projectUpdate: (projectName, updateType) => ({
    subject: `Project Update: ${projectName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Project Update</h2>
        <p>The project <strong>${projectName}</strong> has been ${updateType}.</p>
        <p>Please log in to your dashboard to view the latest updates.</p>
        <p>Best regards,<br>Project Management Team</p>
      </div>
    `,
  }),
};

// Send email function
export const sendEmail = async (to, template, data = {}) => {
  try {
    const emailContent = emailTemplates[template](data);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: emailContent.subject,
      html: emailContent.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error: error.message };
  }
};

// Send welcome email
export const sendWelcomeEmail = async (userEmail, userName) => {
  return await sendEmail(userEmail, "welcome", userName);
};

// Send password reset email
export const sendPasswordResetEmail = async (userEmail, resetLink) => {
  return await sendEmail(userEmail, "passwordReset", resetLink);
};

// Send task assignment email
export const sendTaskAssignmentEmail = async (
  userEmail,
  taskTitle,
  assigneeName
) => {
  return await sendEmail(userEmail, "taskAssignment", {
    taskTitle,
    assigneeName,
  });
};

// Send project update email
export const sendProjectUpdateEmail = async (
  userEmail,
  projectName,
  updateType
) => {
  return await sendEmail(userEmail, "projectUpdate", {
    projectName,
    updateType,
  });
};
