const deleteButton = document.getElementById('deleteButton');
if (deleteButton) deleteButton.addEventListener('click', async event => {
    if (!confirm('Delete this material?')) return;
    const response = await fetch(`/material/${encodeURIComponent(event.currentTarget.dataset.id)}`, {
        method: 'DELETE',
        credentials: 'same-origin'
    });
    if (response.ok) location.href = '/materials.html'; else alert('Failed to delete material.')
});

const relationshipToggle = document.getElementById('relationshipToggle');
const relationshipClose = document.getElementById('relationshipClose');
const relationshipSidebar = document.getElementById('relationshipSidebar');
const relationshipBackdrop = document.getElementById('relationshipBackdrop');
const relationshipList = document.getElementById('relationshipList');
const relationshipEmpty = document.getElementById('relationshipEmpty');
const edgeDialog = document.getElementById('edgeDialog');
const edgeForm = document.getElementById('edgeForm');
const cancelEdgeButton = document.getElementById('cancelEdgeButton');
const edgeName = document.getElementById('edgeName');
const edgeTarget = document.getElementById('edgeTarget');
const materialId = document.body.dataset.materialId;
let selectedMaterial;

if (cancelEdgeButton) {
    cancelEdgeButton.addEventListener('click', () => {
        edgeDialog.close();
        edgeName.value = '';
    });
}

const closeSidebar = () => {
    relationshipSidebar.classList.remove('open');
    relationshipSidebar.setAttribute('aria-hidden', 'true');
    relationshipToggle.setAttribute('aria-expanded', 'false');
    relationshipBackdrop.hidden = true;
};

const renderMaterials = materials => {
    const availableMaterials = materials.filter(material => String(material.id) !== materialId);
    relationshipList.replaceChildren(...availableMaterials.map(material => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'relationship-item';
        button.dataset.id = material.id;
        button.innerHTML = '<strong></strong><span></span>';
        button.querySelector('strong').textContent = material.title;
        button.querySelector('span').textContent = material.memo || 'No memo available.';
        button.addEventListener('click', () => {
            selectedMaterial = material;
            edgeTarget.textContent = `${document.querySelector('h1').textContent} -> ${material.title}`;
            edgeName.value = '';
            edgeDialog.showModal();
            edgeName.focus();
        });
        return button;
    }));
    relationshipEmpty.hidden = availableMaterials.length !== 0;
};

const openSidebar = async () => {
    relationshipSidebar.classList.add('open');
    relationshipSidebar.setAttribute('aria-hidden', 'false');
    relationshipToggle.setAttribute('aria-expanded', 'true');
    relationshipBackdrop.hidden = false;
    relationshipList.replaceChildren();
    relationshipEmpty.hidden = true;
    try {
        const response = await fetch('/material?title=', {credentials: 'same-origin'});
        if (!response.ok) throw new Error();
        renderMaterials(await response.json());
    } catch {
        relationshipEmpty.textContent = 'Failed to load materials.';
        relationshipEmpty.hidden = false;
    }
};

if (relationshipToggle) {
    relationshipToggle.addEventListener('click', openSidebar);
    relationshipClose.addEventListener('click', closeSidebar);
    relationshipBackdrop.addEventListener('click', closeSidebar);
}

if (edgeForm) edgeForm.addEventListener('submit', async event => {
    if (event.submitter?.value !== 'connect') return;
    event.preventDefault();
    const response = await fetch('/edge', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin',
        body: JSON.stringify({sourceId: Number(materialId), targetId: selectedMaterial.id, name: edgeName.value.trim()})
    });
    if (!response.ok) {
        alert('Failed to connect materials.');
        return;
    }
    edgeDialog.close();
    closeSidebar();
});
