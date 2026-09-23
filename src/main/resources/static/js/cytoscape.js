const message = document.getElementById('cytoscapeMessage');
const graphContainer = document.getElementById('cy');
const connectButton = document.createElement('button');
const deleteButton = document.createElement('button');
let hideConnectButtonTimer;
let hideDeleteButtonTimer;
let hoveredNode;

connectButton.type = 'button';
connectButton.className = 'node-connect-button';
connectButton.textContent = '연결 시작';
connectButton.setAttribute('aria-label', '선택한 노드에서 연결 시작');
connectButton.hidden = true;
graphContainer.appendChild(connectButton);

deleteButton.type = 'button';
deleteButton.className = 'edge-delete-button';
deleteButton.textContent = '삭제';
deleteButton.setAttribute('aria-label', '선택한 edge 삭제');
deleteButton.hidden = true;
graphContainer.appendChild(deleteButton);

const showConnectButton = node => {
    clearTimeout(hideConnectButtonTimer);
    hoveredNode = node;

    const position = node.renderedPosition();
    connectButton.style.left = `${position.x}px`;
    connectButton.style.top = `${position.y - 24}px`;
    connectButton.hidden = false;
};

const hideConnectButton = () => {
    clearTimeout(hideConnectButtonTimer);
    hideConnectButtonTimer = setTimeout(() => {
        connectButton.hidden = true;
    }, 100);
};

const showDeleteButton = edge => {
    clearTimeout(hideDeleteButtonTimer);

    const sourcePosition = edge.source().renderedPosition();
    const targetPosition = edge.target().renderedPosition();
    deleteButton.style.left = `${(sourcePosition.x + targetPosition.x) / 2}px`;
    deleteButton.style.top = `${(sourcePosition.y + targetPosition.y) / 2 - 18}px`;
    deleteButton.hidden = false;
    deleteButton.edge = edge;
};

const hideDeleteButton = () => {
    clearTimeout(hideDeleteButtonTimer);
    hideDeleteButtonTimer = setTimeout(() => {
        deleteButton.hidden = true;
        deleteButton.edge = undefined;
    }, 100);
};

connectButton.addEventListener('mouseenter', () => clearTimeout(hideConnectButtonTimer));
connectButton.addEventListener('mouseleave', hideConnectButton);
deleteButton.addEventListener('mouseenter', () => clearTimeout(hideDeleteButtonTimer));
deleteButton.addEventListener('mouseleave', hideDeleteButton);

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
                selector: 'node.connection-preview',
                style: {
                    'background-opacity': 0,
                    'border-width': 0,
                    events: 'no',
                    width: 1,
                    height: 1,
                    label: ''
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
            },
            {
                selector: 'edge.connection-preview',
                style: {
                    width: 3,
                    'line-color': '#f59e0b',
                    'target-arrow-color': '#f59e0b',
                    'target-arrow-shape': 'triangle',
                    label: ''
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

    let connectionPreviewNode;
    let connectionSourceNode;
    let lastPointerEvent;

    const getPointerPosition = event => {
        const bounds = graphContainer.getBoundingClientRect();
        const pan = cy.pan();
        const zoom = cy.zoom();

        return {
            x: (event.clientX - bounds.left - pan.x) / zoom,
            y: (event.clientY - bounds.top - pan.y) / zoom
        };
    };

    const moveConnectionPreview = event => {
        lastPointerEvent = event;
        if (!connectionPreviewNode) return;

        connectionPreviewNode.position(getPointerPosition(event));
    };

    const startConnection = () => {
        if (!hoveredNode || connectionPreviewNode) return;

        connectionSourceNode = hoveredNode;
        const startPosition = lastPointerEvent
            ? getPointerPosition(lastPointerEvent)
            : hoveredNode.position();
        connectionPreviewNode = cy.add({
            group: 'nodes',
            data: {
                id: '__connection-preview-node__'
            },
            position: startPosition,
            classes: 'connection-preview'
        });
        cy.add({
            group: 'edges',
            data: {
                id: '__connection-preview-edge__',
                source: connectionSourceNode.id(),
                target: connectionPreviewNode.id()
            },
            classes: 'connection-preview'
        });
        connectButton.hidden = true;
    };

    const cancelConnection = () => {
        if (!connectionPreviewNode) return;

        connectionPreviewNode.connectedEdges().remove();
        connectionPreviewNode.remove();
        connectionPreviewNode = undefined;
        connectionSourceNode = undefined;
    };

    const completeConnection = async targetNode => {
        if (!connectionPreviewNode || !connectionSourceNode) return;
        if (targetNode.id() === connectionPreviewNode.id()) return;
        if (targetNode.id() === connectionSourceNode.id()) return;

        const sourceId = connectionSourceNode.id();
        const targetId = targetNode.id();

        try {
            const response = await fetch('/edge', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    mindmapId: Number(window.mindmapId),
                    sourceId: Number(sourceId),
                    targetId: Number(targetId),
                    name: null
                })
            });
            if (!response.ok) throw new Error('Failed to create connection.');

            cancelConnection();
            cy.add({
                group: 'edges',
                data: {
                    id: `edge-${sourceId}-${targetId}-${Date.now()}`,
                    source: sourceId,
                    target: targetId,
                    label: ''
                }
            });
            setMessage('Connection created.', true);
        } catch (error) {
            setMessage(error.message);
        }
    };

    const deleteEdge = async edge => {
        const sourceId = edge.data('source');
        const targetId = edge.data('target');

        try {
            const response = await fetch('/edge', {
                method: 'DELETE',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    mindmapId: Number(window.mindmapId),
                    sourceId: Number(sourceId),
                    targetId: Number(targetId),
                    name: null
                })
            });
            if (!response.ok) throw new Error('Failed to delete connection.');

            edge.remove();
            hideDeleteButton();
            setMessage('Connection deleted.', true);
        } catch (error) {
            setMessage(error.message);
        }
    };

    connectButton.addEventListener('click', startConnection);
    deleteButton.addEventListener('click', () => {
        if (deleteButton.edge) deleteEdge(deleteButton.edge);
    });
    graphContainer.addEventListener('mousemove', moveConnectionPreview);
    graphContainer.addEventListener('contextmenu', event => {
        event.preventDefault();
        cancelConnection();
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') cancelConnection();
    });

    cy.on('mouseover', 'node', event => showConnectButton(event.target));
    cy.on('mouseout', 'node', hideConnectButton);
    cy.on('mouseover', 'edge:not(.connection-preview)', event => showDeleteButton(event.target));
    cy.on('mouseout', 'edge:not(.connection-preview)', hideDeleteButton);
    cy.on('dbltap', 'node', startConnection);
    cy.on('tap', 'node', event => {
        if (!connectionPreviewNode) return;

        const targetNode = event.target;
        if (targetNode.id() === connectionSourceNode.id()) return;

        completeConnection(targetNode);
    });

    document.getElementById('fitGraph').addEventListener('click', () => cy.fit(undefined, 40));
    setMessage(`${graph.elements.nodes.length} nodes, ${graph.elements.edges.length} connections`, true);
};

loadGraph().catch(error => {
    setMessage(error.message);
});