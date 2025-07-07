# Definitions

**Guestlist** - when someone organizes a club-like event, they usually sell tickets and have them checked at the door. But they also need a way of letting people in for free, for example as guests of the artists that are playing, business partners, family, close friends etc. These are registered on a guestlist, which is checked on the door along with tickets. This was traditionally done on paper

**Slots (free, half, skip) -** Sometimes people are put on the guestlist, but they still pay part of the price of a full price. If someone enters for free, it’s called “free” or “guestlist”, half is called “half” or “50%” and full price is called “skip” or “full” or “100%”. We sometimes write number of slots as “num_free/num_half/num_skip”, e.g. 7/0/3.(

**Check in** - When a guest arrives, either the security or the kasse will check them in, by crossing their name off the list or clicking them in an app.

**Client** - The

**Links (guestlist links) -**

**Recursive links -**

**Whitelabel -**

# Differentiating factors

- guestlist only (diff vs most systems, but
- better quality software (todo: elaborate here)
- input over natural language processing (telegram bot)
- recursive links (can split a link)
- transparent and fair pricing
- future: maybe good offline capabilities
- not integrated with a ticketing system or any other system (negative)
- content marketing articles
- instructions in links

# Apps and tech choices

- Web app (`guestlist-web`) - React/Next.js, Tailwind
- Mobile app (`guestlist-app`) - React Native, Expo
- Telegram bot (`guestxlist`) - grammY

# Integrations

it could make sense to integrate with some systems which make that possible, in particular ticketing systems. RA would be great, but they don’t have an API. Pretix is cool ticketing system that makes that possible via their open-source plugins system.

# Market & competition

### Market gap?

(TODO) Found very positive responses + not many systems that only do GL

### Why not paper?

(TODO) The baseline reference for a GL is paper. Scale problems: sync across multiple checkpoints (secu & kasse), updating during event, etc etc. On a tiny scale you don’t need a guestlist, because the person on the door knows who they should be letting in or will call.

### Competitors

1. **Book Me Tender ([https://www.bookmetender.com/](https://www.bookmetender.com/de))** - *"Booking-Tool. Event-Management. Papierlose Gästeliste. Personal- und Schichtenplanung. Maßgeschneidert für Clubs und Veranstalter.”*
    - currently seen as biggest competition (lots of Berlin clubs use it)
    - major difference vs this project: it’s an all-in-one software package with quite a few things, and guestlist is just one feature
    - pretty well done and popular
    - could not get access so far, they did not answer emails
    - app split and tech stack: not sure yet
    - known clients in Berlin: Klunkerkranich, Renate, Ritter Butzke, Tresor, Kater)

1. **RA (https://support.ra.co/article/19-guestlist) -** fka ****Resident Advisor, RA is the largest club event discovery platform in the world. They also offer ticketing, which a lot of clubs and promoters use, and a guestlist feature
    - if someone uses RA for ticketing they likley also want to use the guestlist feature
    - strange gap: the check-in app (RA Ticket Scan) is only for iOS, no Android (but there is something on the web for manual check-in)
    - TODO: use/investigate a bit more

2. **Nightlyst (**https://nightlyst.com/)
    - relatively small (only heard about it once)
    - very direct competitor in terms of market fit - the only one known so far that focuses on just guestlist

# AI GENERATED SECTION - PLEASE CONSIDER UNRELIABLE
## Overview

Guestlist Web is an invitation-based event management system designed for exclusive events, particularly focused on nightlife and party venues. The application manages guest lists through a controlled invitation link system, allowing event organizers to distribute access through partner organizations while maintaining strict capacity control.

## Target Users

### 1. Event Organizers (Primary Users)
- Create and manage multiple events
- Generate and distribute invitation links with specific quotas
- Monitor real-time guest registrations and check-ins
- Export guest data for reporting and analysis

### 2. Staff Members
- Receive bulk invitation links via Telegram integration
- Distribute links within their networks
- Act as ambassadors for the event

### 3. Guests (End Users)
- Access events through exclusive invitation links
- Register themselves and companions
- Choose from available ticket tiers

## Core Business Value

The system solves critical challenges in exclusive event management:

1. **Access Control** - Ensures only invited guests can register, maintaining event exclusivity
2. **Capacity Management** - Prevents overselling through real-time slot tracking and limits
3. **Partner Distribution** - Allocates specific quotas to different organizations/partners
4. **Operational Efficiency** - Automates link distribution and provides real-time analytics

## Key Features

### Event Management
- Multi-event support with owner-based access control
- PIN-protected events for additional security
- Real-time guest count tracking

### Invitation System
- Unique links with configurable limits per ticket type
- Organization-specific allocations (e.g., different companies get different quotas)
- Three-tier ticketing: Free entry, Half-price, Skip-queue

### Guest Experience
- Simple, frictionless registration process
- Real-time availability display
- Ability to add companions in a single registration

### Analytics & Operations
- Live dashboard with guest counts and link usage
- CSV export for guest lists
- Check-in tracking at venue doors
- Telegram integration for automated link distribution

## Business Model

The application operates on a **B2B2C model**:
- **B2B**: Event organizers allocate invitation quotas to partner organizations
- **B2C**: Partner organizations distribute links to their networks
- **Direct**: Staff members can also distribute links directly

## Use Case Example

A typical workflow for a nightclub event at TXL Airport (Berlin):
1. Organizer creates event with 1000 total capacity
2. Allocates 100 free entries to "Company A", 50 half-price to "Company B"
3. Links are distributed to company representatives via Telegram
4. Representatives share links with their employees/contacts
5. Guests register through the links until quotas are filled
6. Door staff use the real-time count page to manage entry
7. Post-event analytics show which partners drove attendance

## Market Context

This system is particularly valuable for:
- **Exclusive nightlife events** requiring controlled access
- **Corporate event partnerships** where companies receive guest allocations
- **Venues with strict capacity limits** needing real-time tracking
- **Events with tiered pricing** offering different access levels

The focus on TXL Airport as a venue and the skip-queue feature suggests a primary use case in Berlin's electronic music and nightlife scene, where exclusive access and queue management are critical operational concerns.
