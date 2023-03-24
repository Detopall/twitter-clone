"use strict";

document.addEventListener("click", async (e) => {
	if (!e.target.closest(".retweet-button")) return;

	const retweetButton = e.target.closest(".retweet-button");
	const postId = getRootIdElement(retweetButton);
	if (!postId) return;

	const postData = await sendRetweet(postId);
	if (!postData) return;

	retweetButton.querySelector("span").innerHTML = postData.retweetUsers.length || "";
	if (postData.retweetUsers.includes(USER_LOGGED_IN._id)){
		retweetButton.classList.add("active");
	} else {
		retweetButton.classList.remove("active");
	}
});

async function sendRetweet(postId){
	try {
		const response = await fetch(`/api/posts/${postId}/retweet`, getOptionsPost({}, "POST"));
		const jsonData = await response.json();
		return jsonData;
	} catch (err) {
		console.error("Something went wrong: ", err);
	}
}