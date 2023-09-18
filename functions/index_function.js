const background = document.getElementById('interactive-background');
const customCursor = document.querySelector('.custom-cursor');

document.addEventListener('mousemove', (e) => {
   const x = e.clientX;
   const y = e.clientY;

   // Update custom cursor position
   customCursor.style.left = x + 'px';
   customCursor.style.top = y + 'px';

   // Update background color based on cursor position
   const red = Math.floor((x / window.innerWidth) * 255);
   const blue = Math.floor((y / window.innerHeight) * 255);
   background.style.backgroundColor = `rgb(${red}, 0, ${blue})`;
});

document.addEventListener('mousemove', (e) => {
   const background = document.getElementById('background');
   const mouseX = e.clientX / window.innerWidth;
   const mouseY = e.clientY / window.innerHeight;
   const translateX = mouseX * 20 - 10; // Adjust the sensitivity
   const translateY = mouseY * 20 - 10; // Adjust the sensitivity
   background.style.transform = `translate(${translateX}px, ${translateY}px)`;
});

const fetchUserButton = document.getElementById('fetchUserButton');
const usernameInput = document.getElementById('usernameInput');
const loadingMessage = document.getElementById('loadingMessage');
const userInfoDiv = document.getElementById('userInfo');
const middleHeader = document.getElementById('middleHeader');
const userImage = document.getElementById('userImage');
const moreInfoButton = document.getElementById('moreInfoButton');
const moreInfoDetails = document.getElementById('moreInfoDetails');
let user; // Store user data

// Function to fetch user info
const fetchUserInfo = () => {
   const username = usernameInput.value.trim();
   if (username === '') {
      alert('Please enter a username.');
      return;
   }

   // Display loading message while fetching data
   loadingMessage.style.display = 'block';
   userInfoDiv.innerHTML = '';
   middleHeader.style.display = 'none';
   moreInfoDetails.style.display = 'none';

   // Make a GET request to the API
   fetch(`https://ev.io/stats-by-un/${encodeURIComponent(username)}`)
      .then(response => response.json())
      .then(data => {
         // Hide loading message
         loadingMessage.style.display = 'none';

         if (data.length === 0) {
            userInfoDiv.innerHTML = '<p>User not found.</p>';
            moreInfoButton.style.display = 'none'; // Hide more info button if user not found
         } else {
            user = data[0]; // Store user data
            middleHeader.style.display = 'block';
            middleHeader.innerHTML = `<h2>User Information for ${user.name[0].value}</h2>`;
            const uidUrl = `https://ev.io/user/${user.uid[0].value}`;
            const crosshairUrl = `${user.field_custom_crosshair[0].url}`;
            userInfoDiv.innerHTML = `
                           <p><strong>Username:</strong> ${user.name[0].value}</p>
                           <p><strong>User URL:</strong> <a href="${uidUrl}" target="_blank">https://ev.io/user/${user.uid[0].value}</a></p>
                           <p><strong>Kills:</strong> ${user.field_kills[0].value}</p>
                           <p><strong>Deaths:</strong> ${user.field_deaths[0].value}</p>
                           <p><strong>KD:</strong> ${user.field_k_d[0].value}</p>
                           <p><strong>Rank:</strong> ${user.field_rank[0].value}</p>
                           <p><strong>Score:</strong> ${user.field_score[0].value}</p>
                           <p><strong>Crosshair:</strong> <a href="${crosshairUrl}" target="_blank">Users Crosshair</a></p>
                       `;
            moreInfoButton.style.display = 'block'; // Show more info button
         }
      })
      .catch(error => {
         loadingMessage.style.display = 'none';
         userInfoDiv.innerHTML = '<p>Error fetching user information.</p>';
         moreInfoButton.style.display = 'none'; // Hide more info button on error
         console.error('Error:', error);
      });
};

// Function to show more user details
const showMoreInfo = () => {
   if (usernameInput.value.trim() === '') {
      alert('Please enter a username.');
      return;
   }
   moreInfoDetails.style.display = 'block';
   if (user) {
      moreInfoDetails.innerHTML = `
                   <p><strong>Abilities Layout:</strong> ${user.field_abilities_loadout[0].value}</p>
                   <p><strong>Total Games:</strong> ${user.field_total_games[0].value}</p>\
                   <p><strong>Wallet Address:</strong> ${user.field_wallet_address[0].value}</p>
                   <p><strong>Weekly Score:</strong> ${user.field_weekly_score[0].value}</p>
                   <p><strong>CP Earned Weekly:</strong> ${user.field_cp_earned_weekly[0].value}</p>
                   <p><strong>CP Lifetime Earned:</strong> ${user.field_lifetime_cp_earned[0].value}</p>
                   <p><strong>Ev Coins:</strong> ${user.field_ev_coins[0].value}</p>
                   <!-- Add more details as needed -->
               `;
   }
};

fetchUserButton.addEventListener('click', fetchUserInfo);
moreInfoButton.addEventListener('click', showMoreInfo);

// Listen for Enter key press in the username input field
usernameInput.addEventListener('keyup', event => {
   if (event.key === 'Enter') {
      fetchUserInfo();
   }
});

function openCity(evt, cityName) {
   var i, tabcontent, tablinks;
   tabcontent = document.getElementsByClassName("tabcontent");
   for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
   }
   tablinks = document.getElementsByClassName("tablinks");
   for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
   }
   document.getElementById(cityName).style.display = "block";
   evt.currentTarget.className += " active";
};


// NFT-related code...
const outputDiv = document.getElementById('output');
const nftIdInput = document.getElementById('nftIdInput');
const searchButton = document.getElementById('searchButton');

nftIdInput.addEventListener('keyup', (event) => {
   if (event.key === 'Enter') {
      // Trigger a click on the search button
      searchButton.click();
   }
});

searchButton.addEventListener('click', () => {
   const nftId = nftIdInput.value.trim();
   if (!nftId) {
      alert('Please enter an NFT ID.');
      return;
   }


   // Display loading message while fetching data
   loadingMessage.style.display = 'block';
   outputDiv.innerHTML = '';

   const api_url = `https://ev.io/get-nft-flags/${nftId}`;

   fetch(api_url)
      .then(response => {
         if (!response.ok) {
            throw new Error('Network response was not ok');
         }
         return response.json();
      })
      .then(data => {
         // Hide loading message
         loadingMessage.style.display = 'none';

         const reset_time = data[0]["field_reset_time"];
         const field_meta = JSON.parse(data[0]["field_meta"][0]);

         const skin_name = field_meta["value"]["name"];
         const thumbnail = field_meta["value"]["image"];

         let game_node_id = null;
         const attributes = field_meta["value"]["attributes"];
         for (const attribute of attributes) {
            if (attribute["trait_type"] === "game-node-id") {
               game_node_id = attribute["value"];
               break;
            }
         }

         let weapon_type = null;
         for (const attribute of attributes) {
            if (attribute["trait_type"] === "tier") {
               weapon_type = attribute["value"];
               break;
            }
         }

         let collection = null;
         for (const attribute of attributes) {
            if (attribute["family"] === "EV.IO") {
               collection = attribute["value"];
               break;
            }
         }

         // Create a container for the info
         const infoContainer = document.createElement('div');
         infoContainer.style.marginBottom = '20px'; // Add spacing to the info

         // Create an image element for the thumbnail
         const thumbnailImage = document.createElement('img');
         thumbnailImage.src = thumbnail;
         thumbnailImage.style.maxWidth = '30%'; // Ensure the image fits the container width
         thumbnailImage.style.borderRadius = '15px'; // Ensure the image fits the container width

         // Append the thumbnail image to the info container
         infoContainer.appendChild(thumbnailImage);
         const uidUrl = `https://ev.io/node/${game_node_id}`;
         // Display the extracted data on the web page
         infoContainer.innerHTML += `
                    <p><strong>Skin Name:</strong> ${skin_name}</p>
                    <p><strong>Game Node URL:</strong> <a href="${uidUrl}" target="_blank">${uidUrl}</a></p>
                    <p><strong>Weapon Type:</strong> ${weapon_type}</p>
                    <p><strong>Reset Time:</strong> ${reset_time}</p>
                    <p><strong>Collection:</strong> ${collection}</p>
                `;

         // Append the info container to the output div
         outputDiv.appendChild(infoContainer);
      })
      .catch(error => {
         // Hide loading message on error
         loadingMessage.style.display = 'none';
         console.error('Error:', error);
         outputDiv.innerHTML = '<p>Invalid ID</p>';
      });
});


document.getElementById("defaultOpen").click();