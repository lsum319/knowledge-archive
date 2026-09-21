const message = document.getElementById('cytoscapeMessage');
const graphContainer = document.getElementById('cy');

const setMessage = (text, success = false) => {
    message.textContent = text;
    message.className = `message${success ? ' success' : ' error'}`;
};

const loadGraph = async () => {
    const response = await fetch(`/cytomap/${encodeURIComponent(window.mindmapId)}`, {
        credentials: 'same-origin'
    });
    if (!response.ok) throw new Error('Failed to load graph data.');

    const graph = await response.json();
    const cy = cytoscape({
        container: graphContainer,
        elements: graph.elements,
        style: [
            {
                selector: 'node',
                style: {
                    'background-color': '#4338ca',
                    label: 'data(title)',
                    color: '#111827',
                    'text-wrap': 'wrap',
                    'text-max-width': '140px',
                    'text-valign': 'bottom',
                    'text-margin-y': 8,
                    'font-size': 13,
                    width: 28,
                    height: 28
                }
            },
            {
                selector: 'edge',
                style: {
                    width: 2,
                    'line-color': '#94a3b8',
                    'target-arrow-color': '#94a3b8',
                    'target-arrow-shape': 'triangle',
                    'curve-style': 'bezier',
                    label: 'data(label)',
                    color: '#475569',
                    'font-size': 11,
                    'text-background-color': '#ffffff',
                    'text-background-opacity': 1,
                    'text-background-padding': 3
                }
            }
        ],
        layout: {
            name: 'cose',
            animate: true,
            padding: 40,
            nodeRepulsion: 8000,
            idealEdgeLength: 140
        }
    });

    document.getElementById('fitGraph').addEventListener('click', () => cy.fit(undefined, 40));
    setMessage(`${graph.elements.nodes.length} nodes, ${graph.elements.edges.length} connections`, true);
};

loadGraph().catch(error => {
    setMessage(error.message);
});