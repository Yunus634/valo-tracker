const API_KEY = 'HDEV-d8e7fc8b-a3a0-4ecd-b330-ac724f0356d4';

document.addEventListener('DOMContentLoaded', () => {
  // Arama butonunu id veya genel button olarak yakala
  const searchBtn = document.getElementById('search-btn') || document.querySelector('button');

  if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();

      // Input alanlarını yakala
      const nameInput = document.getElementById('player-name') || document.querySelectorAll('input')[0];
      const tagInput = document.getElementById('player-tag') || document.querySelectorAll('input')[1];

      const nameVal = nameInput ? nameInput.value.trim() : '';
      const tagVal = tagInput ? tagInput.value.trim().replace('#', '') : '';

      if (!nameVal || !tagVal) {
        alert('Lütfen hem oyuncu adını hem de etiketini girin!');
        return;
      }

      fetchPlayerData(nameVal, tagVal);
    });
  }
});

async function fetchPlayerData(name, tag, region) {
  if (!region) {
    region = 'eu';
  }

  try {
    const options = {
      method: 'GET',
      headers: {
        'Authorization': API_KEY
      }
    };

    const proxyUrl = 'https://corsproxy.io/?';

    // 1. Hesap Bilgilerini Çek
    const accountTarget = 'https://api.henrikdev.xyz/valorant/v1/account/' + encodeURIComponent(name) + '/' + encodeURIComponent(tag);
    const accountResponse = await fetch(proxyUrl + encodeURIComponent(accountTarget), options);
    const accountData = await accountResponse.json();

    if (accountData.status !== 200) {
      alert('Oyuncu bulunamadı! İsim ve etiketi kontrol edin.');
      return;
    }

    // 2. Derece (Rank / MMR) Bilgilerini Çek
    const mmrTarget = 'https://api.henrikdev.xyz/valorant/v2/mmr/' + region + '/' + encodeURIComponent(name) + '/' + encodeURIComponent(tag);
    const mmrResponse = await fetch(proxyUrl + encodeURIComponent(mmrTarget), options);
    const mmrData = await mmrResponse.json();

    // 3. Maç Geçmişini Çek
    const matchesTarget = 'https://api.henrikdev.xyz/valorant/v3/matches/' + region + '/' + encodeURIComponent(name) + '/' + encodeURIComponent(tag);
    const matchesResponse = await fetch(proxyUrl + encodeURIComponent(matchesTarget), options);
    const matchesData = await matchesResponse.json();

    console.log('API Verileri:', { accountData, mmrData, matchesData });

    displayData(accountData.data, mmrData.data, matchesData.data);

  } catch (error) {
    console.error('API İsteğinde Hata Oluştu:', error);
    alert('Veriler çekilirken bir sorun oluştu.');
  }
}

function displayData(account, mmr, matches) {
  const resultDiv = document.getElementById('result') || document.getElementById('player-card') || document.querySelector('.result-container');

  if (resultDiv && account) {
    resultDiv.style.display = 'block';

    const rankName = (mmr && mmr.current_data) ? mmr.current_data.currenttierpatched : 'Derecesiz';
    const matchCount = (matches && Array.isArray(matches)) ? matches.length : 0;

    resultDiv.innerHTML = '<h2>' + account.name + ' #' + account.tag + '</h2>' +
      '<p><strong>Hesap Seviyesi:</strong> ' + account.account_level + '</p>' +
      '<p><strong>Mevcut Rank:</strong> ' + rankName + '</p>' +
      '<p><strong>Son Maç Sayısı:</strong> ' + matchCount + '</p>';
  }
}
