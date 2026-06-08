# Kindle Direct Publishing (KDP) Specifications

## Paperback Formats

### Trim Sizes
KDP supports the following trim sizes for paperbacks:
- 5" x 8" (12.7 x 20.32 cm)
- 5.06" x 7.81" (12.85 x 19.84 cm)
- 5.25" x 8" (13.34 x 20.32 cm)
- 5.5" x 8.5" (13.97 x 21.59 cm)
- 6" x 9" (15.24 x 22.86 cm)
- 6.14" x 9.21" (15.6 x 23.39 cm)
- 6.69" x 9.61" (16.99 x 24.41 cm)
- 7" x 10" (17.78 x 25.4 cm)
- 7.44" x 9.69" (18.9 x 24.61 cm)
- 7.5" x 9.25" (19.05 x 23.5 cm)
- 8" x 10" (20.32 x 25.4 cm)
- 8.25" x 6" (20.96 x 15.24 cm)
- 8.25" x 8.25" (20.96 x 20.96 cm)
- 8.5" x 8.5" (21.59 x 21.59 cm)
- 8.5" x 11" (21.59 x 27.94 cm)
- 8.27" x 11.69" (21 x 29.7 cm)

### Interior Paper Types and Page Count Ranges
- **Black ink and white paper**: 24 to 828 pages
- **Black ink and cream paper**: 24 to 776 pages
- **Standard color interior with white paper**: 72 to 600 pages
- **Premium color interior with white paper**: 24 to 828 pages

## Hardcover Formats (Case Laminate)

### Trim Sizes
KDP supports the following trim sizes for hardcovers:
- 5.5" x 8.5" (13.97 x 21.59 cm)
- 6" x 9" (15.24 x 22.86 cm)
- 6.14" x 9.21" (15.6 x 23.39 cm)
- 7" x 10" (17.78 x 25.4 cm)
- 8.25" x 11" (20.96 x 27.94 cm)

### Interior Paper Types and Page Count Ranges
- **Black ink and white paper**: 75 to 550 pages
- **Black ink and cream paper**: 75 to 550 pages
- **Standard color interior with white paper**: 75 to 550 pages
- **Premium color interior with white paper**: 75 to 550 pages

## KDP to Lulu POD Mapping
Lulu provides equivalent print-on-demand specs that we can map to automatically:
- KDP "Black ink and white paper" -> Lulu "Black & White / White"
- KDP "Black ink and cream paper" -> Lulu "Black & White / Cream"
- KDP "Standard color interior with white paper" -> Lulu "Standard Color / White"
- KDP "Premium color interior with white paper" -> Lulu "Premium Color / White"

This mapping allows users to specify KDP-standard inputs, while the system seamlessly generates the exact `POD Package ID` required by Lulu's print API.
