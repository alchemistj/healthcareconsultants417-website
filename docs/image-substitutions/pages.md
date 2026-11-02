# Image substitutions — company pages

Theme-demo photos from `demo.themedraft.net` are not her photos. These three home-page slots use originals already in `src/assets/legacy/`. Every other photo on these pages is the manifest photo, in manifest order.

| Page | Slot | Demo file replaced | Her file | Reason |
|---|---|---|---|---|
| Home | Feature row, first photo (Consulting Advisors) | `https://demo.themedraft.net/wp/doctio/wp-content/uploads/2022/06/three-image-1.jpg` | `src/assets/legacy/wp-content/uploads/2024/11/Care-Coordination.jpg` | Theme stock beside Consulting Advisors. This is her photo of a care team with a family. |
| Home | Feature row, second photo (Qualified Nurses) | `https://demo.themedraft.net/wp/doctio/wp-content/uploads/2022/06/three-image-2.jpg` | `src/assets/legacy/wp-content/uploads/2024/12/Rachal-Payne-2.png` | Theme stock beside Qualified Nurses. Rachal is the nurse, and this file is not already on the home page. |
| Home | Feature row, third photo (Advanced Technology) | `https://demo.themedraft.net/wp/doctio/wp-content/uploads/2022/06/three-image-3.jpg` | `src/assets/legacy/wp-content/uploads/2025/11/zPod-sensory-bed.jpg` | Theme stock beside Advanced Technology. The zPods bed is her technology, and this file is not already on the home page. |

The fourth feature card, Quality Care, had no photo of hers that was not already used on the home page, so it is text only.

## Dropped, not replaced

- Decorative `line-*.png` and the partner strip `brand-1.png` through `brand-5.png`.
- `service-center-image.png` (theme artwork; the subject is not one of her services).
- The home hero is the Revolution Slider photo `retired-couple-2023-11-27-05-10-48-utc.jpg`. `Senior-Guidance.jpg` stays a body photo at its own manifest position.
- The other live file `retired-couple-sitting-table-cafe-talking_23-2147950427.jpg` is stock and is not used.
- Mobile-only duplicates and `submit-spin.svg`.

`legacyImageManifest.json` `excluded` has no themedraft rows for these seven pages. The demo files above were on the live homepage HTML.
