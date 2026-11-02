import copy from "@/data/copy/pages/zpod-beds.json";
import { text, type PhotoRef, type ServicePage } from "./types.ts";

const blocks = copy.blocks;
const s = (i: number) => blocks[i].text;
const t = (i: number) => text(s(i));

const up = "src/assets/legacy/wp-content/uploads";
const icon = (file: string): PhotoRef => ({
  file: `${up}/2025/10/${file}`,
  alt: "",
});

const page: ServicePage = {
  slug: "zpod-sensory-beds",
  manifestSlug: "zpod-beds",
  title: "zPods® Sensory Bed in Springfield, MO | Transitional Healthcare Consultants",
  description:
    "Safe, enclosed sleep beds for kids & adults with autism or sensory needs. Discover how zPods restore calm (and peace of mind) for the whole family.",
  h1: s(0),
  heroFile: `${up}/2025/11/zPod-Beds-for-Safety-and-Sensory-Peace.jpg`,
  heroAlt: "Two adults sit with a child inside an enclosed sensory bed with a glowing window.",
  heroPosition: "78% 48%",
  relatedSlugs: ["transitional-care", "hospital-to-home-transition", "senior-community-placement"],
  usedBlocks: [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
  ],
  droppedBlocks: [
    { index: 46, reason: "Review. This job does not render reviews." },
    { index: 47, reason: "Review attribution. This job does not render reviews." },
    { index: 48, reason: "Review. This job does not render reviews." },
    { index: 49, reason: "Review attribution. This job does not render reviews." },
  ],
  droppedImages: [
    {
      file: `${up}/2022/06/section-bg.jpg`,
      reason: "Decorative theme background of pale circles, not a photograph. Dropped, not replaced.",
    },
  ],
  sections: [
    {
      type: "prose",
      paragraphs: [t(1), t(2), t(3), t(4), t(5), t(6), t(7), t(8), t(9), t(10), t(11), t(12), t(13), t(14), t(15)],
    },
    {
      type: "split",
      heading: s(16),
      paragraphs: [t(17), t(18)],
      photo: {
        file: `${up}/2025/11/zPod-sensory-bed.jpg`,
        alt: "A child lies in an enclosed bed under purple light, holding a tablet.",
        objectPosition: "70% 50%",
      },
      side: "right",
    },
    { type: "prose", paragraphs: [t(19)] },
    {
      type: "split",
      heading: s(20),
      paragraphs: [t(21)],
      items: [t(22), t(23), t(24), t(25), t(26), t(27), t(28), t(29)],
      photo: {
        file: `${up}/2025/11/zPod-beds-secure-space.jpg`,
        alt: "An enclosed bed with pillows, purple light, and a starry ceiling.",
        objectPosition: "50% 50%",
      },
      side: "left",
    },
    {
      type: "cards",
      heading: s(30),
      intro: [t(31)],
      items: [
        { title: s(32), paragraphs: [], icon: icon("tantrum-icon.png") },
        { title: s(33), paragraphs: [], icon: icon("injury-icon.png") },
        { title: s(34), paragraphs: [], icon: icon("sensory-icon.png") },
        { title: s(35), paragraphs: [], icon: icon("fatigue-icon.png") },
      ],
    },
    { type: "prose", paragraphs: [t(36)] },
    {
      type: "split",
      heading: s(37),
      paragraphs: [t(38), t(39)],
      items: [t(40), t(41), t(42), t(43)],
      photo: {
        file: `${up}/2025/11/zPod-Beds-Springfield-MO.jpg`,
        alt: "A child looks out from an enclosed sensory bed.",
        objectPosition: "55% 70%",
      },
      side: "right",
    },
    { type: "prose", paragraphs: [t(44)] },
    { type: "related" },
    {
      type: "faq",
      heading: s(54),
      items: [
        { question: s(55), answer: s(56) },
        { question: s(57), answer: s(58) },
      ],
    },
    {
      type: "split",
      heading: s(45),
      paragraphs: [t(50)],
      photo: {
        file: `${up}/2025/11/johnny-testimonial.jpg`,
        alt: "A child rests with a tablet inside an enclosed bed lit purple.",
        objectPosition: "50% 40%",
      },
      side: "left",
    },
    {
      type: "split",
      heading: s(51),
      photo: {
        file: `${up}/2025/11/oliver-testimonial.jpg`,
        alt: "A child uses a tablet inside an enclosed bed lit green.",
        objectPosition: "50% 40%",
      },
      side: "right",
    },
    { type: "prose", paragraphs: [t(59)] },
    {
      type: "cta",
      heading: s(53),
      button: s(52),
      photo: {
        file: `${up}/2025/11/zPod-bed-for-family.jpg`,
        alt: "A child lies on the floor under a bed.",
        objectPosition: "32% 55%",
      },
      side: "left",
    },
  ],
};

export default page;
