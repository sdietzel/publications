let citeConstructorPromise;

async function getCiteConstructor() {
    if (!citeConstructorPromise) {
        citeConstructorPromise = (async () => {
            const coreModule = await import('https://cdn.jsdelivr.net/npm/@citation-js/core@0.6.9/+esm');
            await import('https://cdn.jsdelivr.net/npm/@citation-js/plugin-bibtex@0.6.9/+esm');
            await import('https://cdn.jsdelivr.net/npm/@citation-js/plugin-csl@0.6.9/+esm');
            const CiteConstructor = coreModule.default || coreModule.Cite;
            if (!CiteConstructor) {
                throw new Error('Citation.js library not loaded');
            }
            return CiteConstructor;
        })();
    }
    return citeConstructorPromise;
}

async function loadCitations() {
    // The only line that changes is the URL inside fetch()
    const GITHUB_URL = 'https://raw.githubusercontent.com/sdietzel/publications/main/publications.bib';

    try {
        // Fetch the .bib file directly from GitHub
        const response = await fetch(GITHUB_URL);
        const bibtexData = await response.text();

        console.log('Fetched BibTeX data:', bibtexData); // Debugging line

        // Load Citation.js and required plugins dynamically the first time we need them.
        const CiteConstructor = await getCiteConstructor();

        const myCitations = new CiteConstructor(bibtexData);

        const htmlOutput = myCitations.format('bibliography', {
            format: 'html',
            template: 'apa',
            lang: 'en-US'
        });

        document.getElementById('publications-list').innerHTML = htmlOutput;
        
    } catch (error) {
        console.error('Failed to load or parse publications from GitHub:', error);
        document.getElementById('publications-list').innerHTML = 'Error loading publications.';
    }
}

window.onload = function() {
  loadCitations();
};
