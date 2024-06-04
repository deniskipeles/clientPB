// The function to load the MathJax library and render the equations
const loadMathJax = () => {
  const mathjaxScript = document.createElement('script');
  mathjaxScript.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js';
  document.head.appendChild(mathjaxScript);

  mathjaxScript.onload = () => {
    window.MathJax = {
      tex: {
        inlineMath: [
          ['$', '$'],
          ['\\(', '\\)']
        ],
        tags: 'ams'
      },
      svg: {fontCache: 'global'}
    };

    // Render the equations
    /*try {
      MathJax.typesetClear();
      MathJax.typesetPromise().then(() => {
        dispatchEvent(new CustomEvent('mathjax:rendered'));
      });
    } catch (e) {
      console.log(e);
    }*/
  };
};

// The function to update the component's content based on the MathJax rendering state
const updateComponent = () => {
  const mathjaxComponent = document.getElementById('mathjax-component');
  if (window.MathJax) {
    // Hide the loading placeholder
    mathjaxComponent.querySelectorAll('.load').forEach(el => el.style.display = 'none');

    // Show the equations
    mathjaxComponent.querySelectorAll('.math').forEach(el => el.style.display = 'inline');
  } else {
    // Hide the equations
    mathjaxComponent.querySelectorAll('.math').forEach(el => el.style.display = 'none');

    // Show the loading placeholder
    mathjaxComponent.querySelectorAll('.load').forEach(el => el.style.display = 'inline');
  }
};

// Load the MathJax library and render the equations when the component is mounted
loadMathJax();

// Update the component's content when the MathJax rendering state changes
//document.addEventListener('mathjax:rendered', updateComponent);
//window.addEventListener('popstate', updateComponent);
