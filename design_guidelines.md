# Ski Resort Weather Comparison - Design Guidelines

## Design Approach
**Reference-Based + Glassmorphism**: Inspired by Apple Weather's data visualization + premium ski resort apps (Powder, SkiTracks). Glassmorphism provides depth while maintaining readability for weather data.

## Typography
- **Headings**: Inter or SF Pro Display - Bold (700) for resort names, Semi-bold (600) for metric categories
- **Data Values**: Tabular numbers, Medium (500), larger sizes (2xl-4xl) for key metrics
- **Labels**: Regular (400), smaller sizes (sm-base) for descriptions

## Layout System
**Spacing**: Tailwind units of 2, 4, 6, 8, 12, 16 for consistent rhythm
- Mobile: Single column, vertical stack
- Desktop: Two-column comparison (grid-cols-2 gap-6)
- Container: max-w-7xl, generous padding (px-6 lg:px-8)

## Component Structure

### Hero Section
**Mountain Background Image**: Panoramic ski slope photo with fresh powder, blue sky, dramatic peaks. Full-width, height ~40vh. Apply subtle gradient overlay (top-to-bottom, dark fade) for text contrast.

### Resort Selector Cards (Glassmorphism)
Two prominent glass-effect selection cards positioned over hero:
- Semi-transparent background (backdrop-blur-xl)
- Subtle border with low opacity
- Rounded corners (rounded-2xl)
- Each card contains dropdown/search for resort selection
- Displays selected resort name prominently
- "Compare" button between cards with blur background when over image

### Comparison Grid Layout
Split into themed sections, each with glass card treatment:

**1. Current Conditions Section**
- Large temperature display
- Weather icon (snow, sunny, cloudy)
- Wind speed with direction arrow
- Visibility metric
- "Last updated" timestamp

**2. Snow Report Card**
- 24hr snowfall (prominent)
- 7-day total
- Base depth
- Snow quality indicator (powder, packed, icy)

**3. Forecast Strip**
5-day horizontal scroll:
- Daily high/low temps
- Precipitation probability
- Weather icons
- Small snowfall prediction

**4. Trail Status Grid**
- Open/Total runs ratio
- Lift status (operating/total)
- Terrain difficulty breakdown (beginner/intermediate/advanced)
- Progress bars with glass styling

**5. Details Matrix**
Two-column comparison table:
- Summit/Base elevation
- Vertical drop
- Season pass pricing
- Parking availability
- Lodge amenities

## Glassmorphism Implementation
- Background: rgba with ~10-15% opacity
- Backdrop filter: blur(16px) saturate(180%)
- Border: 1px solid rgba(255,255,255,0.18)
- Box shadow: Soft, elevated (0 8px 32px rgba(0,0,0,0.1))
- Internal padding: p-6 to p-8

**Dark Mode Adjustments**:
- Reduce background opacity to ~8%
- Border: rgba(255,255,255,0.08)
- Text: white/gray-100 for primary, gray-400 for secondary
- Stronger backdrop blur (20px) for depth

## Visual Enhancements
- Weather condition icons: Animated Lottie files or SVGs from Heroicons
- Snowflake micro-interactions on hover (subtle)
- Smooth transitions between resort selections
- Data value changes animate with slide/fade
- Gradient accents for temperature ranges (cool blues to warm reds)

## Images Section
**Hero Background**: Wide panoramic ski resort image, 1920x800px minimum. Should show:
- Fresh snow conditions
- Mountain peaks
- Skiers in action (optional, adds energy)
- Crisp, high-quality photography
- Natural lighting (sunrise/golden hour preferred)

Position: Top of page, spans full width, fixed/parallax scroll optional for depth