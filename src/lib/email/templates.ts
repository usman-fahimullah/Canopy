// Email templates for Candid platform
// These templates can be used with any email provider (Resend, SendGrid, etc.)

interface BaseEmailData {
  recipientName: string;
  recipientEmail: string;
}

// Session booking confirmation
interface SessionBookingData extends BaseEmailData {
  coachName: string;
  sessionDate: Date;
  sessionDuration: number;
  sessionRate: number;
  meetingLink?: string;
}

export function sessionBookingConfirmation(data: SessionBookingData) {
  const formattedDate = data.sessionDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = data.sessionDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return {
    to: data.recipientEmail,
    subject: `Session Confirmed with ${data.coachName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #0D5C4D; padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0;">Session Confirmed!</h1>
        </div>

        <div style="padding: 32px; background-color: #ffffff;">
          <p>Hi ${data.recipientName},</p>

          <p>Great news! Your session with <strong>${data.coachName}</strong> has been confirmed.</p>

          <div style="background-color: #F3F7F6; border-radius: 8px; padding: 24px; margin: 24px 0;">
            <h3 style="margin: 0 0 16px 0; color: #0D5C4D;">Session Details</h3>
            <p style="margin: 8px 0;"><strong>Date:</strong> ${formattedDate}</p>
            <p style="margin: 8px 0;"><strong>Time:</strong> ${formattedTime}</p>
            <p style="margin: 8px 0;"><strong>Duration:</strong> ${data.sessionDuration} minutes</p>
            <p style="margin: 8px 0;"><strong>Coach:</strong> ${data.coachName}</p>
          </div>

          ${
            data.meetingLink
              ? `
          <div style="text-align: center; margin: 24px 0;">
            <a href="${data.meetingLink}" style="background-color: #0D5C4D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Join Video Call
            </a>
          </div>
          `
              : ""
          }

          <p style="color: #666;">
            Please ensure you're prepared and in a quiet space before your session begins.
          </p>

          <hr style="border: none; border-top: 1px solid #E5E5E5; margin: 24px 0;">

          <p style="color: #888; font-size: 14px;">
            Need to reschedule? You can cancel up to 24 hours before your session for a full refund.
          </p>
        </div>

        <div style="background-color: #F3F7F6; padding: 24px; text-align: center;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            © ${new Date().getFullYear()} Candid. Climate careers, amplified.
          </p>
        </div>
      </div>
    `,
    text: `
Session Confirmed with ${data.coachName}

Hi ${data.recipientName},

Your session has been confirmed!

Session Details:
- Date: ${formattedDate}
- Time: ${formattedTime}
- Duration: ${data.sessionDuration} minutes
- Coach: ${data.coachName}

${data.meetingLink ? `Join your session: ${data.meetingLink}` : ""}

Please ensure you're prepared and in a quiet space before your session begins.

Need to reschedule? You can cancel up to 24 hours before your session for a full refund.

© ${new Date().getFullYear()} Candid. Climate careers, amplified.
    `.trim(),
  };
}

// Session reminder (24 hours before)
interface SessionReminderData extends BaseEmailData {
  coachName: string;
  sessionDate: Date;
  meetingLink?: string;
}

export function sessionReminder(data: SessionReminderData) {
  const formattedDate = data.sessionDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const formattedTime = data.sessionDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return {
    to: data.recipientEmail,
    subject: `Reminder: Session Tomorrow with ${data.coachName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #0D5C4D; padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0;">Session Tomorrow!</h1>
        </div>

        <div style="padding: 32px; background-color: #ffffff;">
          <p>Hi ${data.recipientName},</p>

          <p>Just a reminder that you have a session scheduled tomorrow with <strong>${data.coachName}</strong>.</p>

          <div style="background-color: #FFF8E7; border-left: 4px solid #F59E0B; padding: 16px; margin: 24px 0;">
            <p style="margin: 0;"><strong>📅 ${formattedDate} at ${formattedTime}</strong></p>
          </div>

          ${
            data.meetingLink
              ? `
          <div style="text-align: center; margin: 24px 0;">
            <a href="${data.meetingLink}" style="background-color: #0D5C4D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Add to Calendar
            </a>
          </div>
          `
              : ""
          }

          <h3>Tips for a great session:</h3>
          <ul style="color: #666;">
            <li>Find a quiet, well-lit space</li>
            <li>Test your audio/video beforehand</li>
            <li>Have your questions ready</li>
            <li>Join a few minutes early</li>
          </ul>
        </div>

        <div style="background-color: #F3F7F6; padding: 24px; text-align: center;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            © ${new Date().getFullYear()} Candid. Climate careers, amplified.
          </p>
        </div>
      </div>
    `,
    text: `
Session Tomorrow with ${data.coachName}

Hi ${data.recipientName},

Just a reminder that you have a session scheduled tomorrow with ${data.coachName}.

📅 ${formattedDate} at ${formattedTime}

Tips for a great session:
- Find a quiet, well-lit space
- Test your audio/video beforehand
- Have your questions ready
- Join a few minutes early

© ${new Date().getFullYear()} Candid. Climate careers, amplified.
    `.trim(),
  };
}

// Coach application approved
interface CoachApprovalData extends BaseEmailData {
  coachFirstName: string;
}

export function coachApplicationApproved(data: CoachApprovalData) {
  return {
    to: data.recipientEmail,
    subject: "🎉 Welcome to Candid - Your Coach Application is Approved!",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #0D5C4D; padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to Candid! 🎉</h1>
        </div>

        <div style="padding: 32px; background-color: #ffffff;">
          <p>Hi ${data.coachFirstName},</p>

          <p>Congratulations! Your application to become a Candid coach has been <strong>approved</strong>.</p>

          <p>You're now part of our community of climate professionals helping others transition into impactful careers.</p>

          <div style="background-color: #E8F5E9; border-radius: 8px; padding: 24px; margin: 24px 0;">
            <h3 style="margin: 0 0 16px 0; color: #0D5C4D;">Next Steps</h3>
            <ol style="margin: 0; padding-left: 20px; color: #333;">
              <li style="margin-bottom: 8px;">Complete your profile with a photo and bio</li>
              <li style="margin-bottom: 8px;">Set up your availability calendar</li>
              <li style="margin-bottom: 8px;">Connect your Stripe account for payments</li>
              <li style="margin-bottom: 8px;">Start accepting bookings!</li>
            </ol>
          </div>

          <div style="text-align: center; margin: 24px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/candid/coach" style="background-color: #0D5C4D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Go to Your Dashboard
            </a>
          </div>

          <p>If you have any questions, feel free to reach out to our support team.</p>

          <p>Welcome aboard! 🌱</p>
        </div>

        <div style="background-color: #F3F7F6; padding: 24px; text-align: center;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            © ${new Date().getFullYear()} Candid. Climate careers, amplified.
          </p>
        </div>
      </div>
    `,
    text: `
Welcome to Candid! 🎉

Hi ${data.coachFirstName},

Congratulations! Your application to become a Candid coach has been approved.

You're now part of our community of climate professionals helping others transition into impactful careers.

Next Steps:
1. Complete your profile with a photo and bio
2. Set up your availability calendar
3. Connect your Stripe account for payments
4. Start accepting bookings!

Go to your dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/candid/coach

If you have any questions, feel free to reach out to our support team.

Welcome aboard! 🌱

© ${new Date().getFullYear()} Candid. Climate careers, amplified.
    `.trim(),
  };
}

// Review request after session
interface ReviewRequestData extends BaseEmailData {
  coachName: string;
  sessionDate: Date;
  reviewLink: string;
}

export function reviewRequest(data: ReviewRequestData) {
  const formattedDate = data.sessionDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  return {
    to: data.recipientEmail,
    subject: `How was your session with ${data.coachName}?`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #0D5C4D; padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0;">How Did It Go?</h1>
        </div>

        <div style="padding: 32px; background-color: #ffffff;">
          <p>Hi ${data.recipientName},</p>

          <p>We hope you had a great session with <strong>${data.coachName}</strong> on ${formattedDate}!</p>

          <p>Your feedback helps coaches improve and helps other mentees find the right match.</p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${data.reviewLink}" style="background-color: #0D5C4D; color: white; padding: 16px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 16px;">
              Leave a Review
            </a>
          </div>

          <p style="color: #666; font-size: 14px;">
            It only takes a minute and makes a big difference!
          </p>
        </div>

        <div style="background-color: #F3F7F6; padding: 24px; text-align: center;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            © ${new Date().getFullYear()} Candid. Climate careers, amplified.
          </p>
        </div>
      </div>
    `,
    text: `
How was your session with ${data.coachName}?

Hi ${data.recipientName},

We hope you had a great session with ${data.coachName} on ${formattedDate}!

Your feedback helps coaches improve and helps other mentees find the right match.

Leave a review: ${data.reviewLink}

It only takes a minute and makes a big difference!

© ${new Date().getFullYear()} Candid. Climate careers, amplified.
    `.trim(),
  };
}

// Team invite email (Canopy)
interface TeamInviteData {
  recipientEmail: string;
  inviterName: string;
  companyName: string;
  role: string;
  acceptUrl: string;
}

export function teamInviteEmail(data: TeamInviteData) {
  const roleNames: Record<string, string> = {
    ADMIN: "Admin",
    RECRUITER: "Recruiter",
    HIRING_MANAGER: "Hiring Manager",
    MEMBER: "Reviewer",
    VIEWER: "Viewer",
  };
  const roleName = roleNames[data.role] || data.role;

  const roleDescriptions: Record<string, string> = {
    ADMIN: `
            <ul style="margin: 0; padding-left: 20px; color: #333;">
              <li style="margin-bottom: 8px;">Full access to all ATS features</li>
              <li style="margin-bottom: 8px;">Manage team members and settings</li>
              <li style="margin-bottom: 8px;">View hiring analytics</li>
            </ul>`,
    RECRUITER: `
            <ul style="margin: 0; padding-left: 20px; color: #333;">
              <li style="margin-bottom: 8px;">Post and manage job roles</li>
              <li style="margin-bottom: 8px;">Review and manage candidates</li>
              <li style="margin-bottom: 8px;">View hiring analytics</li>
            </ul>`,
    HIRING_MANAGER: `
            <ul style="margin: 0; padding-left: 20px; color: #333;">
              <li style="margin-bottom: 8px;">Review candidates for your assigned roles</li>
              <li style="margin-bottom: 8px;">Approve or reject candidates at each stage</li>
              <li style="margin-bottom: 8px;">Leave feedback and evaluations</li>
            </ul>`,
    MEMBER: `
            <ul style="margin: 0; padding-left: 20px; color: #333;">
              <li style="margin-bottom: 8px;">Review assigned candidates</li>
              <li style="margin-bottom: 8px;">Submit scorecards and feedback</li>
            </ul>`,
    VIEWER: `
            <ul style="margin: 0; padding-left: 20px; color: #333;">
              <li style="margin-bottom: 8px;">View job postings and candidates</li>
              <li style="margin-bottom: 8px;">Access hiring dashboards and reports</li>
            </ul>`,
  };

  return {
    to: data.recipientEmail,
    subject: `${data.inviterName} invited you to join ${data.companyName} on Canopy`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #0A3D2C; padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0;">You're Invited!</h1>
        </div>

        <div style="padding: 32px; background-color: #ffffff;">
          <p>Hi there,</p>

          <p><strong>${data.inviterName}</strong> has invited you to join <strong>${data.companyName}</strong> on Canopy as a <strong>${roleName}</strong>.</p>

          <div style="background-color: #F3F7F6; border-radius: 8px; padding: 24px; margin: 24px 0;">
            <h3 style="margin: 0 0 16px 0; color: #0A3D2C;">What you'll be able to do</h3>
            ${roleDescriptions[data.role] || roleDescriptions.VIEWER}
          </div>

          <div style="text-align: center; margin: 24px 0;">
            <a href="${data.acceptUrl}" style="background-color: #0A3D2C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Accept Invitation
            </a>
          </div>

          <p style="color: #888; font-size: 14px;">
            This invitation expires in 7 days. If you didn't expect this, you can safely ignore this email.
          </p>
        </div>

        <div style="background-color: #F3F7F6; padding: 24px; text-align: center;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            &copy; ${new Date().getFullYear()} Canopy by Green Jobs Board. Climate hiring, simplified.
          </p>
        </div>
      </div>
    `,
    text: `
You're invited to join ${data.companyName} on Canopy!

${data.inviterName} has invited you to join ${data.companyName} as a ${roleName}.

Accept your invitation: ${data.acceptUrl}

This invitation expires in 7 days.

&copy; ${new Date().getFullYear()} Canopy by Green Jobs Board. Climate hiring, simplified.
    `.trim(),
  };
}

// New booking notification for coach
interface NewBookingNotificationData extends BaseEmailData {
  menteeName: string;
  sessionDate: Date;
  sessionDuration: number;
}

export function newBookingNotification(data: NewBookingNotificationData) {
  const formattedDate = data.sessionDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = data.sessionDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return {
    to: data.recipientEmail,
    subject: `New Session Booked: ${data.menteeName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #0D5C4D; padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0;">New Session Booked!</h1>
        </div>

        <div style="padding: 32px; background-color: #ffffff;">
          <p>Hi ${data.recipientName},</p>

          <p>Great news! <strong>${data.menteeName}</strong> has booked a session with you.</p>

          <div style="background-color: #F3F7F6; border-radius: 8px; padding: 24px; margin: 24px 0;">
            <h3 style="margin: 0 0 16px 0; color: #0D5C4D;">Session Details</h3>
            <p style="margin: 8px 0;"><strong>Mentee:</strong> ${data.menteeName}</p>
            <p style="margin: 8px 0;"><strong>Date:</strong> ${formattedDate}</p>
            <p style="margin: 8px 0;"><strong>Time:</strong> ${formattedTime}</p>
            <p style="margin: 8px 0;"><strong>Duration:</strong> ${data.sessionDuration} minutes</p>
          </div>

          <div style="text-align: center; margin: 24px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/candid/coach" style="background-color: #0D5C4D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View in Dashboard
            </a>
          </div>

          <p style="color: #666;">
            The meeting link will be available in your dashboard before the session.
          </p>
        </div>

        <div style="background-color: #F3F7F6; padding: 24px; text-align: center;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            © ${new Date().getFullYear()} Candid. Climate careers, amplified.
          </p>
        </div>
      </div>
    `,
    text: `
New Session Booked!

Hi ${data.recipientName},

Great news! ${data.menteeName} has booked a session with you.

Session Details:
- Mentee: ${data.menteeName}
- Date: ${formattedDate}
- Time: ${formattedTime}
- Duration: ${data.sessionDuration} minutes

View in Dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/candid/coach

The meeting link will be available in your dashboard before the session.

© ${new Date().getFullYear()} Candid. Climate careers, amplified.
    `.trim(),
  };
}
