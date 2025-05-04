export const signup = (link) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
      <h1 style="color: #007bff; text-align: center;">Hello from Moamen</h1>
      <p style="font-size: 16px; line-height: 1.5; color: #333;">
        This is a test email sent from your Node.js application using <strong>Nodemailer</strong>. 
        You can include styled HTML content to make your emails more engaging!
      </p>
      <p style="font-size: 16px; line-height: 1.5; color: #333;">
        Here are some of the features:
        <ul style="padding-left: 20px;">
          <li>HTML styling</li>
          <li>Dynamic content</li>
          <li>Responsive design</li>
        </ul>
      </p>
      <a href="" target="_blank" style="display: inline-block; background-color: #007bff; color: white; text-decoration: none; padding: 10px 20px; font-size: 16px; border-radius: 4px; margin-top: 10px;">
        ${link}
      </a>
 
  `;
};
export const verifyUpdateEmail = (link) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
      <h1 style="color: #007bff; text-align: center;">Hello from Moamen</h1>
      <p style="font-size: 16px; line-height: 1.5; color: #333;">
        This is a test email sent from your Node.js application using <strong>Nodemailer</strong>. 
        You can include styled HTML content to make your emails more engaging!
      </p>
      <p style="font-size: 16px; line-height: 1.5; color: #333;">
        Here are some of the features:
        <ul style="padding-left: 20px;">
          <li>HTML styling</li>
          <li>Dynamic content</li>
          <li>Responsive design</li>
        </ul>
      </p>
      <a href=${link} target="_blank" style="display: inline-block; background-color: #007bff; color: white; text-decoration: none; padding: 10px 20px; font-size: 16px; border-radius: 4px; margin-top: 10px;">
      verify email
      </a>
 
  `;
};
