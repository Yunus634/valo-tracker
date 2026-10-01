// --- 1. ELEMENT SEÇİMLERİ ---
const riotIdInput = document.getElementById('riotIdInput');
const searchBtn = document.getElementById('searchBtn');
const blueTeamList = document.getElementById('blueTeamList');
const redTeamList = document.getElementById('redTeamList');

// API Ana Bitiş Noktası (HenrikDev Valorant API v3)
const API_BASE_URL = 'https://api.henrikdev.xyz/valorant/v3';

// --- 2. ARAMA BUTONU TIKLAMA OLAYI ---
searchBtn.addEventListener('click', () => {
    const fullId = riotIdInput.value.trim();
    
    if (!fullId.includes('#')) {
        alert('Lütfen geçerli bir Riot ID girin! (Örn: Player#TR1)');
        return;
    }

    // ID ve TAG'i ayrıştır (Örn: "Player#TR1" -> name: "Player", tag: "TR1")
    const [name, tag] = fullId.split('#');
    
    // Canlı Maç Verilerini Getir
    fetchLiveMatch(name, tag);
});

// --- 3. CANLI MAÇ VERİLERİNİ ÇEKEN FONKSİYON ---
async function fetchLiveMatch(name, tag) {
    // Ekranda yükleniyor mesajı göster
    blueTeamList.innerHTML = '<p class="loading">Maç verisi yükleniyor...</p>';
    redTeamList.innerHTML = '<p class="loading">Maç verisi yükleniyor...</p>';

    try {
        // API Endpoint: Oyuncunun aktif/son maçını getirir
        const response = await fetch(API_BASE_URL + '/matches/eu/' + encodeURIComponent(name) + '/' + encodeURIComponent(tag) + '?size=1');
        
        if (!response.ok) {
            throw new Error('Oyuncu veya canlı maç bulunamadı.');
        }

        const result = await response.json();
        const matchData = result.data[0]; // En son / aktif maç verisi

        // Maçtaki oyuncuları takımlara ve gruplara ayırıp ekrana bas
        renderTeams(matchData.players.all_players);

    } catch (error) {
        console.error('API Hatası:', error);
        blueTeamList.innerHTML = '<p class="error">Veri alınamadı veya oyuncu şu an maçta değil.</p>';
        redTeamList.innerHTML = '<p class="error">Veri alınamadı.</p>';
    }
}

// --- 4. OYUNCULARI VE GRUPLARI (PARTY) EKRANA YAZDIRAN FONKSİYON ---
function renderTeams(players) {
    // Liste alanlarını temizle
    blueTeamList.innerHTML = '';
    redTeamList.innerHTML = '';

    // Aynı grupta olan kişileri tespit etmek için Parti Mantığı (party_id takibi)
    const partyMap = {};
    let partyCounter = 1;

    // Her oyuncunun party_id'sine göre grup numarası ata
    players.forEach(player => {
        if (!partyMap[player.party_id]) {
            partyMap[player.party_id] = partyCounter++;
        }
    });

    // Oyuncuları döngüye alıp Mavi ve Kırmızı takıma ayır
    players.forEach(player => {
        const partyGroupNumber = partyMap[player.party_id];
        const playerCard = createPlayerCard(player, partyGroupNumber);

        if (player.team.toLowerCase() === 'blue') {
            blueTeamList.appendChild(playerCard);
        } else {
            redTeamList.appendChild(playerCard);
        }
    });
}

// --- 5. OYUNCU KARTI HTML ŞABLONU OLUŞTURMA ---
function createPlayerCard(player, partyGroupNumber) {
    const card = document.createElement('div');
    card.className = 'player-card party-group-' + partyGroupNumber;

    // Rank ismi ve ikonu
    const rankName = player.currenttier_patched || 'Unranked';
    const characterName = player.character || 'Agent';

    card.innerHTML = `
        <div class="player-info">
            <span class="agent-name">${characterName}</span>
            <strong class="player-name">${player.name}#${player.tag}</strong>
        </div>
        <div class="player-stats">
            <span class="level">Svd: ${player.level}</span>
            <span class="rank">${rankName}</span>
            <span class="party-tag">Grup #${partyGroupNumber}</span>
        </div>
    `;

    return card;
}