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

const attachCardNavigation = card => {
    const detailId = card.dataset.id || card.getAttribute('data-id');
    if (!detailId) return;

    const detailUrl = `/mindmap-detail.html?id=${encodeURIComponent(detailId)}`;
    card.setAttribute('tabindex', '0');
    card.addEventListener('click', event => {
        if (event.target.closest('button')) return;
        window.location.href = detailUrl;
    });
    card.addEventListener('keydown', event => {
        if ((event.key === 'Enter' || event.key === ' ') && !event.target.closest('button')) {
            event.preventDefault();
            window.location.href = detailUrl;
        }
    });
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
        attachCardNavigation(card);
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

document.querySelectorAll('.mindmap').forEach(attachCardNavigation);

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
