
  
  function openForm() {
    document.getElementById("myForm").style.display = "block";
  }
  
  function closeForm() {
    document.getElementById("myForm").style.display = "none";
  }
  
  function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    modalImage.src = imageSrc;
    modal.style.display = 'block';
  }
  
  function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
  }
  
  const copyTextElement = document.getElementById('copyText');
  copyTextElement.addEventListener('click', function () {
    const textToCopy = copyTextElement.textContent;
    const textField = document.createElement('textarea');
    textField.textContent = textToCopy;
    textField.style.position = 'absolute';
    textField.style.top = '-1000px';
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    document.body.removeChild(textField);
    alert("Copied successfully");
  });
  
  function openLink(linkURL) {
    window.open(linkURL, '_blank');
  }
  
  var isAudioPlaying = false;
  
  function playAudio() {
    if (!isAudioPlaying) {
       var audioUrl = "https://github.com/ev-discord-bot/ev-info/raw/main/src/the_music.mp3";
       var audioElement = new Audio(audioUrl);
       audioElement.play();
       document.querySelector('#logo-image').src = "https://github.com/ev-discord-bot/ev-info/raw/main/src/rick_logo.svg";
       isAudioPlaying = true;
       document.querySelector('.scrolling-text').style.pointerEvents = 'none';
       audioElement.addEventListener('ended', function () {
          document.querySelector('#logo-image').src = "https://github.com/ev-discord-bot/ev-info/raw/main/src/main_logo.svg";
          audioElement.pause();
          document.querySelector('.scrolling-text').style.pointerEvents = 'auto';
       });
       document.querySelector('#logo-image').addEventListener('click', function () {
          isAudioPlaying = false;
       });
    }
  }
  
  function openLink(linkURL) {
    window.open(linkURL, '_blank');
  }

window.addEventListener('load', function () {
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.style.display = 'none';
  });
  
  const loadingScreen = document.getElementById('loadingScreen');
  const skipLoadingButton = document.getElementById('skipLoadingButton');
  
  skipLoadingButton.addEventListener('click', () => {
    loadingScreen.style.display = 'none';
  });
  
  window.addEventListener('load', function () {});