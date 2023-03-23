"use strict";

document.addEventListener("click", async (e) => {
	if (!e.target.closest(".like-button")) return;

	const likeButton = e.target.closest(".like-button");
	const postId = getRootIdElement(likeButton);
	if (!postId) return;

	const postData = await sendLike(postId);
	if (!postData) return;

	likeButton.querySelector("span").innerHTML = `${postData.likes.length}` || "";
	if (postData.likes.includes(USER_LOGGED_IN._id)){
		likeButton.classList.add("active");
	} else {
		likeButton.classList.remove("active");
	}
});

async function sendLike(postId){
	try {
		const response = await fetch(`/api/posts/${postId}/like`, getOptionsPost({}, "PUT"));
		const jsonData = await response.json();
		return jsonData;
	} catch (err) {
		console.error("Something went wrong: ", err);
	}
}
