/**
 * Cities, NAP and the service catalog. Defined once; header, footer and routes read from here.
 * Primary-city model: `/` is the Springfield home. City switcher is hidden (one city).
 */

export type ServiceConfig = {
  slug: string;
  /** Short label used in menus, cards and link text. */
  name: string;
  /** Show in the header quick links (3-4 only). */
  headerQuickLink?: boolean;
};

export type CityConfig = {
  slug: string;
  name: string;
  state: string;
  displayName: string;
  /** NAP phone in E.164 (the only phone number in the repo). */
  phoneE164: string;
  /** NAP phone as shown to visitors. */
  phoneDisplay: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
  launchStatus: "launch" | "planned";
  showInSwitcher: boolean;
  /** This city's home is served at `/`. */
  homeAtRoot: boolean;
  services: readonly ServiceConfig[];
};

export const SITE_ORIGIN = "https://www.healthcareconsultants417.com";

export const CITIES: readonly CityConfig[] = [
  {
    slug: "springfield",
    name: "Springfield",
    state: "MO",
    displayName: "Springfield, MO",
    phoneE164: "+14177200818",
    phoneDisplay: "(417) 720-0818",
    address: {
      street: "1450 W Cambridge St",
      city: "Springfield",
      state: "MO",
      postalCode: "65807",
    },
    launchStatus: "launch",
    showInSwitcher: false,
    homeAtRoot: true,
    // Names follow the old WordPress menu labels. Two (transitional care,
    // hospital to home) had no menu label; their names come from the route table.
    services: [
      { slug: "senior-community-placement", name: "Senior Community Placement", headerQuickLink: true },
      { slug: "senior-relocation", name: "Relocation", headerQuickLink: true },
      { slug: "zpod-sensory-beds", name: "zPods® Sensory Bed", headerQuickLink: true },
      { slug: "suicide-awareness", name: "Suicide Awareness", headerQuickLink: true },
      { slug: "senior-downsizing", name: "Senior Downsizing Help" },
      { slug: "transitional-care", name: "Transitional Care" },
      { slug: "hospital-to-home-transition", name: "Hospital to Home Transition" },
    ],
  },
];

export const DEFAULT_CITY_SLUG = "springfield";

export function getCity(slug: string = DEFAULT_CITY_SLUG): CityConfig {
  const city = CITIES.find((c) => c.slug === slug);
  if (!city) throw new Error(`Unknown city: ${slug}`);
  return city;
}

export function getActiveCitySlugs(): string[] {
  return CITIES.filter((c) => c.launchStatus === "launch").map((c) => c.slug);
}

export function cityHomePath(city: CityConfig): string {
  return city.homeAtRoot ? "/" : `/${city.slug}/`;
}

export function servicePath(city: CityConfig, service: ServiceConfig): string {
  return `/${city.slug}/${service.slug}/`;
}

export function contactPath(city: CityConfig): string {
  return `/${city.slug}/contact/`;
}

export function telHref(city: CityConfig): string {
  return `tel:${city.phoneE164}`;
}
