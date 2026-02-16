
# 🎨 ShreeChoice Playworld - Theme Customization Guide

Welcome! This guide will help you customize the look **and layout** of your website without needing to be a coding expert. All visual settings are stored in one file: **`theme.config.ts`**.

---

## 📂 Where to Make Changes
Open the file: **`theme.config.ts`** in your project folder.

Inside, you will see a variable called `THEME` containing different sections (like `hero`, `promo`, `footer`). You just need to change the values inside the quotes `""`.

---

## 🛠️ Beginner's Cheat Sheet (Tailwind CSS)

We use **Tailwind CSS** for styling. Here are the common values you'll use:

### 1. Colors
You can use standard Tailwind colors or Hex codes.
- **Backgrounds**: `bg-white`, `bg-black`, `bg-red-500`, `bg-blue-100`, `bg-[#FF5733]` (custom hex code).
- **Text**: `text-white`, `text-slate-800`, `text-brand-primary`, `text-[#000000]`.
- **Borders**: `border-gray-200`, `border-brand-primary`.

### 2. Shapes (Border Radius)
Control how round the corners of buttons and cards are.
- **Square**: `rounded-none`
- **Slightly Rounded**: `rounded-md` or `rounded-lg`
- **Very Rounded**: `rounded-2xl` or `rounded-3xl`
- **Circle / Pill**: `rounded-full`

### 3. Dimensions & Spacing (New!) 📏
Control the size and spacing of sections.
- **Padding (Inner Space)**: `py-12` (vertical padding), `px-4` (horizontal padding). Higher numbers = more space.
    - Examples: `py-8`, `py-16`, `py-24`, `pt-32` (top only), `pb-32` (bottom only).
- **Margin (Outer Space)**: `mb-24` (margin bottom), `mt-12` (margin top).
- **Height**: `min-h-[500px]`, `h-screen`, `h-full`.
- **Width**: `max-w-4xl`, `w-full`, `w-[300px]`.

---

## 🖌️ Section-by-Section Guide

### 1. Global Defaults
These affect the whole site unless overridden.
```typescript
global: {
    backgroundColor: "bg-white", // Main page background
    textColor: "text-slate-800", // Default text color
}
```

### 2. Hero Section (Top Banner)
This is the first thing users see.
- **`minHeight`**: Controls how tall the banner is. Try `"min-h-[600px]"` or `"min-h-[800px]"`.
- **`padding`**: Inner spacing. Increase this if the text feels too cramped.
- **`contentMaxWidth`**: Controls how wide the text block is. `"max-w-4xl"` makes it wider, `"max-w-2xl"` makes it narrower.
- **`backgroundClass`**: The background color (e.g., `bg-[#F4EBD0]`).
- **`backgroundImage`**: Paste a URL here for a photo background.

### 3. Trending / Featured Section
The "Today's Best Deals" horizontal slider.
- **`cardWidth`**: Controls the width of *each* product card in the slider.
    - Example: `"min-w-[200px] w-[60vw] sm:w-[260px] md:w-[280px]"` (Responsive width).
- **`padding`**: Vertical space inside the white area.
- **`margin`**: Space outside the section (distance from Hero and next section).

### 4. Shop By Brand
- **`cardSize`**: Fixed width and height for the brand logo boxes.
    - Example: `"w-40 h-40 md:w-48 md:h-48"` (160px mobile, 192px desktop).
- **`padding`**: Vertical space inside the grey area.
- **`margin`**: Space below the section.

### 5. Shop By Age (The Colorful Cards)
- **`cardSize`**: Size of the age bubbles/circles.
    - Example: `"w-32 h-32 md:w-40 md:h-40"`.
- **`padding` / `margin`**: Controls spacing around this section.
- **`cards`**: You can still change colors for individual age groups here.

### 6. Promo Banner (The Big Offer Box)
This configuration affects the banner on the **Home Page** AND the **Shop Page**.
- **`minHeight`**: Forces the banner to be at least this tall.
- **`textMaxWidth`**: Prevents the text from stretching too wide on large screens.
- **`padding`**: Space inside the colored box.
- **`margin`**: Space outside the box.
- **`shape`**: `rounded-[2.5rem]` gives it those super smooth corners.

### 7. Reviews Section
- **`cardWidth`**: Width of individual review cards.
- **`padding`**: Inner spacing (top/bottom) of the reviews background area.

### 8. Contact Form
- **`padding`**: Space above and below the contact section.
- **`formBackground`**: Background color of the form box itself.

### 9. Footer
- **`backgroundClass`**: Background of the footer.
- **`borderTop`**: The line separating the footer from the rest of the page.

---

## 🚀 Troubleshooting Layouts

**"The sections are touching each other!"**
-> Increase the `margin` (e.g., change `mb-12` to `mb-24`).

**"The text is hitting the edges of the banner."**
-> Increase the `padding` (e.g., change `py-10` to `py-20`).

**"The product cards look too small."**
-> Increase `cardWidth` in the `featured` section.

**"The Hero banner is too short."**
-> Increase `minHeight` in the `hero` section (e.g., `min-h-[700px]`).
