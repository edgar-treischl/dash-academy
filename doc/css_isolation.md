# CSS Isolation Between Shell and Microfrontends


## Objective

Prevent CSS conflicts between the Shell application and React Microfrontends (MFEs) in our Vite Module Federation architecture.

Ensure that styles defined by one application cannot unintentionally override styles belonging to another application.

## Requirements

1. MFE CSS namespacing
Every MFE must have a unique root CSS namespace, following the existing .mfe-appname convention.
MFE global styles must be scoped under their respective root namespace.
Avoid unscoped global selectors such as body, html, button, h1, * and :root.

2. CSS Modules
Use CSS Modules (*.module.css) for component-level styles.
Avoid globally defined component classes.
Ensure styles remain locally scoped within each application.

3. Shell CSS protection
Shell styles must not be affected by MFE-specific styles.
The Shell remains responsible for global resets, typography defaults and shared design tokens.
MFEs must not override global Shell styles.

4. Naming conventions
Use BEM naming conventions for global CSS classes.
Prefix global classes with the respective application namespace.
Avoid generic class names such as .header, .container or .button.

5. CSS Cascade Layers
Evaluate the use of CSS Cascade Layers to establish predictable styling precedence.
Ensure all participating styles follow the agreed layering convention.


## Acceptance Criteria
- MFE styles cannot unintentionally override Shell styles.
- Shell styles cannot unintentionally override MFE component styles.
- Multiple MFEs can run simultaneously without CSS naming conflicts.
- Global MFE styles are scoped to their respective .mfe-appname root.
- Component styles use CSS Modules wherever possible.
- Existing functionality and visual appearance remain unchanged.
- CSS loading order does not introduce unexpected styling regressions.


## Expected Outcome

A consistent CSS isolation strategy across the Shell and all React MFEs, using CSS Modules, application-level namespaces and BEM conventions where appropriate.