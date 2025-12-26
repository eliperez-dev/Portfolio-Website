export function viewport(element: HTMLElement) {
	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				element.dispatchEvent(new CustomEvent('enterViewport'));
				element.classList.add('viewport-enter');
				observer.unobserve(element);
			}
		});
	}, {
        threshold: 0.1 // Trigger when 10% visible
    });

	observer.observe(element);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
