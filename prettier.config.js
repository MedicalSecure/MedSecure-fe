// The values provided below are the defaults.
// If you don't specify one of these properties,
// the default value will be applied.
module.exports = {
	printWidth: 180, // Specify the line length where Prettier will try to wrap
	tabWidth: 2, // Specify the number of spaces per indentation-level
	useTabs: true, // Indent lines with tabs instead of spaces
	semi: true, // Print semicolons at the ends of statements
	singleQuote: true, // Use double quotes instead of single quotes for strings
	trailingComma: 'none', // Print trailing commas wherever possible
	// Options: 'none', 'es5', 'all'
	bracketSpacing: true, // Print spaces between brackets in object literals
	arrowParens: 'avoid', // Omit parentheses around a sole arrow function parameter
	// Options: 'avoid', 'always'
	parser: 'typescript', // Specify the parser to use for parsing input files
	endOfLine: 'auto'
};
