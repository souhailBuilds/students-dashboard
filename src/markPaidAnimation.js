import { DotLottie } from "https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web/+esm";
import { canvasUI } from "./ui";

export default function markPaidAniimation() {
  const animation = new DotLottie({
    autoplay: true,
    loop: false,
    canvas: document.getElementById("mark-paid-canvas"),
    src: "/jsonAnimation/wallet.json",
  });
  //reset and remove hidden from canavas
  canvasUI.context.clearRect(
    0,
    0,
    canvasUI.canvasMarkPaidAnimation.width,
    canvasUI.canvasMarkPaidAnimation.height,
  );

  if (animation) {
    document.querySelector(".animation-mark-paid").classList.remove("hidden");
    canvasUI.canvasMarkPaidAnimation.classList.remove("hidden");

    animation.addEventListener("complete", function () {
      //document.getElementById("mark-paid-canvas").classList.add("hidden");
      document.querySelector(".animation-mark-paid").classList.add("hidden");
    });
  }
}
