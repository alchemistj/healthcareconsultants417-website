# Image substitutions — company pages

Theme-demo photos from `demo.themedraft.net` are not her photos (Josh, Nov 2: replace them with an
appropriate photo of hers). These three home-page slots use originals already in
`src/assets/legacy/`. Every other photo on these pages is the manifest photo, in manifest order.

`test/gates/images.test.ts` reads the first table below. `slot` is the 1-based position in the
page's photo order where the substitute sits.

| page | slot | replaces | chosen | reason |
| --- | --- | --- | --- | --- |
| / | 8 | three-image-1.jpg | Care-Coordination.jpg | Feature row photo 1 (Consulting Advisors): theme stock replaced with her photo of a care team with a family. |
| / | 9 | three-image-2.jpg | Rachal-Payne-2.png | Feature row photo 2 (Qualified Nurses): Rachal is the nurse; not already on the home page. |
| / | 10 | three-image-3.jpg | zPod-sensory-bed.jpg | Feature row photo 3 (Advanced Technology): the zPods bed is her technology; not already on the home page. |

The fourth feature card, Quality Care, had no photo of hers that was not already used on the home
page, so it is text only.

## Home hero

The home hero is the Revolution Slider photo `retired-couple-2023-11-27-05-10-48-utc.jpg` (the
live hero; the first audit missed it because the slider loads it with JavaScript).
`Senior-Guidance.jpg` stays a body photo at its own manifest position.

## Dropped, not replaced (not manifest images)

- Decorative `line-*.png` and the partner strip `brand-1.png` through `brand-5.png`.
- `service-center-image.png` (theme artwork; the subject is not one of her services).
- `retired-couple-sitting-table-cafe-talking_23-2147950427.jpg`: stock, not in the manifest, not used.
- Mobile-only duplicates and `submit-spin.svg`.
