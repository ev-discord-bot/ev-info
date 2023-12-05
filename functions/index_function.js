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
      .then(response => response.json())
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
	| <strong>Estimated Value:</strong> $${usdValue.toFixed(2)}
	<img src="src/usdc-coin.svg" alt="Sol Logo" style="width: 20; height: 20px; margin-bottom: 6px;">
</p>
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
	| <strong>Estimated Value:</strong> $${usdValue.toFixed(2)}
	<img src="src/usdc-coin.svg" alt="Sol Logo" style="width: 20; height: 20px; margin-bottom: 6px;">
</p>
<hr>
<p><strong><i class="fa-solid fa-crosshairs" style="color: #ffffff;"></i> Crosshair:</strong> Default</p>
`;
            }


            const skinId = user.field_eq_skin[0].target_id;
            if (skinId) {
               fetch(`https://ev.io/node/${skinId}?_format=json`)
                  .then(response => response.json())
                  .then(skinData => {
                     const skinImage = skinData.field_wallet_image[0].url;
                     const skinInfo = document.createElement('div');
                     skinInfo.innerHTML = `<br>
<img src="${skinImage}" alt="${user.name[0].value}'s Skin" style="max-width: 200px; border-radius: 25px;">
`;
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
         userInfoDiv.innerHTML = '<p>Error fetching user information.</p>';
         moreInfoButton.style.display = 'none';
         console.error('Error:', error);
      });
};

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
<p><strong>Wallet Address:</strong> <span style="text-decoration: underline;">${user.field_wallet_address[0].value}<span></p>
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
         loadingMessage.style.display = 'none';
         console.error('Error:', error);
         outputDiv.innerHTML = '<p>Invalid ID</p>';
      });
});

const proPlayers = [
   "BicBoiii",
   "Kriptoz",
   "xen0",
   "LEX1",
   "gLedaL",
   "IzzyGama",
   "xneon",
   "1",
   "DRAGN",
   "SooLeeQ",
   "NizziN",
   "HAPPY C0RRUP",
   "Loudicakes",
   "mrcleen",
   "Aotoki",
   "MagnatTG",
   "EV Demon",
   "Komm",
   "akinore",
   "ALGUY",
   "k1koo",
   "LR",
   "Hob1",
   "Fawn",
   "MetadonT",
   "llupo955",
   "MANDAR1N0V",
   "KlarkS",
   "Abb¡so",
   "Faramura",
   "Q1234",
   "TurboChang ",
];

function getRandomPlayer() {
   const randomIndex = Math.floor(Math.random() * proPlayers.length);
   return proPlayers[randomIndex];
}

function fetchAndDisplayCrosshair() {
   const playerName = getRandomPlayer();
   fetch(`https://ev.io/stats-by-un/${playerName}`)
      .then(response => response.json())
      .then(data => {
         const crosshairURL = data[0]?.field_custom_crosshair[0]?.url;
         const username = data[0]?.name[0]?.value || playerName;

         document.getElementById('username').textContent = username;

         if (crosshairURL) {
            const crosshairImage = document.getElementById('crosshair-image');
            const loadingText = document.getElementById('loadingText');
            const downloadButton = document.getElementById('download-button');

            loadingText.style.display = 'none';
            crosshairImage.src = crosshairURL;
            downloadButton.href = crosshairURL;
            downloadButton.style.display = 'block';
         }
      })
      .catch(error => {
         console.error('Error:', error);
      });
}

document.getElementById('random-button').addEventListener('click', () => {
   const loadingText = document.getElementById('loadingText');
   loadingText.style.display = 'block';

   fetchAndDisplayCrosshair();
});

fetchAndDisplayCrosshair();


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
	<h2>Current Earn Rate</h2>
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
	<h2>${nftDrop.type}</h2>
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
         .then(response => response.json())
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
         fetchUserButton.click();
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

   fetchUserButton.addEventListener('click', fetchEquippedSkins);
});

document.addEventListener('DOMContentLoaded', () => {
   fetchCryptocurrencyInfo();
});

function fetchCryptocurrencyInfo() {
   fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd%2Cinr%2Cbdt%2Cphp%2Cbrl%2Cmyr%2Caud&include_market_cap=false&include_24hr_vol=false&include_24hr_change=true&include_last_updated_at=true&precision=2")
      .then(response => response.json())
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

window.addEventListener("resize", (e) => {
   const windowWidth = window.innerWidth;
   if (windowWidth > 960) {
      doSomething();
   }
   if (windowWidth < 960) { doSomething(); }
}); var isAudioPlaying = false; function playAudio() { if (!isAudioPlaying) { var audioUrl = "https://github.com/ev-discord-bot/ev-info/raw/main/src/the_music.mp3"; var audioElement = new Audio(audioUrl); audioElement.play(); document.querySelector('#logo-image').src = "https://github.com/ev-discord-bot/ev-info/raw/main/src/rick_logo.svg"; isAudioPlaying = true; document.querySelector('.scrolling-text').style.pointerEvents = 'none'; audioElement.addEventListener('ended', function () { document.querySelector('#logo-image').src = "https://github.com/ev-discord-bot/ev-info/raw/main/src/main_logo.svg"; audioElement.pause(); document.querySelector('.scrolling-text').style.pointerEvents = 'auto'; }); document.querySelector('#logo-image').addEventListener('click', function () { isAudioPlaying = false; }); } } function calculateUSDCFromE() {
   const eCoinAmount = parseFloat(document.getElementById('e-coin-input').value); if (!isNaN(eCoinAmount) && eCoinAmount > 0) {
      const usdValue = eCoinAmount / 2000;

      document.getElementById('usd-result').textContent = `USDC Value: $${usdValue.toFixed(2)}`;
   } else {
      alert('Please enter a valid e coin amount.');
   }
}

document.getElementById('e-coin-input').addEventListener('keypress', (event) => {
   if (event.key === 'Enter') {
      calculateUSDCFromE();
   }
});


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

window.addEventListener('load', function () {
   const loadingScreen = document.getElementById('loadingScreen');
   loadingScreen.style.display = 'none';
});

const loadingScreen = document.getElementById('loadingScreen');
const skipLoadingButton = document.getElementById('skipLoadingButton');

skipLoadingButton.addEventListener('click', () => {
   loadingScreen.style.display = 'none';
});

window.addEventListener('load', function () {
   // Remove the setTimeout block
});

function openForm() {
   document.getElementById("myForm").style.display = "block";
}

function closeForm() {
   document.getElementById("myForm").style.display = "none";
}