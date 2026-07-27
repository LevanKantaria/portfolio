export interface CaseStudy {
  id: string
  eyebrow: string
  title: string
  teaser: string
  /** Markdown: #### headings, paragraphs, "- " bullets, *emphasis*. */
  bodyMd: string
}

/** Seed content and offline fallback — the live copy lives in Firestore. */
export const DEFAULT_CASE_STUDIES: CaseStudy[] = [
  {
    id: 'megzuri',
    eyebrow: 'MEGZURI · Founder · React Native + Firebase',
    title: 'Building a real-time average-speed assistant for Georgian drivers',
    teaser:
      'How I designed, built, and launched a mobile app that shows drivers their live average speed inside section-camera zones — end to end, as a solo founder.',
    bodyMd: `MEGZURI is a mobile app I built to help Georgian drivers track their average speed between section-camera zones and avoid accidental traffic fines. In Georgia, many roads use average-speed cameras — drivers often slow down near the cameras but still receive fines, because the system calculates their average speed across the whole section, not just at the camera.

I built MEGZURI as a full product: mobile app, backend logic, admin tooling, data management, landing page, and launch strategy.

#### The problem

Average-speed zones are confusing. The issue is usually not that drivers want to drive fast — it's lack of visibility. A driver can enter a zone, drive normally, slow down near the end, and still get fined because their average was too high:

- Drivers don't always know where section-camera zones start and end.
- Calculating average speed manually while driving is hard.
- Speed limits and camera sections are not easy to remember.
- Sudden braking near cameras makes traffic less smooth and less safe.
- No simple Georgian-focused mobile tool existed for this problem.

#### My role

I designed, built, and launched MEGZURI myself: product idea and feature planning, mobile app design and development, real-time trip logic, average-speed and remaining-distance calculation, user profiles, trip history, a public leaderboard, an admin panel, camera and fine-data management, the landing page, and early marketing experiments. This was not just a coding project — I had to think like a product owner, designer, engineer, and marketer at the same time.

#### The solution

MEGZURI gives drivers a live view of their average speed while inside a section-camera zone. Instead of only showing current speed, it focuses on average speed — because that's what matters — and answers the questions drivers actually care about: Am I currently safe? What's my average in this zone? How much distance is left? Do I need to slow down, or can I keep this pace?

#### Technical approach

Built with React Native, Firebase, Firestore, and Node.js. The app handles the real-time experience — active trip state, speed calculations, zone guidance — while Firestore stores profiles, trip history, leaderboard, and camera-zone data. To keep data fresh, I built an automated ingestion system with scheduled jobs and scraping logic that updates camera and fine-related data daily, plus admin tooling to manage it. The key challenge: making the app feel simple while the logic underneath was complex. The user shouldn't need to understand formulas or section boundaries — just clear guidance at the right moment.

#### Product and UX decisions

The most important decision was making the app feel calm and clear while driving. Drivers shouldn't be overloaded — the interface shows the essentials fast: average speed, remaining distance, and whether you're currently safe. The design direction was inspired by clean automotive interfaces: dark UI, large numbers, strong contrast, minimal noise. Not a flashy app — something drivers understand in seconds.

#### Challenges

Translating a real-world driving problem into simple product logic; earning trust (an app that deals with fines has to feel reliable in its data, calculations, and UI); and building everything end to end as a solo founder — app, backend, admin panel, website, data updates, and launch.

#### Impact

MEGZURI turned a common Georgian driving frustration into a focused mobile product. It's live on iOS (Google Play planned), tested with real users and early marketing campaigns — validating that drivers understand the problem and want a dedicated solution. For me it matters because it shows I can build beyond isolated features: take a real problem, design the solution, build the full system, launch it, and improve it from real user behavior.

#### What I learned

Owning the full outcome feels completely different from delivering assigned features. I had to think about the problem, the user, the UX, the data model, the backend, the app-store launch, marketing, trust, and long-term direction. It also reinforced my main strength as an engineer: taking a messy real-world problem and turning it into a simple, usable interface.`,
  },
  {
    id: 'bogpay',
    eyebrow: 'Bank of Georgia · BOG Pay · React + TypeScript',
    title: 'Turning BOG Pay service forms into a reusable framework',
    teaser:
      'How we replaced hand-built payment forms with a JSON-driven framework that scaled to 500+ uniquely structured services in a production banking environment.',
    bodyMd: `At Bank of Georgia, I worked in the online payments division on products used by both business and retail customers. One of the biggest frontend challenges was the structure of BOG Pay service forms: the platform supported hundreds of different services, and each could have its own fields, validation rules, UI behavior, and edge cases. Over time, building and maintaining these forms became repetitive, slow, and difficult to scale.

To solve this, I helped transform the form-building process from manual one-by-one implementation into a reusable, configuration-driven framework based on shared components and JSON-based service definitions.

#### The problem

The original approach made every new or updated service feel like a custom frontend task. Even when services looked similar, small differences in fields, validation, dependencies, or business rules often required custom implementation work:

- Developers repeated similar UI and validation logic across many services.
- Adding or changing services required more frontend effort than it should have.
- The codebase became harder to maintain as the number of services grew.
- Small inconsistencies could appear between similar forms.
- Product and business changes were slower because each form needed developer attention.

For a payments platform, this mattered a lot. These forms were not simple UI screens — they were part of real payment flows where clarity, reliability, and correctness were critical.

#### My role

I worked as a frontend developer in the online payments team and helped lead the frontend implementation of this change: understanding the repeated patterns across many different payment forms, breaking complex form behavior into reusable components, designing a cleaner structure for rendering forms dynamically, and working with backend/BFF, product, UX/UI, QA, and architecture stakeholders — while keeping the system flexible enough for unusual service requirements.

#### The solution

We moved toward a reusable, JSON/config-driven form system. Instead of treating every service form as a separate custom implementation, we described form structure and behavior through configuration, and the frontend rendered the correct UI from that structure. The framework included reusable building blocks for common needs:

- Text inputs, selects, and dynamic field rendering
- Field validation and conditional fields
- Service-specific labels and metadata
- Consistent layout, spacing, and shared error handling
- Reusable submit and payment-flow behavior

Adding or updating a service became much more about defining the right configuration instead of writing a new custom screen from scratch.

#### Technical approach

The core idea was to separate *what the form is* from *how the form is rendered*. The JSON/config layer described the structure of each service form; the React frontend handled rendering, validation, state management, and user experience through shared components. Service definitions lived in a predictable structure, common logic was centralized, and edge cases could still be supported when a service needed special behavior. All of this ran inside a production banking environment, so the solution also had to be stable, maintainable, and safe for real users.

#### Impact

The change reduced repeated frontend work and made the platform easier to scale — the team could support 500+ differently structured services with a cleaner, more maintainable approach, better consistency across payment forms, and faster future changes. For me, this project showed how frontend engineering directly improves product delivery speed: the value wasn't just UI components, it was turning a painful recurring workflow into a framework.

#### What I learned

Complex products become easier to scale when you identify the repeated patterns and build the right abstraction. The hard part is not making something reusable — it's making it reusable without making it rigid. Balancing structure against flexibility for unusual payment services was the most interesting part of the work.`,
  },
]
