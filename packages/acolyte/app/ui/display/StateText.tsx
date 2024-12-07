export const StateText = (text: string, maxWidth = "max-w-xl") => {
	return (
		<pre className={`whitespace-pre-wrap break-words text-xs ${maxWidth}`}>
			{text}
		</pre>
	);
};
