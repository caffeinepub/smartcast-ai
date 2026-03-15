# SmartCast AI

## Current State
Full-stack predictive maintenance platform with:
- Navbar with colored text links
- Hero section showing 40% downtime reduction
- Impact section with stats including "Average alert-to-response time"
- Contact section with email smartcast@hackathon.dev
- Profile modal with authorities management (add/remove)
- Dashboard accessible only when logged in
- Machine detail showing sensor readings
- No team section (was removed in v11)

## Requested Changes (Diff)

### Add
- Team page/section with members: S Sharan (AI&DS Student), S Shivaram (AI&DS Student), N Krishiv (AI&DS Student), M Abishek (AI&DS Student)
- Team link in navbar
- Profile edit option (inline edit for name, company, role, phone in profile modal)
- Authorities as a separate column/section with their own email and mobile number fields (not compulsory); editable at any time

### Modify
- Downtime reduction stat: change all instances of 40% to 30%
- Navbar text/link color: change to black
- Contact email: change from smartcast@hackathon.dev to smartcastai@gmail.com
- Newly added machines must show: temp, vibration, pressure, oil level, RPM, electricity, since inspection fields
- Alert system: alerts reach authorities via their email and mobile, AND show on dashboard as indicator
- Dashboard: accessible only when logged in (already implemented, confirm/reinforce)
- Authorities: separate column layout with name, email (optional), mobile (optional); editable anytime

### Remove
- "Average alert-to-response time" stat from the Impact section

## Implementation Plan
1. Change all "40%" downtime references to "30%"
2. Update navbar link text color to black
3. Change contact email to smartcastai@gmail.com
4. Remove "Average alert-to-response time" from impact stats
5. Add Team section with 4 members (AI&DS Students)
6. Add Team nav link
7. Add profile edit option in profile modal (edit name, company, role, phone)
8. Update authorities UI to a separate column layout with name, email (optional), mobile (optional); inline edit capability
9. Ensure newly added machines include sensor fields: temp, vibration, pressure, oil level, RPM, electricity, since inspection
10. Ensure dashboard alert panel and authorities notification are both active on machine issues
