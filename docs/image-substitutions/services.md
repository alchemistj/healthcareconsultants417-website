# Image substitutions: service pages

No theme-demo photo was replaced on the seven service pages. Every photo that renders is the
original file, in that page's manifest order, except the decorative backgrounds below.

`test/gates/images.test.ts` reads the first table below. `(dropped)` means the manifest image was
removed on purpose and nothing replaces it.

| page | slot | replaces | chosen | reason |
| --- | --- | --- | --- | --- |
| /springfield/senior-relocation/ | | section-bg.jpg | (dropped) | Decorative theme background of pale circles, not a photograph. |
| /springfield/senior-downsizing/ | | section-bg.jpg | (dropped) | Decorative theme background of pale circles, not a photograph. |
| /springfield/zpod-sensory-beds/ | | section-bg.jpg | (dropped) | Decorative theme background of pale circles, not a photograph. |

## Also not rendered (hidden, not photos)

The hidden WPForms loading spinner `submit-spin.svg` on Senior Community Placement, Suicide
Awareness, Transitional Care and Hospital-to-Home Transition. It is marked hidden in the manifest,
so the image lock already skips it.
