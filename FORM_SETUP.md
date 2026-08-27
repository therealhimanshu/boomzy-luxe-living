# Activate the Luxe Living enquiry form

The website is already wired for Formspree. Activation only requires replacing one placeholder endpoint.

## 1. Create the Formspree form

1. Sign in or create an account at [formspree.io](https://formspree.io/).
2. Create a project, then choose **New Form**.
3. Set the notification email address that should receive Luxe Living enquiries.
4. Open the form's **Integration** page and copy its endpoint. It will look like:

   ```text
   https://formspree.io/f/abcdefgh
   ```

## 2. Add the endpoint to the website

Open `enquire.html` and find:

```html
action="https://formspree.io/f/REPLACE_WITH_FORM_ID"
```

Replace the complete URL inside the quotes with the endpoint copied from Formspree. Do not add an email address or a private API key.

## 3. Publish and test

1. Deploy the website through the client's normal hosting provider.
2. Submit one test enquiry from the published website.
3. Confirm that the submission appears in the Formspree dashboard and reaches the configured notification inbox.
4. If Formspree sends an address-verification message, complete that verification.

The form sends asynchronously, shows the visitor a success or error message, and keeps them on the Luxe Living website. Without JavaScript it falls back to Formspree's standard HTML submission flow.

## Optional production settings

- Restrict submissions to the client's final website domain in Formspree.
- Enable Formspree's spam filtering or CAPTCHA if unwanted submissions increase.
- Add additional notification recipients from the Formspree dashboard rather than hard-coding email addresses into the website.
