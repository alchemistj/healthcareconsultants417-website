import copy from "@/data/copy/pages/services-transitional-care.json";
import { text, type ServicePage } from "./types.ts";

const blocks = copy.blocks;
const s = (i: number) => blocks[i].text;
const t = (i: number) => text(s(i));

const page: ServicePage = {
  slug: "transitional-care",
  manifestSlug: "services-transitional-care",
  title: "Transitional Care in Springfield, MO | Transitional Healthcare Consultants",
  description:
    "At Transitional Healthcare Consultants, we know that the transition from a healthcare facility to home is a critical phase in the recovery process. Our",
  h1: s(0),
  heroFile: "src/assets/legacy/wp-content/uploads/2022/06/banner.jpg",
  heroAlt: "A nurse checks an older man's blood pressure while they sit together on a couch.",
  heroPosition: "50% 50%",
  relatedSlugs: ["hospital-to-home-transition", "senior-community-placement", "senior-relocation"],
  usedBlocks: [0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
  droppedBlocks: [
    { index: 1, reason: "Theme breadcrumb repeated on the thin service pages." },
    { index: 2, reason: "Breadcrumb link text. The business name is already in the body copy." },
    { index: 3, reason: "Duplicate of the page title, already the H1." },
    { index: 18, reason: "Repeated Get a Quote form widget." },
    { index: 19, reason: "Repeated Get a Quote form widget." },
    { index: 20, reason: "Phone link inside the dropped form widget." },
    { index: 21, reason: "Email link inside the dropped form widget." },
    { index: 22, reason: "Form widget instruction." },
    { index: 23, reason: "Form field label." },
    { index: 24, reason: "Form field label." },
    { index: 25, reason: "Form field label." },
    { index: 26, reason: "Form widget junk." },
    { index: 27, reason: "Form field label." },
    { index: 28, reason: "Form widget junk." },
    { index: 29, reason: "Form field label." },
    { index: 30, reason: "Form field label." },
    { index: 31, reason: "Form field label." },
    { index: 32, reason: "Form submit button." },
    { index: 33, reason: "Mobile-only duplicate of the form widget." },
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
        file: "src/assets/legacy/wp-content/uploads/2024/11/Transitional-Care.jpg",
        alt: "A clinician with a stethoscope talks with a patient sitting on a hospital bed.",
        objectPosition: "45% 40%",
      },
      side: "right",
    },
    {
      type: "cards",
      items: [
        { title: s(7), paragraphs: [t(8)] },
        { title: s(9), paragraphs: [t(10)] },
        { title: s(11), paragraphs: [t(12)] },
        { title: s(13), paragraphs: [t(14)] },
        { title: s(15), paragraphs: [t(16)] },
      ],
    },
    { type: "related" },
    { type: "cta", heading: s(0), paragraphs: [t(17)] },
  ],
};

export default page;
