import * as React from "react";

interface EmailTemplateProps {
  email: string;
  secureCode: string;
  id: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  email, secureCode, id
}) => (
  <div>
    <h1 className="bg-black">Welcome, {email}!</h1>
    Your Verfication code is: {secureCode} or click the link below to verify your email
    <a href={`www.localhost:3000/login/verify/${id}/${secureCode}`}></a>
  </div>
);