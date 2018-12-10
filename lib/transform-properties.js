import valueParser from 'postcss-values-parser';
import transformValueAST from './transform-value-ast';

// transform custom pseudo selectors with custom selectors
export default (root, customProperties, opts) => {
	console.log(customProperties);
	// walk decls that can be transformed
	root.walkDecls(decl => {
		if (isTransformableDecl(decl)) {
			const originalValue = decl.value;
			const valueAST = valueParser(originalValue).parse();
			const value = String(transformValueAST(valueAST, customProperties));

			console.log("Value: " + value + " Original Value: " + originalValue);

			// conditionally transform values that have changed
			if (value !== originalValue) {
				if (opts.preserve) {
					decl.cloneBefore({ value });
				} else {
					decl.value = value;
				}
			}
		}
	});
};

// match custom properties
const customPropertyRegExp = /^--[a-zA-Z0-9][\w-]*$/;

// match custom property inclusions
const customPropertiesRegExp = /(^|[^\w-])var\([\W\w]+\)/;

// whether the declaration should be potentially transformed
const isTransformableDecl = decl => !customPropertyRegExp.test(decl.prop) && customPropertiesRegExp.test(decl.value);
