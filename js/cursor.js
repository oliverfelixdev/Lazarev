const cursor = new MouseFollower();
const vidWrapper = document.querySelector(".video-intro-wrapper");
const ftrContact = document.querySelector(".footer-contact h2");

vidWrapper.addEventListener("mouseenter", () => {
  cursor.setSkewing(0.2);
});

vidWrapper.addEventListener("mouseleave", () => {
  cursor.removeSkewing();
});

ftrContact.addEventListener("mouseenter", () => {
  cursor.setSkewing(0.2);
});

ftrContact.addEventListener("mouseleave", () => {
  cursor.removeSkewing();
});

if (window.innerWidth < 768) {
  cursor.destroy();
  console.log("media screen 768px");
}
