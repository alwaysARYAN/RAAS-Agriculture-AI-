# 🌾 Agricultural Design System

## Overview
A comprehensive design system specifically crafted for agricultural applications, featuring earth tones, farming-inspired elements, and a professional yet approachable aesthetic.

---

## 🎨 Color Palette

### Primary Colors (Agricultural Green)
```css
--color-primary: #2d5016        /* Dark Forest Green - Main brand color */
--color-primary-light: #4a7c2c  /* Fresh Leaf Green - Hover states */
--color-primary-dark: #1e3a0f   /* Deep Forest - Headers, emphasis */
```

**Usage:** Primary actions, navigation, headers, emphasis

### Secondary Colors (Earth Tones)
```css
--color-secondary: #8b6f47      /* Rich Soil Brown */
--color-secondary-light: #b08968 /* Light Earth - Cards, backgrounds */
--color-secondary-dark: #5d4a2f  /* Dark Earth - Text, borders */
```

**Usage:** Secondary actions, supporting elements, natural accents

### Accent Colors (Harvest & Nature)
```css
--color-accent-wheat: #f4e4c1   /* Wheat Gold - Highlights */
--color-accent-sun: #fbb034      /* Harvest Sun - Warnings, attention */
--color-accent-sky: #87ceeb      /* Clear Sky Blue - Info, calm */
--color-accent-water: #4a90a4    /* Irrigation Water - Secondary info */
```

**Usage:** Highlights, badges, special states

### Status Colors
```css
--color-success: #52a447   /* Healthy Crop Green */
--color-warning: #e8a633   /* Caution Yellow */
--color-danger: #c7522a    /* Pest Alert Red */
--color-info: #5a9bd5      /* Information Blue */
```

**Usage:** Alerts, notifications, status indicators

### Background Colors
```css
--color-bg-primary: #faf8f3    /* Cream Background - Main bg */
--color-bg-secondary: #f5f1e8  /* Light Straw - Card bg */
--color-bg-tertiary: #e8e3d6   /* Pale Earth - Hover states */
```

---

## 📝 Typography

### Font Families
```css
Primary: 'Inter' - Body text, forms, general content
Headings: 'Poppins' - Headers, titles, emphasis
```

### Font Sizes
```
h1: 2.5rem (40px)  - Page titles
h2: 2rem (32px)    - Section headers
h3: 1.75rem (28px) - Subsection titles
h4: 1.5rem (24px)  - Card headers
h5: 1.25rem (20px) - Small headers
h6: 1.125rem (18px)- Labels
Body: 1rem (16px)  - Content
Small: 0.875rem (14px) - Captions
```

### Font Weights
- Light: 300
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700
- Extrabold: 800

---

## 🎯 Components

### 1. Agricultural Cards (.agri-card)

**Features:**
- White background with rounded corners
- Top border gradient accent
- Hover lift effect
- Shadow depth
- Dashed separator line in header

**Usage:**
```html
<div class="agri-card">
  <div class="agri-card-header">
    <div class="agri-card-icon">🌾</div>
    <h3>Card Title</h3>
  </div>
  <div class="agri-card-body">
    Content here
  </div>
</div>
```

### 2. Buttons (.btn-agri)

**Variants:**
- `btn-primary` - Main actions (green gradient)
- `btn-secondary` - Secondary actions (earth gradient)
- `btn-outline` - Tertiary actions (outlined)

**Features:**
- Rounded corners (12px)
- Ripple effect on click
- Icon support
- Hover lift animation

**Usage:**
```html
<button class="btn-agri btn-primary">
  🌾 Add Farm
</button>
```

### 3. Form Inputs (.agri-input)

**Features:**
- Medium border (2px)
- Rounded corners (10px)
- Focus ring effect
- Custom placeholder color
- Smooth transitions

**Usage:**
```html
<label class="agri-label">Farm Name</label>
<input type="text" class="agri-input" placeholder="Enter farm name">
```

### 4. Status Badges (.agri-badge)

**Variants:**
- `badge-success` - Green for healthy/active
- `badge-warning` - Yellow for attention needed
- `badge-danger` - Red for critical issues
- `badge-info` - Blue for information

**Usage:**
```html
<span class="agri-badge badge-success">
  ✓ Healthy
</span>
```

### 5. Stats Card (.stat-card)

**Features:**
- Large value display
- Left accent border
- Background decoration
- Hover effect

**Usage:**
```html
<div class="stat-card">
  <div class="stat-value">24</div>
  <div class="stat-label">Total Farms</div>
</div>
```

### 6. Tables (.agri-table)

**Features:**
- Rounded container
- Gradient header
- Hover row effect
- Zebra striping option

**Usage:**
```html
<table class="agri-table">
  <thead>
    <tr>
      <th>Column 1</th>
      <th>Column 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
  </tbody>
</table>
```

### 7. Alerts (.agri-alert)

**Variants:**
- `agri-alert-success`
- `agri-alert-warning`
- `agri-alert-danger`
- `agri-alert-info`

**Usage:**
```html
<div class="agri-alert agri-alert-success">
  <span>✓</span>
  <span>Operation successful!</span>
</div>
```

### 8. Progress Bars (.agri-progress)

**Features:**
- Rounded track
- Gradient fill
- Animated shimmer effect
- Smooth transitions

**Usage:**
```html
<div class="agri-progress">
  <div class="agri-progress-bar" style="width: 75%"></div>
</div>
```

---

## 🎭 Navigation Components

### Sidebar (.agri-sidebar)

**Features:**
- Fixed position
- Gradient header
- Active state highlighting
- Icon + text labels
- Left accent border for active items

**Structure:**
```
- Sidebar Header (logo + title)
- Navigation Items (icon + label)
- Active state with left border
```

### Top Navigation (.agri-nav)

**Features:**
- Sticky positioning
- Bottom border accent
- Rounded nav items
- Active state with gradient background

---

## 🌟 Design Principles

### 1. Natural & Earthy
- Use earth tones and agricultural greens
- Incorporate farming-inspired icons (🌾, 🚜, 🌱, 💧)
- Rounded corners for friendly feel

### 2. Professional & Clean
- Ample white space
- Clear hierarchy
- Consistent spacing
- Professional typography

### 3. Accessible & Readable
- High contrast text
- Large touch targets (min 44px)
- Clear focus states
- WCAG AA compliant colors

### 4. Responsive & Adaptive
- Mobile-first approach
- Flexible layouts
- Touch-friendly on mobile
- Accessible on all devices

---

## 📏 Spacing System

```css
0.25rem (4px)   - xs - Tight spacing
0.5rem (8px)    - sm - Small gaps
0.75rem (12px)  - md - Standard gaps
1rem (16px)     - lg - Section spacing
1.5rem (24px)   - xl - Card padding
2rem (32px)     - 2xl - Large spacing
3rem (48px)     - 3xl - Section dividers
```

---

## 🎨 Gradients

### Primary Gradient (Green)
```css
background: linear-gradient(135deg, #4a7c2c 0%, #2d5016 100%);
```
**Usage:** Primary buttons, active states, headers

### Earth Gradient (Brown)
```css
background: linear-gradient(135deg, #b08968 0%, #8b6f47 100%);
```
**Usage:** Secondary buttons, earth-related elements

### Sky Gradient (Blue)
```css
background: linear-gradient(180deg, #87ceeb 0%, #5a9bd5 100%);
```
**Usage:** Weather cards, information sections

### Harvest Gradient (Gold)
```css
background: linear-gradient(135deg, #fbb034 0%, #e8a633 100%);
```
**Usage:** Warnings, highlights, special promotions

---

## 📦 Shadows

```css
--shadow-sm: 0 2px 4px rgba(45, 80, 22, 0.08)   /* Subtle depth */
--shadow-md: 0 4px 8px rgba(45, 80, 22, 0.12)   /* Standard cards */
--shadow-lg: 0 8px 16px rgba(45, 80, 22, 0.16)  /* Elevated elements */
--shadow-xl: 0 12px 24px rgba(45, 80, 22, 0.2)  /* Modals, dropdowns */
```

---

## 🔄 Transitions & Animations

### Standard Timing
```css
transition: all 0.3s ease;
```

### Custom Easing
```css
cubic-bezier(0.4, 0, 0.2, 1) /* Smooth ease-out */
```

### Hover Effects
- Cards: Lift up 4px + increase shadow
- Buttons: Lift up 2px + brighten
- Links: Color change + underline

### Loading States
- Spinner: Rotate 360° in 1s
- Shimmer: Slide across in 2s
- Pulse: Scale 0.95-1.05 in 1.5s

---

## 🖼️ Icons & Emojis

### Recommended Agricultural Icons
```
🌾 - Wheat/Crops
🚜 - Tractor/Farming
🌱 - Seedling/Growth
💧 - Water/Irrigation
🌞 - Sun/Weather
🌧️ - Rain/Weather
📊 - Analytics/Stats
📈 - Growth/Trends
🗺️ - Farm Map
🏠 - Farm Building
👨‍🌾 - Farmer
🐛 - Pests
🦠 - Disease
📅 - Calendar/Season
💰 - Market/Money
🏛️ - Government/Schemes
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First */
Base: 0px - 640px      (Mobile)
sm: 640px - 768px      (Large Mobile)
md: 768px - 1024px     (Tablet)
lg: 1024px - 1280px    (Desktop)
xl: 1280px - 1536px    (Large Desktop)
2xl: 1536px+           (Extra Large)
```

---

## ✅ Accessibility Guidelines

### Color Contrast
- Text on primary green: Use white (#ffffff)
- Text on light backgrounds: Use primary dark (#1e3a0f)
- Minimum contrast ratio: 4.5:1 for normal text

### Focus States
- All interactive elements must have visible focus ring
- Focus ring: 4px rgba(74, 124, 44, 0.1)

### Touch Targets
- Minimum size: 44x44px
- Adequate spacing between clickable elements

### Screen Readers
- Use semantic HTML
- Provide alt text for images
- ARIA labels where needed

---

## 🎯 Usage Examples

### Dashboard Card
```html
<div class="agri-card">
  <div class="agri-card-header">
    <div class="agri-card-icon">🌾</div>
    <h3>My Farms</h3>
  </div>
  <div class="stat-value">12</div>
  <div class="stat-label">Active Farms</div>
  <button class="btn-agri btn-primary">View All</button>
</div>
```

### Status Badge with Icon
```html
<span class="agri-badge badge-success">
  ✓ Healthy
</span>
```

### Form Field
```html
<div>
  <label class="agri-label">Crop Name</label>
  <input type="text" class="agri-input" placeholder="e.g., Wheat">
</div>
```

---

## 🚀 Implementation

All styles are defined in:
- `client/src/index.css` - Custom CSS
- `client/tailwind.config.js` - Tailwind configuration

To use:
1. Apply classes directly: `<div class="agri-card">`
2. Use Tailwind utilities: `<div class="bg-primary-500 text-white">`
3. Combine both for best results

---

## 📚 Resources

- **Google Fonts:** Inter & Poppins (already imported)
- **Icons:** Using emojis for cross-platform compatibility
- **Color Tool:** https://coolors.co for palette exploration
- **Accessibility:** https://webaim.org/resources/contrastchecker/

---

**🌾 This design system brings the essence of agriculture to your digital interface!**
