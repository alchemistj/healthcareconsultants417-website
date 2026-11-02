import copy from "@/data/copy/pages/services-hospital-to-home-transition.json";
import { text, type ServicePage } from "./types.ts";

const blocks = copy.blocks;
const s = (i: number) => blocks[i].text;
const t = (i: number) => text(s(i));

const page: ServicePage = {
  slug: "hospital-to-home-transition",
  manifestSlug: "services-hospital-to-home-transition",
  title: "Hospital-to-Home Transition in Springfield, MO | Transitional Healthcare Consultants",
  description:
    "Transitional Healthcare Consultants recognizes that the transition from the hospital to one's residence is a critical phase of recuperation, frequently",
  h1: s(0),
  heroFile: "src/assets/legacy/wp-content/uploads/2022/06/banner.jpg",
  heroAlt: "A nurse checks an older man's blood pressure while they sit together on a couch.",
  heroPosition: "50% 50%",
  relatedSlugs: ["transitional-care", "senior-community-placement", "senior-relocation"],
  usedBlocks: [0, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  droppedBlocks: [
    { index: 1, reason: "Theme breadcrumb repeated on the thin service pages." },
    { index: 2, reason: "Breadcrumb link text. The business name is already in the body copy." },
    { index: 13, reason: "Get a Quote widget mashed into one paragraph, including a missing space before the email." },
    { index: 14, reason: "Phone link inside the dropped form widget." },
    { index: 15, reason: "Email link inside the dropped form widget." },
    { index: 16, reason: "Form widget instruction." },
    { index: 17, reason: "Form widget junk." },
    { index: 18, reason: "Form field label." },
    { index: 19, reason: "Form field label." },
    { index: 20, reason: "Form field label." },
    { index: 21, reason: "Form widget junk." },
    { index: 22, reason: "Form field label." },
    { index: 23, reason: "Form field label." },
    { index: 24, reason: "Form field label." },
    { index: 25, reason: "Form field label." },
    { index: 26, reason: "Form submit button." },
    { index: 27, reason: "Mobile-only duplicate of the form widget." },
  ],
  droppedImages: [
    {
      file: "src/assets/legacy/wp-content/plugins/wpforms/assets/images/submit-spin.svg",
      reason: "Hidden WPForms loading spinner, not a photo.",
    },
  ],
  sections: [
    {
      type: "split",
      heading: s(3),
      paragraphs: [t(4)],
      items: [t(5), t(6), t(7), t(8), t(9), t(10), t(11)],
      photo: {
        file: "src/assets/legacy/wp-content/uploads/2024/11/Hospital-to-Home-Transition.jpg",
        alt: "A clinician steadies a man as he stands up from a wheelchair in a living room.",
        objectPosition: "50% 45%",
      },
      side: "right",
    },
    { type: "related" },
    { type: "cta", heading: s(0), paragraphs: [t(12)] },
  ],
};

export default page;
