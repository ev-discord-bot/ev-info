function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    modalImage.src = imageSrc;
    modal.style.display = 'block';
 }
 
 // Function to close the modal
 function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
 }