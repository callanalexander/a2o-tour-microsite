// Manages species audio on homepage cards and map callouts. Defer sources until
// spectrograms are near view to avoid duplicate requests from hidden callouts.
// Both arrows share the label's clip index to keep its text and audio in sync.
const spectrogramObserver = new IntersectionObserver((entries, observer) => {
	for (const entry of entries) {
		if (!entry.isIntersecting) continue;

		const spectrogram = entry.target;
		const source = spectrogram.dataset.src;
		if (source) {
			spectrogram.removeAttribute("data-src");
			spectrogram.src = source;
		}
		observer.unobserve(spectrogram);
	}
}, { rootMargin: "200px" });

document.querySelectorAll(".site-info-spectrogram-view[data-src]").forEach(spectrogram => {
	spectrogramObserver.observe(spectrogram);
});

document.addEventListener("click", (event) => {
	const button = event.target.closest(".site-info-species-control");
	if (!button) return;

	const label = button.closest(".site-info-spectrogram-label");
	const clips = JSON.parse(label.dataset.clips);
	const currentIndex = Number(label.dataset.index) || 0;
	const direction = Number(button.dataset.direction);
	const index = (currentIndex + direction + clips.length) % clips.length;
	const player = button.closest(".site-info-spectrogram");
	const spectrogram = player.querySelector("oe-spectrogram");

	label.dataset.index = index;
	label.querySelector(".site-info-species-name").textContent = clips[index].name;
	spectrogramObserver.unobserve(spectrogram);
	spectrogram.removeAttribute("data-src");
	spectrogram.stop?.();
	spectrogram.src = clips[index].url;
});
