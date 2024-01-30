const displaySavedUserInfoButton = document.getElementById('displaySavedUserInfoButton');
const fetchUserButton = document.getElementById('fetchUserButton');
const usernameInput = document.getElementById('usernameInput');
const loadingMessage = document.getElementById('loadingMessage');
const userInfoDiv = document.getElementById('userInfo');
const middleHeader = document.getElementById('middleHeader');
const userImage = document.getElementById('userImage');
const moreInfoButton = document.getElementById('moreInfoButton');
const moreInfoDetails = document.getElementById('moreInfoDetails');
let user;

function getParameterByName(name, url) {
   if (!url) url = window.location.href;
   name = name.replace(/[\[\]]/g, '\\$&');
   var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
   if (!results) return null;
   if (!results[2]) return '';
   return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const username = getParameterByName('username');

const fetchImage = (imageUrl) => {
   return fetch(imageUrl)
      .then(response => {
         if (!response.ok) {
            throw new Error(`Failed to fetch image. Status: ${response.status}`);
         }
         return response.blob();
      })
      .then(blob => URL.createObjectURL(blob))
      .catch(error => console.error('Error fetching image:', error));
};

displaySavedUserInfoButton.addEventListener('click', () => {
   const savedUsername = localStorage.getItem('savedUsername');

   if (savedUsername) {
      usernameInput.value = savedUsername;
      fetchUserInfo();
   } else {
      alert('No saved username found.\nIf you want to save your username click the "Saved Username" button');
   }
});

const fetchUserInfo = () => {
   const username = usernameInput.value.trim();

   if (username === '') {
      alert('Please enter a username.');
      return;
   }

   loadingMessage.style.display = 'block';
   userInfoDiv.innerHTML = '';
   middleHeader.style.display = 'none';
   moreInfoDetails.style.display = 'none';

   fetch(`https://ev.io/stats-by-un/${encodeURIComponent(username)}`)
      .then(response => {
         if (!response.ok) {
            throw new Error(`Failed to fetch user information. Status: ${response.status}`);
         }
         return response.json();
      })
      .then(data => {
         loadingMessage.style.display = 'none';

         if (data.length === 0) {
            userInfoDiv.innerHTML = '<p>User not found.</p>';
            moreInfoButton.style.display = 'none';
         } else {
            user = data[0];
            const uidUrl = `https://ev.io/user/${user.uid[0].value}`;
            try {
               const crosshairUrl = `${user.field_custom_crosshair[0].url}`;
               const eCoinBalance = user.field_ev_coins[0].value;
               const usdValue = eCoinBalance / 2000;
               const usdValueFormatted = usdValue.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
               });

               const usdValueSpan = document.createElement("span");
               usdValueSpan.textContent = usdValueFormatted;
               usdValueSpan.classList.add("formatted-value");;

               userInfoDiv.innerHTML = `
               <h3>User Information for ${user.name[0].value === 'iminthebibleson' ? `iminthebibleson | Owner Of Site <img src="src/cat.gif" height="auto" width="35px" style="border-radius: 15px;">` : user.name[0].value}</h3>
               <p>Short cut URl: <strong style="user-select: all;">https://evinfo.vercel.app?username=${user.name[0].value}</strong></p>
               <p><strong>Username:</strong>${user.name[0].value === 'iminthebibleson' ? `iminthebibleson <em>fear me <img src="src/dog_flew.gif" height="auto" width="25px" style="border-radius: 15px;"></em></i>` : user.name[0].value}</p>
               <p><strong><i class="fa-solid fa-link" style="color: #ffffff;"></i> User URL: </strong><a style="text-decoration: none; color: #FFA500;" href="${uidUrl}" target="_blank">https://ev.io/user/${user.uid[0].value}</a></p>
               <p><strong><i class="fa-solid fa-skull" style="color: #ffffff;"></i> Kills:</strong> ${user.field_kills[0].value.toLocaleString()} | 
               <strong><i class="fa-solid fa-skull-crossbones" style="color: #ffffff;"></i> Deaths:</strong> ${user.field_deaths[0].value.toLocaleString()} | 
               <strong><i class="fa-solid fa-person-rifle" style="color: #ffffff;"></i> KD:</strong> ${user.field_k_d[0].value}</p>
               <p><strong><i class="fa-solid fa-ranking-star" style="color: #ffffff;"></i> Ranking:</strong> ${user.field_rank[0].value.toLocaleString()} | 
               <strong><i class="fa-solid fa-star" style="color: #ffffff;"></i> Score:</strong> ${user.field_score[0].value.toLocaleString()}</p>
               <p><strong><img src="src/e_coin.png" alt="Sol Logo" style="width: 15; height: 15px; margin-bottom: 6px; user-select: none;"> Coins:</strong> ${user.field_ev_coins[0].value.toLocaleString()} | 
               <strong>Estimated Value:</strong> ${usdValueFormatted}
               <img src="src/usdc-coin.svg" alt="Sol Logo" style="width: 20; height: 20px; margin-bottom: 6px; user-select: none;">
               <br><strong><i class="fa-solid fa-square-check" style="color: #ffffff;"></i> Users Status:</strong> ${user.field_social_bio[0]?.value || 'No Bio Set'} ${user.field_social_bio[0]?.value.toLowerCase().includes('the lag tho') || user.field_social_bio[0]?.value.toLowerCase().includes('lag') ? '(fr tho)' : ''}</p>
               <hr>
               <p><strong><i class="fa-solid fa-crosshairs" style="color: #ffffff;"></i> Crosshair:</strong> <a style="text-decoration: none; color: #FFA500;" href="${crosshairUrl}" target="_blank">Users Crosshair</a></p>
           `;

            } catch (error) {
               console.error('Error fetching crosshair:', error);
               const uidUrl = `https://ev.io/user/${user.uid[0].value}`;
               const eCoinBalance = user.field_ev_coins[0].value;
               const usdValue = eCoinBalance / 2000;
               userInfoDiv.innerHTML = `
<h3>User Information for ${user.name[0].value}
</h3>
<p><strong>Username:</strong> ${user.name[0].value}
</p>
<p><strong><i class="fa-solid fa-link" style="color: #ffffff;"></i> User URL: </strong><a style="text-decoration: none; color: #FFA500;" href="${uidUrl}" target="_blank">https://ev.io/user/${user.uid[0].value}</a></p>
<p><strong><i class="fa-solid fa-skull" style="color: #ffffff;"></i> Kills:</strong> ${user.field_kills[0].value.toLocaleString()}
	| <strong><i class="fa-solid fa-skull-crossbones" style="color: #ffffff;"></i> Deaths:</strong> ${user.field_deaths[0].value.toLocaleString()}
	| <strong><i class="fa-solid fa-person-rifle" style="color: #ffffff;"></i> KD:</strong> ${user.field_k_d[0].value}
</p>
<p><strong><i class="fa-solid fa-ranking-star" style="color: #ffffff;"></i> Ranking:</strong> ${user.field_rank[0].value.toLocaleString()}
	| <strong><i class="fa-solid fa-star" style="color: #ffffff;"></i> Score:</strong> ${user.field_score[0].value.toLocaleString()}
</p>
<p><strong><img src="src/e_coin.png" alt="Sol Logo" style="width: 15; height: 15px; margin-bottom: 6px;"> Coins:</strong> ${user.field_ev_coins[0].value.toLocaleString()}
	| <strong>Estimated Value:</strong> $${usdValue.toFixed(2).toLocaleString()}
	<img src="src/usdc-coin.svg" alt="Sol Logo" style="width: 20; height: 20px; margin-bottom: 6px;">
  <br><strong><i class="fa-solid fa-square-check" style="color: #ffffff;"></i> Users Status:</strong> ${user.field_social_bio[0]?.value || 'No Bio Set'} ${user.field_social_bio[0]?.value.toLowerCase().includes('the lag tho') || user.field_social_bio[0]?.value.toLowerCase().includes('lag') ? '(fr tho)' : ''}</p>
  </p>
<hr>
<p><strong><i class="fa-solid fa-crosshairs" style="color: #ffffff;"></i> Crosshair:</strong> Default</p>
`;
            }


            const skinId = user.field_eq_skin[0].target_id;
            if (skinId) {
               fetch(`https://ev.io/node/${skinId}?_format=json`)
                  .then(response => {
                     if (!response.ok) {
                        throw new Error(`Failed to fetch skin data. Status: ${response.status}`);
                     }
                     return response.json();
                  })
                  .then(skinData => {
                     const skinImage = skinData.field_wallet_image[0].url;
                     return fetchImage(skinImage);
                  })
                  .then(skinImageUrl => {
                     const skinInfo = document.createElement('div');
                     skinInfo.innerHTML = `<br><img src="${skinImageUrl}" alt="${user.name[0].value}'s Skin" style="max-width: 200px; border-radius: 25px;">`;
                     userInfoDiv.appendChild(skinInfo);
                  })
                  .catch(error => console.error('Error fetching skin data:', error));
            }

            if (user) {
               userInfoDiv.style.display = 'block';
               moreInfoButton.style.display = 'block';
            }
         }
      })
      .catch(error => {
         loadingMessage.style.display = 'none';
         userInfoDiv.innerHTML = `<p>Error fetching user information. ${error.message}</p>`;
         moreInfoButton.style.display = 'none';
         console.error('Error:', error);
      });
};
if (username) {
   usernameInput.value = username;
   fetchUserInfo();
   document.getElementById('userinfo-lookup').scrollIntoView({ behavior: 'smooth' });
}

const showMoreInfo = () => {
   const username = usernameInput.value.trim();
   if (username === '') {
      alert('Please enter a username.');
      return;
   }

   if (user) {
      moreInfoDetails.style.display = 'block';
      userInfoDiv.style.display = 'none';
      moreInfoDetails.innerHTML = `
<p><strong>Abilities Layout:</strong> ${user.field_abilities_loadout[0].value}</p>
<p><strong>Total Games:</strong> ${user.field_total_games[0].value}</p>
<p><strong>Wallet Address:</strong> <span style="text-decoration: underline; user-select: all;">${user.field_wallet_address[0].value}<span></p>
<p><strong>Weekly Score:</strong> ${user.field_weekly_score[0].value} | <strong>CP Earned Weekly:</strong> ${user.field_cp_earned_weekly[0].value}</p>
<p><strong>CP Lifetime Earned:</strong> ${user.field_lifetime_cp_earned[0].value} | <strong>Ev Coins:</strong> ${user.field_ev_coins[0].value}</p>
`;
   }
};

fetchUserButton.addEventListener('click', fetchUserInfo);
moreInfoButton.addEventListener('click', showMoreInfo);


usernameInput.addEventListener('keyup', event => {
   if (event.key === 'Enter') {
      fetchUserInfo();
   }
});

function getParameterByName(name, url) {
   if (!url) url = window.location.href;
   name = name.replace(/[\[\]]/g, '\\$&');
   var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
   if (!results) return null;
   if (!results[2]) return '';
   return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const nft_id = getParameterByName('nft_id');

const outputDiv = document.getElementById('output');
const nftIdInput = document.getElementById('nftIdInput');
const searchButton = document.getElementById('searchButton');

nftIdInput.addEventListener('keyup', (event) => {
   if (event.key === 'Enter') {
      searchButton.click();
   }
});

searchButton.addEventListener('click', () => {
   const nftId = nftIdInput.value.trim();
   if (!nftId) {
      alert('Please enter an NFT ID.');
      return;
   }

   // Define your loadingMessage element here
   // const loadingMessage = document.getElementById('loadingMessage');
   // loadingMessage.style.display = 'block';

   outputDiv.innerHTML = ''; // Clear previous results

   const api_url = `https://ev.io/get-nft-flags/${nftId}`;

   fetch(api_url)
      .then(response => {
         if (!response.ok) {
            throw new Error('Network response was not ok');
         }
         return response.json();
      })
      .then(data => {
         // Uncomment if you have a loading message
         // loadingMessage.style.display = 'none';

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

         const infoContainer = document.createElement('div');
         infoContainer.style.marginBottom = '20px';

         const thumbnailImage = document.createElement('img');
         thumbnailImage.src = thumbnail;
         thumbnailImage.style.maxWidth = '20%';
         thumbnailImage.style.borderRadius = '15px';

         infoContainer.appendChild(thumbnailImage);
         const uidUrl = `https://ev.io/node/${game_node_id}`;
         infoContainer.innerHTML += `<br><br>
                    <p style="margin-top: -12px;"><strong>Skin Name:</strong> ${skin_name}</p>
                    <p style="margin-top: -12px;"><strong>Game Node URL:</strong> <a style="text-decoration: none; color: #FFA500;" href="${uidUrl}" target="_blank">${uidUrl}</a></p>
                    <p style="margin-top: -12px;"><strong>Weapon Type:</strong> ${weapon_type}</p>
                    <p style="margin-top: -12px;"><strong>Reset Time:</strong> ${reset_time}</p>
                    <p style="margin-top: -12px;"><strong>Collection:</strong> ${collection}</p>
                    `;

         outputDiv.appendChild(infoContainer);
      })
      .catch(error => {
         // Uncomment if you have a loading message
         // loadingMessage.style.display = 'none';
         console.error('Error:', error);
         outputDiv.innerHTML = '<p>Invalid ID</p>';
      });
});

if (nft_id) {
   nftIdInput.value = nft_id;
   searchButton.click();
   document.getElementById('nftid-lookup').scrollIntoView({ behavior: 'smooth' });
}

const EarnRateContainer = document.getElementById('Earn-Rate');

window.addEventListener('load', async () => {
   EarnRateContainer.innerHTML = 'Fetching Earn Rate...';

   try {
      const response = await fetch('https://ev.io/vars');
      const EarnRatepData = await response.json();
      const field_e_earn_rate_per_100_score = EarnRatepData[0]['field_e_earn_rate_per_100_score'];
      const field_earnings_cap = EarnRatepData[0]['field_earnings_cap'];
      const earnRateDataHtml = `
<center>
	<h2><img src="src/e_coin.png" alt="Sol Logo" style="width: 28; height: auto; margin-top: -8px;"> Current Earn Rate</h2>
	<p>The E Earn Rate Per 100 Score is: <strong>${field_e_earn_rate_per_100_score}</strong></p>
	<p>The Earnings Cap is: <strong>${field_earnings_cap}</strong></p>
</center>
`;
      EarnRateContainer.innerHTML = earnRateDataHtml;
   } catch (error) {
      console.error('Error:', error);
      EarnRateContainer.innerHTML = 'An error occurred while fetching Earn Rate.';
   }
});


const nftDropsContainer = document.getElementById('nft-drops');

window.addEventListener('load', async () => {
   nftDropsContainer.innerHTML = 'Fetching NFT Drops...';

   try {
      const response = await fetch('https://ev.io/nft-drops');
      const nftDropData = await response.json();

      const nftDropsGrid = document.createElement('div');
      nftDropsGrid.className = 'nft-drop-grid';

      for (const nftDrop of nftDropData) {
         const nftDropItem = document.createElement('div');
         nftDropItem.className = 'nft-drop';

         const nftDropContent = `
<center>
	<h2><img src="src/token_icon.png" alt="Sol Logo" style="width: 30; height: auto; margin-top: -10px;">‎ ${nftDrop.type}</h2>
	<div class="nft-drop-info">
		<p><b>Name:</b> ${nftDrop.title}</p>
		<p><b>Tier:</b> ${nftDrop.field_tier}</p>
		<p><b>Drop Chance:</b> ${nftDrop.field_drop_chance}</p>
		<p><b>Quantity Left:</b> ${nftDrop.field_quantity_left}</p>
	</div>
</center>
`;

         nftDropItem.innerHTML = nftDropContent;
         nftDropsGrid.appendChild(nftDropItem);
      }

      nftDropsContainer.innerHTML = '';
      nftDropsContainer.appendChild(nftDropsGrid);
   } catch (error) {
      console.error('Error:', error);
      nftDropsContainer.innerHTML = 'An error occurred while fetching NFT drops.';
   }
});

function getParameterByName(name, url) {
   if (!url) url = window.location.href;
   name = name.replace(/[\[\]]/g, '\\$&');
   var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
       results = regex.exec(url);
   if (!results) return null;
   if (!results[2]) return '';
   return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

document.addEventListener("DOMContentLoaded", () => {
   const fetchUserButton = document.getElementById('fetchUserButtonTabs');
   const usernameInput = document.getElementById('usernameInputTabs');
   const loadingMessage = document.getElementById('loadingMessageTabs');
   const tabButtons = document.querySelectorAll('.custom-tab-button');
   const tabs = document.querySelectorAll('.custom-tab');

   const fetchEquippedSkins = () => {
       const username = usernameInput.value.trim();
       if (username === '') {
           alert('Please enter an ev.io username.');
           return;
       }

       loadingMessage.style.display = 'block';

       tabs.forEach(tab => {
           tab.style.display = 'none';
       });

       fetch(`https://ev.io/stats-by-un/${encodeURIComponent(username)}`)
           .then(response => {
               if (!response.ok) {
                   throw new Error('Network response was not ok');
               }
               return response.json();
           })
           .then(data => {
               loadingMessage.style.display = 'none';

               if (data.length === 0) {
                   tabs.forEach(tab => {
                       tab.innerHTML = '<p>User not found.</p>';
                   });
               } else {
                   console.log('User data:', data);

                   const user = data[0];

               const characterSkinId = user.field_eq_skin[0]?.target_id;
               if (characterSkinId) {
                  fetch(`https://ev.io/node/${characterSkinId}?_format=json`)
                     .then(response => response.json())
                     .then(skinData => {
                        const skinName = skinData.title[0].value;
                        const skinIcon = skinData.field_large_thumb[0].url;
                        displaySkin('CharacterTab', skinName, skinIcon);
                     })
                     .catch(error => console.error('Error fetching character skin:', error));
               } else {
                  displayNoSkin('CharacterTab');
               }

               const arSkinId = user.field_auto_rifle_skin[0]?.target_id;
               if (arSkinId) {
                  fetch(`https://ev.io/node/${arSkinId}?_format=json`)
                     .then(response => response.json())
                     .then(skinData => {
                        const skinName = skinData.title[0].value;
                        const skinIcon = skinData.field_weapon_skin_thumb[0].url;
                        displaySkin('AssaultRifleTab', skinName, skinIcon);
                     })
                     .catch(error => console.error('Error fetching AR skin:', error));
               } else {
                  displayNoSkin('AssaultRifleTab');
               }

               const hcSkinId = user.field_hand_cannon_skin[0]?.target_id;
               if (hcSkinId) {
                  fetch(`https://ev.io/node/${hcSkinId}?_format=json`)
                     .then(response => response.json())
                     .then(skinData => {
                        const skinName = skinData.title[0].value;
                        const skinIcon = skinData.field_weapon_skin_thumb[0].url;
                        displaySkin('HandCannonTab', skinName, skinIcon);
                     })
                     .catch(error => console.error('Error fetching HC skin:', error));
               } else {
                  displayNoSkin('HandCannonTab');
               }

               const lrSkinId = user.field_laser_rifle_skin[0]?.target_id;
               if (lrSkinId) {
                  fetch(`https://ev.io/node/${lrSkinId}?_format=json`)
                     .then(response => response.json())
                     .then(skinData => {
                        const skinName = skinData.title[0].value;
                        const skinIcon = skinData.field_weapon_skin_thumb[0].url;
                        displaySkin('LaserRifleTab', skinName, skinIcon);
                     })
                     .catch(error => console.error('Error fetching LR skin:', error));
               } else {
                  displayNoSkin('LaserRifleTab');
               }

               const brSkinId = user.field_burst_rifle_skin[0]?.target_id;
               if (brSkinId) {
                  fetch(`https://ev.io/node/${brSkinId}?_format=json`)
                     .then(response => response.json())
                     .then(skinData => {
                        const skinName = skinData.title[0].value;
                        const skinIcon = skinData.field_weapon_skin_thumb[0].url;
                        displaySkin('BurstRifleTab', skinName, skinIcon);
                     })
                     .catch(error => console.error('Error fetching BR skin:', error));
               } else {
                  displayNoSkin('BurstRifleTab');
               }

               const sweeperSkinId = user.field_sweeper_skin[0]?.target_id;
               if (sweeperSkinId) {
                  fetch(`https://ev.io/node/${sweeperSkinId}?_format=json`)
                     .then(response => response.json())
                     .then(skinData => {
                        const skinName = skinData.title[0].value;
                        const skinIcon = skinData.field_weapon_skin_thumb[0].url;
                        displaySkin('SweeperTab', skinName, skinIcon);
                     })
                     .catch(error => console.error('Error fetching BR skin:', error));
               } else {
                  displayNoSkin('SweeperTab');
               }

               const swordSkinId = user.field_sword_skin[0]?.target_id;
               if (swordSkinId) {
                  fetch(`https://ev.io/node/${swordSkinId}?_format=json`)
                     .then(response => response.json())
                     .then(skinData => {
                        const skinName = skinData.title[0].value;
                        const skinIcon = skinData.field_weapon_skin_thumb[0].url;
                        displaySkin('SwordTab', skinName, skinIcon);
                     })
                     .catch(error => console.error('Error fetching BR skin:', error));
               } else {
                  displayNoSkin('SwordTab');
               }


            }
         })
         .catch(error => {
            loadingMessage.style.display = 'none';
            tabs.forEach(tab => {
                tab.innerHTML = '<p>Error fetching user information.</p>';
            });
            console.error('Error:', error);
        });
};

const displaySkin = (tabId, skinName, skinIcon) => {
    const tab = document.getElementById(tabId);
    tab.innerHTML = `
        <h2>Equipped ${tabId.replace('Tab', '')} Skin</h2>
        <p><strong>Skin Name:</strong> ${skinName}</p>
        <img style="border-top-width: 0px; padding-top: 5px;" src="${skinIcon}" alt="${skinName} Skin" style="max-width: 300px;">
        <hr class="modern-hr">
    `;

    tab.style.display = 'block';
};

const displayNoSkin = (tabId) => {
    const tab = document.getElementById(tabId);
    tab.innerHTML = '<p>No skin equipped for this category.</p>';

    tab.style.display = 'block';
};

const handleEnterKey = (event) => {
    if (event.key === 'Enter') {
        fetchEquippedSkins();
    }
};

fetchUserButton.addEventListener('click', fetchEquippedSkins);
usernameInput.addEventListener('keydown', handleEnterKey);

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabs.forEach(tab => {
            tab.style.display = 'none';
        });

        const tabId = button.getAttribute('data-tab');
        const tab = document.getElementById(tabId);
        tab.style.display = 'block';
    });
});

// Check if 'equipped_skins' is provided in the URL and trigger the fetchEquippedSkins function
const equippedSkinsParam = getParameterByName('equipped_skins');

if (equippedSkinsParam) {
    usernameInput.value = equippedSkinsParam;
    fetchEquippedSkins();
    document.getElementById('equipped-skins-lookup').scrollIntoView({ behavior: 'smooth' });
}
});

document.addEventListener('DOMContentLoaded', () => {
   fetchCryptocurrencyInfo();
});

function fetchCryptocurrencyInfo() {
   fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd%2Cinr%2Cbdt%2Cphp%2Cbrl%2Cmyr%2Caud&include_market_cap=false&include_24hr_vol=false&include_24hr_change=true&include_last_updated_at=true&precision=2")
      .then(response => {
         if (!response.ok) {
            throw new Error(`Failed to fetch data. Status: ${response.status}`);
         }
         return response.json();
      })
      .then(data => {
         const usd = data.solana.usd;
         const inr = data.solana.inr;
         const php = data.solana.php;

         document.getElementById('usd').textContent = `1 SOL = ${usd} USD`;
         document.getElementById('inr').textContent = `1 SOL = ${inr} INR`;
         document.getElementById('php').textContent = `1 SOL = ${php} PHP`;

      })
      .catch(error => {
         console.error('Error:', error);
      });
};


function sidebar_toggler() {
   var SidebarToggler = document.querySelector("#SiteContainer");
   SidebarToggler.classList.toggle("sidebar-show");
}

var isAudioPlaying = false;

function playAudio() {
   if (!isAudioPlaying) {
      var audioUrl = "https://github.com/ev-discord-bot/ev-info/raw/main/src/the_music.mp3";
      var audioElement = new Audio(audioUrl);
      audioElement.play();
      document.querySelector('#logo-image').src = "https://github.com/ev-discord-bot/ev-info/raw/main/src/rick_logo.svg";
      isAudioPlaying = true;
      document.querySelector('.scrolling-text').style.pointerEvents = 'none';
      audioElement.addEventListener('ended', function () {
         document.querySelector('#logo-image').src = "https://github.com/ev-discord-bot/ev-info/raw/main/src/main_logo.svg";
         audioElement.pause();
         document.querySelector('.scrolling-text').style.pointerEvents = 'auto';
      });
      document.querySelector('#logo-image').addEventListener('click', function () {
         isAudioPlaying = false;
      });
   }
}

function getParameterByName(name, url) {
   if (!url) url = window.location.href;
   name = name.replace(/[\[\]]/g, '\\$&');
   var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
   if (!results) return null;
   if (!results[2]) return '';
   return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const e_to_usdc = getParameterByName('e_to_usdc');

function calculateUSDCFromE() {


   const eCoinAmount = parseFloat(document.getElementById('e_coin_input').value);
   if (!isNaN(eCoinAmount) && eCoinAmount > 0) {
      const usdValue = eCoinAmount / 2000;
      const usdValueFormatted = usdValue.toLocaleString("en-US", {
         style: "currency",
         currency: "USD",
      });

      const usdValueSpan = document.createElement("span");
      usdValueSpan.textContent = usdValueFormatted;
      usdValueSpan.classList.add("formatted-value");


      const usdResultElement = document.getElementById("usd-result");
      usdResultElement.textContent = "USDC Value: ";
      usdResultElement.appendChild(usdValueSpan);
   } else {
      alert('Please enter a valid e coin amount.');
   }
}

document.getElementById('e_coin_input').addEventListener('keypress', (event) => {
   if (event.key === 'Enter') {
      calculateUSDCFromE();
   }
});

if (e_to_usdc) {
   e_coin_input.value = e_to_usdc;
   calculateUSDCFromE();
   document.getElementById('e-usdc').scrollIntoView({ behavior: 'smooth' });
}


const copyTextElement = document.getElementById('copyText');
copyTextElement.addEventListener('click', function () {
   const textToCopy = copyTextElement.textContent;
   const textField = document.createElement('textarea');
   textField.textContent = textToCopy;
   textField.style.position = 'absolute';
   textField.style.top = '-1000px';
   document.body.appendChild(textField);
   textField.select();
   document.execCommand('copy');
   document.body.removeChild(textField);
   alert("Copied successfully");
});

function openLink(linkURL) {
   window.open(linkURL, '_blank');
}

function getParameterByName(name, url) {
   if (!url) url = window.location.href;
   name = name.replace(/[\[\]]/g, '\\$&');
   var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
   if (!results) return null;
   if (!results[2]) return '';
   return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const nft_lookup = getParameterByName('nft_lookup');

const pageSize = 6;

const fetchUserUid = async () => {
   const username = document.getElementById('usernameInputnft').value.trim();

   if (username === '') {
      alert('Please enter a username.');
      return;
   }

   try {
      loadingMessage.style.display = 'block';

      const response = await fetch(`https://ev.io/stats-by-un/${encodeURIComponent(username)}`);

      if (!response.ok) {
         throw new Error(`Failed to fetch user data. Status: ${response.status}, ${response.statusText}`);
      }

      const data = await response.json();
      loadingMessage.style.display = 'none';

      if (data.length === 0) {
         alert('User not found.');
      } else {
         const user = data[0];
         const uidUrl = `${user.uid[0].value}`;
         return uidUrl;
      }
   } catch (error) {
      console.error('Error fetching user data:', error.message);
   }
};

async function getUserNFTs(uidUrl) {
   try {
      const response = await fetch(`https://ev.io/flags/${uidUrl}`);
      const data = await response.json();

      if (!response.ok) {
         throw new Error(`Failed to fetch user NFTs. Status: ${response.status}, ${response.statusText}`);
      }

      return data;
   } catch (error) {
      console.error('Error fetching user NFTs:', error.message);
      return null;
   }
}

async function displayUserNFTs() {
   const nftContainer = document.getElementById('nftContainer');
   nftContainer.innerHTML = '';

   const pagination = document.getElementById('pagination');
   pagination.innerHTML = '';

   try {
      const uidUrl = await fetchUserUid();
      if (!uidUrl) {
         return;
      }

      const loadingSpinner = document.createElement('span');
      loadingSpinner.classList.add('loading-spinner');
      nftContainer.appendChild(loadingSpinner);

      const userNFTs = await getUserNFTs(uidUrl);

      if (userNFTs) {
         loadingSpinner.remove();

         const totalPages = Math.ceil(userNFTs.length / pageSize);

         for (let page = 1; page <= totalPages; page++) {
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedNFTs = userNFTs.slice(startIndex, endIndex);

            const pageButton = document.createElement('button');
            pageButton.textContent = page;
            pageButton.onclick = () => displayPageNFTs(paginatedNFTs, page, totalPages);

            pagination.appendChild(pageButton);
         }

         displayPageNFTs(userNFTs.slice(0, pageSize), 1, totalPages);
      } else {
         loadingSpinner.textContent = 'Failed to fetch user NFTs. Please try again later.';
      }
   } catch (error) {
      console.error('Error displaying user NFTs:', error.message);
   }
}

function displayPageNFTs(paginatedNFTs, currentPage, totalPages) {
   const nftContainer = document.getElementById('nftContainer');
   nftContainer.innerHTML = '';

   const pageIndicator = document.getElementById('pageIndicator');

   if (currentPage !== undefined && totalPages !== undefined) {
      pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
   } else {
      pageIndicator.textContent = '';
   }

   if (paginatedNFTs.length === 0) {
      const noNFTsMessage = document.createElement('div');
      noNFTsMessage.textContent = 'User has no NFTs.';
      noNFTsMessage.classList.add('no-nfts-message');
      nftContainer.appendChild(noNFTsMessage);
   } else {
      paginatedNFTs.forEach((nftData) => {
         const nftCard = document.createElement('div');
         nftCard.classList.add('nft-card');

         const nftImage = document.createElement('img');
         nftImage.classList.add('nft-image');

         try {
            const imageUrl = `https://ev.io${nftData.field_wallet_image}`;

            nftImage.src = imageUrl;
            nftImage.alt = 'NFT Image';

            nftCard.appendChild(nftImage);

            const skinInfo = document.createElement('div');
            skinInfo.innerHTML = `
                  <p><strong>Name:</strong> ${nftData.field_skin || 'Unknown'}</p>
                  <p><strong>NFT Token:</strong> ${truncateToken(nftData.field_flag_nft_address) || 'Unknown'}</p>
                  <p><strong>Skin Node ID:</strong> ${nftData.entity_id || 'Unknown'}</p>
                  <hr>
                  <p><strong>Being Lend To:</strong> ${nftData.field_scholar || 'Not Being Lended'}</p>
                  <p><strong><img src="src/e_coin.png" alt="Sol Logo" style="width: 15; height: 15px; margin-bottom: 6px;"> Made Today:</strong> ${nftData.field_earned_today || 'Unknown'}</p>
               `;

            nftCard.appendChild(skinInfo);

            nftContainer.appendChild(nftCard);
         } catch (parseError) {
            console.error('Error parsing NFT data:', parseError.message);


            async function getSkinInfo(entityId) {
               try {
                  const response = await fetch(`https://ev.io/node/${entityId}?_format=json`);
                  const data = await response.json();

                  if (!response.ok) {
                     throw new Error(`Failed to fetch skin info. Status: ${response.status}, ${response.statusText}`);
                  }

                  return data;
               } catch (error) {
                  console.error('Error fetching skin info:', error.message);
                  return null;
               }
            }


            const errorMessage = document.createElement('div');
            errorMessage.innerHTML = `
                     <p><strong>Node ID:</strong> ${nftData.entity_id || 'Unknown'}</p>
                     <p><strong>Nft:</strong> ${nftData.field_flag_nft_address || 'False'}</p>
                  `;


            errorMessage.classList.add('no-nfts-message');
            nftContainer.appendChild(errorMessage);
         }
      });
   }
}

document.getElementById('usernameInputnft').addEventListener('keypress', (event) => {
   if (event.key === 'Enter') {
      displayUserNFTs();
   }
});

if (nft_lookup) {
   usernameInputnft.value = nft_lookup;
   displayUserNFTs();
   document.getElementById('user-nfts-lookup').scrollIntoView({ behavior: 'smooth' });
}

function getMetaAttribute(nftData, attribute) {
   try {
      const metaAttributes = JSON.parse(nftData.field_meta[0])?.value?.attributes;
      return metaAttributes.find(attr => attr.trait_type === attribute)?.value || 'Unknown';
   } catch (error) {
      console.error(`Error getting ${attribute} attribute:`, error.message);
      return 'Unknown';
   }
}


function truncateToken(token) {
   return `${token.substring(0, 5)}...${token.substring(token.length - 5)}`;
}


window.addEventListener('load', function () {
   const loadingScreen = document.getElementById('loadingScreen');
   loadingScreen.style.display = 'none';
});

const loadingScreen = document.getElementById('loadingScreen');
const skipLoadingButton = document.getElementById('skipLoadingButton');

skipLoadingButton.addEventListener('click', () => {
   loadingScreen.style.display = 'none';
});

window.addEventListener('load', function () {});

function openForm() {
   document.getElementById("myForm").style.display = "block";
}

function closeForm() {
   document.getElementById("myForm").style.display = "none";
}

document.addEventListener('DOMContentLoaded', function () {
   const toggleCSSButton = document.getElementById('toggleCSSButton');
   const linkElement = document.getElementById('customCSS');
   let currentCSS = 'styles/index_styles.css';

   function toggleCSS() {
      if (currentCSS === 'styles/index_styles.css') {
         currentCSS = 'styles/index_dark_mode.css';
      } else {
         currentCSS = 'styles/index_styles.css';
      }
      linkElement.href = currentCSS;
   }
   toggleCSSButton.addEventListener('click', toggleCSS);
});