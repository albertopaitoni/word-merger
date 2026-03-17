# Keyword Merger

A powerful web-based tool for generating keyword combinations from multiple word lists. Perfect for SEO professionals, marketers, and advertisers who need to create comprehensive keyword campaigns.

![Keyword Merger](https://img.shields.io/badge/Version-3.0-purple) ![License](https://img.shields.io/badge/License-MIT-green)

## Features

### Combination Strategies
- **Full Chain**: Combines all columns together (A+B+C)
- **Accumulative**: Generates progressive combinations (A, A+B, A+B+C)
- **Minimo 2**: Combines minimum 2 columns (A+B, A+B+C)
- **Power Set**: All possible subsets of columns

### Text Options
- Multiple separator choices (space, plus, hyphen, underscore, pipe, custom)
- Case transformation (lowercase, UPPERCASE, Capitalize)
- Duplicate removal
- Empty line filtering
- Trim whitespace
- Character limit filter

### SEO/Ads Features
- Broad Match keywords
- "Phrase Match" keywords
- [Exact Match] keywords
- Prefix/Suffix wrapper (e.g., `site:` or `.it`)

### Column Modes
- **Mix Mode**: Combines with other columns
- **Solo Mode**: Outputs column words independently (appended at end)

## Getting Started

Simply open `word-merger.html` in any modern web browser. No installation or server required.

```bash
# Clone the repository
git clone https://github.com/yourusername/words-merge.git

# Open in browser
cd words-merge
start word-merger.html
```

## Usage

1. **Add Columns**: Click the `+` button to add more word columns
2. **Enter Words**: Type or paste your keywords into each column (one per line)
3. **Select Strategy**: Choose how you want to combine the words
4. **Configure Options**: Set separators, case, SEO options, etc.
5. **Generate**: Click "COMBINA" to generate your keyword combinations
6. **Copy**: Click "COPIA" to copy the results to clipboard

## Technologies

- **HTML5** - Structure
- **CSS3** - Styling (CSS Variables, Flexbox, Grid)
- **JavaScript (ES6+)** - Logic and algorithms

## License

MIT License - feel free to use this project for personal and commercial purposes.

---

Built with ❤️ for SEO professionals
