const API_KEY = 'HDEV-d8e7fc8b-a3a0-4ecd-b330-ac724f0356d4';

document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('searchBtn');
  const inputField = document.getElementById('riotIdInput');

  if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const inputVal = inputField ? inputField.value.trim() : '';

      if (!inputVal || !inputVal.includes('#')) {
        alert('Lütfen Riot ID ve Tag değerini "İsim#Etiket" şeklinde girin! (Örn: EMRE#VCG5)');
        return;
      }

      const parts = inputVal.split('#');
      const name = parts[0].trim();
      const tag = parts[1].trim();

      if (!name || !tag) {
        alert('Lütfen geçerli bir isim ve etiket girin!');
        return;
      }

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

    const proxyUrl = 'https://corsproxy.io/?';

    // 1. Hesap Bilgilerini Çek
    const accountTarget = 'https://api.henrikdev.xyz/valorant/v1/account/' + encodeURIComponent(name) + '/' + encodeURIComponent(tag);
    const accountResponse = await fetch(proxyUrl + encodeURIComponent(accountTarget), options);
    const accountData = await accountResponse.json();

    if (accountData.status !== 200) {
      alert('Oyuncu bulunamadı! Lütfen ismi ve etiketi kontrol edin.');
      return;
    }

    // 2. Derece (Rank / MMR) Bilgilerini Çek
    const mmrTarget = 'https://api.henrikdev.xyz/valorant/v2/mmr/' + region + '/' + encodeURIComponent(name) + '/' + encodeURIComponent(tag);
    const mmrResponse = await fetch(proxyUrl + encodeURIComponent(mmrTarget), options);
    const mmrData = await mmrResponse.json();

    console.log('API Verileri:', { accountData, mmrData });

    displayData(accountData.data, mmrData.data);

  } catch (error) {
    console.error('API İsteğinde Hata Oluştu:', error);
    alert('Veriler çekilirken bir sorun oluştu.');
  }
}

function displayData(account, mmr) {
  const blueList = document.getElementById('blueTeamList');

  const rankName = (mmr && mmr.current_data) ? mmr.current_data.currenttierpatched : 'Derecesiz';

  if (blueList && account) {
    blueList.innerHTML = `
      <div style="padding: 12px; background: rgba(255,255,255,0.1); margin-top: 10px; border-radius: 6px;">
        <h3 style="margin: 0 0 5px 0;">${account.name} #${account.tag}</h3>
        <p style="margin: 2px 0;"><strong>Seviye:</strong> ${account.account_level}</p>
        <p style="margin: 2px 0;"><strong>Rank:</strong> ${rankName}</p>
      </div>
    `;
  }
}
