const form = document.getElementById('mindmapForm');
const nameInput = document.getElementById('mindmapName');
const mindmapList = document.getElementById('mindmapList');
const emptyMessage = document.getElementById('emptyMessage');
const message = document.getElementById('message');
const template = document.getElementById('mindmapTemplate');

const setMessage = (text, success = false) => {
    message.textContent = text;
    message.className = `message${success ? ' success' : ' error'}`;
};

const updateEmptyState = () => {
    const hasMindmaps = mindmapList.children.length > 0;
    mindmapList.hidden = !hasMindmaps;
    emptyMessage.hidden = hasMindmaps;
};

const deleteMindmap = async event => {
    const card = event.currentTarget.closest('.mindmap');
    const id = card.dataset.id;
    if (!confirm('Delete this mindmap?')) return;

    const response = await fetch(`/mindmap/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'same-origin'
    });
    if (!response.ok) {
        setMessage('Failed to delete mindmap.');
        return;
    }

    card.remove();
    updateEmptyState();
    setMessage('Mindmap deleted.', true);
};

const renderMindmaps = mindmaps => {
    mindmapList.replaceChildren(...mindmaps.map(mindmap => {
        const item = template.content.cloneNode(true);
        const card = item.querySelector('.mindmap');
        card.dataset.id = mindmap.id;
        item.querySelector('.mindmap-name').textContent = mindmap.name;
        item.querySelector('.mindmap-created').textContent = mindmap.createdAt || '';
        item.querySelector('.delete-mindmap').addEventListener('click', deleteMindmap);
        return item;
    }));
    updateEmptyState();
};

const loadMindmaps = async () => {
    const response = await fetch('/mindmap', {credentials: 'same-origin'});
    if (!response.ok) throw new Error();
    renderMindmaps(await response.json());
};

document.querySelectorAll('.delete-mindmap').forEach(button => {
    button.addEventListener('click', deleteMindmap);
});

form.addEventListener('submit', async event => {
    event.preventDefault();
    const name = nameInput.value.trim();
    if (!name) return;

    const response = await fetch('/mindmap', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin',
        body: JSON.stringify({name})
    });
    if (!response.ok) {
        setMessage('Failed to create mindmap.');
        return;
    }

    nameInput.value = '';
    await loadMindmaps();
    setMessage('Mindmap created.', true);
});

updateEmptyState();
