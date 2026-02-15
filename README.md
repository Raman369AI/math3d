# Math3D - Interactive 3D Mathematics

Math3D is an interactive educational platform designed to visualize complex mathematical concepts using 3D graphics. Built with **React**, **TypeScript**, and **React Three Fiber**, it offers an immersive way to explore Linear Algebra, Calculus, Probability, and Machine Learning.

## Features

- **Interactive 3D Visualizations**: Rotate, zoom, and interact with mathematical objects.
- **Topic-Based Organization**: Structured curriculum covering key mathematical fields.
- **Responsive Design**: Accessible on desktop and mobile devices.
- **Performance Optimized**: Uses WebGL for high-performance rendering.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd math3d
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:5173`.

## Project Structure

```
src/
├── components/       # UI components (Sidebar, Layout, etc.)
│   └── 3d/           # Shared 3D components (Arrow, Axis, Label)
├── data/             # Topic definitions and static data
├── scenes/           # 3D visualization scenes grouped by topic
│   ├── linear-algebra/
│   ├── calculus/
│   ├── probability/
│   └── ml/
├── App.tsx           # Main application entry point
└── index.css         # Global styles and themes
```

## Technologies

- **Vite**: Fast build tool and dev server.
- **React**: UI library.
- **React Three Fiber (R3F)**: React renderer for Three.js.
- **Three.js**: 3D graphics library.
- **TypeScript**: Static typing for safer code.
- **Tailwind CSS / CSS Modules**: (Inferred usage based on class names, though `index.css` suggests custom CSS).

## Contributing

Please refer to `AGENTS.md` for coding standards and architectural guidelines.

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License.
