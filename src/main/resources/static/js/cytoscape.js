const message = document.getElementById('cytoscapeMessage');
const graphContainer = document.getElementById('cy');
const graphWorkspace = document.getElementById('graphWorkspace');
const nodeSidebar = document.getElementById('nodeSidebar');
const nodeSidebarEmpty = document.getElementById('nodeSidebarEmpty');
const nodeDetailsForm = document.getElementById('nodeDetailsForm');
const createNodeDialog = document.getElementById('createNodeDialog');
const createNodeForm = document.getElementById('createNodeForm');
const createNodeMessage = document.getElementById('createNodeMessage');
const newNodeTitleInput = document.getElementById('newNodeTitle');
const newNodeUrlInput = document.getElementById('newNodeUrl');
const newNodeMemoInput = document.getElementById('newNodeMemo');
const nodeDetailsMessage = document.getElementById('nodeDetailsMessage');
const nodeTitleInput = document.getElementById('nodeTitle');
const nodeUrlInput = document.getElementById('nodeUrl');
const nodeMemoInput = document.getElementById('nodeMemo');
const nodeTags = document.getElementById('nodeTags');
const toggleNodeSidebar = document.getElementById('toggleNodeSidebar');
const connectButton = document.createElement('button');
const deleteButton = document.createElement('button');
let hideConnectButtonTimer;
let hideDeleteButtonTimer;
let hoveredNode;
let selectedNode;
let availableTags = [];

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

const updateDeleteButtonPosition = () => {
    const edge = deleteButton.edge;
    if (!edge || edge.removed()) return;

    const sourcePosition = edge.source().renderedPosition();
    const targetPosition = edge.target().renderedPosition();
    deleteButton.style.left = `${(sourcePosition.x + targetPosition.x) / 2}px`;
    deleteButton.style.top = `${(sourcePosition.y + targetPosition.y) / 2 - 18}px`;
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

const setDetailsMessage = (text, success = false) => {
    nodeDetailsMessage.textContent = text;
    nodeDetailsMessage.className = `message${success ? ' success' : ' error'}`;
};

const setCreateNodeMessage = (text, success = false) => {
    createNodeMessage.textContent = text;
    createNodeMessage.className = `message${success ? ' success' : ' error'}`;
};

const setSidebarOpen = isOpen => {
    graphWorkspace.classList.toggle('sidebar-collapsed', !isOpen);
    nodeSidebar.hidden = false;
    toggleNodeSidebar.textContent = isOpen ? 'Hide details' : 'Show details';
    toggleNodeSidebar.setAttribute('aria-expanded', String(isOpen));
};

const renderNodeTags = selectedTagIds => {
    nodeTags.replaceChildren(...availableTags.map(tag => {
        const label = document.createElement('label');
        label.className = 'tag-option';

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.value = tag.id;
        input.checked = selectedTagIds.includes(tag.id);

        const name = document.createElement('span');
        name.className = 'tag-name';
        name.textContent = tag.name;
        label.append(input, name);
        return label;
    }));
};

const loadNodeDetails = async node => {
    selectedNode = node;
    setSidebarOpen(true);
    nodeSidebarEmpty.hidden = true;
    nodeDetailsForm.hidden = false;
    setDetailsMessage('Loading details...');

    try {
        const [materialResponse, tagsResponse] = await Promise.all([
            fetch(`/material/${encodeURIComponent(node.data('materialId'))}`, {credentials: 'same-origin'}),
            fetch('/tag', {credentials: 'same-origin'})
        ]);
        if (!materialResponse.ok || !tagsResponse.ok) throw new Error('Failed to load node details.');

        const material = await materialResponse.json();
        availableTags = await tagsResponse.json();
        nodeTitleInput.value = material.title || '';
        nodeUrlInput.value = material.url || '';
        nodeMemoInput.value = material.memo || '';
        renderNodeTags((material.tags || []).map(tag => tag.id));
        setDetailsMessage('');
    } catch (error) {
        setDetailsMessage(error.message);
    }
};

const clearNodeDetails = () => {
    selectedNode = undefined;
    nodeDetailsForm.hidden = true;
    nodeSidebarEmpty.hidden = false;
    setDetailsMessage('');
    setSidebarOpen(false);
};

const showCreateNodeForm = () => {
    createNodeForm.hidden = false;
    setCreateNodeMessage('');
    createNodeDialog.showModal();
    newNodeTitleInput.focus();
};

const hideCreateNodeForm = () => {
    if (createNodeDialog.open) createNodeDialog.close();
    createNodeForm.reset();
    setCreateNodeMessage('');
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
        wheelSensitivity: 0.2,
        boxSelectionEnabled: true,
        userPanningEnabled: false,
        selectionType: 'single',
        style: [
            {
                selector: 'node',
                style: {
                    'background-color': '#0f766e',
                    'border-width': 2,
                    'border-color': '#115e59',
                    label: 'data(title)',
                    color: '#ffffff',
                    'text-wrap': 'wrap',
                    'text-max-width': '74px',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'font-size': 13,
                    'font-weight': 700,
                    width: 90,
                    height: 90
                }
            },
            {
                selector: 'node:selected',
                style: {
                    'background-color': '#f59e0b',
                    'border-color': '#b45309',
                    'border-width': 4,
                    color: '#422006'
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
            },
            {
                selector: 'edge.edge-hover',
                style: {
                    width: 4,
                    'line-color': '#f59e0b',
                    'target-arrow-color': '#f59e0b',
                    color: '#92400e'
                }
            },
            {
                selector: 'edge:selected',
                style: {
                    width: 5,
                    'line-color': '#dc2626',
                    'target-arrow-color': '#dc2626',
                    color: '#991b1b'
                }
            },
            {
                selector: 'edge:selected.edge-hover',
                style: {
                    'line-color': '#f59e0b',
                    'target-arrow-color': '#f59e0b',
                    color: '#92400e'
                }
            }
        ],
        layout: {
            name: 'preset',
            fit: true,
            padding: 40
        }
    });

    let connectionPreviewNode;
    let connectionSourceNode;
    let lastPointerEvent;
    let tapSelectionTimer;

    const getPointerPosition = event => {
        const bounds = graphContainer.getBoundingClientRect();
        const pan = cy.pan();
        const zoom = cy.zoom();

        return {
            x: (event.clientX - bounds.left - pan.x) / zoom,
            y: (event.clientY - bounds.top - pan.y) / zoom
        };
    };

    const updateNodeCoords = async node => {
        const position = node.position();
        const response = await fetch(`/cytomap/${encodeURIComponent(window.mindmapId)}`, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: Number(node.data('id')),
                coordX: position.x,
                coordY: position.y
            })
        });

        if (!response.ok) throw new Error('Failed to save node position.');
    };

    const moveConnectionPreview = event => {
        lastPointerEvent = event;
        if (!connectionPreviewNode) return;

        connectionPreviewNode.position(getPointerPosition(event));
    };

    const startConnection = sourceNode => {
        const node = sourceNode || hoveredNode;
        if (!node || connectionPreviewNode) return;

        connectionSourceNode = node;
        const startPosition = lastPointerEvent
            ? getPointerPosition(lastPointerEvent)
            : node.position();
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

    const deleteNode = async node => {
        const response = await fetch(`/mindmap/material/${encodeURIComponent(node.data('id'))}`, {
            method: 'DELETE',
            credentials: 'same-origin'
        });
        if (!response.ok) throw new Error('Failed to delete node.');

        node.remove();
    };

    const deleteSelectedElements = async () => {
        const selectedElements = cy.$(':selected').filter(element => !element.hasClass('connection-preview'));
        if (!selectedElements.length) return;

        try {
            const selectedNodes = selectedElements.nodes();
            const selectedEdges = selectedElements.edges().union(selectedNodes.connectedEdges());

            for (const edge of selectedEdges) await deleteEdge(edge);
            for (const node of selectedNodes) await deleteNode(node);

            setMessage('Selected elements deleted.', true);
        } catch (error) {
            setMessage(error.message);
        }
    };

    connectButton.addEventListener('click', () => startConnection());
    deleteButton.addEventListener('click', () => {
        if (deleteButton.edge) deleteEdge(deleteButton.edge);
    });
    toggleNodeSidebar.addEventListener('click', () => {
        const isOpen = toggleNodeSidebar.getAttribute('aria-expanded') === 'true';
        setSidebarOpen(!isOpen);
    });
    document.getElementById('closeNodeSidebar').addEventListener('click', () => setSidebarOpen(false));
    document.getElementById('createNodeButton').addEventListener('click', showCreateNodeForm);
    document.getElementById('cancelCreateNode').addEventListener('click', hideCreateNodeForm);
    createNodeDialog.addEventListener('click', event => {
        if (event.target === createNodeDialog) hideCreateNodeForm();
    });
    createNodeDialog.addEventListener('close', () => {
        createNodeForm.hidden = true;
        createNodeForm.reset();
        setCreateNodeMessage('');
    });
    createNodeForm.addEventListener('submit', async event => {
        event.preventDefault();

        try {
            const response = await fetch(`/cytomap/node/${encodeURIComponent(window.mindmapId)}`, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    title: newNodeTitleInput.value.trim(),
                    url: newNodeUrlInput.value.trim(),
                    memo: newNodeMemoInput.value.trim(),
                    tagIds: []
                })
            });
            if (!response.ok) throw new Error('Failed to create node.');

            setCreateNodeMessage('Node created.', true);
            window.location.reload();
        } catch (error) {
            setCreateNodeMessage(error.message);
        }
    });
    nodeDetailsForm.addEventListener('submit', async event => {
        event.preventDefault();
        if (!selectedNode) return;

        try {
            const response = await fetch(`/material/${encodeURIComponent(selectedNode.data('materialId'))}`, {
                method: 'PUT',
                credentials: 'same-origin',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    title: nodeTitleInput.value.trim(),
                    url: nodeUrlInput.value.trim(),
                    memo: nodeMemoInput.value.trim(),
                    tagIds: Array.from(nodeTags.querySelectorAll('input:checked')).map(input => Number(input.value))
                })
            });
            if (!response.ok) throw new Error('Failed to update node details.');

            selectedNode.data('title', nodeTitleInput.value.trim());
            setDetailsMessage('Node details updated.', true);
            setMessage('Node details updated.', true);
        } catch (error) {
            setDetailsMessage(error.message);
        }
    });
    graphContainer.addEventListener('mousemove', moveConnectionPreview);
    graphContainer.addEventListener('wheel', event => {
        event.preventDefault();

        const bounds = graphContainer.getBoundingClientRect();
        const deltaY = event.deltaMode === 1
            ? event.deltaY * 16
            : event.deltaMode === 2
                ? event.deltaY * 100
                : event.deltaY;
        const level = Math.min(
            cy.maxZoom(),
            Math.max(cy.minZoom(), cy.zoom() * Math.pow(1.0015, -deltaY))
        );

        cy.zoom({
            level,
            renderedPosition: {
                x: event.clientX - bounds.left,
                y: event.clientY - bounds.top
            }
        });
    }, {passive: false});
    graphContainer.addEventListener('contextmenu', event => {
        event.preventDefault();
        cancelConnection();
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') cancelConnection();
        if (event.key === 'Delete') {
            event.preventDefault();
            deleteSelectedElements();
        }
    });

    cy.on('mouseover', 'node', event => showConnectButton(event.target));
    cy.on('mouseout', 'node', hideConnectButton);
    cy.on('mouseover', 'edge:not(.connection-preview)', event => {
        event.target.addClass('edge-hover');
        showDeleteButton(event.target);
    });
    cy.on('mouseout', 'edge:not(.connection-preview)', event => {
        event.target.removeClass('edge-hover');
        hideDeleteButton();
    });
    let backgroundPanPosition;
    cy.on('cxttapstart', event => {
        backgroundPanPosition = event.target === cy ? event.renderedPosition : undefined;
    });
    cy.on('cxtdrag', event => {
        if (!backgroundPanPosition) return;

        const position = event.renderedPosition;
        const pan = cy.pan();
        cy.pan({
            x: pan.x + position.x - backgroundPanPosition.x,
            y: pan.y + position.y - backgroundPanPosition.y
        });
        backgroundPanPosition = position;
    });
    cy.on('cxttapend', () => {
        backgroundPanPosition = undefined;
    });
    cy.on('cxttap', 'node', event => loadNodeDetails(event.target));
    cy.on('tap', 'node, edge', event => {
        if (connectionPreviewNode && event.target.isNode()) {
            const targetNode = event.target;
            if (targetNode.id() !== connectionSourceNode.id()) completeConnection(targetNode);
            return;
        }

        clearTimeout(tapSelectionTimer);
        tapSelectionTimer = setTimeout(() => {
            cy.elements().unselect();
            event.target.select();
            hideCreateNodeForm();
            clearNodeDetails();
        }, 220);
    });
    cy.on('pan zoom position', updateDeleteButtonPosition);
    cy.on('dragfree', 'node', event => {
        updateNodeCoords(event.target).catch(error => setMessage(error.message));
    });
    cy.on('dbltap', 'node', event => {
        clearTimeout(tapSelectionTimer);
        cy.elements().unselect();
        event.target.select();
        startConnection(event.target);
    });
    document.getElementById('fitGraph').addEventListener('click', () => cy.fit(undefined, 40));
    setSidebarOpen(false);
    setMessage(`${graph.elements.nodes.length} nodes, ${graph.elements.edges.length} connections`, true);
};

loadGraph().catch(error => {
    setMessage(error.message);
});