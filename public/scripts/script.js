//Global variables
const userId = document.getElementById('userId').value;
const channelId = window.location.href.split('/').slice(-1)[0];
const postsUL = document.getElementById('postsUL');

//Socket script
const socket = io();

sendUserIdToSocket = () => {
  socket.emit('userIdFromClient', userId);
};

socket.on('socketUsersUpdated', (socketUsers) => {
  renderWhoIsOnline(socketUsers);
});

socket.on('postFromServer', (post) => {
  renderPost(post);
});

//Render functions
renderWhoIsOnline = (socketUsers) => {
  document.querySelectorAll('.onlineSpan').forEach((e) => e.remove());
  let arrayOfSocketUsers = Object.entries(socketUsers).map(
    (element) => element[1]
  );
  arrayOfSocketUsers.forEach((user) => {
    let onlineId = user.userId + 'online';
    if (document.getElementById(onlineId) === null) {
      const item = document.createElement('span');
      item.innerHTML = ' online';
      item.classList.add('onlineSpan');
      if (user.userId === userId) {
        item.innerHTML += ' (you)';
      }
      item.id = user.userId + 'online';
      const onlineUser = document.getElementById(user.userId);
      onlineUser.appendChild(item);
    }
  });
};

renderChannels = (channelList) => {
  channelList.forEach((channel) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `/channels/${channel._id}`;
    a.innerHTML = `#${channel.name}`;
    li.appendChild(a);
    channelsUl.insertBefore(li, create);
  });
};

renderUsers = (users) => {
  users.forEach((user) => {
    const li = document.createElement('li');
    li.id = user._id;
    const img = document.createElement('img');
    img.classList.add('icon_image');
    img.src = user.profilePhoto;
    img.alt = user.name;
    li.appendChild(img);
    const a = document.createElement('a');
    a.href = `/channels/DMorProfile/${user._id}`;
    a.innerHTML = user.name;
    li.appendChild(a);
    usersUl.appendChild(li);
  });
};

renderPost = (post) => {
  const li = document.createElement('li');
  li.classList.add('channel__li');
  const bySpan = document.createElement('span');
  bySpan.innerHTML = `${post.byId.name} wrote on ${post.date}:`;
  li.appendChild(bySpan);
  const contentP = document.createElement('p');
  contentP.innerHTML = post.content;
  li.appendChild(contentP);
  if (userId.toString() === post.byId._id.toString()) {
    const span = document.createElement('span');
    const aDelete = document.createElement('a');
    aDelete.href = `/channels/deletePost/${channelId}/${post._id}`;
    aDelete.innerHTML = 'Delete';
    span.appendChild(aDelete);
    li.appendChild(span);
  }
  postsUL.appendChild(li);
};

//API functions
fetchChannels = () => {
  fetch('/api/channels', {
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      renderChannels(data);
    });
};

fetchUsers = () => {
  fetch('/api/users', {
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      renderUsers(data);
    });
};

sendPostByAPI = () => {
  const postBody = {
    content: document.getElementById('content').value,
    by: userId,
  };
  fetch(`/api/channels/${channelId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postBody),
  })
    .then((res) => res.json())
    .then((newPost) => {
      socket.emit('postSaved', newPost);
    });
};

//Functions to run on page load
document.addEventListener('DOMContentLoaded', () => {
  sendUserIdToSocket();
  fetchChannels();
  fetchUsers();
});

if (document.getElementById('postButton') !== null) {
  document.getElementById('postButton').addEventListener('click', (e) => {
    e.preventDefault();
    sendPostByAPI();
    document.getElementById('content').value = '';
  });
}
