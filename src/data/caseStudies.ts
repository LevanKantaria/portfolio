export interface CaseStudy {
  id: string
  eyebrow: string
  title: string
  teaser: string
  /** Markdown: #### headings, paragraphs, "- " bullets, *emphasis*. */
  bodyMd: string
}

/** Seed content and offline fallback. The live copy lives in Firestore. */
export const DEFAULT_CASE_STUDIES: CaseStudy[] = [
  {
    id: 'megzuri',
    eyebrow: 'MEGZURI, 2025 – now',
    title: 'An average-speed assistant for Georgian drivers',
    teaser:
      'Designing and launching an app that shows drivers their live average speed between section cameras.',
    bodyMd: `Many Georgian roads have section cameras. They measure your average speed between two points, so slowing down at the camera doesn't help if you drove too fast in between. Drivers get fined without understanding why.

MEGZURI shows drivers their average speed for the section they're in, live, while they drive. I designed, built and launched it on my own.

#### The problem

Most drivers fined on these roads aren't speeding on purpose. They can't see the numbers that matter:

- Where a camera section starts and ends
- Their average speed so far
- How much distance is left, and what speed keeps them under the limit

The usual response is braking hard at the last camera, which makes traffic worse. When I started, there was no Georgian app built around this problem.

#### What I built

The app tracks the active trip, calculates average speed across the current section and shows the distance left. Around that core are user profiles, trip history, a public leaderboard and an admin panel for camera data.

Camera locations and fine data change, so a scheduled Node.js job scrapes and updates them every day. The app is written in React Native and TypeScript, backed by Node.js, Firebase and Firestore.

#### Design decisions

A driving app has to be readable at a glance. The main screen shows three things: your average speed, the distance left, and whether you're currently safe. Everything else stays out of the way. The look borrows from car dashboards, with a dark background, large numbers and strong contrast.

Trust mattered as much as clarity. People use MEGZURI to avoid fines, so a wrong number costs them money. The calculations and the camera data had to be reliable before anything else.

#### Where it is now

MEGZURI launched on the App Store in July 2025 and is now on version 2. More than 1,000 people use it, it's rated 5.0 on the App Store, and an Android version is planned. I run the releases, the data pipeline and the marketing myself.

#### What I learned

At a company you usually deliver the features you're given. Here I owned all of it: the idea, the interface, the data model, the backend, the App Store listing and the marketing. It changed how I judge features. Each one has to earn its place on a small screen that someone glances at while driving.`,
  },
  {
    id: 'bogpay',
    eyebrow: 'Bank of Georgia, 2023 – 2026',
    title: 'One form engine for 500 payment services',
    teaser:
      'Replacing hand-built payment forms on BOG Pay with an engine that renders every service from configuration, so new services launch without a frontend release.',
    bodyMd: `BOG Pay is Bank of Georgia's public payments site. Customers use it to pay for hundreds of services, such as utility bills and mobile top-ups, and each service needs its own form with its own fields, validation rules and edge cases.

Most of these forms used to be built one at a time. In the online payments team, I designed and built a form engine that renders any service from a schema instead.

#### The problem

Every new or changed service was a frontend task, even when it looked almost identical to one we had already built. Small differences in fields, validation or business rules meant custom code. Over time that led to:

- The same UI and validation logic repeated across many services
- More frontend work than a service change should need
- A codebase that got harder to maintain as services were added
- Small inconsistencies between forms that should behave the same
- Product changes waiting on developer time

In a payment flow those inconsistencies matter. A confusing form can mean a failed or wrong payment.

#### My role

I designed the engine and led the frontend work on it. I looked for the patterns shared across hundreds of forms, broke their behaviour into reusable components and designed how a form renders from configuration. I worked with the backend and BFF, product, design, QA and architecture teams, inside a regulated release process where correctness and auditability matter far more than on a typical consumer site.

#### How it works

We separated *what a form is* from *how it's rendered*. A JSON definition describes each service: its fields, labels, validation, conditional fields and metadata. The React frontend reads that definition and builds the form from shared components for inputs, selects, validation, errors, layout and the payment submit flow.

Adding a service became a configuration change. It no longer needed a frontend release or a frontend developer, and when a service needed something unusual, the engine made room for it without a one-off screen.

#### Impact

The engine renders more than 500 differently structured services. New services ship through configuration alone, which took frontend releases out of the path to launching one. Forms behave consistently, and far less code is repeated between them.

#### What I learned

Complex products get easier to scale once you find the repeated patterns and build the right abstraction. The hard part is keeping that abstraction flexible. The engine had to cover the common cases and still handle the odd payment service, and finding that balance was the most interesting part of the work.`,
  },
]
