import community from "./senior-community-placement.ts";
import relocation from "./senior-relocation.ts";
import downsizing from "./senior-downsizing.ts";
import zpod from "./zpod-sensory-beds.ts";
import suicide from "./suicide-awareness.ts";
import transitional from "./transitional-care.ts";
import hospital from "./hospital-to-home-transition.ts";
import type { ServicePage } from "./types.ts";

/** The seven Springfield service pages, in cityConfig order. */
export const servicePages: readonly ServicePage[] = [
  community,
  relocation,
  zpod,
  suicide,
  downsizing,
  transitional,
  hospital,
];

const bySlug = new Map(servicePages.map((page) => [page.slug, page]));

export function getServicePage(slug: string): ServicePage {
  const page = bySlug.get(slug);
  if (!page) throw new Error(`No service page for ${slug}`);
  return page;
}
