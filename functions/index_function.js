const fetchUserButton = document.getElementById('fetchUserButton');
const usernameInput = document.getElementById('usernameInput');
const loadingMessage = document.getElementById('loadingMessage');
const userInfoDiv = document.getElementById('userInfo');
const middleHeader = document.getElementById('middleHeader');
const userImage = document.getElementById('userImage');
const moreInfoButton = document.getElementById('moreInfoButton');
const moreInfoDetails = document.getElementById('moreInfoDetails');
let user;

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
				const crosshairUrl = `${user.field_custom_crosshair[0].url}`;
				userInfoDiv.innerHTML = `
                <h2>User Information for ${user.name[0].value}</h2>

<p><strong>Username:</strong> ${user.name[0].value}</p>
<p><strong>User URL:</strong> <a href="${uidUrl}" target="_blank">https://ev.io/user/${user.uid[0].value}</a></p>
<p><strong>Kills:</strong> ${user.field_kills[0].value} | <strong>Deaths:</strong> ${user.field_deaths[0].value} | <strong>KD:</strong> ${user.field_k_d[0].value}</p>
<p><strong>Ranking:</strong> ${user.field_rank[0].value} | <strong>Score:</strong> ${user.field_score[0].value}</p>
<p><strong>Crosshair:</strong> <a href="${crosshairUrl}" target="_blank">Users Crosshair</a></p>
`;

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
			thumbnailImage.style.maxWidth = '30%';
			thumbnailImage.style.borderRadius = '15px';

			infoContainer.appendChild(thumbnailImage);
			const uidUrl = `https://ev.io/node/${game_node_id}`;
			infoContainer.innerHTML += `<br><br>
    <p><strong>Skin Name:</strong> ${skin_name}</p>
    <p><strong>Game Node URL:</strong> <a href="${uidUrl}" target="_blank">${uidUrl}</a></p>
    <p><strong>Weapon Type:</strong> ${weapon_type}</p>
    <p><strong>Reset Time:</strong> ${reset_time}</p>
    <p><strong>Collection:</strong> ${collection}</p>
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
		const nftDropsList = nftDropData.map(nft => `
      <center>
          <div class="nft-drop">
              <h2>${nft.type}</h2>
              <p>Name: ${nft.title}</p>
              <p>Tier: ${nft.field_tier}</p>
              <p>Drop Chance: ${nft.field_drop_chance}</p>
              <p>Quantity Left: ${nft.field_quantity_left}</p>
          </div>
      </center>
    `).join('');
		nftDropsContainer.innerHTML = nftDropsList;
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
    <img src="${skinIcon}" alt="${skinName} Skin" style="max-width: 300px;">
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
	if (windowWidth < 960) {
		doSomething();
	}
});

var isAudioPlaying = false;

function playAudio() {
	if (!isAudioPlaying) {
		var audioUrl = "https://cdn.discordapp.com/attachments/972952855210238015/1124542374165618778/Rick_Roll_Sound_Effect.mp3";
		var audioElement = new Audio(audioUrl);
		audioElement.play();
		document.querySelector('#logo-image').src = "https://cdn.discordapp.com/attachments/1039308604148293682/1173756837418508308/Mediamodifier-Design_2.svg";
		isAudioPlaying = true;
		document.querySelector('.scrolling-text').style.pointerEvents = 'none';
		audioElement.addEventListener('ended', function() {
			document.querySelector('#logo-image').src = "https://cdn.discordapp.com/attachments/1039308604148293682/1171560968950657175/Mediamodifier-Design_2.svg";
			audioElement.pause();
			document.querySelector('.scrolling-text').style.pointerEvents = 'auto';
		});
		document.querySelector('#logo-image').addEventListener('click', function() {
			isAudioPlaying = false;
		});
	}
}

function requestPermission() {
	if (Notification.permission !== 'granted') {
		Notification.requestPermission();
		setTimeout(function() {
			var notification = new Notification('Thanks!', {
				icon: 'https://media.discordapp.net/attachments/1039308604148293682/1155548421315383406/icon.png',
				body: 'You will be notified when the site updates!'
			});

			notification.onclick = function() {};
		}, 2000);
	} else {
		alert("You have already registered");
	}
}

var websiteURL = "https://ev-info.vercel.app";
var lastModificationTime = 0;

window.setInterval(function() {
	fetch(websiteURL)
		.then(response => response.text())
		.then(code => {
			var fingerprint = sha256(code);

			if (fingerprint !== lastModificationTime) {
				if (Notification.permission !== 'granted') {
					Notification.requestPermission();
				} else {
					var notification = new Notification('New updates!', {
						icon: 'https://media.discordapp.net/attachments/1039308604148293682/1155548421315383406/icon.png',
						body: 'Something new has come up on EV-Info! Check it out!'
					});

					notification.onclick = function() {
						window.open(websiteURL);
					};
				}

				lastModificationTime = fingerprint;
			}
		});
}, 10);

const copyTextElement = document.getElementById('copyText');
copyTextElement.addEventListener('click', function() {
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

 let url = new URL(`https://api.us-east.tinybird.co/v0/pipes/untitled_pipe_6579.json`)


 const result = await fetch(url, {
   headers: {
	 Authorization: 'Bearer p.eyJ1IjogImFmOTlmOTI4LWJiNDgtNDhkYi1iMjQ0LWYxZjBmNDZlZDAyOSIsICJpZCI6ICJhZDExMzk0NC05N2ZiLTQ4MGQtOWI4OS0wMTE5MzY1YjQ1YWQiLCAiaG9zdCI6ICJ1c19lYXN0In0.wALQKENUBQOs-Tv1Qz1D4vvuOTkt1_vHhGRAiJEuKuo'
   }
 }) 
   .then(r => r.json())
   .then(r => r)
   .catch(e => e.toString())
 
 if (!result.data) {
   console.error(`there is a problem running the query: ${result}`);
 } else {
   console.table(result.data)
   console.log("** Query columns **")
   for (let column of result.meta) {
	 console.log(`${column.name} -> ${column.type}`)
   }
 }