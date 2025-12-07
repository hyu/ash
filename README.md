# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

## Contact Form Setup

This project includes a contact form that sends submissions via email using Netlify serverless functions.

### Prerequisites

1. **SendGrid Account**: Sign up at [SendGrid](https://sendgrid.com/) and get an API key
2. **Netlify Account**: Deploy your site to Netlify

### Environment Variables

Create a `.env` file in the project root (or set these in Netlify's dashboard):

```env
SENDGRID_API_KEY=your_sendgrid_api_key_here
RECIPIENT_EMAIL=han@sent.com
SENDER_EMAIL=your_verified_sender_email@example.com
```

**Important**: 
- `SENDGRID_API_KEY`: Get this from your SendGrid dashboard (Settings > API Keys)
- `RECIPIENT_EMAIL`: The email address that will receive form submissions (defaults to `han@sent.com`)
- `SENDER_EMAIL`: Must be a verified sender email in SendGrid (for production)

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your `.env` file with the variables above

3. Install Netlify CLI (if not already installed):
   ```bash
   npm install -g netlify-cli
   ```

4. Run the development server with Netlify Functions:
   ```bash
   netlify dev
   ```

   This will start both the Vite dev server and Netlify Functions locally.

### Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to Netlify:
   - Connect your repository to Netlify
   - Set the environment variables in Netlify Dashboard (Site Settings > Build & Deploy > Environment Variables)
   - Netlify will automatically detect the `netlify.toml` configuration

### Future: Google Sheets Integration

To add form submissions to a Google Sheet:
1. Create a Google Cloud project and enable Google Sheets API
2. Create a service account and download credentials
3. Share your Google Sheet with the service account email
4. Update the `sendEmail.ts` function to also append data to the sheet

### Project Structure

```
├── netlify/
│   └── functions/
│       └── sendEmail.ts      # Serverless function for sending emails
├── src/
│   └── components/
│       └── ContactForm.vue   # Contact form component
└── netlify.toml              # Netlify configuration
```
