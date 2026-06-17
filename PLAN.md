\# CISSP Cram App — `plan.md`



\## Objective



Build a modern, responsive CISSP study web app that helps me prepare for the exam in fewer than 14 days.



The app must focus on:



\* Finding weak CISSP domains quickly

\* Explaining difficult concepts in plain language

\* Teaching the management and risk-based CISSP mindset

\* Practising scenario-based questions

\* Training recall with flashcards and spaced repetition

\* Tracking daily progress and exam readiness



This is a personal static web app deployed through GitHub Pages.



Do not implement login, accounts, server databases or features unrelated to passing the CISSP exam.



\---



\## Source Material



Process the following supplied EPUB files locally:



1\. \*\*ISC2 CISSP Official Study Guide\*\*



&#x20;  \* Primary curriculum and concept source

&#x20;  \* Map content to the eight CISSP domains and official exam objectives



2\. \*\*CISSP For Dummies, 8th Edition\*\*



&#x20;  \* Use for simpler explanations, analogies and beginner-friendly examples



3\. \*\*ISC2 CISSP Official Practice Tests\*\*



&#x20;  \* Use to identify tested concepts, scenario patterns and common distractors



4\. \*\*CISSP Exam Prep 500+ Practice Questions\*\*



&#x20;  \* Use as supplementary coverage for topics and question styles



Supplement gaps with current authoritative online sources such as:



\* ISC2

\* NIST

\* CISA

\* CIS

\* OWASP

\* IETF RFCs

\* Official vendor documentation



The official study guide and current ISC2 exam outline take priority when sources conflict.



Do not publish the EPUB files, complete chapters or copied question banks. Generate original summaries, explanations, flashcards and practice questions.



\---



\## CISSP Content Structure



Organize all learning content around the eight CISSP domains.



For every domain, provide:



\* Domain overview

\* Official objectives

\* Key concepts

\* Plain-language explanation

\* Detailed technical explanation

\* Real-world enterprise examples

\* Management versus engineering perspective

\* Common exam traps

\* Closely related concept comparisons

\* Memory hooks

\* Flashcards

\* Scenario-based questions

\* Weakness assessment



Each concept page should follow this structure:



```text

Quick definition

→ Explain it simply

→ Technical explanation

→ Why CISSP cares

→ Real-world example

→ Manager perspective

→ Engineer perspective

→ Common exam trap

→ Related concepts

→ Memory hook

→ Knowledge check

```



Use IAM examples where relevant, including Entra ID, Active Directory, Okta and CyberArk, but cover all CISSP domains rather than overfocusing on identity.



\---



\## Two-Week Cram Mode



Ask the user for:



\* Exam date

\* Available weekday study hours

\* Available weekend study hours

\* Preferred study session length



Start with a mixed-domain diagnostic assessment.



Use the results to create an adaptive daily plan based on:



```text

Priority = Domain weight × Weakness × Question importance × Review urgency

```



Prioritize:



1\. High-confidence incorrect answers

2\. Weak high-weight domains

3\. Repeated misconceptions

4\. Scenario-based decision errors

5\. Overdue flashcards

6\. Low-confidence correct answers



Do not treat reading completion as mastery.



Each daily session should contain:



```text

Flashcard review

→ Weak-concept lesson

→ Comparison or scenario drill

→ Timed practice questions

→ Error review

→ Updated study recommendation

```



Include at least one CAT-style mock exam before the final review day.



\---



\## Core Features



\### Dashboard



Show:



\* Days until exam

\* Today’s study plan

\* Overall readiness

\* Weakest three objectives

\* Questions required today

\* Flashcards due

\* Latest scores

\* Recommended next action



\### Diagnostic Assessment



Assess all eight domains and produce:



\* Domain scores

\* Weak objectives

\* Misconception patterns

\* Initial study plan

\* Initial flashcard queue



\### Domain Lessons



Provide structured lessons with practical examples, comparisons and exam traps.



\### Practice Questions



Support:



\* Learn mode

\* Timed domain quizzes

\* Weakness drills

\* Mixed scenarios

\* Rapid ten-question drills

\* CAT-style simulation



Every question must explain:



\* Why the correct answer is best

\* Why every distractor is wrong

\* Which CISSP principle applies

\* Whether the question expects a management or technical perspective



Generate original questions. Do not reproduce questions from the supplied books.



\### Error Notebook



Automatically record:



\* Incorrect answer

\* Correct answer

\* Reasoning mistake

\* Concept gap

\* CISSP decision rule

\* Related lesson

\* Retest status



A mistake should only be resolved after the user answers a different question testing the same concept.



\### Flashcards



Use FSRS spaced repetition.



Support:



\* Definitions

\* Comparisons

\* Scenarios

\* Process sequences

\* Formulas

\* Cloze deletion

\* Misconception correction

\* Governance decisions



\### Ask CISSP



Implement local search across:



\* Lessons

\* Definitions

\* Comparisons

\* Examples

\* Flashcards

\* Questions

\* Source references



Return the closest relevant explanation and related practice material.



Do not embed an AI API key in the GitHub Pages application.



\---



\## Visual Design



Create a modern, minimalist interface inspired by Notion.



\### Design Principles



\* Content-first layout

\* Large readable typography

\* Generous whitespace

\* Minimal visual noise

\* Clear information hierarchy

\* Subtle borders instead of heavy shadows

\* Smooth but restrained interactions

\* Fast and distraction-free study flow



\### Visual Style



Use:



\* Warm white or light neutral background

\* Near-black primary text

\* Muted grey secondary text

\* One restrained accent colour

\* Rounded corners between 6px and 10px

\* Thin neutral borders

\* Soft hover states

\* Clean sans-serif typography

\* Monospace styling for formulas and technical terms



Avoid:



\* Large gradients

\* Glassmorphism

\* Excessive shadows

\* Bright dashboard colours

\* Gamification-heavy visuals

\* Decorative animations

\* Dense enterprise-style tables



\### Desktop Layout



Use a collapsible left sidebar containing:



```text

Dashboard

Study Plan

Domains

Practice

Flashcards

Error Notebook

Ask CISSP

Progress

Settings

```



The main content area should use a readable maximum width rather than stretching text across the entire screen.



Provide a contextual right panel for:



\* Table of contents

\* Related concepts

\* Sources

\* Progress

\* Notes



\### Mobile Layout



Use:



\* Single-column content

\* Collapsible navigation drawer

\* Sticky bottom navigation for major actions

\* Large touch targets

\* Sticky quiz submission controls

\* Swipe-safe flashcard controls

\* No horizontal scrolling



\### Key Components



Design reusable components for:



\* Domain cards

\* Objective progress rows

\* Concept pages

\* Callout blocks

\* Comparison tables

\* Question cards

\* Answer explanations

\* Flashcards

\* Progress indicators

\* Error notebook entries

\* Source citations

\* Daily plan items

\* Command palette



Add a command palette similar to Notion:



```text

Open domain

Search concept

Start flashcards

Start quick quiz

Resume study plan

View weak areas

```



\---



\## Technical Architecture



Use:



\* React

\* TypeScript

\* Vite

\* Tailwind CSS

\* IndexedDB with Dexie.js

\* Zod for content validation

\* FSRS for flashcard scheduling

\* Fuse.js or MiniSearch

\* Progressive Web App support

\* GitHub Actions

\* GitHub Pages



Store locally:



\* Exam date

\* Study schedule

\* Progress

\* Quiz attempts

\* Flashcard reviews

\* Notes

\* Error notebook

\* Readiness history



Provide:



\* JSON progress export

\* JSON progress import

\* Local reset

\* Offline access after first load



Ensure routing works correctly under a GitHub Pages repository subpath.



\---



\## Development Priority



Build this complete flow first:



```text

Open app

→ Enter exam date

→ Complete diagnostic

→ Identify weak domains

→ Generate today’s plan

→ Study one concept

→ Answer related questions

→ Review mistakes

→ Review flashcards

→ Save progress locally

```



Then implement in this order:



1\. EPUB processing and CISSP objective mapping

2\. Diagnostic assessment

3\. Daily adaptive study plan

4\. Lessons and comparison pages

5\. Practice question engine

6\. Error notebook

7\. Flashcards and FSRS

8\. CAT-style simulation

9\. Local Ask CISSP search

10\. Progress analytics and UI refinement



Prioritize reliable learning content and strong answer explanations over animations or a large number of low-quality questions.



