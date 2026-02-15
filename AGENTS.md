# AGENTS.md

## Coding Standards & Conventions

### 1. File Structure
- Components: `src/components/`
- Scenes: `src/scenes/<topic>/`
- Data/Constants: `src/data/`
- Shared 3D Utilities: `src/components/3d/` (Create this if it doesn't exist)
- CSS: `src/index.css` (Use CSS variables for theming)

### 2. React + TypeScript
- Use functional components with hooks.
- Use strict TypeScript types. Avoid `any`.
- Define prop interfaces clearly.
- Use `useRef` for Three.js object references.
- Use `useMemo` for heavy computations (geometries, complex calculations).

### 3. Three.js / React Three Fiber (R3F)
- Use `@react-three/drei` for common helpers (OrbitControls, Text, Line).
- Always dispose of geometries and materials explicitly if not handled by R3F (R3F usually handles basic disposal, but be mindful of custom textures/complex objects).
- Use `useFrame` for animations. Keep logic inside `useFrame` minimal to maintain 60fps.
- Group logical units (e.g., an arrow with a label) into their own components.

### 4. Accessibility (a11y)
- All interactive elements must be keyboard accessible.
- 3D Canvases should have `aria-label` describing the scene content.
- Provide alternative text/descriptions for complex visualizations.

### 5. Performance
- Minimize object creation inside `useFrame`.
- Use instanced meshes for repeated geometry (e.g., many particles).
- Optimize lighting (limit dynamic lights, bake shadows if possible).

## Project Overview

This project is a React application using Vite and React Three Fiber to visualize mathematical concepts in 3D.
It is organized by topics (Linear Algebra, Calculus, Probability, ML).

### Core Components
- `App.tsx`: Main router and layout.
- `Sidebar.tsx`: Navigation.
- `SubtopicView.tsx`: Wrapper for individual 3D scenes.
- `src/scenes/`: Contains the actual visualization logic.

## Contribution Workflow
1. Create a new branch.
2. Implement feature/fix.
3. Verify with `npm run lint` and `npm run build`.
4. Ensure accessibility checks pass.
5. Create a Pull Request.
