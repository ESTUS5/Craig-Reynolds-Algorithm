var pageX = document.getElementById("x");
var pageY = document.getElementById("y");

function MouseCordinates(event) {
  pageX.innerText = event.pageX;
  pageY.innerText = event.pageY;
}

canvas.addEventListener("mousemove", MouseCordinates, false);
canvas.addEventListener("mouseenter", MouseCordinates, false);
canvas.addEventListener("mouseleave", MouseCordinates, false);