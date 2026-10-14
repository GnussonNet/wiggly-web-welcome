---
title: "How Loam removes metadata without recompressing your photo"
description: "A photo contains more than pixels. Loam removes descriptive metadata while preserving encoded image data, orientation, color profiles, and supported HDR rendering information."
date: "2026-10-14"
project: "loam"
---

A photo can carry its camera model, capture time, editing software, and GPS coordinates alongside the visible image. Sharing the file can share those details too.

Loam inspects JPEG and PNG files and creates a cleaned copy in your browser. It removes descriptive metadata by editing the encoded file's structure. The pixels are never re-encoded or recompressed.

The difficult part is deciding what to remove. Some information outside the pixel data determines how the photo should look. Removing it indiscriminately can rotate the image, change its colors, or lose its HDR rendering.

## A photo is more than its compressed image data

A JPEG contains image data together with segments that may hold EXIF, XMP, IPTC, comments, color profiles, or embedded thumbnails. PNG uses chunks, some of which contain descriptive text and others instructions for displaying the image.

These structures can reveal information that is not visible in the picture. An embedded thumbnail is also a separate image that needs to be considered when cleaning the file.

Loam separates descriptive information from the information it deliberately retains for rendering. GPS coordinates and camera identifiers belong in the removal path. Orientation and color information need more careful treatment.

That distinction is more useful than a promise to remove every metadata byte. The cleaned file still needs to describe how its image should be displayed.

## Cleaning edits the container

Loam parses the original file, identifies its supported structures, and constructs a cleaned container around the existing encoded image data.

For JPEG, it removes descriptive EXIF, IPTC, XMP, comments, embedded thumbnails, and other segments outside its retained set. It preserves the original image frame, tables, and compressed scans. For PNG, it removes descriptive text and other excluded chunks while preserving image data and supported rendering chunks.

There is no step that draws the photo onto a canvas and exports a newly compressed version. There is no lossy fallback for a file that the cleaner cannot safely handle.

In outline, the path is:

```text
Selected photo
  → validate its container and browser decoding
  → inspect metadata
  → rebuild with encoded image data and retained rendering information
  → inspect and verify the generated file
  → offer a separate download
```

The original file stays untouched. Processing runs in a dedicated worker, and an invalid or unsupported file produces no cleaned download.

## Orientation has to survive

A camera can store pixels in one orientation and use an EXIF tag to say how they should be displayed. Removing that tag can make a correctly displayed photo appear sideways or mirrored.

Loam preserves all eight EXIF orientation values. It builds a minimal EXIF structure from scratch rather than copying the original directory and its pointers, thumbnails, or unused bytes.

This preserves the display instruction without carrying the original descriptive EXIF block into the output. Optional color-space information and supported Apple HDR coefficients can be retained in that rebuilt structure too.

The encoded pixels stay in their original arrangement. The retained orientation tells the viewer how to present them.

## Color profiles have their own tradeoff

A color profile helps a viewer interpret the image's colors. Loam preserves supported embedded profiles byte for byte, along with other supported color-rendering information.

That choice has a privacy limit. A profile can contain names, copyright text, or other descriptive information inside it. Loam does not scrub profile internals. The interface lists retained rendering information separately so the result does not imply that every descriptive byte has disappeared.

Preserving the file's rendering information also does not guarantee that every browser and screen will show identical colors. It preserves the information available to those viewers.

## HDR can involve more than one JPEG

Some HDR JPEGs include an additional image called a gain map. It describes how brightness can be adjusted when the photo is displayed on an HDR-capable screen. The file also contains information linking the images and describing that adjustment.

Cleaning only the primary image would be incomplete: descriptive metadata can exist inside the gain-map images as well. Removing all auxiliary images would discard part of the photo's rendering.

Loam supports recognized JPEG containers with one to three gain maps. It validates the image offsets and sizes, cleans each embedded image, and rebuilds the index with updated positions. The encoded image data in both the primary image and its gain maps is preserved.

Supported HDR properties are retained narrowly. Apple MakerNotes are rebuilt with the supported rendering coefficients; supported HDR XMP is reconstructed with allowed rendering properties. Other descriptive fields and identifiers are discarded. ISO HDR rendering segments are retained byte for byte, with the same limitation as color profiles: their binary internals are not scrubbed.

Unsupported or ambiguous containers are rejected. HDR JPEGs with extended XMP are currently rejected because their rendering properties cannot yet be preserved reliably. Native HEIC and HEIF files are also outside the supported formats.

The HDR handling lives in `src/hdr.ts`, alongside the container inspection and cleaning code in `src/metadata.ts`.

## Inspection has limits too

Loam can decode common camera, exposure, date, author, software, and GPS fields, along with supported IPTC and PNG text. XMP is displayed as inert, length-limited XML text. No remote resources are loaded from it.

Some fields and metadata formats are detected without being fully decoded. A detected block with no decoded fields is different from a verified absence of descriptive metadata. The interface keeps that distinction visible.

An unreadable field can still be removed with its enclosing descriptive block. Cleaning does not depend on presenting every original value as readable text.

## Verification happens before download

After cleaning, Loam inspects the generated bytes again. It checks that descriptive metadata has been removed and that the expected image dimensions, orientation, color information, and supported HDR data have survived. The browser must also decode the generated file before a download is offered.

The automated tests go further for their fixtures. They compare compressed JPEG scans and PNG image-data chunks, check exact color-profile bytes, and use ImageMagick as an independent decoder to compare oriented pixels. HDR fixtures exercise metadata inside auxiliary images, relocated offsets, and malformed indexes.

Those checks support specific preservation claims. Synthetic fixtures and an independent decoder do not establish how every native photo application will render every HDR file. Real iPhone images and native Apple Photos/Safari HDR rendering remain unverified in the documented test environment.

## The photo stays in the browser

File reading, inspection, cleaning, previews, and download generation happen in browser memory. Loam has no image-upload endpoint, remote processing service, analytics, or persistent storage of selected photos and their metadata. The page's scripts and fonts are bundled locally.

This keeps the photo out of a server-side cleaning pipeline. Loading the website still involves downloading its static assets, but the selected image is processed locally.

The cleaned copy also has limits beyond its container. Faces, visible text, landmarks, and watermarks remain in the pixels. The download keeps the original base filename with a `-cleaned` suffix, so a revealing filename still needs to be renamed. A sharing service can add information later.

Removing embedded descriptive metadata reduces what travels with the file. It does not make the image anonymous. Loam's useful promise is to make that information visible, remove it within supported formats, and preserve the encoded image and the rendering information it explicitly retains.

The project is licensed under MIT. Its source repository will be linked here when the Daggmask GitHub organization is ready.
