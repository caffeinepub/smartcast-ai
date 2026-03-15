# SmartCast AI

## Current State
The app is a multi-section marketing/showcase website for SmartCast AI (AI-based predictive maintenance for die casting machines). It includes Hero, Problem Statement, AI Solution, How It Works, Dashboard, Business Impact, Technology, Future Scope, Team, and Contact sections. There is no authentication.

## Requested Changes (Diff)

### Add
- Login button in the navbar that triggers Internet Identity authentication
- Logout button visible when user is logged in (replace Login button)
- Display logged-in user's principal/identity in the navbar when authenticated
- Use the `authorization` Caffeine component for ICP Internet Identity login/logout

### Modify
- Navbar: add Login/Logout controls on the right side

### Remove
- Nothing removed

## Implementation Plan
1. Wire the `useAuth` hook from the authorization component into the navbar
2. Add a Login button that calls `login()` when user is not authenticated
3. Add a user avatar/principal display + Logout button that calls `logout()` when authenticated
4. Show a loading state while auth is being checked
