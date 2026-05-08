# Shop Ash — Image Assets Guide

All static images you upload go inside `public/`. Anything under `public/` is served at the root of your site (e.g. `public/images/hero/slide-01.jpg` → `/images/hero/slide-01.jpg`).

## Folder map — what goes where

| Folder | Used by | Recommended size | Notes |
|---|---|---|---|
| `logo/` | Header & footer wordmark / favicon | SVG preferred · or 600×200 PNG | Transparent background. Will replace the text "SHOP ASH" wordmark. |
| `images/hero/` | [Hero.tsx](../src/components/home/Hero.tsx) full-bleed slides | **2400×1600** JPG (or 16:10 ratio) · ~250–400 KB after compression | High-impact lifestyle / product macro shots. Keep one side darker for readable overlay text. |
| `images/megamenu/` | [Navbar.tsx](../src/components/layout/Navbar.tsx) Men / Women mega-menu thumbnails | **1200×800** JPG (3:2) | Two images: one for "For Him", one for "For Her". |
| `images/brands/` | [ShopByBrand.tsx](../src/components/home/ShopByBrand.tsx) | **1600×1600** JPG (square) | One per brand. File names should match: `rolex.jpg`, `patek-philippe.jpg`, `audemars-piguet.jpg`, `omega.jpg`, `rado.jpg`, `cartier.jpg`, `tag-heuer.jpg`, `tissot.jpg`. |
| `images/products/` | [ProductCard.tsx](../src/components/product/ProductCard.tsx) & detail page | **1200×1500** JPG (4:5) | Two images per product: `<id>-1.jpg` (primary) and `<id>-2.jpg` (hover/alternate). |
| `images/styles/` | [ShopByStyle.tsx](../src/components/home/ShopByStyle.tsx) | **1200×1500** JPG (4:5) | Four images: `dress.jpg`, `sport.jpg`, `diver.jpg`, `chronograph.jpg`. |
| `images/journal/` | [EditorialRow.tsx](../src/components/home/EditorialRow.tsx) | **1600×1200** JPG (4:3) | Editorial / journal article cover images. |
| `images/lifestyle/` | Reusable backdrop & section imagery (StatsStrip, BrandStory, etc.) | **2400×1600** JPG | Atmospheric watch-making, boutique, craftsmanship shots. |

## File naming conventions

- **Lowercase only**, hyphens between words: `rolex-day-date.jpg` ✅, `Rolex_DayDate.jpg` ❌
- **Brand folders use slugs**: `patek-philippe.jpg` (not `patekphilippe.jpg` or `Patek Philippe.jpg`)
- **Product files prefix with the product ID** so we can map automatically: `1-1.jpg`, `1-2.jpg`, `2-1.jpg`, etc.
- **Hero slides are numbered**: `slide-01.jpg`, `slide-02.jpg`, `slide-03.jpg`

## How to reference an image in code

Once an image lives in `public/`, reference it from `/` (no `public/` prefix):

```tsx
// ✅ Correct
<img src="/images/hero/slide-01.jpg" alt="..." />

// ❌ Wrong
<img src="public/images/hero/slide-01.jpg" alt="..." />
<img src="./public/images/hero/slide-01.jpg" alt="..." />
```

## Format & compression

- **Format**: JPG for photographs, PNG only when you need transparency (e.g. cutout watches), SVG for logos / icons
- **Compression**: aim for **under 400 KB** per hero image, **under 200 KB** for product images, **under 100 KB** for thumbnails. Use [Squoosh](https://squoosh.app) or [TinyPNG](https://tinypng.com) before uploading
- **Hero images** specifically: 80% JPEG quality is plenty — watches don't need 100% quality, file size matters more than pixel perfection

## What to do once images are uploaded

After uploading, tell me the file names and I'll update each component to use them in place of the current Unsplash URLs. Or, if you follow the naming convention above (e.g. `images/brands/rolex.jpg`), I can wire them all up in one go.
