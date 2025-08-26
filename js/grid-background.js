// Add grid background to the page
document.addEventListener('DOMContentLoaded', function () {
    // Create grid background container
    const gridBackground = document.createElement('div');
    gridBackground.className = 'grid-background';

    // Create grid lines
    const gridLines = document.createElement('div');
    gridLines.className = 'grid-lines';

    // Create grid glow effect
    const gridGlow = document.createElement('div');
    gridGlow.className = 'grid-glow';

    // Append elements to the container
    gridBackground.appendChild(gridLines);
    gridBackground.appendChild(gridGlow);

    // Add the grid background as the first child of the body
    document.body.insertBefore(gridBackground, document.body.firstChild);
});
