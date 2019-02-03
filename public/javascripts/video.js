var videoElem = document.getElementsByTagName('video') 

videoElem.onpause = () => {
  videoElem.play();
}
