---

# Smart Utility Billing Assistant

Smart Utility Billing Assistant is a modern web-based dashboard designed to help users efficiently manage, pay, and track their utility bills. With a focus on clarity, automation, and ease of use, this application brings together all your billing needs into a single, intuitive interface.

## Features

- **Dashboard Overview:** Get a clear summary of your utilities, outstanding balances, payments made, upcoming bills, and bill splits.
- **Smart Reminders:** Receive timely notifications about due bills and important actions, helping you avoid late payments.
- **Quick Actions:** 
  - Make instant payments for your utilities.
  - Split bills easily with roommates or family members.
  - View detailed payment history and export records as needed.
- **Monthly Summary:** Visual statistics for total outstanding amounts, payments made within the current month, upcoming bills, and active bill splits.
- **USSD Simulator:** Experience and test mobile-based utility payment flows (accessible via the navigation).
- **Settings:** Customize your billing experience to fit your unique needs.
- **Responsive Design:** Optimized for desktops, tablets, and mobile devices.
- **Theme Toggle:** Switch between light and dark modes for a comfortable viewing experience.

## Technologies Used

- **HTML:** For structuring the dashboard and all primary pages.
- **CSS:** For styling, layouts, and themes, ensuring a responsive and modern UI.
- **JavaScript:** For dynamic data handling, updating statistics, populating cards and reminders, and managing user interactions.

## Getting Started

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/mathncode-sid/smart-billing.git
   ```
2. **Open the Application:**
   - Open `index.html` in your preferred web browser.
   - No build steps are required; everything runs client-side.

## File Structure

- `index.html` — Main dashboard page
- `pay.html`, `split.html`, `history.html`, `settings.html`, `ussd.html` — Functional pages for billing tasks
- `styles.css` — Main stylesheet for layout and theming
- `app.js` — Core JavaScript for data and dashboard updates

## Accessibility

- Semantic HTML and ARIA labels are used throughout for better accessibility.
- Navigation is keyboard-friendly and screen reader compatible.

## Contributing

Pull requests and feature suggestions are welcome! Please open an issue to discuss your ideas or report bugs.

## License

[MIT](LICENSE)

---

## To-Do
- Create backend for this project
- Integrate Africa's Talking APIs for USSD and message options
