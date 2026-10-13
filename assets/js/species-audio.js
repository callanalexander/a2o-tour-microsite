document.addEventListener("click", (event) => {
	const button = event.target.closest(".site-info-species-next");
	if (!button) return;

	const clips = JSON.parse(button.dataset.clips);
	const index = ((Number(button.dataset.index) || 0) + 1) % clips.length;
	const spectrogram = button.closest(".site-info-spectrogram").querySelector("oe-spectrogram");

	button.dataset.index = index;
	button.previousElementSibling.textContent = clips[index].name;
	spectrogram.stop?.();
	spectrogram.src = clips[index].url;
});
