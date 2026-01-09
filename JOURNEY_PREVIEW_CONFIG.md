# Journey Preview Section - Configuration Guide

## Overview
The `section-journey-preview.html` partial creates a two-part section showcasing ScriptLab (self-serve) and Full Video (managed service).

## File Location
```
layouts/partials/section-journey-preview.html
```

## Usage

### Basic Usage
Add the partial to your Hugo template:

```html
{{ partial "section-journey-preview.html" . }}
```

### Example: Add to index.html
```html
{{ define "main" }}
    {{ partial "videoportfolio.html" . }}
    {{ partial "logos-insights-carousel.html" . }}
    {{ partial "case-study-oyo.html" . }}
    {{ partial "section-journey-preview.html" . }}  <!-- Add this line -->
    {{ partial "case-study-jagdamba.html" . }}
    {{ partial "how-it-works-alt.html" . }}
    {{ partial "case-study-indira.html" . }}
    {{ partial "faqs-alt.html" . }}
    {{ partial "final-cta-v2.html" . }}
{{ end }}
```

## Configuration Options

### Method 1: Using config.toml (Recommended)

Add the following to your `config.toml`:

```toml
[params.journey]
  [params.journey.partA]
    eyebrow = "Try This First"
    badge = "FREE"
    headline = "Research-Backed Scripts in Minutes"
    ctaText = "Get 2 Free Scripts"
    ctaUrl = "#scriptlab-demo"
  
  [params.journey.partB]
    eyebrow = "Need Videos?"
    badge = "DONE FOR YOU"
    headline = "We Handle the Rest"
    timeline = "Timeline: 5-7 days from approved script"
    ctaText = "Talk to Founding Team"
    ctaUrl = "#contact"
```

### Method 2: Using Data Files

1. Create `content/data/journey.yaml` (see `content/data/journey-example.yaml` for template)
2. Modify the partial to use data files instead of params

## Customization

### Colors
The section uses standard Tailwind CSS classes:
- Part A Background: `bg-gray-800` (#1F2937)
- Part B Background: `bg-gray-900` (#111827)
- Accent Blue: `text-blue-500` (#3B82F6)
- Accent Green: `bg-green-500` (#10B981)

### Responsive Breakpoints
- Mobile: < 768px (default)
- Desktop: ≥ 768px (`md:` prefix)

### Icons
All icons are inline SVGs (Heroicons style) for performance. Icons used:
- File/Document icon (Scripts, Brief)
- Search icon (Research)
- Grid icon (Strategy Report, Variants)
- Film/Camera icon (Storyboard)
- Video icon (Master Video)
- Checkmark icon (Feature lists)

## Features

✅ Fully responsive (mobile-first design)
✅ Accessible (semantic HTML, ARIA labels, focus states)
✅ Configurable content via Hugo params
✅ Inline SVG icons (no external dependencies)
✅ Smooth hover transitions
✅ Tailwind CSS utility classes only

## Section Structure

### Part A: ScriptLab (Self-Serve)
- Eyebrow badge with "FREE" badge
- Headline
- 4-step animation container (placeholder for future animation)
- "What You Get" feature list (3 items)
- CTA button (green, solid)

### Divider
- Gradient line separating Part A and Part B

### Part B: Full Video (Managed Service)
- Eyebrow badge with "DONE FOR YOU" badge
- Headline
- 4-step workflow boxes (Scripts → Storyboard → Master Video → Variants)
- "What's Included" feature list (4 items)
- Timeline text
- CTA button (blue, outline)

## Future Enhancements

The animation container in Part A is a placeholder for a future 10-second looping animation showing the ScriptLab workflow.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Tailwind CSS 3.x required
- No JavaScript dependencies
