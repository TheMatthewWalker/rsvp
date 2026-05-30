# Wedding RSVP Website

A beautiful, responsive wedding website for Matthew and Sapphir's special day.

## Features

- **Elegant Design**: Formal and sophisticated layout with smooth animations
- **Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **RSVP Form**: Interactive form for guests to confirm attendance and food preferences
- **Wedding Details**: Complete information about ceremony, reception, and logistics
- **Photo Gallery**: Showcase your love story with photos
- **Registry Links**: Easy access to gift registries
- **Smooth Scrolling**: Seamless navigation between sections

## Sections

1. **Hero**: Eye-catching introduction with wedding date and RSVP call-to-action
2. **About Us**: Personal story and couple photo
3. **Wedding Details**: Ceremony, reception, accommodations, and travel info
4. **RSVP**: Interactive form with conditional fields based on attendance
5. **Gallery**: Photo collection of your journey
6. **Registry**: Links to gift registries

## Customization

### Images
Add your photos to the `images/` folder:
- `couple.jpg`: Photo for the About section
- `hero-bg.jpg`: Background image for the hero section
- `photo1.jpg`, `photo2.jpg`, etc.: Images for the gallery
- `favicon.png`: Website favicon

### Content
Update the HTML with your specific details:
- Wedding date and time
- Venue addresses
- Hotel recommendations
- Registry links
- Personal story in the About section

### Styling
Modify `styles.css` to match your color scheme or preferences.

## Running the Website

1. Open `index.html` in a web browser
2. Or serve locally: `python3 -m http.server 8000`
3. Visit `http://localhost:8000`

## RSVP Functionality

The RSVP form currently logs submissions to the console. For production use, integrate with:
- Email service (e.g., Formspree, Netlify Forms)
- Google Forms
- Custom backend API

## Technologies Used

- HTML5
- CSS3 (with animations and responsive design)
- JavaScript (ES6+)
- Google Fonts (Playfair Display & Lato)
