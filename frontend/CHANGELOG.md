# Frontend Changelog

## [0.17.0] - 2025-01-07 - Feature Redesign: Separate Tools

### Added
- New CitationFormatter component for batch citation formatting
- Tab navigation system with "Verify References" and "Format Citations" tabs
- Dedicated citation formatting interface with style selection (APA, MLA, Chicago, Harvard)
- Copy functionality for individual citations and bulk copy for all results
- Loading states and error handling for formatting operations

### Changed
- Main title changed from "Verify Your References" to "Reference Tools"
- Updated subtitle to reflect dual functionality
- Simplified ResultCard component - removed all formatting display functionality
- Copy button in results now copies the original reference text
- Clean separation between verification and formatting features

### Removed
- Format selector dropdown from verification results
- Formatted citation display from verification results
- Complex citation formatting logic from ResultCard
- selectedFormat state and related formatting UI

## [0.16.0] - 2025-01-07 - Critical Format Display Fix

### Added
- Fallback citation formatting system for when backend formatting is unavailable
- Always-available format selector for verified references
- Enhanced error handling for missing formatted data

### Changed
- Format display logic: now always shows format options for verified references
- Fallback generation: creates basic APA/MLA/Chicago/Harvard formats from original reference
- Copy functionality: uses fallback formats when backend formatting unavailable

### Fixed
- **Critical**: Format selector now always appears for verified references
- **Critical**: Formatted citations always display, even when backend formatting fails
- Missing formatted data no longer results in empty citation sections
- Improved resilience when Gemini API is unavailable

## [0.15.0] - 2025-01-07 - UI Polish & Functionality Fixes

### Added
- Green apple magnifier icon for Verify button
- Proper z-index and positioning for dropdown selectors
- Enhanced cache system to include formatted citation data

### Changed
- Header: improved two-sided alignment with flex-1 on left side
- Input border: lightened focus colors (gray-200 to gray-400)
- Results layout: redesigned with grid system for better proportions
- Card layout: horizontal emphasis with reduced vertical padding (py-4)
- Typography: smaller, more readable fonts throughout results
- Format selector: replaced shadcn Select with native select for better control
- Citation display: improved styling with gray backgrounds and borders

### Fixed
- Dropdown overlay issues with proper native select implementation
- Cache formatting: now properly stores and retrieves formatted citations
- Results card proportions: wider horizontally, shorter vertically
- Text hierarchy: better font sizes and spacing for readability

## [0.14.0] - 2025-01-07 - Layout Optimization & Visual Improvements

### Changed
- Header layout: removed container constraints for full-width header with edge-positioned content
- Main content: expanded max-width to max-w-6xl for better horizontal space utilization
- Increased top spacing: changed from pt-12 to pt-20 for better vertical balance
- Enhanced title spacing: increased bottom margin from mb-6 to mb-8
- Improved subtitle spacing: increased bottom margin from mb-12 to mb-16
- "Ensure" text styling: changed to text-gray-700 font-semibold for subtle black bold appearance

### Removed
- Card wrapper around input section for cleaner appearance
- Alert component borders, replaced with custom yellow background styling
- Unnecessary container constraints in header

### Fixed
- Header text positioning now properly aligned to screen edges
- Better visual hierarchy with improved spacing throughout
- Cleaner Note section styling with yellow background instead of bordered alert

## [0.13.0] - 2025-01-07 - Standard Template Layout Redesign

### Added
- Restored Note section with original Alert formatting
- Standard card-based layout for input section
- Proper spacing hierarchy throughout application

### Changed
- Redesigned layout to follow standard template structure
- Adjusted container max-width from max-w-6xl to max-w-4xl for better proportions
- Increased main content padding back to py-12
- Enhanced typography with proper theme color usage (text-foreground, text-muted-foreground)
- Improved card-based design with proper CardContent wrapper
- Updated button styling to use theme colors (bg-primary)
- Better spacing between sections using space-y-8
- Reduced progress bar height to h-2 for cleaner appearance
- Improved verification results header layout with better alignment

### Fixed
- Overall visual hierarchy and proportions
- Consistent spacing throughout the application
- Theme color consistency across all components

## [0.12.0] - 2025-01-07 - Final Format & Layout Fixes

### Added
- Added back "Ensure your academic citations are accurate and properly formatted" subtitle
- Force display of formatted citations for all verified references

### Changed
- Reduced top padding from py-12 to py-8 (20% reduction)
- Adjusted main title from text-5xl to text-4xl and added mb-4 for better spacing
- Removed Note alert section completely
- Improved description text spacing with mb-4 instead of mb-6
- Replaced "Gemini AI" with "CrossRef" in description text

### Fixed
- Format display issue: verified references now always show formatted citations
- Verify button loading state: maintains black background and white text during verification
- Spinner icon color changed to white for better visibility

## [0.11.0] - 2025-01-07 - Final UI Refinements

### Added
- Enhanced format selector with better single/multiple format handling
- Improved citation display logic for better reliability

### Changed
- Description text: changed to black color, moved closer to main title
- Layout dimensions: increased to max-w-6xl (horizontal +10%), textarea height to 156px (vertical +30%)
- New Verification button: black background with white text and font-semibold
- Removed Card wrapper from input area (no visible border)

### Removed
- "Ensure your academic citations are accurate and properly formatted" sentence completely deleted
- Card border and background from main input area

### Fixed
- Format selector now properly handles single format cases
- Better fallback logic for formatted citations display

## [0.10.0] - 2025-01-07 - Visual Alignment & Layout Fixes

### Changed
- Layout width: expanded from max-w-3xl to max-w-5xl for better horizontal space utilization
- Textarea dimensions: reduced height from 200px to 120px, increased width significantly
- Main title: enhanced to text-5xl font-bold with explicit text-black color
- Description text: updated to text-lg text-muted-foreground for proper shadcn styling
- Format selector: improved layout structure and added debug logging

### Fixed
- Input area proportions now properly balanced (wide but not too tall)
- Typography styles now match shadcn/ui design specifications exactly
- Format selector display logic reorganized for better reliability

## [0.9.0] - 2025-01-07 - Zero-Tolerance Punch List

### Added
- Shadcn/ui compliant main title with scroll-m-20 and font-extrabold classes
- Proper secondary button variant for "New Verification"

### Changed
- Main title updated to h1 with shadcn typography classes (scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl)
- Removed secondary title "Enter Your References" completely
- Updated description text to use shadcn subtitle classes (text-xl leading-7)
- Changed "not" to "NOT" (uppercase) in Note section for emphasis
- Reduced textarea min-height from 256px to 200px for better proportion
- Verify button: black background, white text, removed emoji icon
- New Verification button changed from outline to secondary variant

### Fixed
- Typography hierarchy now matches shadcn/ui design specifications exactly
- Visual proportions optimized for deployment-ready state

## [0.8.0] - 2025-01-07 - Final Polish

### Added
- Loading state for Verify button with animated spinner and "Verifying..." text
- Sticky header with improved backdrop blur and z-index
- Proper HTML bold formatting for Markdown text in alerts

### Changed
- Layout proportions: reduced max-width from 4xl to 3xl for better visual balance
- Enhanced button loading state with professional spinner animation
- Fixed Note content formatting: **not** now displays correctly in bold

### Fixed
- Backend cache format selector bug: cached results now properly include all format options
- Visual hierarchy and proportion issues throughout the application

## [0.7.0] - 2025-01-07

### Added
- Status badges with rounded background colors for better visual hierarchy
- Z-index wrapper for Select dropdown to prevent overlap issues
- Enhanced typography with larger headings (text-4xl)

### Changed
- Cancel button from destructive to outline variant for better visual hierarchy
- Removed colorful left borders from result cards, now using uniform shadcn/ui style
- Status display now uses badge-style indicators instead of colored text
- Increased main content padding from py-8 to py-12
- Enhanced card title to text-2xl with semibold weight

### Fixed
- Select dropdown menu overlap issue with z-10 positioning
- Visual inconsistency with shadcn/ui design language

## [0.6.0] - 2025-01-07

### Added
- Enhanced shadow effects on cards (shadow-md, shadow-xl)
- Button hover scale animation (transform hover:scale-105)
- Transition animations on all interactive elements

### Changed
- Global background from pure white to subtle gray (bg-gray-50/50)
- Header and footer with white background and proper shadows
- Primary button to black background with white text
- Cancel button from destructive to outline variant
- Format selector: removed "Formatted Citation" label for cleaner UI
- Copy button changed to ghost variant
- Status colors to deeper shades (emerald-600, rose-600, amber-600)
- Typography: increased heading sizes (text-4xl) and improved hierarchy
- Card backgrounds explicitly set to white for better contrast

### Fixed
- Button color transition issue (removed emoji, cleaner state changes)
- Overall visual density with increased padding and spacing

## [0.5.0] - 2025-01-07

### Added
- Visual alignment with shadcn/ui design language
- Hover shadow effects on cards and buttons
- Relative positioning wrapper for Select dropdown

### Changed
- Applied `text-foreground` globally in App.jsx
- ReferenceInput.jsx: Added subtle shadows and muted borders to Card
- ReferenceInput.jsx: Increased textarea bottom margin for better spacing
- ResultCard.jsx: Replaced full border backgrounds with left border indicators
- ResultCard.jsx: Reorganized internal layout with improved vertical spacing
- ResultCard.jsx: Enhanced citation format area with softer colors and rounded corners

### Fixed
- Select dropdown menu overlap issue in ResultCard
- Visual density issues with better spacing throughout

## [0.4.0] - 2025-01-07

### Added
- Modern header with gradient text effect in App.jsx
- Footer with copyright and shadcn/ui attribution

### Changed
- Refactored ReferenceInput.jsx to use Card, Button, Textarea, and Alert components from shadcn/ui
- Refactored ResultCard.jsx to use Card, Select, and Button components from shadcn/ui
- Refactored VerificationResults.jsx to use Button component and theme colors
- Updated all text colors to use theme variables (text-foreground, text-muted-foreground)
- Updated background colors to use theme variables (bg-primary, bg-secondary, bg-muted)
- Simplified Select component usage with native HTML select

### Fixed
- Build error with Select component imports

## [0.3.0] - 2025-01-07

### Added
- Shadcn/ui infrastructure setup with components.json
- CSS variables theme system for light/dark mode support
- Core shadcn/ui components: Button, Card, Textarea, Select, Alert
- Vite path alias configuration (@/ imports)
- lib/utils.js with cn() utility function
- tailwindcss-animate plugin for animations

### Changed
- Updated tailwind.config.js to support shadcn/ui requirements
- Enhanced index.css with CSS variable definitions
- Added Vite resolve alias configuration

## [0.2.0] - 2025-01-07

### Added
- Format selector dropdown for switching between citation styles
- Support for displaying multiple citation formats (APA, MLA, Chicago, Harvard)
- Dynamic format detection based on backend response

### Changed
- Copy button now copies the currently selected format
- Citation display shows selected format name in copy button tooltip

## [0.1.0] - 2025-01-07

### Added
- APA citation display for verified references in ResultCard component
- Copy button for formatted citations with visual feedback
- Elegant UI design for citation display section
- Support for displaying formattedAPA field from backend

### Changed
- ResultCard now uses React hooks (useState) for copy functionality
- Enhanced user experience with one-click citation copying

### Fixed
- Error display UI when backend verification fails
- Support for 'ambiguous' and 'error' status display with appropriate icons

## [0.0.2] - 2025-01-06

### Added
- Real-time streaming support for reference verification using Server-Sent Events (SSE)
- Progress bar showing verification progress percentage
- Cancel button to abort ongoing verification
- Automatic switching between batch and streaming modes based on reference count
- Real-time result updates as each reference is processed

### Changed
- Updated Zustand store to support streaming operations and progress tracking
- Enhanced API service with SSE client implementation
- Improved user experience for processing large batches of references

## [0.0.1] - 2025-01-06

### Added
- 初始项目设置
- React + Vite 开发环境
- Tailwind CSS 配置
- 基础项目结构
- 参考文献输入界面
- 验证结果展示组件
- 结果卡片组件（不同状态不同颜色）
- Zustand状态管理
- API服务集成