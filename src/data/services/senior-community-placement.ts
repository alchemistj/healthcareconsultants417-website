import copy from "@/data/copy/pages/services-community-placement.json";
import { linkPhrase, text, type ServicePage } from "./types.ts";

const blocks = copy.blocks;
const s = (i: number) => blocks[i].text;
const t = (i: number) => text(s(i));

const downsizing = "/springfield/senior-downsizing/";

const page: ServicePage = {
  slug: "senior-community-placement",
  manifestSlug: "services-community-placement",
  title: "Senior Community Placement in Springfield, MO | Transitional Healthcare Consultants",
  description:
    "At Transitional Healthcare Consultants, we understand the importance of finding the right placement in the community to support health, independence, and",
  h1: s(0),
  heroFile: "src/assets/legacy/wp-content/uploads/2022/06/banner.jpg",
  heroAlt: "A nurse checks an older man's blood pressure while they sit together on a couch.",
  heroPosition: "50% 50%",
  relatedSlugs: ["senior-relocation", "senior-downsizing", "transitional-care"],
  usedBlocks: [0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34],
  droppedBlocks: [
    { index: 1, reason: "Theme breadcrumb repeated on the thin service pages." },
    { index: 2, reason: "Breadcrumb link text. The business name is already in the body copy." },
    { index: 3, reason: "Duplicate of the page title, already the H1." },
    { index: 13, reason: "Link text already inside the Support for Families paragraph." },
    { index: 17, reason: "Link text already inside the closing paragraph." },
    { index: 35, reason: "Review heading. This job does not render reviews." },
    { index: 36, reason: "Review. This job does not render reviews." },
    { index: 37, reason: "Repeated Get a Quote form widget." },
    { index: 38, reason: "Repeated Get a Quote form widget." },
    { index: 39, reason: "Phone link inside the dropped form widget." },
    { index: 40, reason: "Email link inside the dropped form widget." },
    { index: 41, reason: "Form widget instruction." },
    { index: 42, reason: "Form field label." },
    { index: 43, reason: "Form field label." },
    { index: 44, reason: "Form field label." },
    { index: 45, reason: "Form field label." },
    { index: 46, reason: "Form field label." },
    { index: 47, reason: "Form widget junk." },
    { index: 48, reason: "Form widget junk." },
    { index: 49, reason: "Form field label." },
    { index: 50, reason: "Form field label." },
    { index: 51, reason: "Form submit button." },
    { index: 52, reason: "Mobile-only duplicate of the form widget." },
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
        file: "src/assets/legacy/wp-content/uploads/2024/10/Community-Placement.jpg",
        alt: "A group of older adults hugs and laughs together in front of a brick wall.",
        objectPosition: "50% 40%",
      },
      side: "right",
    },
    {
      type: "cards",
      items: [
        { title: s(7), paragraphs: [t(8)] },
        { title: s(9), paragraphs: [t(10)] },
        { title: s(11), paragraphs: [linkPhrase(s(12), "Downsizing Help,", downsizing)] },
        { title: s(14), paragraphs: [t(15)] },
      ],
    },
    {
      type: "prose",
      heading: s(18),
      groups: [
        { title: s(19), paragraphs: [t(20)] },
        { title: s(21), paragraphs: [t(22)] },
        { title: s(23), paragraphs: [t(24)] },
        { title: s(25), paragraphs: [t(26)] },
        { title: s(27), paragraphs: [t(28), t(29)] },
      ],
    },
    {
      type: "prose",
      heading: s(30),
      items: [t(31), t(32), t(33), t(34)],
    },
    { type: "related" },
    {
      type: "cta",
      heading: s(0),
      paragraphs: [t(16)],
    },
  ],
};

export default page;
