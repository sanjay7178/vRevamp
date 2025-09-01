# Contributing to vRevamp 🤝

Thank you for your interest in contributing to vRevamp! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Contributing Guidelines](#contributing-guidelines)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Issue Reporting](#issue-reporting)
- [Community and Support](#community-and-support)

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please be respectful and considerate in all interactions.

### Expected Behavior
- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites
- **Google Chrome** browser (latest version recommended)
- **Git** for version control
- **Text Editor** (VS Code, Sublime Text, etc.)
- Basic knowledge of **JavaScript**, **HTML**, and **CSS**
- Familiarity with **Chrome Extension APIs** (helpful but not required)

### First Contribution
1. 🍴 **Fork** the repository
2. 🌿 **Clone** your fork locally
3. 🔧 **Set up** the development environment
4. 🐛 **Find an issue** to work on or 💡 **propose a new feature**
5. 🚀 **Start coding**!

## Development Environment

### Setup Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/vRevamp.git
   cd vRevamp
   ```

2. **Load Extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the cloned `vRevamp` folder
   - The extension will appear in your extensions list

3. **Development Workflow**
   - Make code changes
   - Click the "Reload" button on the extension card in `chrome://extensions/`
   - Test your changes on VTOP pages

### Project Structure

```
vRevamp/
├── manifest.json              # Extension configuration
├── js/                       # JavaScript modules
│   ├── attendance.js         # Attendance tracking functionality
│   ├── marks_page.js         # Marks page enhancements
│   ├── exam_schedule.js      # Calendar integration
│   ├── captcha/              # Captcha automation
│   ├── modules/              # Utility modules
│   ├── store/                # Data storage utilities
│   ├── timetable/            # Timetable features
│   └── ...
├── css/                      # Stylesheets
│   ├── table.css             # Table styling
│   └── nav-custom-div.css    # Navigation styling
├── html/                     # HTML files
│   ├── popup.html            # Extension popup
│   └── ...
├── assets/                   # Icons and images
│   └── icons/                # Extension icons
├── service_worker/           # Background scripts
└── testing/                  # Test files
```

## Contributing Guidelines

### Types of Contributions

We welcome various types of contributions:

- 🐛 **Bug fixes**
- ✨ **New features**
- 📚 **Documentation improvements**
- 🎨 **UI/UX enhancements**
- ⚡ **Performance optimizations**
- 🧪 **Tests**

### Before You Start

1. **Check existing issues** to avoid duplicate work
2. **Open an issue** to discuss major changes before implementing
3. **Search existing pull requests** to see if someone is already working on it

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the coding standards below
   - Test your changes thoroughly
   - Update documentation if needed

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your descriptive commit message"
   ```

## Coding Standards

### JavaScript Guidelines

- **Use ES6+ features** where appropriate
- **Follow camelCase** for variable and function names
- **Use meaningful variable names**
- **Add comments** for complex logic
- **Keep functions small** and focused on single responsibility
- **Use `const` and `let`** instead of `var`

#### Example
```javascript
// Good
const calculateAttendancePercentage = (presentClasses, totalClasses) => {
    if (totalClasses === 0) return 0;
    return Math.round((presentClasses / totalClasses) * 100);
};

// Avoid
var calc = function(p, t) {
    return Math.round((p/t)*100);
}
```

### CSS Guidelines

- **Use consistent naming** conventions (prefer kebab-case)
- **Organize styles** logically
- **Avoid inline styles** when possible
- **Use CSS custom properties** for repeated values
- **Comment complex styles**

#### Example
```css
/* Good */
.attendance-calculator {
    background-color: var(--primary-color);
    border-radius: 8px;
    padding: 16px;
}

.attendance-calculator__percentage {
    font-weight: bold;
    color: var(--text-color);
}
```

### HTML Guidelines

- **Use semantic HTML** elements
- **Include proper attributes** (alt text, aria labels, etc.)
- **Maintain consistent indentation**
- **Use descriptive class names**

## Testing

### Manual Testing

Before submitting your changes:

1. **Load your extension** in Chrome development mode
2. **Navigate to VTOP** and test affected functionality
3. **Test on different VTOP pages** (attendance, marks, exam schedule, etc.)
4. **Verify no console errors** appear
5. **Test edge cases** (empty data, network failures, etc.)

### Testing Checklist

- [ ] Extension loads without errors
- [ ] All existing features still work
- [ ] New features work as expected
- [ ] No console errors or warnings
- [ ] Proper error handling for edge cases
- [ ] Cross-browser compatibility (if applicable)

### Browser Testing

Test your changes on:
- **Latest Chrome version**
- **Chrome Beta** (if available)
- Different **screen resolutions**
- **VTOP pages** you're modifying

## Submitting Changes

### Pull Request Process

1. **Update your fork**
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Rebase your feature branch**
   ```bash
   git checkout feature/your-feature-name
   git rebase main
   ```

3. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create pull request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your feature branch
   - Fill out the PR template

### Pull Request Guidelines

#### Title Format
Use conventional commit format:
- `feat: add exam schedule export feature`
- `fix: resolve attendance calculation bug`
- `docs: update installation instructions`
- `style: improve navigation bar design`

#### Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Style/UI improvement
- [ ] Performance optimization

## Testing
- [ ] Tested on VTOP pages
- [ ] No console errors
- [ ] Existing features still work

## Screenshots (if applicable)
Add screenshots showing the changes

## Related Issues
Closes #123
```

### Review Process

1. **Automated checks** will run
2. **Maintainers will review** your code
3. **Address feedback** if requested
4. **Merge** once approved

## Issue Reporting

### Before Creating an Issue

1. **Check existing issues** for duplicates
2. **Update to latest version** and test again
3. **Try in incognito mode** to rule out conflicts

### Issue Types

#### Bug Reports
Use the bug report template and include:
- **Clear description** of the problem
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Browser and extension version**
- **Console errors** (if any)
- **Screenshots** (if helpful)

#### Feature Requests
Include:
- **Problem statement** - what issue does this solve?
- **Proposed solution**
- **Alternative solutions** considered
- **Use cases** and examples

#### Enhancement Suggestions
Include:
- **Current behavior**
- **Suggested improvement**
- **Benefits** of the change
- **Implementation ideas** (optional)

## Community and Support

### Getting Help

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Documentation**: Check the README and this contributing guide

### Recognition

Contributors will be:
- **Listed** in our contributors section
- **Mentioned** in release notes for significant contributions
- **Invited** to provide input on project direction

## Release Process

### Versioning

We follow semantic versioning (semver):
- **Major** (X.0.0): Breaking changes
- **Minor** (0.X.0): New features
- **Patch** (0.0.X): Bug fixes

### Release Notes

Each release includes:
- **New features**
- **Bug fixes**
- **Performance improvements**
- **Breaking changes** (if any)
- **Contributor acknowledgments**

---

## Questions?

Don't hesitate to reach out if you have questions! We're here to help and appreciate your contributions to making vRevamp better for all VIT students.

**Happy coding! 🚀**