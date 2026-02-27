# Update Blog Detail UI - Implementation Plan

## 📋 Overview
Add real-time information panel to PostDetail page with clock, weather widget, and gold price chart using mock data and interval updates.

## 🔧 Files to Modify/Create

### New Files
- `client/src/components/post/RealtimeClock.tsx` - Auto-updating clock component
- `client/src/components/post/RealtimeClock.test.tsx` - Clock unit tests
- `client/src/components/post/WeatherWidget.tsx` - Weather display with mock data
- `client/src/components/post/WeatherWidget.test.tsx` - Weather unit tests
- `client/src/components/post/GoldPriceChart.tsx` - Gold price chart using recharts
- `client/src/components/post/GoldPriceChart.test.tsx` - Chart unit tests
- `client/src/components/post/PostInfoPanel.tsx` - Container for all three widgets
- `client/src/components/post/PostInfoPanel.test.tsx` - Panel unit tests
- `client/src/types/index.ts` - Add WeatherData, GoldPrice, PricePoint interfaces

### Modified Files
- `client/src/components/post/PostHeader.tsx` - Add PostInfoPanel above post title
- `client/src/components/post/PostHeader.test.tsx` - Add test for PostInfoPanel rendering
- `client/src/components/post/index.ts` - Export new components
- `client/src/App.css` - Add styles for info panel and widgets
- `client/package.json` - Add recharts dependency

## 🚀 Implementation Steps
1. Install dependencies: `cd client && npm install recharts`
2. Add type definitions to `client/src/types/index.ts`
3. Create RealtimeClock component + tests (TDD)
4. Create WeatherWidget component + tests (TDD)
5. Create GoldPriceChart component + tests (TDD)
6. Create PostInfoPanel component + tests (TDD)
7. Update PostHeader to include PostInfoPanel + tests
8. Export new components in index.ts
9. Add CSS styles for responsive design
10. Run all 3 test suites: backend unit, frontend unit, E2E

## ⚠️ Risks
- **Multiple intervals**: Use proper useEffect cleanup to prevent memory leaks
- **Test timer mocking**: Use `vi.useFakeTimers()` for interval testing
- **Mobile layout**: Stack widgets vertically using CSS Grid on small screens
- **Chart bundle size**: Recharts adds ~100KB, acceptable for this feature
- **Coverage**: Ensure 100% coverage with proper mocking of intervals and chart components

