// Hiring-specific email templates for Canopy ATS
// Includes candidate notifications and approver templates

interface BaseEmailData {
  candidateEmail: string;
  candidateName: string;
}

// Application received
interface ApplicationReceivedData extends BaseEmailData {
  jobTitle: string;
  companyName: string;
}

export function applicationReceivedEmail(data: ApplicationReceivedData) {
  const formattedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return {
    to: data.candidateEmail,
    subject: `Thank you for applying to ${data.jobTitle} at ${data.companyName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #0A3D2C; padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0;">Application Received</h1>
        </div>

        <div style="padding: 32px; background-color: #ffffff;">
          <p>Hi ${data.candidateName},</p>

          <p>Thank you for applying to the <strong>${data.jobTitle}</strong> position at <strong>${data.companyName}</strong>.</p>

          <p>We've received your application and will review it carefully. We'll be in touch soon if you're selected to move forward in the hiring process.</p>

          <div style="background-color: #F3F7F6; border-radius: 8px; padding: 24px; margin: 24px 0;">
            <h3 style="margin: 0 0 16px 0; color: #0A3D2C;">Application Details</h3>
            <p style="margin: 8px 0;"><strong>Position:</strong> ${data.jobTitle}</p>
            <p style="margin: 8px 0;"><strong>Company:</strong> ${data.companyName}</p>
            <p style="margin: 8px 0;"><strong>Received:</strong> ${formattedDate}</p>
          </div>

          <p style="color: #666;">
            In the meantime, feel free to explore other opportunities or learn more about ${data.companyName} on their career page.
          </p>

          <hr style="border: none; border-top: 1px solid #E5E5E5; margin: 24px 0;">

          <p style="color: #888; font-size: 14px;">
            If you have any questions about your application, please don't hesitate to reach out.
          </p>
        </div>

        <div style="background-color: #F3F7F6; padding: 24px; text-align: center;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            © ${new Date().getFullYear()} Canopy by Green Jobs Board. Climate hiring, simplified.
          </p>
        </div>
      </div>
    `,
    text: `
Application Received

Hi ${data.candidateName},

Thank you for applying to the ${data.jobTitle} position at ${data.companyName}.

We've received your application and will review it carefully. We'll be in touch soon if you're selected to move forward in the hiring process.

Application Details:
- Position: ${data.jobTitle}
- Company: ${data.companyName}
- Received: ${formattedDate}

In the meantime, feel free to explore other opportunities or learn more about ${data.companyName} on their career page.

If you have any questions about your application, please don't hesitate to reach out.

© ${new Date().getFullYear()} Canopy by Green Jobs Board. Climate hiring, simplified.
    `.trim(),
  };
}

// Stage changed
interface StageChangedData extends BaseEmailData {
  jobTitle: string;
  companyName: string;
  newStage: string;
}

export function stageChangedEmail(data: StageChangedData) {
  const stageLabels: Record<string, string> = {
    screening: "Screening Round",
    interview: "Interview Round",
    offer: "Offer Stage",
    hired: "Hired",
  };

  const stageLabel = stageLabels[data.newStage.toLowerCase()] || data.newStage;

  return {
    to: data.candidateEmail,
    subject: `Great news about your application for ${data.jobTitle}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #0A3D2C; padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0;">Application Update</h1>
        </div>

        <div style="padding: 32px; background-color: #ffffff;">
          <p>Hi ${data.candidateName},</p>

          <p>Congratulations! Your application for the <strong>${data.jobTitle}</strong> position at <strong>${data.companyName}</strong> has progressed to the next stage.</p>

          <div style="background-color: #E8F5E9; border-radius: 8px; padding: 24px; margin: 24px 0;">
            <h3 style="margin: 0 0 16px 0; color: #0A3D2C;">You're now in:</h3>
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #0A3D2C;">${stageLabel}</p>
          </div>

          <p style="color: #666;">
            We're impressed with your qualifications and would like to continue our conversation. You'll hear from us soon with next steps.
          </p>

          <p style="color: #666;">
            If you have any questions in the meantime, please don't hesitate to reach out.
          </p>

          <hr style="border: none; border-top: 1px solid #E5E5E5; margin: 24px 0;">

          <p style="color: #888; font-size: 14px;">
            Thank you for your interest in ${data.companyName}!
          </p>
        </div>

        <div style="background-color: #F3F7F6; padding: 24px; text-align: center;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            © ${new Date().getFullYear()} Canopy by Green Jobs Board. Climate hiring, simplified.
          </p>
        </div>
      </div>
    `,
    text: `
Application Update

Hi ${data.candidateName},

Congratulations! Your application for the ${data.jobTitle} position at ${data.companyName} has progressed to the next stage.

You're now in: ${stageLabel}

We're impressed with your qualifications and would like to continue our conversation. You'll hear from us soon with next steps.

If you have any questions in the meantime, please don't hesitate to reach out.

Thank you for your interest in ${data.companyName}!

© ${new Date().getFullYear()} Canopy by Green Jobs Board. Climate hiring, simplified.
    `.trim(),
  };
}

// Interview scheduled
interface InterviewScheduledData extends BaseEmailData {
  jobTitle: string;
  companyName: string;
  interviewDate: Date;
  interviewerName: string;
  meetingLink?: string;
}

export function interviewScheduledEmail(data: InterviewScheduledData) {
  const formattedDate = data.interviewDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = data.interviewDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return {
    to: data.candidateEmail,
    subject: `Your interview is scheduled for ${data.jobTitle}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #0A3D2C; padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0;">Interview Scheduled</h1>
        </div>

        <div style="padding: 32px; background-color: #ffffff;">
          <p>Hi ${data.candidateName},</p>

          <p>Great news! Your interview with <strong>${data.interviewerName}</strong> from <strong>${data.companyName}</strong> has been scheduled.</p>

          <div style="background-color: #F3F7F6; border-radius: 8px; padding: 24px; margin: 24px 0;">
            <h3 style="margin: 0 0 16px 0; color: #0A3D2C;">Interview Details</h3>
            <p style="margin: 8px 0;"><strong>Position:</strong> ${data.jobTitle}</p>
            <p style="margin: 8px 0;"><strong>Date:</strong> ${formattedDate}</p>
            <p style="margin: 8px 0;"><strong>Time:</strong> ${formattedTime}</p>
            <p style="margin: 8px 0;"><strong>Interviewer:</strong> ${data.interviewerName}</p>
          </div>

          ${
            data.meetingLink
              ? `
          <div style="text-align: center; margin: 24px 0;">
            <a href="${data.meetingLink}" style="background-color: #0A3D2C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Join Interview
            </a>
          </div>
          `
              : ""
          }

          <h3 style="color: #0A3D2C;">Tips for Success</h3>
          <ul style="color: #666;">
            <li>Research the company and the role thoroughly</li>
            <li>Prepare thoughtful questions about the position and company</li>
            <li>Test your technology setup if it's a virtual interview</li>
            <li>Arrive a few minutes early</li>
            <li>Dress professionally</li>
          </ul>

          <p style="color: #666;">
            If you need to reschedule or have any questions, please reach out as soon as possible.
          </p>
        </div>

        <div style="background-color: #F3F7F6; padding: 24px; text-align: center;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            © ${new Date().getFullYear()} Canopy by Green Jobs Board. Climate hiring, simplified.
          </p>
        </div>
      </div>
    `,
    text: `
Interview Scheduled

Hi ${data.candidateName},

Great news! Your interview with ${data.interviewerName} from ${data.companyName} has been scheduled.

Interview Details:
- Position: ${data.jobTitle}
- Date: ${formattedDate}
- Time: ${formattedTime}
- Interviewer: ${data.interviewerName}

${data.meetingLink ? `Join Interview: ${data.meetingLink}` : ""}

Tips for Success:
- Research the company and the role thoroughly
- Prepare thoughtful questions about the position and company
- Test your technology setup if it's a virtual interview
- Arrive a few minutes early
- Dress professionally

If you need to reschedule or have any questions, please reach out as soon as possible.

© ${new Date().getFullYear()} Canopy by Green Jobs Board. Climate hiring, simplified.
    `.trim(),
  };
}

// Application rejected
interface ApplicationRejectedData extends BaseEmailData {
  jobTitle: string;
  companyName: string;
  rejectionReason?: string;
}

export function applicationRejectedEmail(data: ApplicationRejectedData) {
  return {
    to: data.candidateEmail,
    subject: `Update on your application for ${data.jobTitle}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #0A3D2C; padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0;">Application Update</h1>
        </div>

        <div style="padding: 32px; background-color: #ffffff;">
          <p>Hi ${data.candidateName},</p>

          <p>Thank you for applying to the <strong>${data.jobTitle}</strong> position at <strong>${data.companyName}</strong>. We appreciate your interest and time invested in this opportunity.</p>

          <p>After careful consideration, we've decided to move forward with other candidates who more closely match the requirements of this specific role.</p>

          ${
            data.rejectionReason
              ? `
          <div style="background-color: #FFF8E7; border-left: 4px solid #F59E0B; padding: 16px; margin: 24px 0;">
            <p style="margin: 0;"><strong>Feedback:</strong> ${data.rejectionReason}</p>
          </div>
          `
              : ""
          }

          <p style="color: #666;">
            We encourage you to stay connected with ${data.companyName} and watch for future opportunities that might be a better fit. Many great careers don't start with the first application!
          </p>

          <hr style="border: none; border-top: 1px solid #E5E5E5; margin: 24px 0;">

          <p style="color: #888; font-size: 14px;">
            We wish you the best in your job search. Keep applying and stay persistent!
          </p>
        </div>

        <div style="background-color: #F3F7F6; padding: 24px; text-align: center;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            © ${new Date().getFullYear()} Canopy by Green Jobs Board. Climate hiring, simplified.
          </p>
        </div>
      </div>
    `,
    text: `
Application Update

Hi ${data.candidateName},

Thank you for applying to the ${data.jobTitle} position at ${data.companyName}. We appreciate your interest and time invested in this opportunity.

After careful consideration, we've decided to move forward with other candidates who more closely match the requirements of this specific role.

${data.rejectionReason ? `Feedback: ${data.rejectionReason}` : ""}

We encourage you to stay connected with ${data.companyName} and watch for future opportunities that might be a better fit. Many great careers don't start with the first application!

We wish you the best in your job search. Keep applying and stay persistent!

© ${new Date().getFullYear()} Canopy by Green Jobs Board. Climate hiring, simplified.
    `.trim(),
  };
}

// Approval request
interface ApprovalRequestData {
  approverEmail: string;
  approverName: string;
  requesterName: string;
  entityType: "JOB" | "OFFER";
  entityTitle: string;
}

export function approvalRequestEmail(data: ApprovalRequestData) {
  const entityTypeName = data.entityType === "JOB" ? "Job Posting" : "Offer Letter";

  return {
    to: data.approverEmail,
    subject: `Approval needed: ${data.entityTitle}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #0A3D2C; padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0;">Approval Request</h1>
        </div>

        <div style="padding: 32px; background-color: #ffffff;">
          <p>Hi ${data.approverName},</p>

          <p><strong>${data.requesterName}</strong> has submitted a <strong>${entityTypeName}</strong> for your approval:</p>

          <div style="background-color: #F3F7F6; border-radius: 8px; padding: 24px; margin: 24px 0;">
            <h3 style="margin: 0 0 16px 0; color: #0A3D2C;">${data.entityTitle}</h3>
            <p style="margin: 0; color: #666;">Type: ${entityTypeName}</p>
            <p style="margin: 8px 0 0 0; color: #666;">Submitted by: ${data.requesterName}</p>
          </div>

          <p style="color: #666;">
            Please review and either approve or reject this request in Canopy ATS.
          </p>

          <div style="text-align: center; margin: 24px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/canopy/approvals" style="background-color: #0A3D2C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Review in Canopy
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #E5E5E5; margin: 24px 0;">

          <p style="color: #888; font-size: 14px;">
            This is an automated message from Canopy ATS. Please do not reply to this email.
          </p>
        </div>

        <div style="background-color: #F3F7F6; padding: 24px; text-align: center;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            © ${new Date().getFullYear()} Canopy by Green Jobs Board. Climate hiring, simplified.
          </p>
        </div>
      </div>
    `,
    text: `
Approval Request

Hi ${data.approverName},

${data.requesterName} has submitted a ${entityTypeName} for your approval:

${data.entityTitle}
Type: ${entityTypeName}
Submitted by: ${data.requesterName}

Please review and either approve or reject this request in Canopy ATS.

Review in Canopy: ${process.env.NEXT_PUBLIC_APP_URL}/canopy/approvals

This is an automated message from Canopy ATS. Please do not reply to this email.

© ${new Date().getFullYear()} Canopy by Green Jobs Board. Climate hiring, simplified.
    `.trim(),
  };
}

// Approval response
interface ApprovalResponseData {
  requesterEmail: string;
  requesterName: string;
  approverName: string;
  entityType: "JOB" | "OFFER";
  entityTitle: string;
  status: "APPROVED" | "REJECTED";
  rejectionReason?: string;
}

export function approvalResponseEmail(data: ApprovalResponseData) {
  const entityTypeName = data.entityType === "JOB" ? "Job Posting" : "Offer Letter";
  const isApproved = data.status === "APPROVED";

  return {
    to: data.requesterEmail,
    subject: isApproved
      ? `${data.entityTitle} has been approved`
      : `${data.entityTitle} needs revision`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: ${isApproved ? "#0A3D2C" : "#E90000"}; padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0;">${isApproved ? "Approved!" : "Needs Revision"}</h1>
        </div>

        <div style="padding: 32px; background-color: #ffffff;">
          <p>Hi ${data.requesterName},</p>

          <p>
            ${
              isApproved
                ? `<strong>${data.approverName}</strong> has approved your <strong>${entityTypeName}</strong>: <strong>${data.entityTitle}</strong>`
                : `<strong>${data.approverName}</strong> has reviewed your <strong>${entityTypeName}</strong> and requested changes before it can be approved.`
            }
          </p>

          <div
            style="background-color: ${isApproved ? "#E8F5E9" : "#FFEBF4"}; border-radius: 8px; padding: 24px; margin: 24px 0; border-left: 4px solid ${isApproved ? "#0A3D2C" : "#E90000"};"
          >
            <h3 style="margin: 0 0 16px 0; color: ${isApproved ? "#0A3D2C" : "#E90000"};">
              ${isApproved ? "Next Steps" : "Feedback"}
            </h3>
            ${
              isApproved
                ? `<p style="margin: 0; color: #666;">Your ${entityTypeName.toLowerCase()} is ready to go live. You can now publish or send it as needed.</p>`
                : `<p style="margin: 0; color: #666;">${data.rejectionReason || "Please review the feedback and make the requested changes."}</p>`
            }
          </div>

          <div style="text-align: center; margin: 24px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/canopy/dashboard" style="background-color: #0A3D2C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View in Canopy
            </a>
          </div>

          <p style="color: #666;">
            ${
              isApproved
                ? "Your approval is complete. Proceed with publishing or sharing as needed."
                : "If you have questions about the feedback, please reach out to " + data.approverName + "."
            }
          </p>
        </div>

        <div style="background-color: #F3F7F6; padding: 24px; text-align: center;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            © ${new Date().getFullYear()} Canopy by Green Jobs Board. Climate hiring, simplified.
          </p>
        </div>
      </div>
    `,
    text: `
${isApproved ? "Approved!" : "Needs Revision"}

Hi ${data.requesterName},

${
  isApproved
    ? `${data.approverName} has approved your ${entityTypeName}: ${data.entityTitle}`
    : `${data.approverName} has reviewed your ${entityTypeName} and requested changes before it can be approved.`
}

${isApproved ? "Next Steps" : "Feedback"}:
${
  isApproved
    ? `Your ${entityTypeName.toLowerCase()} is ready to go live. You can now publish or send it as needed.`
    : `${data.rejectionReason || "Please review the feedback and make the requested changes."}`
}

View in Canopy: ${process.env.NEXT_PUBLIC_APP_URL}/canopy/dashboard

${
  isApproved
    ? "Your approval is complete. Proceed with publishing or sharing as needed."
    : "If you have questions about the feedback, please reach out to " + data.approverName + "."
}

© ${new Date().getFullYear()} Canopy by Green Jobs Board. Climate hiring, simplified.
    `.trim(),
  };
}
