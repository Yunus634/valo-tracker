const API_KEY = 'HDEV-d8e7fc8b-a3a0-4ecd-b330-ac724f0356d4';

async function fetchPlayerData(name, tag, region = 'eu') {
  try {
    const options = {
      headers: {
        'Authorization': API_KEY
      }
    };

    // 1. Hesap Bilgilerini Çek
    const accountUrl = 'https://api.henrikdev.xyz/valorant/v1/account/' + name + '/' + tag;
    const accountResponse = await fetch(accountUrl, { headers: {'Authorization': API_KEY} });
    const accountData = await accountResponse.json();

    if (accountData.status !== 200) {
      alert('Oyuncu bulunamadı veya bir hata oluştu!');
      return;
    }

    // 2. Derece (Rank / MMR) Bilgilerini Çek
    const mmrUrl = 'https://api.henrikdev.xyz/valorant/v2/mmr/' + region + '/' + name + '/' + tag;
    const mmrResponse = await fetch(mmrUrl, { headers: {'Authorization': API_KEY} });
    const mmrData = await mmrResponse.json();

    // 3. Maç Geçmişini Çek
    const matchesUrl = 'https://api.henrikdev.xyz/valorant/v3/matches/' + region + '/' + name + '/' + tag;
    const matchesResponse = await fetch(matchesUrl, { headers: {'Authorization': API_KEY} });
    const matchesData = await matchesResponse.json();

    console.log('Hesap Bilgileri:', accountData);
    console.log('MMR / Rank Bilgileri:', mmrData);
    console.log('Maç Geçmişi:', matchesData);

    // Verileri arayüze basma fonksiyonu
    displayData(accountData.data, mmrData.data, matchesData.data);

  } catch (error) {
    console.error('API İsteği Sırasında Hata Oluştu:', error);
  }
}

function displayData(account, mmr, matches) {
  console.log('Arayüz verileri alındı:', { account, mmr, matches });
}
