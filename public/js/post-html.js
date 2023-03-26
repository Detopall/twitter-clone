"use strict";

function deleteButtonHtml(postData){
	if (!postData) return;
	let deleteButton = "";
	if (postData.postedBy._id === USER_LOGGED_IN._id){
		deleteButton = `
			<button data-id="${postData._id}" data-bs-toggle="modal" data-bs-target="#delete-post-modal" class="delete-post-button">
				<i class="fa-regular fa-trash-can"></i>
			</button>`;
	}
	return deleteButton;
}


function createPostHtml(postData, largeFont=false){
	if (!postData) return;

	const isRetweet = postData.retweetData !== undefined;
	const retweetedBy = isRetweet ? postData.postedBy.username : null;
	postData = isRetweet ? postData.retweetData : postData;

	const postedBy = postData.postedBy;

	const displayName = `${postedBy.firstname} ${postedBy.lastname}`;
	const timestamp = timeSince(postData.createdAt);

	const likedBtnActiveClass = postData.likes.includes(USER_LOGGED_IN._id) ? "active" : "";
	const retweetBtnActiveClass = postData.retweetUsers.includes(USER_LOGGED_IN._id) ? "active": "";

	let retweetText = "";
	if (isRetweet){
		retweetText = `<span>Retweeted by: <a href="/profile/${retweetedBy}">@${retweetedBy}</a></span>`;
	}

	let replyFlag = "";
	if (postData.replyTo && postData.replyTo._id){
		const replyToUsername = postData.replyTo.postedBy.username;
		replyFlag = `<div class="reply-flag">Replying to
						<a href="/profile/${replyToUsername}"> @${replyToUsername}</a>
					</div>`;
	}
	
	const largeFontClass = largeFont ? "largeFont" : "";
	return renderHtml(postData, displayName, timestamp, likedBtnActiveClass, retweetBtnActiveClass, retweetText, replyFlag, largeFontClass);
}

function renderHtml(postData, displayName, timestamp, likedBtnActiveClass, retweetBtnActiveClass, retweetText, replyFlag, largeFontClass){
	if (!postData) return;
	const deleteButton = deleteButtonHtml(postData);
	return `
	<div class="post ${largeFontClass}" data-id='${postData._id}'>
		<div class="post-action-container">${retweetText}</div>
		<div class="main-content-container">
			<div class="user-img-container">
				<img src="../../${postData.postedBy.profilePic}" alt='profile-pic'>
			</div>
			<div class="post-content-container">
				<div class="header">
					<a href="/profile/${postData.postedBy.username}" class="display-name">
						${displayName}
					</a>
					<span class="username">@${postData.postedBy.username}</span>
					<span class="date">${timestamp}</span>
					${deleteButton}
				</div>
				${replyFlag}
				<div class="post-body">
					<span>${postData.content}</span>
				</div>
				<div class="post-footer">
					<div class="post-button-container like">
						<button class="like-button ${likedBtnActiveClass}">
							<i class="far fa-heart"></i>
							<span>${postData.likes.length || ""}</span>
						</button>
					</div>

					<div class="post-button-container retweet">
						<button class="retweet-button ${retweetBtnActiveClass}">
							<i class='fas fa-retweet'></i>
							<span>${postData.retweetUsers.length || ""}</span>
						</button>
					</div>

					<div class="post-button-container">
						<button class="reply-button" data-bs-toggle="modal" data-bs-target="#reply-modal">
							<i class="far fa-comment"></i>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	`;
}
