import copy from "@/data/copy/pages/services-suicide-awareness.json";
import { text, type ServicePage } from "./types.ts";

const blocks = copy.blocks;
const s = (i: number) => blocks[i].text;
const t = (i: number) => text(s(i));

/**
 * The old meta description is 156 characters because it ends on a cut-off word " Our".
 * The sentence before that cutoff is the old description, 152 characters.
 */
const description =
  "At Transitional Healthcare Consultants, we are dedicated to promoting mental health awareness and equipping our community with tools to prevent suicide.";

const page: ServicePage = {
  slug: "suicide-awareness",
  manifestSlug: "services-suicide-awareness",
  title: "Suicide Awareness in Springfield, MO | Transitional Healthcare Consultants",
  description,
  h1: s(0),
  heroFile: "src/assets/legacy/wp-content/uploads/2022/06/banner.jpg",
  heroAlt: "A nurse checks an older man's blood pressure while they sit together on a couch.",
  heroPosition: "50% 50%",
  relatedSlugs: ["transitional-care", "hospital-to-home-transition", "senior-community-placement"],
  usedBlocks: [0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
  droppedBlocks: [
    { index: 1, reason: "Theme breadcrumb repeated on the thin service pages." },
    { index: 2, reason: "Breadcrumb link text. The business name is already in the body copy." },
    { index: 3, reason: "Duplicate of the page title, already the H1." },
    { index: 19, reason: "Repeated Get a Quote form widget." },
    { index: 20, reason: "Repeated Get a Quote form widget." },
    { index: 21, reason: "Phone link inside the dropped form widget." },
    { index: 22, reason: "Email link inside the dropped form widget." },
    { index: 23, reason: "Form widget instruction." },
    { index: 24, reason: "Form field label." },
    { index: 25, reason: "Form field label." },
    { index: 26, reason: "Form field label." },
    { index: 27, reason: "Form field label." },
    { index: 28, reason: "Form widget junk." },
    { index: 29, reason: "Form field label." },
    { index: 30, reason: "Form widget junk." },
    { index: 31, reason: "Form field label." },
    { index: 32, reason: "Form field label." },
    { index: 33, reason: "Form submit button." },
    { index: 34, reason: "Mobile-only duplicate of the form widget." },
  ],
  droppedImages: [
    {
      file: "src/assets/legacy/wp-content/plugins/wpforms/assets/images/submit-spin.svg",
      reason: "Hidden WPForms loading spinner, not a photo.",
    },
  ],
  sections: [
    { type: "prose", paragraphs: [t(4)] },
    {
      type: "split",
      heading: s(5),
      paragraphs: [t(6)],
      photo: {
        file: "src/assets/legacy/wp-content/uploads/2024/11/Suicide-Awareness.jpg",
        alt: "A woman holds her forehead, with the word HELP written on a wrap around her wrist.",
        objectPosition: "50% 30%",
      },
      side: "right",
    },
    {
      type: "cards",
      items: [
        { title: s(7), paragraphs: [t(8), t(9)] },
        { title: s(10), paragraphs: [t(11)] },
        { title: s(12), paragraphs: [t(13)] },
        { title: s(14), paragraphs: [t(15)] },
        { title: s(16), paragraphs: [t(17)] },
      ],
    },
    { type: "related" },
    { type: "cta", heading: s(0), paragraphs: [t(18)] },
  ],
};

export default page;
