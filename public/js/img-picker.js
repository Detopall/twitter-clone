"use strict";

const IMG_NAMES = ["car", "crow", "fish", "skater", "profilePic"];

const mainProfilePic = document.querySelector(".profile-header-container img");
const imgPickerContainer = document.querySelector("#img-picker-container");

mainProfilePic.addEventListener("click", (e) => {
	imgPickerContainer.innerHTML = "";
	let html = "";
	IMG_NAMES.forEach(img => {
		html += `<img src="../images/${img}.png" alt="${img}-profile">`;
	});
	imgPickerContainer.insertAdjacentHTML("beforeend", html);
});


imgPickerContainer.addEventListener("click", (e) => {
	const img = e.target;
	if (!img.matches("img")) return;
	
	const changeImgButton = document.querySelector("#submit-img-picker-button");
	if (!changeImgButton) return;

	changeImgButton.disabled = false;
	changeImgButton.setAttribute("img-uri", img.getAttribute("src").slice(3)); //remove '../'
});

document.addEventListener("click", async (e) => {
	const changeImgButton = document.querySelector("#submit-img-picker-button");

	if (!changeImgButton) return;
	if (!e.target.matches("#submit-img-picker-button")) return;

	await sendImgRequest(changeImgButton.getAttribute("img-uri"));
	location.reload();
});

async function sendImgRequest(imgUri){
	try {
		const response = await fetch(`/api/profile/image`, getOptionsPost({image: imgUri}, "PUT"));
		return response;
	} catch (err) {
		console.error("Something went wrong: ", err);
	}
}

