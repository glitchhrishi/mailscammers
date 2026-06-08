export interface SampleEmail {
  id: string;
  sender: string;
  senderName: string;
  subject: string;
  date: string;
  body: string;
}

export const SAMPLE_EMAILS: SampleEmail[] = [
  {
    id: "1",
    senderName: "Google Recruiting (HR)",
    sender: "google.hr.recruitment2025@gmail.com",
    subject: "URGENT: Your Google Internship Offer - Action Required in 24h",
    date: "2026-06-08T09:12:00Z",
    body: `Dear applicant,

Congratulations! You have been selected for the Google Summer Internship Program 2026.

To confirm your position, kindly pay a refundable training & equipment fee of $250 and send your bank account details, SSN, and a copy of your passport immediately.

Fill out this form to secure your spot: https://forms.gle/abc123XYZ

This offer expires in 24 hours. Failure to respond will result in cancellation.

Best regards,
Google HR Team`,
  },
  {
    id: "2",
    senderName: "MIT Career Advising",
    sender: "careers@mit.edu",
    subject: "Reminder: Summer Internship Workshop on Friday",
    date: "2026-06-07T14:30:00Z",
    body: `Hi students,

A quick reminder that our Summer Internship Workshop is happening this Friday at 3pm in Building 7.

We'll cover resume reviews, interview prep, and answer questions about on-campus recruiting.

No registration needed. See you there!

Best,
MIT Career Advising`,
  },
  {
    id: "3",
    senderName: "Microsoft Careers",
    sender: "no-reply@careers.microsoft.com",
    subject: "Application received — Software Engineer Intern",
    date: "2026-06-06T11:00:00Z",
    body: `Hello,

Thank you for applying to the Software Engineer Intern role at Microsoft. We have received your application and will review it shortly.

You can track the status of your application in your candidate portal at https://careers.microsoft.com.

Regards,
Microsoft Talent Acquisition`,
  },
  {
    id: "4",
    senderName: "Amazon HR",
    sender: "amazon-careers-team@outlook.com",
    subject: "Internship Confirmation — Please verify your details",
    date: "2026-06-05T18:45:00Z",
    body: `Dear Candidate,

We are pleased to inform you that you have been shortlisted for an Amazon remote internship.

Please verify your identity by filling out this Typeform: https://acmecorp-verify.typeform.com/to/xYz

You will need to provide your debit card details for payroll setup. A small registration fee of $99 applies.

Sincerely,
Amazon HR`,
  },
  {
    id: "5",
    senderName: "LinkedIn",
    sender: "messages-noreply@linkedin.com",
    subject: "You have 3 new internship matches",
    date: "2026-06-05T08:00:00Z",
    body: `Hi there,

Based on your profile, we found 3 new internship opportunities you might like.

View them on LinkedIn: https://www.linkedin.com/jobs/

Cheers,
The LinkedIn Team`,
  },
  {
    id: "6",
    senderName: "Stripe University Recruiting",
    sender: "university@stripe.com",
    subject: "Next step: Online assessment for Stripe Internship",
    date: "2026-06-04T16:20:00Z",
    body: `Hello,

Thanks for your interest in Stripe's internship program. The next step is a short online assessment.

You can start it any time within the next 5 days here: https://stripe.com/jobs/assessment

Reach out to university@stripe.com if you have any questions.

Best,
Stripe University Team`,
  },
  {
    id: "7",
    senderName: "Internship Opportunity",
    sender: "hr.global.intern@yahoo.com",
    subject: "Remote Data Entry Internship — $40/hr, no experience needed",
    date: "2026-06-04T07:00:00Z",
    body: `Hi student,

We have an immediate opening for a remote data entry intern, paying $40/hour.

No interview required. Just fill out this Jotform with your full name, address, bank account number and routing number to get started today: https://form.jotform.com/abc/intern-onboarding

Limited spots — apply now!

Regards,
Global Intern Team`,
  },
  {
    id: "8",
    senderName: "Meta University",
    sender: "university-careers@meta.com",
    subject: "Welcome to Meta University 2026",
    date: "2026-06-03T13:10:00Z",
    body: `Hi,

Welcome to Meta University! Your onboarding portal is now open.

Please log in using your @meta.com email to complete pre-internship paperwork: https://my.meta.com/onboarding

We're excited to have you join us.

Meta University Team`,
  },
  {
    id: "9",
    senderName: "GitHub",
    sender: "noreply@github.com",
    subject: "[GitHub] Your monthly developer digest",
    date: "2026-06-02T10:00:00Z",
    body: `Hey there,

Here's what's new across the repositories you follow this month.

Read the digest: https://github.com/notifications

— GitHub`,
  },
  {
    id: "10",
    senderName: "Quick Cash Internship",
    sender: "support@quick-cash-intern.tk",
    subject: "Claim your $5000 signing bonus before midnight!",
    date: "2026-06-01T22:00:00Z",
    body: `Congratulations!!! You have been pre-approved for an exclusive paid internship with a $5000 signing bonus.

To claim, send us a $50 processing fee via crypto (BTC/USDT) and verify your identity with a selfie holding your ID.

Click here NOW: http://bit.ly/claim-bonus-2026

Hurry, expires at midnight!`,
  },
];
