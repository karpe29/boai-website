# BlinkofAI Website

A static website built with Hugo and Tailwind CSS, hosted on GitHub Pages.

## Features

- **Hugo** static site generator
- **Tailwind CSS** for styling
- **Poppins** font family
- Responsive design
- Animated hero section with changing text

## Prerequisites

- Node.js and npm (for Tailwind CSS)
- Hugo (optional, for local development)

## Setup

1. **Install dependencies:**
   ```powershell
   npm install
   ```

2. **Build Tailwind CSS:**
   ```powershell
   npm run build:css
   ```

   Or watch for changes:
   ```powershell
   npm run watch:css
   ```

3. **Run Hugo server (if Hugo is installed):**
   
   For local development, use the development config:
   ```powershell
   hugo server --config config.toml,config.dev.toml
   ```
   
   Or use the baseURL flag:
   ```powershell
   hugo server --baseURL http://localhost:1313/
   ```

   Then visit `http://localhost:1313`

## Project Structure

```
.
├── content/          # Markdown content files
├── layouts/          # HTML templates
│   ├── _default/     # Default layouts
│   └── partials/     # Reusable components (header, footer, hero)
├── static/           # Static assets (CSS, JS, images)
│   └── css/          # Tailwind CSS files
├── config.toml       # Hugo configuration
├── tailwind.config.js # Tailwind configuration
└── package.json      # Node.js dependencies
```

## Color Theme

- **Primary Background:** `#2C2C2C` (Dark Gray)
- **Accent Color:** `#FF7F27` (Vibrant Orange)
- **Text:** White and Gray variations

## Deployment to GitHub Pages

1. Build the site:
   ```powershell
   hugo
   ```

2. The `public/` directory will contain the static files ready for deployment.

3. Push to GitHub and configure GitHub Pages to serve from the `public/` directory or use GitHub Actions for automatic deployment.

## Development

- Edit content in `content/`
- Edit templates in `layouts/`
- Styles are in `static/css/input.css` (Tailwind source)
- Run `npm run watch:css` to auto-compile CSS during development





