import copy from "@/data/copy/pages/senior-downsizing-help.json";
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
  slug: "senior-downsizing",
  manifestSlug: "senior-downsizing-help",
  title: "Senior Downsizing Help in Springfield, MO | Transitional Healthcare Consultants",
  description:
    "Compassionate downsizing help for seniors in Southwest Missouri. We simplify transitions so your parent feels honored and you feel less overwhelmed",
  h1: s(0),
  heroFile: `${up}/2025/10/Senior-Downsizing.jpg`,
  heroAlt: "An older couple packs a cardboard box on a couch, with more boxes stacked beside them.",
  heroPosition: "68% 48%",
  relatedSlugs: ["senior-relocation", "senior-community-placement", "transitional-care"],
  usedBlocks: [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
    58, 59, 60, 61, 62, 65, 66, 67, 68, 69, 70, 71, 72, 73,
  ],
  droppedBlocks: [
    { index: 63, reason: "Review. This job does not render reviews." },
    { index: 64, reason: "Review attribution. This job does not render reviews." },
  ],
  droppedImages: [
    {
      file: `${up}/2022/06/section-bg.jpg`,
      reason: "Decorative theme background of pale circles, not a photograph. Dropped, not replaced.",
    },
  ],
  sections: [
    { type: "prose", paragraphs: [t(1), t(2), t(3), t(4), t(5), t(6)] },
    {
      type: "split",
      heading: s(7),
      paragraphs: [t(8), t(9), t(10)],
      items: [t(11), t(12), t(13), t(14), t(15), t(16)],
      photo: {
        file: `${up}/2025/10/senior-downsizing-services.jpg`,
        alt: "An older woman sorts items into boxes in a living room.",
        objectPosition: "50% 35%",
      },
      side: "right",
    },
    { type: "prose", paragraphs: [t(17)] },
    {
      type: "split",
      heading: s(18),
      paragraphs: [t(19)],
      photo: {
        file: `${up}/2025/10/Senior-Downsizing-Springfield.jpg`,
        alt: "An older man holds a small chalkboard that reads NEW HOME, with moving boxes behind him.",
        objectPosition: "50% 40%",
      },
      side: "left",
    },
    {
      type: "cards",
      items: [
        { title: s(20), paragraphs: [], icon: icon("senior-parentscon.png") },
        { title: s(21), paragraphs: [], icon: icon("senior-assisted-living.png") },
        { title: s(22), paragraphs: [], icon: icon("senior-widow.png") },
        { title: s(23), paragraphs: [], icon: icon("estate-will.png") },
      ],
    },
    { type: "prose", paragraphs: [t(24)] },
    {
      type: "split",
      heading: s(25),
      paragraphs: [t(26), t(27), t(28), t(29), t(30), t(31)],
      items: [t(32), t(33), t(34), t(35)],
      photo: {
        file: `${up}/2025/10/Downsizing-Services-for-Seniors.jpg`,
        alt: "Three adults stand together with their arms around each other.",
        objectPosition: "50% 40%",
      },
      side: "right",
    },
    { type: "prose", paragraphs: [t(36)] },
    {
      type: "cards",
      heading: s(37),
      intro: [t(38)],
      items: [
        { title: s(39), paragraphs: [t(40)], icon: icon("custom-plan-icon.png") },
        { title: s(41), paragraphs: [t(42)], icon: icon("moving-2-icon.png") },
        { title: s(43), paragraphs: [t(44)], icon: icon("estate-sale-icon.png") },
        { title: s(45), paragraphs: [t(46)], icon: icon("cleaning-i2-con.png") },
        { title: s(47), paragraphs: [t(48)], icon: icon("move-in-icon.png") },
        { title: s(49), paragraphs: [t(50)], icon: icon("virtual-check-icon.png") },
        { title: s(51), paragraphs: [t(52)], icon: icon("medicine-2-icon.png") },
      ],
    },
    {
      type: "split",
      heading: s(53),
      paragraphs: [t(54), t(55)],
      photo: {
        file: `${up}/2025/10/Senior-Downsizing-packages.jpg`,
        alt: "A woman with a clipboard talks with an older couple on a sofa.",
        objectPosition: "50% 45%",
      },
      side: "left",
    },
    { type: "prose", paragraphs: [t(56)] },
    {
      type: "split",
      heading: s(57),
      paragraphs: [t(58), t(59), t(60), t(61)],
      photo: {
        file: `${up}/2025/10/senior-moving-company.jpg`,
        alt: "A younger man and an older man stand with two taped moving boxes.",
        objectPosition: "40% 40%",
      },
      side: "right",
    },
    { type: "related" },
    {
      type: "faq",
      heading: s(67),
      items: [
        { question: s(68), answer: s(69) },
        { question: s(70), answer: s(71) },
        { question: s(72), answer: s(73) },
      ],
    },
    {
      type: "cta",
      heading: s(62),
      paragraphs: [t(65)],
      button: s(66),
      photo: {
        file: `${up}/2025/09/Senior-Relocation-Service.jpg`,
        alt: "An older couple stands with their backs to the camera, looking at a house.",
        objectPosition: "50% 60%",
      },
      side: "left",
    },
  ],
};

export default page;
