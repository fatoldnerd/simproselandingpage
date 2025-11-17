# SE Central – Product Requirements Document (PRD)

## **1\. Product Summary**

**Name:** SE Central  
 **Type:** Internal web landing page (single route)  
 **Purpose:** Serve as the **home base** for Sales Engineers and SE managers, providing a single, clear starting point to access the SE tools ecosystem.

**Core Job:**

Give SEs and SE managers one canonical URL where they can see which tools exist, understand what each one is for, and open the right app in one click.

**Apps linked from SE Central v1:**

1. **GROW Coaching App** – development planning and coaching notes.

2. **Demo Scoring App** – call transcript upload and triad scoring (LLM \+ self \+ manager).

3. **Quota Attainment Tracker** – SE progress vs targets.

4. **SE Contribution to Sales App** – SE pipeline/revenue contribution.

SE Central does **not** implement any of these apps’ internal logic; it is a hub that links out to them.

---

## **2\. Goals, Non-Goals, Success**

### **2.1 Goals (v1)**

* Provide a **single canonical URL** for all SE tools (“Start at SE Central”).

* Make it obvious **which app is for what** via clear tiles and short descriptions.

* Reflect the **coaching workflow**:

  * Demo Scoring is a shared tool used by SEs and SE managers.

  * Demo Scoring surfaces three perspectives:

    * LLM score

    * SE self-score

    * Manager score

  * GROW Coaching is where development actions live.

* Make it **easy to add new apps later** via a central config, without redesigning the layout.

* Deliver a **simple, professional, internal-grade UI** that feels like a real product, not a prototype.

* Align with company standards by using **Firebase backend \+ Google Authentication**.

### **2.2 Non-Goals (v1)**

* No dashboards or metrics visualizations on SE Central itself.

* No admin UI for managing apps (config file / Firestore only).

* No complex personalization beyond (optional) greeting like “Welcome back, \[First name\]”.

* No mobile-first optimization; just “works reasonably” on smaller screens.

### **2.3 Success Criteria (practical)**

After launch:

* Onboarding docs and SE leaders consistently direct people to **SE Central**, not individual app URLs.

* SEs and managers can clearly articulate:

  * What each tile leads to.

  * When they should use each app (especially Demo Scoring vs GROW Coaching vs quota/impact).

* New apps can be added by updating **one config source** and appear as tiles automatically.

* (If analytics wired) majority of SE tool usage starts from SE Central.

---

## **3\. Assumptions & Constraints**

* **Authentication:**

  * Use **Firebase Authentication** with **Google provider**.

  * Restrict access to users in the company’s Google Workspace domain (e.g., `@company.com`).

* **Backend / Hosting:**

  * Use **Firebase Hosting** for the web app.

  * Use **Firestore** (or Firebase Remote Config / static config file) to store app tile metadata, if needed.

* **Tech stack (front end):**

  * Component-based front-end (e.g., React, Next, Vite, etc.) generated via Claude/Cursor.

  * Deployed via Firebase CLI and build pipeline.

* **User base:**  
   Internal SE team and SE managers/leaders across regions.

* **Destinations:**  
   Linked apps may run on separate domains and may have their own auth sessions.

* **Scope:**  
   Single page, single route hub.

---

## **4\. Users & Use Cases**

### **4.1 Personas**

1. **Sales Engineer (IC)**

   * Uses SE Central weekly/daily to:

     * Upload and review calls in Demo Scoring.

     * Capture goals/actions in GROW Coaching.

     * Check own numbers in Quota Attainment and Contribution apps.

2. **SE Manager / SE Leader**

   * Heavy user of:

     * **Demo Scoring** – to review calls and enter manager scores.

     * **GROW Coaching** – to run structured 1:1s and track development.

     * **Quota/Contribution apps** – to prepare for reviews and track performance.

   * Uses SE Central to quickly access the right tool while coaching.

Secondary: AEs or other roles may occasionally follow links, but v1 is optimized for SEs and SE leadership.

### **4.2 Key Use Cases**

1. **SE uploads and scores a demo call**

   * SE opens SE Central.

   * Clicks **Demo Scoring** tile.

   * In Demo Scoring app:

     * Uploads transcript (e.g., from Gong/Fireflies/Clari).

     * LLM auto-scores the call.

     * SE enters **self-score**.

   * Outcome: call has LLM \+ self score, ready for manager review.

2. **Manager reviews and scores the same call**

   * Manager opens SE Central.

   * Clicks **Demo Scoring** tile.

   * In Demo Scoring app:

     * Opens the same call.

     * Reviews transcript and LLM \+ SE scores.

     * Enters **manager score**.

   * Outcome: three perspectives (LLM, SE, manager) are stored for coaching use.

3. **Manager and SE use scores for a 1:1 coaching session**

   * Before/during the 1:1:

     * Both open SE Central.

     * Manager clicks **Demo Scoring** tile and views combined scores to identify:

       * Mismatches (e.g., SE vs manager perception).

       * Patterns across calls.

     * Manager or SE then opens **GROW Coaching** tile to:

       * Log goals and next steps based on insights from the scores.

   * Outcome: triad scoring feeds directly into GROW-based coaching.

4. **SE prepares for a coaching conversation**

   * SE opens SE Central.

   * Clicks **Demo Scoring** to upload/review a recent call and self-score it.

   * Clicks **GROW Coaching** to:

     * Write down reflections and goals ahead of the 1:1.

   * Outcome: SE arrives at coaching with recent calls scored and goals thought through.

5. **SE checks personal performance numbers**

   * SE opens SE Central.

   * Clicks **Quota Attainment** tile to see progress vs target.

   * Optionally clicks **SE Contribution** tile to see pipeline/revenue impact.

   * Outcome: SE knows where they stand for performance conversations.

6. **Manager prepares for a 1:1 or QBR**

   * Manager opens SE Central.

   * Uses:

     * **Demo Scoring** to review demo quality trends.

     * **GROW Coaching** to see goals and historical notes.

     * **Quota/Contribution** apps to see numbers context.

   * Outcome: manager has a consolidated picture for coaching and performance management.

7. **New SE learns the tool landscape**

   * New hire opens SE Central from onboarding documentation.

   * Reads short section title and sees four tiles with concise descriptions:

     * GROW Coaching → development and 1:1s.

     * Demo Scoring → LLM \+ self \+ manager scoring on calls.

     * Quota Attainment → progress vs targets.

     * SE Contribution → revenue and pipeline impact.

   * Outcome: new SE understands which tool to use for skills vs call quality vs numbers.

---

## **5\. Experience Overview**

Single-page, desktop-first layout:

1. **Top Navigation Bar**

2. **Hero Section** – short intro \+ CTA to scroll to apps.

3. **Apps Tile Grid** – four app cards, main focus.

4. **Help / Questions Strip**

5. **Footer**

No additional sections (stats, FAQ accordions, etc.) in v1.

---

## **6\. Functional Requirements**

### **6.1 Route & Page Container**

* **Route:** `/se-central` (canonical SE hub URL).

* **Layout:**

  * Max content width \~1200px centered.

  * Horizontal padding 16–32px; vertical spacing 32–48px between sections.

* **Behavior:**

  * Page loads scrolled to top.

  * Internal anchor scrolling used for “Apps” / “View Apps” actions.

---

### **6.2 Authentication & Firebase Integration**

**Purpose:** Ensure only internal users in the company’s Google Workspace can access SE Central.

**Requirements:**

* Use **Firebase Authentication** with the **Google sign-in provider**.

* Restrict sign-in to email addresses in the company domain (e.g., `@company.com`).

* On login success:

  * Store basic user info in client state:

    * `uid`

    * `email`

    * `displayName` (if available)

  * Optionally display `displayName` in the nav (e.g., “Hi, Brad”).

**Behavior:**

* If user is **not** authenticated:

  * Show a simple “Sign in with Google” screen (Firebase Auth UI or custom button).

  * Do not show SE Central content until authenticated.

* If user’s email is **not** in allowed domain:

  * Deny access with message: “SE Central is only available to internal users.”

* Auth state should be persisted (Firebase default) so users don’t need to re-login on every visit.

---

### **6.3 Top Navigation Bar**

**Purpose:** Brand the hub and provide quick access to the apps section.

**Structure:**

* Full-width bar at top; may remain sticky on scroll.

* Height \~56–64px.

**Content:**

* **Left:**

  * Logo/icon (e.g., “SE” badge or company mark).

  * Text label: `SE Central`.

  * Clicking logo or text scrolls to top.

* **Center (optional):**

  * Simple text link: `Apps` → smooth scroll to apps section.

* **Right:**

  * Optional greeting: `Hi, [First name]` (from Firebase user `displayName` or email).

  * Primary button: `Browse Apps` → smooth scroll to apps section.

  * Optional `Sign out` link/button to call Firebase `signOut()`.

**Behavior:**

* All nav items show hover states.

* Buttons keyboard-accessible.

---

### **6.4 Hero Section**

**Purpose:** Briefly explain what SE Central is and push users to the apps grid.

**Layout:**

* Two-column layout within main container on desktop:

  * Left column: text and CTAs.

  * Right column: visual placeholder (image, illustration, or card).

**Left Column Content:**

* Heading (H1) – one sentence.

* Short paragraph (2–3 lines).

* Primary button:

  * Label: `View SE Apps`.

  * Action: smooth scroll to apps section (`id="apps"`).

* Secondary button (optional):

  * Label: `Open Default App`.

  * Action: stub or global default (can be implemented later).

**Right Column Content:**

* Placeholder visual: screenshot collage, abstract graphic, or simple card.

* No functional requirements; purely presentational.

**Responsive behavior:**

* On narrow screens, stack vertically:

  * Text block above.

  * Visual block below.

---

### **6.5 Apps Tile Grid (“Apps” Section)**

**Purpose:** Main functional area; tile-based navigation to SE apps.

#### **6.5.1 Section Container**

* **id:** `apps` (for anchor scrolling).

* Contents:

  * Section title, e.g., `SE Apps` or `Choose an SE App`.

  * Optional short subtitle (one line max).

  * Responsive grid of tiles/cards.

#### **6.5.2 Data Model (App Config)**

Tiles are driven from a single configuration source.

**Fields per app:**

* `id` (string, unique): `"grow"`, `"demo-scoring"`, `"quota"`, `"contribution"`, etc.

* `name` (string): display name, e.g., `GROW Coaching`.

* `description` (string): concise, 1–2 sentences describing purpose and when to use it.

* `url` (string): destination link (absolute or relative).

* `icon` (string or enum): key to map to an icon in the UI.

* `category` (string, optional): e.g., `"Coaching"`, `"Demos & Coaching"`, `"Performance"`.

* `isDefault` (boolean, optional): whether this is the user/team default app.

* `isEnabled` (boolean): whether the app is active.

* `order` (number): to control display order.

**Storage options (v1):**

* Simplest: Static config file (e.g., `appsConfig.ts`/`apps.json`) imported by the front end.

* Optional: Store in **Firestore** (`seApps` collection) and read at runtime:

  * Firestore structure:

    * Collection: `seApps`

    * Document fields match above.

  * If you use Firestore, implement a lightweight loader with fallback if no data.

#### **6.5.3 Layout**

* Desktop: 2 columns × 2 rows (4 apps).

* Gaps:

  * Horizontal gap \~24–32px.

  * Vertical gap \~24–32px.

* Tablet: 2 columns when width allows.

* Mobile: 1 column, full-width stacked cards.

#### **6.5.4 Tile / Card Structure**

Each tile displays:

1. **Header row:**

   * Left: icon according to `icon` key.

   * Right: optional status pill:

     * If `isDefault` true → pill with “Default”.

     * If `isEnabled` false → pill with “Coming soon”.

2. **Title:**

   * App `name`.

3. **Description:**

   * App `description` (truncated if necessary).

4. **Category label (optional):**

   * Small text below description based on `category`.

5. **Action:**

   * Primary button:

     * Label: `Open App` or `Open [name]`.

     * On click: opens `url`.

   * Optionally, entire card is clickable and triggers same action.

#### **6.5.5 Special Consideration – Demo Scoring Tile**

The Demo Scoring tile should reflect its **triad scoring** and joint SE/manager use:

* Example structural description:

  * `name`: `"Demo Scoring"`

  * `description`: `"Upload call transcripts and compare LLM, self, and manager scores to drive coaching."`

  * `category`: `"Demos & Coaching"`

This ensures users understand it’s not just a self-evaluation tool.

#### **6.5.6 States & Behavior**

* **Default:** card appears clickable, with hover elevation/shadow and pointer cursor.

* **Disabled (`isEnabled` false):**

  * Reduced opacity or greyed-out style.

  * Button disabled or replaced with `Coming soon`.

  * Click does not navigate.

* **Click target:**

  * Prefer single behavior:

    * Either open in same tab (simpler).

    * Or open in new tab (`_blank`) if app domains/auth flows demand.

* **Error handling:**

  * If `url` missing or invalid, disable button and show small warning text:  
     “Not configured. Contact admin.”

---

### **6.6 Help / Questions Strip**

**Purpose:** Give users a clear place to go when they’re confused or something is broken.

**Layout:**

* Full-width strip below apps grid.

* Centered text:

  * Heading: `Questions or issues?`

  * Short line of text with links, e.g.:

    * `View the SE Central guide` (docs link).

    * `Ask in #se-central on Slack`.

**Behavior:**

* Links open in new tab.

---

### **6.7 Footer**

**Content:**

* Left: `© [Company Name] – SE Central`.

* Right (optional): small text links:

  * `Help`

  * `Feedback` (mailto or form)

  * `Privacy` / `Terms` (if relevant internally)

Static content only.

---

## **7\. Styling & Visual Direction**

### **7.1 Overall Look & Feel**

* Professional, clean, minimal.

* Internal product aesthetic, not marketing-heavy.

* Emphasis on clarity and scannability.

### **7.2 Layout**

* **Max-width:** \~1200px for main content.

* **Page padding:** 16–32px horizontal; 32–48px vertical between main sections.

* **Hero spacing:** generous padding so header \+ hero feel distinct.

* **Grid:** consistent column and row spacing; cards aligned in a tidy grid.

### **7.3 Color**

Map to company/brand colors, but conceptually:

* **Background:** light neutral (very light grey or off-white).

* **Cards:** white or slightly off-white with subtle shadows.

* **Accent color:** company primary color for:

  * Primary buttons.

  * Section overlines / highlights.

  * Icons and focus states.

* **Status pills:**

  * Default: subtle accent border and text.

  * Coming soon: neutral grey.

### **7.4 Typography**

* Single sans-serif font (system or brand font).

* **Hierarchy:**

  * H1 (hero): \~28–32px, bold.

  * H2 (section titles): \~20–24px.

  * Card titles: \~18–20px, semi-bold.

  * Body: \~14–16px.

* Line length: aim for 60–80 characters for paragraphs.

### **7.5 Components**

1. **Top Nav:**

   * Solid background (same as or slightly darker than page).

   * Clear separation from content (shadow or border).

2. **Buttons:**

   * Primary: filled with accent color, white text.

   * Secondary: outline or ghost style with accent color.

   * Hover: slightly darker background for primaries; subtle fill for secondaries.

3. **Cards:**

   * Rounded corners (8–12px).

   * Drop shadow or subtle elevation.

   * On hover: slightly stronger shadow; optional tiny scale-up.

4. **Icons:**

   * Simple, minimal icons for each app (coaching, call/demo, target, chart).

   * Consistent stroke weight and size (\~24px).

5. **Status Pills:**

   * Small rounded pill with text (“Default”, “Coming soon”).

### **7.6 Responsiveness & Accessibility**

* Cards stack gracefully on smaller viewports.

* Text contrast meets accessibility thresholds.

* Buttons and cards are usable via keyboard (focus outlines visible).

---

## **8\. Data & Configuration Details**

### **8.1 App Config Storage**

Options:

* **v1 (simple):** Static config file imported into the app.

* **Optional v1.1:** Firestore collection `seApps` used to read tile metadata at runtime.

If using Firestore:

* Collection: `seApps`

* Document id: `id` field.

* Fields: `name`, `description`, `url`, `icon`, `category`, `isDefault`, `isEnabled`, `order`.

### **8.2 Environment-aware URLs**

* Use environment variables or per-environment config for app URLs.

* Example: `FIREBASE_APP_ENV` controls which set of URLs to read.

---

## **9\. Telemetry / Analytics (Optional v1)**

If monitoring is added, use Firebase Analytics or another telemetry stack.

Events:

1. **`se_central_page_view`**

   * Properties: `uid`, `email`, timestamp.

2. **`se_central_app_open_click`**

   * Properties: `uid`, `email`, `appId`, timestamp.

3. **`se_central_help_click`**

   * Properties: `uid`, `email`, `destination` (`docs`, `slack`, etc.).

---

## **10\. Non-Functional Requirements**

* **Performance:** Page should render in under \~2s on typical internal networks and laptops.

* **Reliability:** Use Firebase Hosting \+ Auth; avoid external dependencies that could break the core experience.

* **Security:**

  * Firebase Auth restricts to corporate domain.

  * Firestore rules (if used) restrict reads/writes to authenticated users in allowed domain.

* **Accessibility:**

  * Keyboard navigation works.

  * Focus states visible.

  * Color contrast acceptable.

---

## **11\. Roadmap**

### **v1 (this build)**

* SE Central at `/se-central`.

* Firebase Authentication with Google provider and domain restriction.

* Firebase Hosting deployment.

* Top nav with brand, greeting, and `Browse Apps` button.

* Hero section with short intro and `View SE Apps` CTA.

* Apps tile grid with 4 apps:

  * GROW Coaching

  * Demo Scoring (triad scoring emphasis)

  * Quota Attainment

  * SE Contribution

* Help / questions strip.

* Footer.

* Config-driven app list (static file or Firestore).

### **v1.1 (future)**

* Implement “Default App” behavior (user- or team-level).

* “Last opened app” indicator (localStorage or Firestore).

* Option to mark apps “new” with a badge.

* Deeper documentation links per app.

### **v2 (later)**

* Metrics row (e.g., demos scored this quarter, coaching sessions, etc.).

* Manager-specific enhancements.

* Admin UI for managing tile config in Firestore.

