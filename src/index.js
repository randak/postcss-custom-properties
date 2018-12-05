import postcss from 'postcss';
import { readCustom, readCustomFromRoot, transformRootWithCustomProperties, writeCustom } from 'postcss-custom-utils';

export default postcss.plugin('postcss-custom-properties', opts => {
	// whether to preserve custom selectors and rules using them
	const preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : true;

	// sources to import custom selectors from
	const importFrom = [].concat(Object(opts).importFrom || []);

	// destinations to export custom selectors to
	const exportTo = [].concat(Object(opts).exportTo || []);

	return async root => {
		const customFromImports = await readCustom(...importFrom);
		const customFromRoot = await readCustomFromRoot(root, preserve);
		const customProperties = Object.assign({}, customFromImports.customProperties, customFromRoot.customProperties);

		transformRootWithCustomProperties(root, customProperties, preserve);

		await writeCustom({ customProperties }, ...exportTo);
	};
});
