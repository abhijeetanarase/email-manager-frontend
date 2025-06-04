// import { Email } from '../types/email';

// // Generate a set of mock emails for testing
// export const mockEmails: Email[] = [
//   {
//     id: '1',
//     threadId: 'thread-1',
//     from: { name: 'John Smith', email: 'john.smith@example.com' },
//     to: [{ name: 'Me', email: 'me@example.com' }],
//     subject: 'Following up on our conversation',
//     body: `<p>Hi there,</p>
//     <p>Just wanted to follow up on our conversation from last week. I'm very interested in your product and would like to schedule a demo.</p>
//     <p>When would be a good time for you?</p>
//     <p>Best regards,<br>John</p>`,
//     snippet: 'Just wanted to follow up on our conversation from last week. I\'m very interested in your product...',
//     date: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
//     read: false,
//     starred: true,
//     folder: 'inbox',
//     account: '1',
//     hasAttachments: false,
//     attachments: [],
//     category: 'interested'
//   },
//   {
//     id: '2',
//     threadId: 'thread-2',
//     from: { name: 'Sarah Johnson', email: 'sarah.johnson@example.com' },
//     to: [{ name: 'Me', email: 'me@example.com' }],
//     cc: [{ name: 'Team', email: 'team@example.com' }],
//     subject: 'Meeting booked for Thursday',
//     body: `<p>Hello,</p>
//     <p>I've booked our meeting for Thursday at 2:00 PM. Please find the calendar invite attached.</p>
//     <p>Looking forward to discussing our project further.</p>
//     <p>Regards,<br>Sarah</p>`,
//     snippet: 'I\'ve booked our meeting for Thursday at 2:00 PM. Please find the calendar invite attached...',
//     date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
//     read: true,
//     starred: false,
//     folder: 'inbox',
//     account: '1',
//     hasAttachments: true,
//     attachments: [
//       {
//         filename: 'meeting-details.ics',
//         contentType: 'text/calendar',
//         size: '2.3 KB'
//       }
//     ],
//     category: 'meeting-booked'
//   },
//   {
//     id: '3',
//     threadId: 'thread-3',
//     from: { name: 'Marketing Team', email: 'marketing@example.com' },
//     to: [{ name: 'Me', email: 'me@example.com' }],
//     subject: 'Not interested in your proposal',
//     body: `<p>Hi,</p>
//     <p>Thank you for your proposal, but we are not interested at this time. We'll keep your information on file for future opportunities.</p>
//     <p>Best,<br>Marketing Team</p>`,
//     snippet: 'Thank you for your proposal, but we are not interested at this time. We\'ll keep your information...',
//     date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
//     read: true,
//     starred: false,
//     folder: 'inbox',
//     account: '1',
//     hasAttachments: false,
//     attachments: [],
//     category: 'not-interested'
//   },
//   {
//     id: '4',
//     threadId: 'thread-4',
//     from: { name: 'David Brown', email: 'david.brown@example.com' },
//     to: [{ name: 'Me', email: 'me@example.com' }],
//     subject: 'Re: Your inquiry about our services',
//     body: `<p>Hello,</p>
//     <p>I am currently out of office until January 15th with limited access to email.</p>
//     <p>For urgent matters, please contact my colleague Jane at jane@example.com.</p>
//     <p>Regards,<br>David</p>`,
//     snippet: 'I am currently out of office until January 15th with limited access to email. For urgent matters...',
//     date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
//     read: true,
//     starred: false,
//     folder: 'inbox',
//     account: '2',
//     hasAttachments: false,
//     attachments: [],
//     category: 'out-of-office'
//   },
//   {
//     id: '5',
//     threadId: 'thread-5',
//     from: { name: 'Promotions', email: 'noreply@example.com' },
//     to: [{ name: 'Me', email: 'me@example.com' }],
//     subject: 'SPECIAL OFFER: 50% OFF TODAY ONLY!!!',
//     body: `<p>LIMITED TIME OFFER!</p>
//     <p>GET 50% OFF ALL PRODUCTS TODAY ONLY!</p>
//     <p>CLICK HERE TO CLAIM YOUR DISCOUNT!</p>`,
//     snippet: 'LIMITED TIME OFFER! GET 50% OFF ALL PRODUCTS TODAY ONLY! CLICK HERE TO CLAIM YOUR DISCOUNT!',
//     date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
//     read: false,
//     starred: false,
//     folder: 'inbox',
//     account: '2',
//     hasAttachments: false,
//     attachments: [],
//     category: 'spam'
//   },
//   {
//     id: '6',
//     threadId: 'thread-6',
//     from: { name: 'Tech Support', email: 'support@example.com' },
//     to: [{ name: 'Me', email: 'me@example.com' }],
//     subject: 'Your support ticket has been resolved',
//     body: `<p>Hello,</p>
//     <p>We're pleased to inform you that your support ticket #12345 has been resolved.</p>
//     <p>If you have any further questions, please don't hesitate to contact us.</p>
//     <p>Best regards,<br>Support Team</p>`,
//     snippet: 'We\'re pleased to inform you that your support ticket #12345 has been resolved. If you have any further questions...',
//     date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
//     read: true,
//     starred: false,
//     folder: 'inbox',
//     account: '1',
//     hasAttachments: false,
//     attachments: [],
//     category: null
//   },
//   {
//     id: '7',
//     threadId: 'thread-7',
//     from: { name: 'Alex Wong', email: 'alex.wong@example.com' },
//     to: [{ name: 'Me', email: 'me@example.com' }],
//     subject: 'Interested in learning more about your product',
//     body: `<p>Hi there,</p>
//     <p>I recently came across your product and I'm very interested in learning more about it. Could you please provide me with some additional information?</p>
//     <p>I'm particularly interested in:</p>
//     <ul>
//       <li>Pricing</li>
//       <li>Features</li>
//       <li>Integration capabilities</li>
//     </ul>
//     <p>Looking forward to hearing from you.</p>
//     <p>Best,<br>Alex</p>`,
//     snippet: 'I recently came across your product and I\'m very interested in learning more about it. Could you please provide me with...',
//     date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
//     read: true,
//     starred: true,
//     folder: 'inbox',
//     account: '2',
//     hasAttachments: false,
//     attachments: [],
//     category: 'interested'
//   },
//   {
//     id: '8',
//     threadId: 'thread-8',
//     from: { name: 'Project Team', email: 'project@example.com' },
//     to: [{ name: 'Me', email: 'me@example.com' }],
//     cc: [
//       { name: 'Manager', email: 'manager@example.com' },
//       { name: 'Team Lead', email: 'lead@example.com' }
//     ],
//     subject: 'Project update and next steps',
//     body: `<p>Hi team,</p>
//     <p>Attached are the latest project updates and our plan for the next sprint.</p>
//     <p>Please review the documents before our meeting on Monday.</p>
//     <p>Regards,<br>Project Team</p>`,
//     snippet: 'Attached are the latest project updates and our plan for the next sprint. Please review the documents before our meeting...',
//     date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
//     read: true,
//     starred: false,
//     folder: 'inbox',
//     account: '1',
//     hasAttachments: true,
//     attachments: [
//       {
//         filename: 'project-update.pdf',
//         contentType: 'application/pdf',
//         size: '1.2 MB'
//       },
//       {
//         filename: 'sprint-plan.xlsx',
//         contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//         size: '458 KB'
//       }
//     ],
//     category: null
//   }
// ];