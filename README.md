# Image Clip
A plugin for cropping images, using canvas to convert cropped images to base64.
## Usage
1. Initialize
Create a instance of ImageClip plugin. Container is the parent node of ImageClip.
```
const imgClip = new ImageClip(container);
```
2. Set source and width
Image must be an instance of Image, width is the width of the ImageClip container.
```
imgClip.setSource(image, width);
```
3. Drag the bounds of image.
4. Save the modified picture.
Crop the picture to a specified size, and convert the result to base64.
```
const path = imgClip.save(width, height);
```
## License
MIT
