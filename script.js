document.addEventListener("DOMContentLoaded", () => {
  const giftBox = document.getElementById("gift-box");
  const skyContainer = document.getElementById("sky-container");

  giftBox.addEventListener("click", () => {
    giftBox.classList.add("kick-animation");

    setTimeout(() => {
      giftBox.style.display = "none";
      skyContainer.style.display = "block";
    }, 2000);
  });
});
