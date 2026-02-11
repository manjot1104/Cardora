# Animated Invites - Background Images Required

Yeh saari images `public/images/animated-invites/` folder mein add karni hain.

## 📁 Folder Structure:
```
public/
  images/
    animated-invites/
      mountains/
        - mountains-bg-main.jpg
        - mountains-bg-overlay.png
      beach/
        - beach-sunset-bg.jpg
        - beach-overlay.png
      city/
        - vintage-car-palace-bg.jpg
        - palace-overlay.png
      laavan/
        - golden-temple-bg.jpg
        - sikh-pattern-overlay.png
```

---

## 🏔️ Mountains Template Images

### 1. `mountains-bg-main.jpg`
- **Size**: 1920x1080px (or higher)
- **Description**: Main mountain landscape background
- **Style**: Beautiful mountain range with nature scenery, can include snow-capped peaks, valleys, or forest mountains
- **Colors**: Should complement the light sage green theme (#E8F0E8)
- **Format**: JPG (high quality)

### 2. `mountains-bg-overlay.png`
- **Size**: 1920x1080px
- **Description**: Overlay pattern or additional mountain elements
- **Style**: Transparent PNG with mountain silhouettes, clouds, or nature patterns
- **Purpose**: Adds depth and layers to the background
- **Format**: PNG (with transparency)

---

## 🏖️ Beach Template Images

### 1. `beach-sunset-bg.jpg`
- **Size**: 1920x1080px (or higher)
- **Description**: Beach sunset scene
- **Style**: Beautiful beach with sunset/sunrise, ocean, sand, palm trees
- **Colors**: Warm tones (oranges, pinks, yellows) that work with the light sky blue theme
- **Format**: JPG (high quality)

### 2. `beach-overlay.png`
- **Size**: 1920x1080px
- **Description**: Beach elements overlay
- **Style**: Transparent PNG with beach elements like palm leaves, waves, shells, or decorative patterns
- **Purpose**: Adds beach-themed decorative elements
- **Format**: PNG (with transparency)

---

## 🏛️ City Template Images

### 1. `vintage-car-palace-bg.jpg`
- **Size**: 1920x1080px (or higher)
- **Description**: Vintage car with palace/royal architecture
- **Style**: Elegant vintage car (like Rolls Royce, classic car) in front of a palace or royal architecture
- **Colors**: Should complement the light teal/green theme
- **Format**: JPG (high quality)

### 2. `palace-overlay.png`
- **Size**: 1920x1080px
- **Description**: Palace/royal decorative overlay
- **Style**: Transparent PNG with palace architectural elements, arches, pillars, or royal patterns
- **Purpose**: Adds royal/elegant decorative elements
- **Format**: PNG (with transparency)

---

## 🕊️ Laavan Template Images

### 1. `golden-temple-bg.jpg`
- **Size**: 1920x1080px (or higher)
- **Description**: Golden Temple or Sikh wedding venue background
- **Style**: Beautiful Golden Temple (Harmandir Sahib) or elegant Sikh wedding venue
- **Colors**: Should work with the orange/purple diagonal split theme
- **Format**: JPG (high quality)

### 2. `sikh-pattern-overlay.png`
- **Size**: 1920x1080px
- **Description**: Sikh decorative patterns overlay
- **Style**: Transparent PNG with Sikh patterns, Khanda symbols, or traditional designs
- **Purpose**: Adds Sikh wedding themed decorative elements
- **Format**: PNG (with transparency)

---

## 🎨 Image Requirements:

### Technical Specifications:
- **Main Backgrounds (JPG)**: 
  - Resolution: Minimum 1920x1080px, preferably 3840x2160px (4K)
  - Quality: High quality, optimized for web (under 500KB if possible)
  - Format: JPG with good compression

- **Overlays (PNG)**:
  - Resolution: 1920x1080px or matching main background
  - Transparency: Must have transparent background
  - Format: PNG-24 with alpha channel

### Design Guidelines:
1. **Parallax Effect**: Images will move on scroll, so ensure important elements are centered
2. **Text Readability**: Images should not be too busy where text appears
3. **Color Harmony**: Images should complement the template's color scheme
4. **Quality**: High resolution for crisp display on all devices
5. **File Size**: Optimize for web (use tools like TinyPNG or ImageOptim)

---

## ✅ After Adding Images:

Once you add these images to the `public/images/animated-invites/` folder structure, the parallax scroll effects will automatically work!

The templates are already configured to:
- ✅ Use parallax scrolling (backgrounds move on scroll)
- ✅ Multiple layers for depth effect
- ✅ Smooth animations with GSAP
- ✅ Responsive design
- ✅ Fallback to gradients if images not found

---

## 📝 Notes:

- If images are not found, templates will show gradient backgrounds as fallback
- You can also use custom images via the `backgroundImage` prop in the data
- All images should be optimized for web performance
- Consider using WebP format for better compression (code can be updated to support WebP)
