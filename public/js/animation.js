const titles = gsap.utils.toArray("h1");
const tl = gsap.timeline({ repeat: -1 });
const matchMedia = gsap.matchMedia();
// this check if scren with is for only desktop screen start run animation
matchMedia.add("(min-width:1025px)", () => {
  console.log("big-screen");
  titles.forEach((title, i) => {
    tl.from(
      title,
      {
        opacity: 0,
        y: 80,
        rotateX: -90,
      },
      "<",
    ).to(
      title,
      {
        opacity: 0,
        y: -80,
        rotateX: 90,
      },
      "<2",
    );
  });
});
