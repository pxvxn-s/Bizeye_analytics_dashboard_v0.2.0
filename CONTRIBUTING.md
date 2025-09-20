# Contributing to BIZEYE

Thank you for your interest in contributing to BIZEYE! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### 1. Fork the Repository
- Fork the repository on GitHub
- Clone your fork locally
- Set up the development environment

### 2. Development Setup

#### Backend Setup
```bash
cd back-end
pip install -r requirements.txt
python app.py
```

#### Frontend Setup
```bash
cd front-end
npm install
npm start
```

### 3. Create a Branch
```bash
git checkout -b feature/your-feature-name
```

### 4. Make Changes
- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Test your changes thoroughly

### 5. Commit Changes
```bash
git add .
git commit -m "Add: Brief description of changes"
```

### 6. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```

## 📋 Code Style Guidelines

### Python (Backend)
- Follow PEP 8 style guide
- Use meaningful variable names
- Add docstrings for functions and classes
- Keep functions focused and small

### JavaScript (Frontend)
- Use ES6+ features
- Follow React best practices
- Use meaningful component and variable names
- Add PropTypes for component props

## 🧪 Testing

### Backend Testing
```bash
cd back-end
python -m pytest tests/
```

### Frontend Testing
```bash
cd front-end
npm test
```

## 📝 Pull Request Guidelines

### Before Submitting
- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] Documentation updated if needed
- [ ] No console errors or warnings

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Backend tests pass
- [ ] Frontend tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes

## Additional Notes
Any additional information for reviewers
```

## 🐛 Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, browser, etc.)

## 💡 Feature Requests

For feature requests, please:
- Describe the feature clearly
- Explain the use case
- Consider implementation complexity
- Check if similar features exist

## 📚 Documentation

- Update README.md for significant changes
- Add inline comments for complex code
- Update API documentation for new endpoints
- Include examples for new features

## 🔒 Security

- Report security vulnerabilities privately
- Follow responsible disclosure
- Do not commit sensitive information
- Use environment variables for secrets

## 📞 Getting Help

- Check existing issues and discussions
- Join our community Discord
- Email: support@bizeye.com
- Create an issue for questions

## 🎯 Areas for Contribution

### High Priority
- Performance optimizations
- Additional ML models
- Mobile responsiveness
- API rate limiting
- User authentication

### Medium Priority
- Additional chart types
- Export functionality
- Multi-language support
- Advanced filtering
- Real-time updates

### Low Priority
- UI/UX improvements
- Documentation updates
- Code refactoring
- Test coverage
- Accessibility improvements

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Invited to maintainer discussions
- Given priority for feature requests

## 📄 License

By contributing to BIZEYE, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to BIZEYE! 🚀
