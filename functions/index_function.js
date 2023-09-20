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

                const skinId = user.field_eq_skin[0].target_id;
                if (skinId) {
                    fetch(`https://ev.io/node/${skinId}?_format=json`)
                        .then(response => response.json())
                        .then(skinData => {
                            const skinImage = skinData.field_large_thumb[0].url;
                            const skinName = skinData.title[0].value;
                            const skinInfo = document.createElement('div');
                            skinInfo.innerHTML = `
                                        <p><strong>Skin Name:</strong> ${skinName}</p>
                                        <img src="${skinImage}" alt="${skinName} Skin" style="max-width: 300px;"> <!-- Adjust max-width as needed -->
                                    `;
                            userInfoDiv.appendChild(skinInfo);
                        })
                        .catch(error => console.error('Error fetching skin data:', error));
                }

                if (user) {
                    userInfoDiv.style.display = 'block';
                    userInfoDiv.innerHTML = `
                                    <p><strong>Abilities Layout:</strong> ${user.field_abilities_loadout[0].value}</p>
                                    <p><strong>Total Games:</strong> ${user.field_total_games[0].value}</p>
                                    <p><strong>Wallet Address:</strong> ${user.field_wallet_address[0].value}</p>
                                    <p><strong>Weekly Score:</strong> ${user.field_weekly_score[0].value}</p>
                                    <p><strong>CP Earned Weekly:</strong> ${user.field_cp_earned_weekly[0].value}</p>
                                    <p><strong>CP Lifetime Earned:</strong> ${user.field_lifetime_cp_earned[0].value}</p>
                                    <p><strong>Ev Coins:</strong> ${user.field_ev_coins[0].value}</p>
                                    <!-- Add more details as needed -->
                                `;
                }


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
    const username = usernameInput.value.trim();
    if (username === '') {
        alert('Please enter a username.');
        return;
    }

    if (user) {
        moreInfoDetails.style.display = 'block';
        moreInfoDetails.innerHTML = `
            <p><strong>Abilities Layout:</strong> ${user.field_abilities_loadout[0].value}</p>
            <p><strong>Total Games:</strong> ${user.field_total_games[0].value}</p>
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
    // Add more pro players here
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

// Initially fetch and display a random crosshair when the page loads
fetchAndDisplayCrosshair();

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
            const gbp = data.solana.gbp;

            document.getElementById('usd').textContent = `1 SOL = ${usd} USD`;
            document.getElementById('inr').textContent = `1 SOL = ${inr} INR`;
            document.getElementById('php').textContent = `1 SOL = ${php} PHP`;
            document.getElementById('gbp').textContent = `1 SOL = ${gbp} GBP`;

            // Fetch other data and update corresponding elements here
        })
        .catch(error => {
            console.error('Error:', error);
        });
};

document.addEventListener('DOMContentLoaded', () => {
    const earnRateButton = document.getElementById('earnRateButton');
    const earnRateInfo = document.getElementById('earnRateInfo');

    earnRateButton.addEventListener('click', () => {
        earnRateInfo.innerHTML = 'Loading...';

        fetch('https://ev.io/vars')
            .then(response => response.json())
            .then(data => {
                const field_e_earn_rate_per_100_score = data[0]['field_e_earn_rate_per_100_score'];
                const field_earnings_cap = data[0]['field_earnings_cap'];

                const infoHTML = `
                   <h2>Current Earn Rate</h2>
                   <p>The E Earn Rate Per 100 Score is: <strong>${field_e_earn_rate_per_100_score}</strong></p>
                   <p>The Earnings Cap is: <strong>${field_earnings_cap}</strong></p>
               `;

                earnRateInfo.innerHTML = infoHTML;
            })
            .catch(error => {
                console.error('Error:', error);
                earnRateInfo.innerHTML = 'An error occurred while fetching data.';
            });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const fetchDataButton = document.getElementById('fetchData');
    const nftDrops = document.getElementById('nftDrops');

    fetchDataButton.addEventListener('click', () => {
        nftDrops.innerHTML = 'Fetching NFT Drops...';

        fetch('https://ev.io/nft-drops')
            .then(response => response.json())
            .then(data => {
                // Assuming the API response is an array of NFT drops
                const nftDropsList = data.map(nft => `
                   <center><div class="nft-drop">
                       <h2>${nft.type}</h2>
                       <p>Name: ${nft.title}</p>
                       <p>Tier: ${nft.field_tier}</p>
                       <p>Drop Chance: ${nft.field_drop_chance}</p>
                       <p>Quantity Left: ${nft.field_quantity_left}</p></center>

                   </div>
               `).join('');

                nftDrops.innerHTML = nftDropsList;
            })
            .catch(error => {
                console.error('Error:', error);
                nftDrops.innerHTML = 'An error occurred while fetching NFT drops.';
            });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const fetchUserButton = document.getElementById('fetchUserButtonTabs');
    const usernameInput = document.getElementById('usernameInputTabs');
    const loadingMessage = document.getElementById('loadingMessageTabs');
    const tabButtons = document.querySelectorAll('.custom-tab-button');
    const tabs = document.querySelectorAll('.custom-tab');

    // Function to fetch equipped skins
    const fetchEquippedSkins = () => {
        const username = usernameInput.value.trim();
        if (username === '') {
            alert('Please enter an ev.io username.');
            return;
        }

        // Display loading message while fetching data
        loadingMessage.style.display = 'block';

        // Hide all tabs
        tabs.forEach(tab => {
            tab.style.display = 'none';
        });

        // Make a GET request to the ev.io API
        fetch(`https://ev.io/stats-by-un/${encodeURIComponent(username)}`)
            .then(response => response.json())
            .then(data => {
                // Hide loading message
                loadingMessage.style.display = 'none';

                if (data.length === 0) {
                    // Display a message for no user found
                    tabs.forEach(tab => {
                        tab.innerHTML = '<p>User not found.</p>';
                    });
                } else {
                    console.log('User data:', data); // Log user data to console

                    const user = data[0]; // Store user data

                    // Fetch and display Character Skin
                    // Fetch and display Character Skin
                    const characterSkinId = user.field_eq_skin[0]?.target_id;
                    if (characterSkinId) {
                        fetch(`https://ev.io/node/${characterSkinId}?_format=json`)
                            .then(response => response.json())
                            .then(skinData => {
                                const skinName = skinData.title[0].value;
                                const skinIcon = skinData.field_large_thumb[0].url;
                                displaySkin('CharacterTab', skinName, skinIcon); // Use 'CharacterTab' instead of 'Character'
                            })
                            .catch(error => console.error('Error fetching character skin:', error));
                    } else {
                        // Display a message for no character skin
                        displayNoSkin('CharacterTab'); // Use 'CharacterTab' instead of 'Character'
                    }

                    // Fetch and display Assault Rifle Skin
                    const arSkinId = user.field_auto_rifle_skin[0]?.target_id;
                    if (arSkinId) {
                        fetch(`https://ev.io/node/${arSkinId}?_format=json`)
                            .then(response => response.json())
                            .then(skinData => {
                                const skinName = skinData.title[0].value;
                                const skinIcon = skinData.field_weapon_skin_thumb[0].url;
                                displaySkin('AssaultRifleTab', skinName, skinIcon); // Use 'AssaultRifleTab' instead of 'AssaultRifle'
                            })
                            .catch(error => console.error('Error fetching AR skin:', error));
                    } else {
                        // Display a message for no AR skin
                        displayNoSkin('AssaultRifleTab'); // Use 'AssaultRifleTab' instead of 'AssaultRifle'
                    }

                    const hcSkinId = user.field_hand_cannon_skin[0]?.target_id;
                    if (hcSkinId) {
                        fetch(`https://ev.io/node/${hcSkinId}?_format=json`)
                            .then(response => response.json())
                            .then(skinData => {
                                const skinName = skinData.title[0].value;
                                const skinIcon = skinData.field_weapon_skin_thumb[0].url;
                                displaySkin('HandCannonTab', skinName, skinIcon); // Use 'AssaultRifleTab' instead of 'AssaultRifle'
                            })
                            .catch(error => console.error('Error fetching HC skin:', error));
                    } else {
                        // Display a message for no AR skin
                        displayNoSkin('HandCannonTab'); // Use 'AssaultRifleTab' instead of 'AssaultRifle'
                    }

                    const lrSkinId = user.field_laser_rifle_skin[0]?.target_id;
                    if (lrSkinId) {
                        fetch(`https://ev.io/node/${lrSkinId}?_format=json`)
                            .then(response => response.json())
                            .then(skinData => {
                                const skinName = skinData.title[0].value;
                                const skinIcon = skinData.field_weapon_skin_thumb[0].url;
                                displaySkin('LaserRifleTab', skinName, skinIcon); // Use 'AssaultRifleTab' instead of 'AssaultRifle'
                            })
                            .catch(error => console.error('Error fetching LR skin:', error));
                    } else {
                        // Display a message for no AR skin
                        displayNoSkin('LaserRifleTab'); // Use 'AssaultRifleTab' instead of 'AssaultRifle'
                    }

                    const brSkinId = user.field_burst_rifle_skin[0]?.target_id;
                    if (brSkinId) {
                        fetch(`https://ev.io/node/${brSkinId}?_format=json`)
                            .then(response => response.json())
                            .then(skinData => {
                                const skinName = skinData.title[0].value;
                                const skinIcon = skinData.field_weapon_skin_thumb[0].url;
                                displaySkin('BurstRifleTab', skinName, skinIcon); // Use 'AssaultRifleTab' instead of 'AssaultRifle'
                            })
                            .catch(error => console.error('Error fetching BR skin:', error));
                    } else {
                        // Display a message for no AR skin
                        displayNoSkin('BurstRifleTab'); // Use 'AssaultRifleTab' instead of 'AssaultRifle'
                    }

                    const swordSkinId = user.field_sword_skin[0]?.target_id;
                    if (swordSkinId) {
                        fetch(`https://ev.io/node/${swordSkinId}?_format=json`)
                            .then(response => response.json())
                            .then(skinData => {
                                const skinName = skinData.title[0].value;
                                const skinIcon = skinData.field_weapon_skin_thumb[0].url;
                                displaySkin('SwordTab', skinName, skinIcon); // Use 'AssaultRifleTab' instead of 'AssaultRifle'
                            })
                            .catch(error => console.error('Error fetching BR skin:', error));
                    } else {
                        // Display a message for no AR skin
                        displayNoSkin('SwordTab'); // Use 'AssaultRifleTab' instead of 'AssaultRifle'
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

    // Function to display skin information in the specified tab
    const displaySkin = (tabId, skinName, skinIcon) => {
        const tab = document.getElementById(tabId);
        tab.innerHTML = `
            <h2>Equipped ${tabId.replace('Tab', '')} Skin</h2>
            <p><strong>Skin Name:</strong> ${skinName}</p>
            <img src="${skinIcon}" alt="${skinName} Skin" style="max-width: 300px;">
            <hr class="modern-hr">
        `;

        // Display the tab
        tab.style.display = 'block';
    };

    // Function to display a message for no skin in the specified tab
    const displayNoSkin = (tabId) => {
        const tab = document.getElementById(tabId);
        tab.innerHTML = '<p>No skin equipped for this category.</p>';

        // Display the tab
        tab.style.display = 'block';
    };

    const handleEnterKey = (event) => {
        if (event.key === 'Enter') {
            // Trigger a click event on the "Show Equipped Skins" button
            fetchUserButton.click();
        }
    };

    fetchUserButton.addEventListener('click', fetchEquippedSkins);
    usernameInput.addEventListener('keydown', handleEnterKey);

    // Add click event listeners to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Hide all tabs
            tabs.forEach(tab => {
                tab.style.display = 'none';
            });

            // Show the selected tab
            const tabId = button.getAttribute('data-tab');
            const tab = document.getElementById(tabId);
            tab.style.display = 'block';
        });
    });

    fetchUserButton.addEventListener('click', fetchEquippedSkins);
});

document.getElementById("defaultOpen").click();