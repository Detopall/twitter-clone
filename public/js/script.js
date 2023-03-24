"use strict";

document.addEventListener("keyup", (e) => {
	if (e.target.matches("#post-textarea")){
		const postTxtArea = document.querySelector("#post-textarea");
		const submitButton = document.querySelector("#submit-post-button");
		textAreaBehaviour(postTxtArea, submitButton);
	}
	if (e.target.matches("#reply-textarea")) {
		const replyTxtArea = document.querySelector("#reply-textarea");
		const replyButton = document.querySelector("#submit-reply-button");
		textAreaBehaviour(replyTxtArea, replyButton);
	}
});

document.addEventListener("click", (e) => {
	if (!e.target.closest(".post")) return;

	const element = e.target;
	const postId = getRootIdElement(element);
	if (!postId || e.target.matches("button")) return;

	window.location.href = `/post/${postId}`;
});


function textAreaBehaviour(textarea, button){
	if (!textarea) return;	
	if (!button) return;

	const value = textarea.value.trim();
	if (value === ""){
		button.disabled = true;
		button.style.cursor = null;
	} else {
		button.disabled = false;
		button.style.cursor = "pointer";
	}
}

function getRootIdElement(element){
	const isRoot = element.classList.contains("post");
	const root = isRoot ? element : element.closest(".post");
	return root.getAttribute("data-id");
}

async function createPost(textarea, submitButton, data){
	if (!textarea || !submitButton) return;
	try {
		const response = await fetch("/api/posts", getOptionsPost(data, "POST"));
		const jsonData = await response.json();
		textarea.value = "";
		submitButton.disabled = true;

		if (jsonData.replyTo){
			location.reload();
		}

		return jsonData;
	} catch (err) {
		console.error("Something went wrong: ", err);
	}		
}


function outputPosts(results, container){
	container.innerHTML = "";

	if (!Array.isArray(results)){
		results = [results];
	}

	results.forEach(res => {
		const html = createPostHtml(res);
		container.insertAdjacentHTML("afterbegin", html);
	});

	if (results.length === 0){
		container.insertAdjacentHTML("afterbegin", `<p>No content to show.</p>`);
	}
}

function outputPostsWithReplies(results, container){
	container.innerHTML = "";

	if(results.replyTo && results.replyTo._id){
		const html = createPostHtml(results.replyTo);
		container.insertAdjacentHTML("afterbegin", html);
	}

	const mainPostHtml = createPostHtml(results.postData, true);
	container.insertAdjacentHTML("afterbegin", mainPostHtml);

	results.replies.forEach(res => {
		const html = createPostHtml(res);
		container.insertAdjacentHTML("beforeend", html);
	});
}