# Wedding Background Images Setup Guide

## Required Images

आपको ये images add करनी होंगी `public/images/wedding-backgrounds/` folder में:

### From the 4-Panel Collage:

1. **collage-panel-1-golden-temple-golden-hour.jpg**
   - Top-Left Panel: Golden Temple at golden hour
   - Extract this panel from the collage

2. **collage-panel-2-bougainvillea-archway.jpg**
   - Top-Right Panel: Bougainvillea archway
   - Extract this panel from the collage

3. **collage-panel-3-golden-temple-soft-light.jpg**
   - Bottom-Left Panel: Golden Temple with soft light
   - Extract this panel from the collage

4. **collage-panel-4-fortified-city.jpg**
   - Bottom-Right Panel: Fortified city on hillside
   - Extract this panel from the collage

### Full Collage:

5. **full-collage-indian-heritage.jpg**
   - Complete 4-panel collage image
   - Use the full collage image

### Additional Images:

6. **traditional-wedding-couple.jpg**
   - Traditional Indian wedding couple photo
   - From the wedding photo you shared

## Image Specifications:

- **Format:** JPG or PNG
- **Resolution:** Minimum 1920x1080 (Full HD)
- **Recommended:** 3840x2160 (4K) for best quality
- **File Size:** Optimized for web (under 2MB per image)
- **Aspect Ratio:** 16:9 or 4:3 for backgrounds

## How to Extract Panels from Collage:

1. Open the collage image in an image editor
2. Divide the image into 4 equal parts (2x2 grid)
3. Extract each panel:
   - Top-Left: Panel 1
   - Top-Right: Panel 2
   - Bottom-Left: Panel 3
   - Bottom-Right: Panel 4
4. Save each as separate JPG files

## Templates Using These Images:

### Individual Panel Templates:
- `golden-temple-golden-hour` → Uses Panel 1
- `bougainvillea-archway` → Uses Panel 2
- `golden-temple-soft-light` → Uses Panel 3
- `fortified-city-rajasthan` → Uses Panel 4

### Additional Panel Templates:
- `golden-temple-panel-1` → Uses Panel 1
- `bougainvillea-panel-2` → Uses Panel 2
- `golden-temple-panel-3` → Uses Panel 3
- `fortified-city-panel-4` → Uses Panel 4

### Full Collage Template:
- `indian-heritage-collage` → Uses full collage

## After Adding Images:

1. Restart the development server
2. Go to Dashboard → Card Settings
3. Select Wedding Card mode
4. Choose any template with image background
5. The image will automatically appear as background

## Notes:

- All images should be in `public/images/wedding-backgrounds/` folder
- Images are served statically from the public folder
- Each template uses a different image for variety
- Dark overlay is automatically applied for text readability
