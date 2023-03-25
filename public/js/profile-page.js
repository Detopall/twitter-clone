"use strict";

createProfileTabs();
addingPostsToPostsTab();

async function addingPostsToPostsTab(){
	try {
		const postsContainer = document.querySelector(".post-container");
		if (!postsContainer) return;

		if (SELECTED_TAB === "replies"){
			document.querySelector("#replies").classList.add("active");
			document.querySelector("#normal-posts").classList.remove("active");
			
			await loadReplies(postsContainer);
		} else {
			document.querySelector("#replies").classList.remove("active");
			document.querySelector("#normal-posts").classList.add("active");
			
			await loadPosts(postsContainer);
		}
	} catch (err) {
		console.error("Something went wrong: ", err);
	}
}

async function loadReplies(postsContainer){
	const params = new URLSearchParams({postedBy: PROFILE_USER._id, isReply: "true"});
	const response = await fetch("/api/posts?" + params);
	const jsonData = await response.json();
	outputPosts(jsonData, postsContainer);
}

async function loadPosts(postsContainer){
	const params = new URLSearchParams({postedBy: PROFILE_USER._id, isReply: "false"});
	const response = await fetch("/api/posts?" + params);
	const jsonData = await response.json();
	outputPosts(jsonData, postsContainer);
}

function createProfileTabs(){
	const tabsContainer = document.querySelector(".tabs-container");

	const html = `
		<a id="normal-posts" href="/profile/${PROFILE_USER.username}" class="tab active">Posts</a>
		<a id="replies" href="/profile/${PROFILE_USER.username}/replies" class="tab">Replies</a>
	`;

	tabsContainer.insertAdjacentHTML("beforeend", html);
}

