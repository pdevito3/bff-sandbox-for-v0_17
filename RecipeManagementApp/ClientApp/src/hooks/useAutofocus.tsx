import React from "react";

export function useAutofocus() {
	const autofocusRef = React.useCallback((node: any) => {
		if (node !== null) {
			node?.focus();
		}
	}, []);
	return autofocusRef;
}
