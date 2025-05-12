# CLAUDE.md - AI Assistant Guidelines

## Build & Development Commands
- Build: `npm run build`
- Dev server: `npm run dev`
- Typecheck: `npm run typecheck`
- Lint: `npm run lint`
- Format: `npm run format`
- Test all: `npm run test`
- Test single file: `npm run test -- path/to/file.test.ts`
- Publish: `npm publish`

## Code Style Guidelines
- **Formatting**: Use Prettier with 2-space indentation
- **Types**: Use TypeScript with strict mode, explicitly export types
- **Imports**: Group imports by category - external, internal, types
- **Naming**: camelCase for variables/functions, PascalCase for components/interfaces
- **Components**: Use functional components with named exports
- **Error Handling**: Use try/catch with proper error propagation
- **Documentation**: Use JSDoc comments for functions and interfaces
- **CSS**: Use namespaced classNames with `famousai-` prefix

## Project Structure
- `/src`: Source code
  - `/components`: React components for rendering FAQs
  - `/lib`: Utility functions and hooks
  - `/types`: TypeScript type definitions
  - `/styles`: CSS styles
- `/examples`: Usage examples for Next.js applications
- `/dist`: Compiled output (generated)