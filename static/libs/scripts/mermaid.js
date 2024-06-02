// The function to load the Mermaid library and render the diagram
const loadMermaid = async () => {
  // Set the Mermaid rendering state to true
  window.mermaidRendered = true;

  // Load the Mermaid library
  const mermaidUrl = 'https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js';
  const mermaidScript = document.createElement('script');
  mermaidScript.src = mermaidUrl;
  document.head.appendChild(mermaidScript);

  // Wait for the Mermaid library to be loaded
  await new Promise(resolve => {
    mermaidScript.onload = resolve;
    mermaidScript.onerror = resolve;
  });

  // Initialize the Mermaid library with the desired theme
  mermaid.initialize({ theme: 'forest', startOnLoad: false });

  // Render the diagram
  try {
    await mermaid.run();
  } catch (e) {
    console.log(e);
  }
};

// The function to update the component's content based on the Mermaid rendering state
const updateComponent = () => {
  
  const elements = document.querySelectorAll('.language-mermaid');

  elements.forEach((element) => {
    const newElement = document.createElement('div');
    newElement.classList.add('mermaid');
    newElement.innerHTML = element.innerHTML;
    element.parentNode.replaceChild(newElement, element);
  });

  elements.forEach((diagramSlot, index) => {
    const loadingPlaceholder = document.createElement('div');
    loadingPlaceholder.className = 'load';
    loadingPlaceholder.innerText = ' loading... ';
    if (!diagramSlot.parentNode.querySelector('.load')) {
      diagramSlot.parentNode.prepend(loadingPlaceholder);
    }

    if (window.mermaidRendered) {
      // Hide the loading placeholder
      loadingPlaceholder.style.display = 'none';

      // Show the diagram
      diagramSlot.style.display = 'block';
    } else {
      // Hide the diagram
      diagramSlot.style.display = 'none';

      // Show the loading placeholder
      loadingPlaceholder.style.display = 'block';
    }
  });
};

// Load the Mermaid library and render the diagram when the component is mounted
loadMermaid().then(() => updateComponent());

// Update the component's content when the Mermaid rendering state changes
const mermaidRenderedObserver = new MutationObserver(() => updateComponent());
mermaidRenderedObserver.observe(document.body, { attributes: true });
