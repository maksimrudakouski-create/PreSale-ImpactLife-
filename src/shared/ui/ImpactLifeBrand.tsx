/** The brand mark adapts to the active light or dark theme. */
export function ImpactLifeBrand() {
  return (
    <>
      <img src="/impactlife-logo.svg" alt="ImpactLife" className="h-10 w-auto translate-x-6 translate-y-2 dark:hidden" />
      <img src="/impactlife-logo-dark.svg" alt="ImpactLife" className="hidden h-10 w-auto translate-x-6 translate-y-2 dark:block" />
    </>
  );
}
