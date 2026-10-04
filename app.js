const API_KEY = 'HDEV-d8e7fc8b-a3a0-4ecd-b330-ac724f0356d4';

// Sayfa yüklendiğinde buton tıklamasını dinle
document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('search-btn') || document.querySelector('button');
  
  if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('player-name') || document.querySelector('input[type="text"]');
      const tagInput = document.getElementById('player-tag') || document.querySelectorAll('input')[1];
      
      if (!nameInput || !tagInput || !nameInput.value || !tagInput.value) {
        alert('Lütfen oyuncu adı ve etiketini girin!');
        return;
      }
      
      const name = nameInput.value.trim();
      const tag = tagInput.value.trim().replace('#', '');
      
      fetchPlayerData(name, tag);
    });
  }
});

async function fetchPlayerData(name, tag, region = 'eu') {
  try {
    const options = {
      method: 'GET',
      headers: {
        'Authorization': API_KEY
      }
    };

    // CORS proxy ile tarayıcı engeli aşılır
    const proxyUrl = 'https://corsproxy.io/?';
    
    // 1. Hesap Bilgileri
    const accountTarget = https://api.henrikdev.xyz/valorant/v1/account/${encodeURIComponent(name)}/${encodeURIComponent(tag)};
    const accountResponse = await fetch(proxyUrl + encodeURIComponent(accountTarget), options);
    const accountData = await accountResponse.json();

    if (accountData.status !== 200) {
      alert('Oyuncu bulunamadı! Lütfen ismi ve etiketi kontrol edin.');
      return;
    }

    // 2. MMR / Rank
    const mmrTarget = https://api.henrikdev.xyz/valorant/v2/mmr/${region}/${encodeURIComponent(name)}/${encodeURIComponent(tag)};
    const mmrResponse = await fetch(proxyUrl + encodeURIComponent(mmrTarget), options);
    const mmrData = await mmrResponse.json();

    // 3. Maç Geçmişi
    const matchesTarget = https://api.henrikdev.xyz/valorant/v3/matches/${region}/${encodeURIComponent(name)}/${encodeURIComponent(tag)};
    const matchesResponse = await fetch(proxyUrl + encodeURIComponent(matchesTarget), options);
    const matchesData = await matchesResponse.json();

    console.log('API Yanıtları:', { accountData, mmrData, matchesData });
    displayData(accountData.data, mmrData.data, matchesData.data);

  } catch (error) {
    console.error('API İsteğinde Hata:', error);
    alert('Veriler çekilirken bir hata oluştu. Konsolu kontrol edin (F12).');
  }
}

function displayData(account, mmr, matches) {
  // Arayüz elemenlarını doldurma işlemleri
  const resultDiv = document.getElementById('result') || document.getElementById('player-card');
  
  if (resultDiv) {
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
      <h2>${account.name} #${account.tag}</h2>
      <p><strong>Seviye:</strong> ${account.account_level}</p>
      <p><strong>Mevcut Kademe:</strong> ${mmr?.current_data?.currenttierpatched || 'Derecesiz'}</p>
      <p><strong>Son Maç Sayısı:</strong> ${matches?.length || 0}</p>
    `;
  }
}
