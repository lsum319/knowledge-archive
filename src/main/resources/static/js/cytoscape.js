const message = document.getElementById('cytoscapeMessage');
const graphContainer = document.getElementById('cy');
const graphWorkspace = document.getElementById('graphWorkspace');
const nodeSidebar = document.getElementById('nodeSidebar');
const nodeSidebarEmpty = document.getElementById('nodeSidebarEmpty');
const nodeDetailsForm = document.getElementById('nodeDetailsForm');
const createNodeDialog = document.getElementById('createNodeDialog');
const createNodeForm = document.getElementById('createNodeForm');
const createNodeMessage = document.getElementById('createNodeMessage');
const existingMaterialResults = document.getElementById('existingMaterialResults');
const submitCreateNodeButton = document.getElementById('submitCreateNode');
const newNodeTitleInput = document.getElementById('newNodeTitle');
const newNodeUrlInput = document.getElementById('newNodeUrl');
const newNodeMemoInput = document.getElementById('newNodeMemo');
const nodeDetailsMessage = document.getElementById('nodeDetailsMessage');
const nodeTitleInput = document.getElementById('nodeTitle');
const nodeUrlInput = document.getElementById('nodeUrl');
const nodeMemoInput = document.getElementById('nodeMemo');
const nodeTags = document.getElementById('nodeTags');
const toggleNodeSidebar = document.getElementById('toggleNodeSidebar');
const graphContextMenu = document.getElementById('graphContextMenu');
const graphContextMenuTitle = document.getElementById('graphContextMenuTitle');
const nodeStyleOptions = document.getElementById('nodeStyleOptions');
const edgeStyleOptions = document.getElementById('edgeStyleOptions');
const nodeStyleColor = document.getElementById('nodeStyleColor');
const nodeStyleShape = document.getElementById('nodeStyleShape');
const nodeStyleSize = document.getElementById('nodeStyleSize');
const edgeStyleColor = document.getElementById('edgeStyleColor');
const edgeStyleWidth = document.getElementById('edgeStyleWidth');
const edgeStyleLine = document.getElementById('edgeStyleLine');
const edgeStyleName = document.getElementById('edgeStyleName');
let hideMemoTooltipTimer;
let hoveredMemoNode;
let keyboardSelectedNode;
let isMemoNodeHovered = false;
let isMemoTooltipHovered = false;
let isMemoEditorOpen = false;
let selectedNode;
let availableTags = [];
let selectedExistingMaterialId;
let materialSearchTimer;
let materialSearchRequestId = 0;
const memoCache = new Map();
const nodeShapes = new Set(['ellipse', 'round-rectangle', 'diamond', 'hexagon', 'rectangle']);
const edgeLineStyles = new Set(['solid', 'dashed', 'dotted']);
const defaultNodeStyle = {color: '#0f766e', shape: 'ellipse', size: 90};
const defaultEdgeStyle = {color: '#94a3b8', width: 2, lineStyle: 'solid'};
let graphElementStyles = {nodes: {}, edges: {}};
let contextMenuElement;
const graphElementStyleSaveTimers = new Map();
const graphElementStyleSaveQueues = new Map();

const memoTooltip = document.createElement('div');
memoTooltip.className = 'node-memo-tooltip';
memoTooltip.setAttribute('role', 'tooltip');
memoTooltip.hidden = true;
graphContainer.appendChild(memoTooltip);
memoTooltip.addEventListener('mouseenter', () => {
    isMemoTooltipHovered = true;
    clearTimeout(hideMemoTooltipTimer);
});
memoTooltip.addEventListener('mouseleave', () => {
    isMemoTooltipHovered = false;
    scheduleHideMemoTooltip();
});
memoTooltip.addEventListener('wheel', event => event.stopPropagation());
['pointerdown', 'pointerup', 'mousedown', 'mouseup', 'touchstart', 'touchend', 'click'].forEach(type => {
    memoTooltip.addEventListener(type, event => event.stopPropagation());
});

const positionMemoTooltip = node => {
    if (hoveredMemoNode !== node || memoTooltip.hidden) return;

    const position = node.renderedPosition();
    const margin = 12;
    const left = Math.min(position.x + 16, graphContainer.clientWidth - memoTooltip.offsetWidth - margin);
    const top = Math.min(position.y + 16, graphContainer.clientHeight - memoTooltip.offsetHeight - margin);
    memoTooltip.style.left = `${Math.max(margin, left)}px`;
    memoTooltip.style.top = `${Math.max(margin, top)}px`;
};

const renderMemoTooltip = (node, memo) => {
    if (hoveredMemoNode !== node || !/[^ ]/.test(memo)) return;

    memoTooltip.classList.remove('editing');
    memoTooltip.textContent = memo;
    memoTooltip.hidden = false;
    positionMemoTooltip(node);
};

const openMemoEditor = (node, initialMemo = '', method = 'POST') => {
    clearTimeout(hideMemoTooltipTimer);
    hoveredMemoNode = node;
    isMemoNodeHovered = false;
    isMemoEditorOpen = true;
    memoTooltip.classList.add('editing');
    memoTooltip.replaceChildren();

    const input = document.createElement('textarea');
    input.setAttribute('aria-label', '노드 메모');
    input.placeholder = '메모를 입력하세요';
    input.value = initialMemo;

    const saveButton = document.createElement('button');
    saveButton.type = 'button';
    saveButton.className = 'button small';
    saveButton.textContent = '저장';
    saveButton.addEventListener('click', async () => {
        const memo = input.value;
        const nodeId = Number(node.data('id'));

        try {
            const response = await fetch(`/mindmap/${encodeURIComponent(nodeId)}/node`, {
                method,
                credentials: 'same-origin',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id: nodeId, memo})
            });
            if (!response.ok) throw new Error();

            memoCache.set(String(nodeId), memo);
            isMemoEditorOpen = false;
            memoTooltip.replaceChildren();
            if (/[^ ]/.test(memo)) {
                renderMemoTooltip(node, memo);
            } else {
                memoTooltip.hidden = true;
            }
            if (!isMemoNodeHovered && !isMemoTooltipHovered) scheduleHideMemoTooltip();
            setMessage('메모를 저장했습니다.', true);
        } catch {
            setMessage('메모 저장에 실패했습니다.');
        }
    });

    memoTooltip.append(input, saveButton);
    memoTooltip.hidden = false;
    positionMemoTooltip(node);
    input.focus();
};

memoTooltip.addEventListener('click', () => {
    if (isMemoEditorOpen || memoTooltip.hidden || !hoveredMemoNode) return;

    const nodeId = String(hoveredMemoNode.data('id'));
    const memo = memoCache.get(nodeId);
    if (typeof memo === 'string' && /[^ ]/.test(memo)) {
        openMemoEditor(hoveredMemoNode, memo, 'PUT');
    }
});

const openMemoEditorForEmptyNode = async node => {
    const nodeId = String(node.data('id'));
    let memo = memoCache.get(nodeId);

    if (memo === undefined) {
        try {
            const response = await fetch(`/mindmap/${encodeURIComponent(nodeId)}/node`, {credentials: 'same-origin'});
            if (!response.ok) throw new Error();
            memo = await response.text();
            memoCache.set(nodeId, memo);
        } catch {
            return;
        }
    }

    if (!/[^ ]/.test(memo)) openMemoEditor(node);
};

const showMemoTooltip = async node => {
    if (isMemoEditorOpen) return;
    clearTimeout(hideMemoTooltipTimer);
    hoveredMemoNode = node;
    isMemoNodeHovered = true;
    memoTooltip.hidden = true;

    const nodeId = String(node.data('id'));
    if (memoCache.has(nodeId)) {
        renderMemoTooltip(node, memoCache.get(nodeId));
        return;
    }

    try {
        const response = await fetch(`/mindmap/${encodeURIComponent(nodeId)}/node`, {credentials: 'same-origin'});
        if (!response.ok) throw new Error();

        const memo = await response.text();
        memoCache.set(nodeId, memo);
        renderMemoTooltip(node, memo);
    } catch {}
};

const scheduleHideMemoTooltip = () => {
    clearTimeout(hideMemoTooltipTimer);
    if (isMemoNodeHovered || isMemoTooltipHovered || isMemoEditorOpen) return;

    hideMemoTooltipTimer = setTimeout(() => {
        if (isMemoNodeHovered || isMemoTooltipHovered) return;
        hoveredMemoNode = undefined;
        memoTooltip.hidden = true;
    }, 150);
};

const hideMemoTooltip = node => {
    if (hoveredMemoNode !== node) return;

    isMemoNodeHovered = false;
    scheduleHideMemoTooltip();
};

const closeMemoTooltip = () => {
    clearTimeout(hideMemoTooltipTimer);
    hoveredMemoNode = undefined;
    isMemoNodeHovered = false;
    isMemoTooltipHovered = false;
    isMemoEditorOpen = false;
    memoTooltip.hidden = true;
    memoTooltip.classList.remove('editing');
    memoTooltip.replaceChildren();
};

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

const loadGraphElementStyles = graph => {
    const styles = {nodes: {}, edges: {}};
    for (const node of graph.elements.nodes) {
        const style = node.style;
        if (!style || typeof style !== 'object' || !/^#[0-9a-f]{6}$/i.test(style.color) || !nodeShapes.has(style.shape)
            || !Number.isInteger(style.size) || style.size < 60 || style.size > 150) continue;
        styles.nodes[node.data.id] = {color: style.color, shape: style.shape, size: style.size};
    }
    for (const edge of graph.elements.edges) {
        const style = edge.style;
        if (!style || typeof style !== 'object' || !/^#[0-9a-f]{6}$/i.test(style.color) || !edgeLineStyles.has(style.lineStyle)
            || !Number.isInteger(style.width) || style.width < 1 || style.width > 8) continue;
        styles.edges[edge.data.id] = {color: style.color, lineStyle: style.lineStyle, width: style.width};
    }
    return styles;
};

const saveGraphElementStyle = (element, isNode, style, successMessage) => {
    const id = element.id();
    const key = `${isNode ? 'node' : 'edge'}:${id}`;
    clearTimeout(graphElementStyleSaveTimers.get(key));
    graphElementStyleSaveTimers.set(key, setTimeout(async () => {
        graphElementStyleSaveTimers.delete(key);
        const previousSave = graphElementStyleSaveQueues.get(key) || Promise.resolve();
        const currentSave = previousSave.catch(() => {}).then(async () => {
            const response = await fetch(
                isNode ? `/mindmap/node/${encodeURIComponent(id)}/style` : '/edge/style',
                {
                    method: 'PUT',
                    credentials: 'same-origin',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(isNode ? {style} : {id: Number(id), style})
                }
            );
            if (!response.ok) throw new Error();
        });
        graphElementStyleSaveQueues.set(key, currentSave);
        try {
            await currentSave;
            if (successMessage) setMessage(successMessage, true);
        } catch {
            setMessage('Failed to save element style.');
        } finally {
            if (graphElementStyleSaveQueues.get(key) === currentSave) {
                graphElementStyleSaveQueues.delete(key);
            }
        }
    }, 250));
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

const searchExistingMaterials = async title => {
    const requestId = ++materialSearchRequestId;
    existingMaterialResults.replaceChildren();
    existingMaterialResults.hidden = true;
    if (!title) return;

    try {
        const response = await fetch(
            `/mindmap/material/${encodeURIComponent(window.mindmapId)}?title=${encodeURIComponent(title)}`,
            {credentials: 'same-origin'}
        );
        if (!response.ok) throw new Error('Failed to search existing materials.');
        const materials = await response.json();
        if (requestId !== materialSearchRequestId) return;

        const uniqueMaterials = Array.from(new Map(
            materials.map(material => [String(material.materialId), material])
        ).values());
        if (!uniqueMaterials.length) {
            const emptyOption = document.createElement('div');
            emptyOption.className = 'material-search-empty';
            emptyOption.textContent = 'No matching existing materials.';
            existingMaterialResults.appendChild(emptyOption);
            existingMaterialResults.hidden = false;
            return;
        }

        for (const material of uniqueMaterials) {
            const option = document.createElement('button');
            option.type = 'button';
            option.className = 'material-search-option';
            option.setAttribute('role', 'option');
            option.textContent = material.title;
            option.addEventListener('click', async () => {
                const selectionRequestId = ++materialSearchRequestId;
                option.disabled = true;
                submitCreateNodeButton.disabled = true;
                submitCreateNodeButton.textContent = 'Loading material...';

                try {
                    const detailResponse = await fetch(
                        `/material/${encodeURIComponent(material.materialId)}`,
                        {credentials: 'same-origin'}
                    );
                    if (!detailResponse.ok) throw new Error('Failed to load material details.');
                    const detail = await detailResponse.json();
                    if (selectionRequestId !== materialSearchRequestId) return;

                    selectedExistingMaterialId = detail.id;
                    newNodeTitleInput.value = detail.title || '';
                    newNodeUrlInput.value = detail.url || '';
                    newNodeMemoInput.value = detail.memo || '';
                    newNodeUrlInput.readOnly = true;
                    newNodeMemoInput.readOnly = true;
                    existingMaterialResults.replaceChildren();
                    existingMaterialResults.hidden = true;
                    setCreateNodeMessage('');
                    submitCreateNodeButton.textContent = 'Add selected material';
                } catch (error) {
                    if (selectionRequestId === materialSearchRequestId) {
                        setCreateNodeMessage(error.message);
                        submitCreateNodeButton.textContent = 'Create node';
                    }
                } finally {
                    option.disabled = false;
                    if (selectionRequestId === materialSearchRequestId) {
                        submitCreateNodeButton.disabled = false;
                    }
                }
            });
            existingMaterialResults.appendChild(option);
        }
        existingMaterialResults.hidden = false;
    } catch (error) {
        if (requestId === materialSearchRequestId) setCreateNodeMessage(error.message);
    }
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
    graphElementStyles = loadGraphElementStyles(graph);
    const nodeCount = graph.elements.nodes.length;
    graph.elements.nodes.push({
        data: {id: 'mindmap-title', title: window.mindmapTitle},
        position: {x: 0, y: 0},
        classes: 'mindmap-title',
        locked: true,
        selectable: false,
        grabbable: false
    });
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
                selector: 'node.mindmap-title',
                style: {
                    shape: 'ellipse',
                    width: 220,
                    height: 140,
                    'background-color': '#ffffff',
                    'background-opacity': 0.9,
                    'border-width': 3,
                    'border-color': '#f59e0b',
                    'z-index': -1,
                    color: '#0f172a',
                    'font-size': 20,
                    'text-max-width': '190px',
                    events: 'no'
                }
            },
            {
                selector: 'node:selected',
                style: {
                    'border-color': '#b45309',
                    'border-width': 4
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
                selector: 'edge:selected',
                style: {
                    'overlay-color': '#f59e0b',
                    'overlay-opacity': 0.4,
                    'overlay-padding': 4
                }
            },
            {
                selector: 'edge.name-editing',
                style: {
                    label: ''
                }
            },
        ],
        layout: {
            name: 'preset',
            fit: true,
            padding: 40
        }
    });

    cy.nodes().forEach(node => {
        const style = graphElementStyles.nodes[node.id()];
        if (style) node.style({
            'background-color': style.color,
            shape: style.shape,
            width: style.size,
            height: style.size
        });
    });
    cy.edges().forEach(edge => {
        const style = graphElementStyles.edges[edge.id()];
        if (style) edge.style({
            'line-color': style.color,
            'target-arrow-color': style.color,
            width: style.width,
            'line-style': style.lineStyle
        });
    });

    let connectionPreviewNode;
    let connectionSourceNode;
    let lastPointerEvent;
    let tapSelectionTimer;
    let edgeNameEditor;

    const closeGraphContextMenu = () => {
        graphContextMenu.hidden = true;
        contextMenuElement = undefined;
    };

    const applyElementStyle = (element, isNode, style) => {
        if (isNode) {
            element.style({
                'background-color': style.color,
                shape: style.shape,
                width: style.size,
                height: style.size
            });
            return;
        }

        element.style({
            'line-color': style.color,
            'target-arrow-color': style.color,
            width: style.width,
            'line-style': style.lineStyle
        });
    };

    const showGraphContextMenu = (element, event) => {
        if (element.hasClass('connection-preview') || element.id() === 'mindmap-title') return;

        contextMenuElement = element;
        const isNode = element.isNode();
        graphContextMenuTitle.textContent = isNode ? 'Node style' : 'Edge style';
        nodeStyleOptions.hidden = !isNode;
        edgeStyleOptions.hidden = isNode;
        if (isNode) {
            const style = {...defaultNodeStyle, ...graphElementStyles.nodes[element.id()]};
            nodeStyleColor.value = style.color;
            nodeStyleShape.value = style.shape;
            nodeStyleSize.value = style.size;
        } else {
            const style = {...defaultEdgeStyle, ...graphElementStyles.edges[element.id()]};
            edgeStyleColor.value = style.color;
            edgeStyleWidth.value = style.width;
            edgeStyleLine.value = style.lineStyle;
            edgeStyleName.value = element.data('label') || '';
        }

        graphContextMenu.hidden = false;
        const margin = 8;
        graphContextMenu.style.left = `${Math.max(margin, Math.min(
            event.renderedPosition.x,
            graphContainer.clientWidth - graphContextMenu.offsetWidth - margin
        ))}px`;
        graphContextMenu.style.top = `${Math.max(margin, Math.min(
            event.renderedPosition.y,
            graphContainer.clientHeight - graphContextMenu.offsetHeight - margin
        ))}px`;
    };

    const updateContextElementStyle = () => {
        if (!contextMenuElement) return;

        const isNode = contextMenuElement.isNode();
        const style = isNode
            ? {color: nodeStyleColor.value, shape: nodeStyleShape.value, size: Number(nodeStyleSize.value)}
            : {
                color: edgeStyleColor.value,
                width: Number(edgeStyleWidth.value),
                lineStyle: edgeStyleLine.value
            };
        const styles = isNode ? graphElementStyles.nodes : graphElementStyles.edges;
        styles[contextMenuElement.id()] = style;
        applyElementStyle(contextMenuElement, isNode, style);
        saveGraphElementStyle(contextMenuElement, isNode, style);
    };

    graphContextMenu.addEventListener('click', event => event.stopPropagation());
    ['pointerdown', 'pointerup', 'mousedown', 'mouseup', 'touchstart', 'touchend', 'wheel', 'contextmenu'].forEach(type => {
        graphContextMenu.addEventListener(type, event => {
            event.stopPropagation();
            if (type === 'contextmenu') event.preventDefault();
        });
    });
    document.getElementById('closeGraphContextMenu').addEventListener('click', closeGraphContextMenu);
    document.getElementById('resetElementStyle').addEventListener('click', () => {
        if (!contextMenuElement) return;

        const isNode = contextMenuElement.isNode();
        const styles = isNode ? graphElementStyles.nodes : graphElementStyles.edges;
        const style = {...(isNode ? defaultNodeStyle : defaultEdgeStyle)};
        styles[contextMenuElement.id()] = style;
        applyElementStyle(contextMenuElement, isNode, style);
        saveGraphElementStyle(contextMenuElement, isNode, style, 'Element style reset.');
        showGraphContextMenu(contextMenuElement, {
            renderedPosition: {
                x: Number.parseFloat(graphContextMenu.style.left),
                y: Number.parseFloat(graphContextMenu.style.top)
            }
        });
    });
    [nodeStyleColor, nodeStyleSize, edgeStyleColor, edgeStyleWidth].forEach(input => {
        input.addEventListener('input', updateContextElementStyle);
    });
    [nodeStyleShape, edgeStyleLine].forEach(input => {
        input.addEventListener('change', updateContextElementStyle);
    });
    document.getElementById('saveEdgeStyleName').addEventListener('click', () => {
        if (contextMenuElement?.isEdge()) saveEdgeName(contextMenuElement, edgeStyleName.value.trim());
    });

    const positionEdgeNameEditor = () => {
        if (!edgeNameEditor || edgeNameEditor.edge.removed()) return;

        const midpoint = edgeNameEditor.edge.renderedMidpoint();
        edgeNameEditor.input.style.left = `${midpoint.x}px`;
        edgeNameEditor.input.style.top = `${midpoint.y}px`;
    };

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
        if (!sourceNode || connectionPreviewNode) return;

        connectionSourceNode = sourceNode;
        const startPosition = lastPointerEvent
            ? getPointerPosition(lastPointerEvent)
            : sourceNode.position();
        connectionPreviewNode = cy.add({
            group: 'nodes',
            data: {id: '__connection-preview-node__'},
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
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    mindmapId: Number(window.mindmapId),
                    sourceId: Number(sourceId),
                    targetId: Number(targetId),
                    name: null
                })
            });
            if (!response.ok) throw new Error('Failed to create connection.');

            const edgeId = await response.json();
            cancelConnection();
            cy.add({
                group: 'edges',
                data: {
                    id: String(edgeId),
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
        const edgeId = edge.data('id');

        try {
            const response = await fetch(`/edge/${encodeURIComponent(edgeId)}`, {
                method: 'DELETE',
                credentials: 'same-origin'
            });
            if (!response.ok) throw new Error('Failed to delete connection.');

            edge.remove();
        } catch (error) {
            setMessage(error.message);
        }
    };

    const saveEdgeName = async (edge, name) => {
        try {
            const response = await fetch('/edge/name', {
                method: 'PUT',
                credentials: 'same-origin',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    id: Number(edge.data('id')),
                    name
                })
            });
            if (!response.ok) throw new Error('Failed to save connection name.');

            edge.data('label', name);
            setMessage('Connection name saved.', true);
        } catch (error) {
            setMessage(error.message);
        }
    };

    const finishEdgeNameEdit = save => {
        if (!edgeNameEditor) return;

        const {edge, input} = edgeNameEditor;
        edgeNameEditor = undefined;
        edge.removeClass('name-editing');
        input.remove();

        if (save) saveEdgeName(edge, input.value.trim());
    };

    const startEdgeNameEdit = edge => {
        if (edgeNameEditor) finishEdgeNameEdit(true);

        const input = document.createElement('input');
        input.className = 'edge-name-editor';
        input.type = 'text';
        input.setAttribute('aria-label', 'Connection name');
        input.value = edge.data('label') || '';
        graphContainer.appendChild(input);
        edgeNameEditor = {edge, input};
        edge.addClass('name-editing');

        ['pointerdown', 'mousedown', 'click', 'dblclick', 'wheel'].forEach(type => {
            input.addEventListener(type, event => event.stopPropagation());
        });
        input.addEventListener('input', () => {
            input.style.width = `${Math.max(80, Math.min(240, input.value.length * 8 + 24))}px`;
        });
        input.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                event.preventDefault();
                finishEdgeNameEdit(true);
            }
            if (event.key === 'Escape') {
                event.preventDefault();
                finishEdgeNameEdit(false);
            }
        });
        input.addEventListener('blur', () => finishEdgeNameEdit(true));
        input.dispatchEvent(new Event('input'));
        positionEdgeNameEditor();
        input.focus();
        input.select();
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

    graphContainer.addEventListener('mousemove', moveConnectionPreview);
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
        selectedExistingMaterialId = undefined;
        clearTimeout(materialSearchTimer);
        materialSearchRequestId++;
        newNodeUrlInput.readOnly = false;
        newNodeMemoInput.readOnly = false;
        submitCreateNodeButton.disabled = false;
        existingMaterialResults.replaceChildren();
        existingMaterialResults.hidden = true;
        submitCreateNodeButton.textContent = 'Create node';
        setCreateNodeMessage('');
    });
    newNodeTitleInput.addEventListener('input', () => {
        clearTimeout(materialSearchTimer);
        materialSearchRequestId++;
        submitCreateNodeButton.disabled = false;
        setCreateNodeMessage('');
        existingMaterialResults.replaceChildren();
        existingMaterialResults.hidden = true;
        if (selectedExistingMaterialId !== undefined) {
            selectedExistingMaterialId = undefined;
            newNodeUrlInput.value = '';
            newNodeMemoInput.value = '';
            newNodeUrlInput.readOnly = false;
            newNodeMemoInput.readOnly = false;
        }
        submitCreateNodeButton.textContent = 'Create node';
        const title = newNodeTitleInput.value.trim();
        materialSearchTimer = setTimeout(() => searchExistingMaterials(title), 300);
    });
    createNodeForm.addEventListener('submit', async event => {
        event.preventDefault();

        try {
            if (selectedExistingMaterialId !== undefined) {
                const response = await fetch(`/mindmap/${encodeURIComponent(window.mindmapId)}`, {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({materialId: selectedExistingMaterialId})
                });
                if (!response.ok) throw new Error('Failed to add the selected material.');

                setCreateNodeMessage('Material added to the mindmap.', true);
                window.location.reload();
                return;
            }

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
            const memo = nodeMemoInput.value.trim();
            const response = await fetch(`/material/${encodeURIComponent(selectedNode.data('materialId'))}`, {
                method: 'PUT',
                credentials: 'same-origin',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    title: nodeTitleInput.value.trim(),
                    url: nodeUrlInput.value.trim(),
                    memo,
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
    document.addEventListener('click', event => {
        if (!graphContextMenu.hidden && !graphContextMenu.contains(event.target)) closeGraphContextMenu();
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            const target = event.target;
            if (target instanceof Element && target.closest('button, input, select, textarea, [contenteditable="true"]')) return;
            if (!keyboardSelectedNode || keyboardSelectedNode.removed()) return;

            event.preventDefault();
            openMemoEditorForEmptyNode(keyboardSelectedNode);
        }
        if (event.key === 'Escape') {
            cancelConnection();
            closeGraphContextMenu();
        }
        if (event.key === 'Delete') {
            const target = event.target;
            if (target instanceof Element && target.closest('button, input, select, textarea, [contenteditable="true"]')) return;
            event.preventDefault();
            deleteSelectedElements();
        }
    });

    cy.on('mouseover', 'node', event => {
        showMemoTooltip(event.target);
    });
    cy.on('mouseout', 'node', event => {
        hideMemoTooltip(event.target);
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
    cy.on('cxttap', 'node', event => {
        loadNodeDetails(event.target);
        showGraphContextMenu(event.target, event);
    });
    cy.on('tap', 'node, edge', event => {
        if (connectionPreviewNode && event.target.isNode()) {
            const targetNode = event.target;
            if (targetNode.id() !== connectionSourceNode.id()) completeConnection(targetNode);
            return;
        }

        closeGraphContextMenu();
        keyboardSelectedNode = event.target.isNode() ? event.target : undefined;
        clearTimeout(tapSelectionTimer);
        tapSelectionTimer = setTimeout(() => {
            cy.elements().unselect();
            event.target.select();
            hideCreateNodeForm();
            clearNodeDetails();
        }, 220);
    });
    cy.on('tap', event => {
        if (event.target !== cy) return;

        clearTimeout(tapSelectionTimer);
        cy.elements().unselect();
        keyboardSelectedNode = undefined;
        closeMemoTooltip();
        closeGraphContextMenu();
        clearNodeDetails();
    });
    cy.on('pan zoom position', () => positionMemoTooltip(hoveredMemoNode));
    cy.on('pan zoom position resize', positionEdgeNameEditor);
    cy.on('cxttap', 'edge', event => showGraphContextMenu(event.target, event));
    cy.on('dbltap', 'edge', event => {
        clearTimeout(tapSelectionTimer);
        startEdgeNameEdit(event.target);
    });
    cy.on('dragfree', 'node', event => {
        updateNodeCoords(event.target).catch(error => setMessage(error.message));
    });
    cy.on('dbltap', 'node', event => {
        clearTimeout(tapSelectionTimer);
        cy.elements().unselect();
        keyboardSelectedNode = event.target;
        event.target.select();
        startConnection(event.target);
    });
    document.getElementById('fitGraph').addEventListener('click', () => cy.fit(undefined, 40));
    setSidebarOpen(false);
    setMessage(`${nodeCount} nodes, ${graph.elements.edges.length} connections`, true);
};

loadGraph().catch(error => {
    setMessage(error.message);
});