(function() {
	'use strict';

	var toggleButton = document.getElementById('theme-toggle');

	function updateToggleButton(theme) {
		if (!toggleButton) {
			return;
		}

		var isDarkTheme = theme === 'dark';
		toggleButton.setAttribute('aria-pressed', isDarkTheme ? 'true' : 'false');
		toggleButton.textContent = isDarkTheme ? 'Switch to light mode' : 'Switch to dark mode';
	}

	if (toggleButton) {
		updateToggleButton(document.documentElement.getAttribute('data-theme') || 'light');

		toggleButton.addEventListener('click', function() {
			var currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
			var nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

			document.documentElement.setAttribute('data-theme', nextTheme);

			try {
				localStorage.setItem('go-crazy-theme', nextTheme);
			} catch (error) {}

			updateToggleButton(nextTheme);
		});
	}
})();
