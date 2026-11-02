import copy from "@/data/copy/pages/senior-relocation-services.json";
import { linkPhrase, text, type PhotoRef, type ServicePage } from "./types.ts";

const blocks = copy.blocks;
const s = (i: number) => blocks[i].text;
const t = (i: number) => text(s(i));

const up = "src/assets/legacy/wp-content/uploads";
const icon = (file: string): PhotoRef => ({
  file: `${up}/2025/09/${file}`,
  alt: "",
});

const page: ServicePage = {
  slug: "senior-relocation",
  manifestSlug: "senior-relocation-services",
  title: "Senior Relocation Services in Springfield, MO | Transitional Healthcare Consultants",
  description:
    "Compassionate senior relocation help in Springfield, MO. We ease your stress and protect your parent’s dignity so you can just be their child again.",
  h1: s(0),
  eyebrow: s(1),
  subhead: s(2),
  heroFile: `${up}/2025/09/Parents-transition.jpg`,
  heroAlt: "An older couple smiles together in front of a house.",
  heroPosition: "72% 42%",
  relatedSlugs: ["senior-community-placement", "senior-downsizing", "transitional-care"],
  usedBlocks: [
    0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
    31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 56, 57, 58, 59, 60, 61,
    62, 63, 64, 65, 66, 67,
  ],
  droppedBlocks: [
    { index: 7, reason: "Link text already inside the opening paragraph." },
    { index: 53, reason: "Review heading. This job does not render reviews." },
    { index: 54, reason: "Review. This job does not render reviews." },
    { index: 55, reason: "Review. This job does not render reviews." },
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
      heading: s(3),
      paragraphs: [t(4), t(5), linkPhrase(s(6), "downsizing,", "/springfield/senior-downsizing/"), t(8)],
      button: s(9),
    },
    {
      type: "split",
      heading: s(10),
      paragraphs: [t(11)],
      photo: {
        file: `${up}/2025/09/packing-items.jpg`,
        alt: "A person packs picture frames into cardboard moving boxes.",
        objectPosition: "25% 45%",
      },
      side: "right",
    },
    {
      type: "cards",
      items: [
        { title: s(12), paragraphs: [t(13)], icon: icon("moving-icon.png") },
        { title: s(14), paragraphs: [t(15)], icon: icon("cleaning-icon.png") },
        { title: s(16), paragraphs: [t(17)], icon: icon("senior-care-icon.png") },
        { title: s(18), paragraphs: [t(19)], icon: icon("medicine-icon.png") },
      ],
    },
    {
      type: "split",
      heading: s(20),
      groups: [
        { title: s(21), paragraphs: [t(22)] },
        { title: s(23), paragraphs: [t(24)] },
        { title: s(25), paragraphs: [t(26)] },
        { title: s(27), paragraphs: [t(28)] },
      ],
      photo: {
        file: `${up}/2025/09/senior-relocation.jpg`,
        alt: "An older couple holds hands beside stacks of moving boxes.",
        objectPosition: "50% 25%",
      },
      side: "left",
    },
    {
      type: "prose",
      heading: s(56),
      items: [t(57), t(58), t(59), t(60)],
      paragraphs: [t(61)],
    },
    {
      type: "steps",
      heading: s(29),
      headers: [s(30), s(31), s(32)],
      steps: [
        { title: s(33), lines: [s(34), s(35), s(36), s(37)] },
        { title: s(38), lines: [s(39), s(40), s(41), s(42)] },
        { title: s(43), lines: [s(44), s(45), s(46), s(47)] },
        { title: s(48), lines: [s(49), s(50), s(51), s(52)] },
      ],
      photo: {
        file: `${up}/2025/09/senior-relocations.jpg`,
        alt: "A younger man and an older man high-five over taped moving boxes.",
        objectPosition: "50% 30%",
      },
      side: "right",
    },
    { type: "related" },
    {
      type: "split",
      heading: s(66),
      paragraphs: [t(67)],
      photo: {
        file: `${up}/2025/09/Senior-Relocation-Service.jpg`,
        alt: "An older couple stands with their backs to the camera, looking at a house.",
        objectPosition: "50% 60%",
      },
      side: "left",
    },
    {
      type: "cta",
      heading: s(62),
      paragraphs: [t(63), t(64)],
      button: s(65),
      photo: {
        file: `${up}/2025/09/Parent-transition-service.jpg`,
        alt: "An older couple carries moving boxes down a hallway while another person carries a box behind them.",
        objectPosition: "45% 40%",
      },
      side: "right",
    },
  ],
};

export default page;
