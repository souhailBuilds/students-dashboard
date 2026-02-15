import { DotLottie } from "https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web/+esm";
import { canvasUI } from "./ui";
//if the form if succesfully filled return an animation
export default function successRegisterStudent() {
  const animation = new DotLottie({
    autoplay: true,
    loop: false,
    canvas: document.getElementById("canvas"),
    src: "/jsonAnimation/success.json",
  });
  //reset and remove hidden from canavas
  canvasUI.context.clearRect(
    0,
    0,
    canvasUI.canvasAnimation.width,
    canvasUI.canvasAnimation.height,
  );
  canvasUI.canvasAnimation.classList.remove("hidden");

  animation.addEventListener("complete", function () {
    document.getElementById("canvas").classList.add("hidden");
  });
}
