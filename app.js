/* ========================================
   夢占い - Dream Interpreter App Logic
   ======================================== */

// --- 夢キーワード辞書 ---
const DREAM_DICTIONARY = {
    海: {
        category: '自然',
        meaning: '海の夢は、あなたの深層心理や感情の状態を表しています。穏やかな海は心の安定を、荒れた海は感情の揺れ動きを示唆します。海は無限の可能性を象徴し、新しい挑戦への準備が整っていることを暗示しています。',
        fortune: 4,
        advice: '心の声に素直に従いましょう。直感を信じて新しいことに挑戦するのに良い時期です。'
    },
    空: {
        category: '自然',
        meaning: '空の夢は自由への憧れや、より高い目標を求める気持ちの表れです。青く澄んだ空は希望に満ちた未来を、曇り空は一時的な不安を表します。あなたの中に大きな可能性が眠っています。',
        fortune: 5,
        advice: '視野を広げて、大きな目標を設定してみましょう。あなたには無限の可能性があります。'
    },
    山: {
        category: '自然',
        meaning: '山の夢は目標達成や困難への挑戦を象徴します。山を登る夢は着実に目標に向かっている証拠。山頂にいる夢は大きな成功が近いことを暗示しています。',
        fortune: 4,
        advice: '今は努力を続けることが大切です。一歩一歩着実に進めば、必ず頂上にたどり着けます。'
    },
    花: {
        category: '自然',
        meaning: '花の夢は美しさ、愛情、そして成長を象徴します。花が咲く夢は才能が開花する予兆。枯れた花は過去への執着を手放す時が来たことを示しています。',
        fortune: 5,
        advice: '自分の魅力を信じて、もっと自信を持ちましょう。あなたの花は今まさに咲こうとしています。'
    },
    雨: {
        category: '自然',
        meaning: '雨の夢は浄化と再生を意味します。心に溜まったストレスや不安が洗い流され、新しい自分に生まれ変わる暗示です。雨上がりの虹は幸運の前兆です。',
        fortune: 3,
        advice: '今は休息を取り、心をリフレッシュする時期です。嵐の後には必ず晴れ間が訪れます。'
    },
    雪: {
        category: '自然',
        meaning: '雪の夢は純粋さや静けさ、そして新しい始まりを象徴します。一面の雪景色は心がリセットされることを意味し、雪が溶ける夢は問題の解決を暗示しています。',
        fortune: 3,
        advice: '心を静かに落ち着けて、内省の時間を大切にしましょう。'
    },
    川: {
        category: '自然',
        meaning: '川の夢は人生の流れや時間の経過を表します。清らかな流れは順調な人生を、急流は変化の激しい状況を示しています。川を渡る夢は人生の転機を意味します。',
        fortune: 4,
        advice: '流れに逆らわず、自然体で物事に向き合うのが吉です。'
    },
    星: {
        category: '自然',
        meaning: '星の夢は希望、導き、そしてインスピレーションの象徴です。輝く星は夢の実現が近いことを、流れ星は願いが叶うチャンスの到来を暗示しています。',
        fortune: 5,
        advice: '今の夢や目標を諦めないでください。星が導く方向に進めば、必ず光が見えてきます。'
    },
    月: {
        category: '自然',
        meaning: '月の夢は直感力や神秘的な力の象徴です。満月は感情の高まりや成就を、三日月は新しい始まりを表します。あなたの直感力が冴えている時期です。',
        fortune: 4,
        advice: '直感を大切にしましょう。論理だけでなく、心の声に耳を傾けてください。'
    },
    猫: {
        category: '動物',
        meaning: '猫の夢は独立心、自由、そして神秘的な直感を象徴します。甘える猫はあなたに安らぎが必要なことを、野良猫は自由への渇望を示しています。',
        fortune: 3,
        advice: '自分だけの時間を大切にしましょう。一人の時間があなたの創造性を高めてくれます。'
    },
    犬: {
        category: '動物',
        meaning: '犬の夢は忠誠心、友情、そして信頼の象徴です。懐く犬は信頼できる仲間の存在を、吠える犬は警戒すべきことを暗示しています。人間関係を大切にしましょう。',
        fortune: 4,
        advice: '周りの人との絆を深める良い時期です。信頼関係を大切にすれば、きっと助けが得られます。'
    },
    鳥: {
        category: '動物',
        meaning: '鳥の夢は自由、希望、そして精神的な飛躍を象徴します。空を飛ぶ鳥はあなたの可能性の広がりを、美しい鳥の歌は吉報の前兆を示しています。',
        fortune: 5,
        advice: '束縛から解放される時が来ています。自分の翼を信じて大空へ飛び立ちましょう。'
    },
    蛇: {
        category: '動物',
        meaning: '蛇の夢は変容、知恵、そして金運を象徴します。白い蛇は特に金運上昇の大吉夢。脱皮する蛇は古い自分から新しい自分への変化を暗示しています。',
        fortune: 5,
        advice: '大きな変化の予兆です。恐れずに新しい自分を受け入れましょう。金運も上昇中です。'
    },
    魚: {
        category: '動物',
        meaning: '魚の夢は幸運、富、そして潜在意識を象徴します。大きな魚は大きな幸運の到来を、魚を釣る夢はチャンスを掴むことを暗示しています。',
        fortune: 4,
        advice: 'チャンスを逃さないよう、アンテナを張り巡らせてください。幸運は突然訪れます。'
    },
    馬: {
        category: '動物',
        meaning: '馬の夢はエネルギー、情熱、そして前進する力を象徴します。白馬は幸運と成功を、走る馬は目標に向かう情熱の表れです。',
        fortune: 4,
        advice: '情熱を持って行動すれば、必ず結果がついてきます。今こそ全力で駆け出す時です。'
    },
    飛ぶ: {
        category: '行動',
        meaning: '飛ぶ夢は自由への願望と自信の高まりを表します。気持ちよく飛べる夢は今の自分に自信がある証拠。うまく飛べない夢は自分の可能性を信じきれていないサインです。',
        fortune: 4,
        advice: '自分の力をもっと信じてください。あなたは思っているより高く飛べるはずです。'
    },
    走る: {
        category: '行動',
        meaning: '走る夢は目標に向かう意欲や焦りを表しています。軽快に走れる夢は順調な進展を、走れない夢は現実のプレッシャーや不安を示しています。',
        fortune: 3,
        advice: '焦らず自分のペースを保つことが大切です。マラソンのように、長い目で見て進みましょう。'
    },
    落ちる: {
        category: '行動',
        meaning: '落ちる夢は不安や自信の喪失を表すことがありますが、同時に人生の転機を暗示しています。落ちた先に新しい世界が広がることもあります。',
        fortune: 2,
        advice: '不安を感じたら、信頼できる人に相談しましょう。一人で抱え込む必要はありません。'
    },
    泳ぐ: {
        category: '行動',
        meaning: '泳ぐ夢は感情のコントロール力や人生を切り開く力を象徴します。上手に泳げる夢は感情をうまく扱えている証拠です。',
        fortune: 4,
        advice: '感情に流されず、冷静に状況を判断しましょう。あなたには乗り越える力があります。'
    },
    食べる: {
        category: '行動',
        meaning: '食べる夢はエネルギーの充填や欲求の象徴です。美味しく食べる夢は満足感の表れ、食べ過ぎる夢は欲求不満を示している可能性があります。',
        fortune: 3,
        advice: '心と体のバランスを大切にしましょう。自分を満たすことは悪いことではありません。'
    },
    歌う: {
        category: '行動',
        meaning: '歌う夢は自己表現への欲求と感情の解放を象徴します。楽しく歌う夢は心が解放されている証拠。人前で歌う夢は認められたい気持ちの表れです。',
        fortune: 4,
        advice: '自分の気持ちを素直に表現してみましょう。あなたの声は誰かの心に届くはずです。'
    },
    家: {
        category: '場所',
        meaning: '家の夢はあなた自身の心や精神状態を表しています。立派な家は自信の表れ、壊れた家は心の傷を示唆します。家を建てる夢は新しい自分を築く意志の表れです。',
        fortune: 3,
        advice: '自分の内面と向き合い、心の中を整理する時間を設けましょう。'
    },
    学校: {
        category: '場所',
        meaning: '学校の夢は学びや成長、そして社会との関わりを象徴します。懐かしい学校の夢は過去の経験が今のあなたに影響していることを示しています。',
        fortune: 3,
        advice: '新しいスキルや知識を身につけるチャンスです。学ぶ姿勢を忘れないでください。'
    },
    電車: {
        category: '乗り物',
        meaning: '電車の夢は人生の方向性や目的地への旅を象徴します。順調に走る電車は人生が正しい軌道に乗っていることを、乗り遅れる夢はチャンスを逃す不安を表しています。',
        fortune: 3,
        advice: '人生の方向性を見つめ直す良い機会です。本当に行きたい場所を確認しましょう。'
    },
    水: {
        category: '自然',
        meaning: '水の夢は感情や生命力の象徴です。澄んだ水は純粋な心を、濁った水は感情の混乱を表します。水を飲む夢はエネルギーの充填を意味しています。',
        fortune: 4,
        advice: '感情を浄化する時間を取りましょう。瞑想や自然の中での散歩がおすすめです。'
    },
    火: {
        category: '自然',
        meaning: '火の夢は情熱、変革、そして浄化を象徴します。暖かい火は愛情と安心を、激しい炎は強い情熱や怒りを表しています。火は古いものを焼き尽くし、新しいものを生み出す力です。',
        fortune: 4,
        advice: '情熱を忘れずに、でもコントロールすることも大切です。バランスを保ちましょう。'
    },
    赤ちゃん: {
        category: '人物',
        meaning: '赤ちゃんの夢は新しい始まり、純粋さ、そして創造性を象徴します。元気な赤ちゃんは新しいプロジェクトの成功を、泣いている赤ちゃんは心の中の不安を表しています。',
        fortune: 5,
        advice: '新しいことを始めるのに最適な時期です。初心に帰って、ワクワクする気持ちを大切にしましょう。'
    },
    友達: {
        category: '人物',
        meaning: '友達の夢はあなた自身の一部を反映しています。楽しい時間を過ごす夢は人間関係の充実を、喧嘩する夢は自分の中の葛藤を表していることもあります。',
        fortune: 3,
        advice: '大切な人との時間を意識的に作りましょう。人とのつながりがあなたの力になります。'
    },
    お金: {
        category: 'もの',
        meaning: 'お金の夢は自己価値や自信、エネルギーを象徴します。お金を見つける夢は新しい才能の発見を、お金を失う夢はエネルギーの消耗を暗示しています。',
        fortune: 4,
        advice: '自分の価値を正しく認識しましょう。あなたには多くの才能と可能性が秘められています。'
    },
    桜: {
        category: '自然',
        meaning: '桜の夢は儚さの中にある美しさ、新しい出発を象徴します。満開の桜は人生の最高潮を、散る桜は美しい別れや新しい章の始まりを暗示しています。',
        fortune: 4,
        advice: '今この瞬間を大切にしましょう。美しい時間は永遠ではないからこそ、輝いています。'
    },
    虹: {
        category: '自然',
        meaning: '虹の夢は最高の吉夢の一つです。困難の先にある希望、そして夢の実現を暗示しています。多くの色は多彩な可能性が開かれていることを意味します。',
        fortune: 5,
        advice: '最高の運気があなたに向かっています。大胆に行動すれば、素晴らしい結果が待っています。'
    },
    森: {
        category: '自然',
        meaning: '森の夢は無意識の世界や未知の領域を象徴します。森を歩く夢は自分探しの旅を、光が差す森は答えが見つかることを暗示しています。',
        fortune: 3,
        advice: '自分の内面を深く探求する時期です。答えはすでにあなたの中にあります。'
    },
    階段: {
        category: '場所',
        meaning: '階段の夢は人生のステップアップや成長を象徴します。上る夢は昇進や成功を、下る夢は過去の振り返りや基盤固めを意味しています。',
        fortune: 4,
        advice: '一段一段確実にステップアップしていきましょう。急がば回れです。'
    },
    鍵: {
        category: 'もの',
        meaning: '鍵の夢は新しい可能性や秘密、解決策の象徴です。鍵を見つける夢は問題の解決策が見つかることを、鍵を失う夢は機会を逃す不安を表しています。',
        fortune: 4,
        advice: '答えは意外と身近なところにあります。よく観察してみてください。'
    },
    鏡: {
        category: 'もの',
        meaning: '鏡の夢は自己認識や真実の象徴です。きれいな鏡は自分を正しく理解していることを、割れた鏡は自己イメージの変化を暗示しています。',
        fortune: 3,
        advice: '自分自身と向き合う時間を大切にしましょう。ありのままの自分を受け入れてください。'
    },
    太陽: {
        category: '自然',
        meaning: '太陽の夢はエネルギー、成功、そして生命力の象徴です。輝く太陽は素晴らしい運気の到来を、日の出は新しい始まりを暗示しています。',
        fortune: 5,
        advice: '自信を持って前に進みましょう。あなたの内なる光が周りを照らし始めています。'
    }
};

// --- サジェストキーワード ---
const SUGGESTION_KEYWORDS = ['海', '空', '猫', '蛇', '飛ぶ', '桜', '虹', '星'];

// --- DOM要素 ---
const dreamInput = document.getElementById('dream-input');
const searchBtn = document.getElementById('search-btn');
const resultArea = document.getElementById('result-area');
const suggestionsContainer = document.getElementById('suggestions');

// --- 初期化 ---
function init() {
    createStars();
    renderSuggestions();
    setupEventListeners();
}

// --- 星の背景を生成 ---
function createStars() {
    const starsContainer = document.getElementById('stars');
    const count = 120;

    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        const size = Math.random() * 2.5 + 0.5;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
        star.style.animationDelay = `${Math.random() * 5}s`;
        starsContainer.appendChild(star);
    }
}

// --- サジェストタグ表示 ---
function renderSuggestions() {
    suggestionsContainer.innerHTML = SUGGESTION_KEYWORDS.map(keyword =>
        `<button class="suggestion-tag" data-keyword="${keyword}">${keyword}</button>`
    ).join('');
}

// --- イベントリスナー ---
function setupEventListeners() {
    searchBtn.addEventListener('click', handleSearch);

    dreamInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    suggestionsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('suggestion-tag')) {
            const keyword = e.target.dataset.keyword;
            dreamInput.value = keyword;
            handleSearch();
        }
    });
}

// --- 検索処理 ---
async function handleSearch() {
    const query = dreamInput.value.trim();

    if (!query) {
        showNoInput();
        return;
    }

    // 1. まず辞書から検索
    const localResults = searchDream(query);

    if (localResults.length > 0) {
        renderResults(localResults);
    } else {
        // 2. 辞書になければAIで検索
        await searchByAI(query);
    }
}

// --- キーワード検索（部分一致） ---
function searchDream(query) {
    const matches = [];

    for (const [keyword, data] of Object.entries(DREAM_DICTIONARY)) {
        if (keyword.includes(query) || query.includes(keyword)) {
            matches.push({ keyword, ...data });
        }
    }

    return matches;
}

// --- AIによる検索 ---
async function searchByAI(query) {
    showLoading();

    try {
        const response = await fetch(`/.netlify/functions/dream?keyword=${encodeURIComponent(query)}`);

        if (!response.ok) {
            // Try to parse error details from JSON response
            const errorData = await response.json().catch(() => ({}));

            // Pass the full error data to the catch block
            const error = new Error(errorData.error || errorData.message || `Server Error: ${response.status}`);
            error.details = errorData.details; // Attach details
            throw error;
        }

        const data = await response.json();

        // AI結果を通常の形式に変換
        const aiResult = {
            keyword: query,
            category: data.category || 'AI診断',
            meaning: data.meaning,
            fortune: data.fortune,
            advice: data.advice
        };

        renderResults([aiResult]);

    } catch (error) {
        console.error('AI Error:', error);
        showError(query, error.message, error.details);
    }
}

// --- ローディング表示 ---
function showLoading() {
    resultArea.innerHTML = `
    <div class="result-card loading-card">
      <div class="loading-spinner"></div>
      <p class="loading-text">星の声を聞いています...</p>
    </div>
  `;
}

// --- 結果を表示 ---
function renderResults(results) {
    resultArea.innerHTML = results.map(result => `
    <div class="result-card">
      <div class="result-keyword">${escapeHtml(result.keyword)}</div>
      <div class="result-category">${escapeHtml(result.category)}</div>
      <hr class="result-divider">
      <p class="result-meaning">${escapeHtml(result.meaning)}</p>
      <div class="result-fortune">
        <span class="fortune-label">運勢</span>
        <span>
          <span class="fortune-stars">${'★'.repeat(result.fortune)}</span><span class="fortune-empty">${'★'.repeat(5 - result.fortune)}</span>
        </span>
      </div>
      <div class="result-advice">
        <span class="advice-icon">💫</span>
        <span class="advice-text">${escapeHtml(result.advice)}</span>
      </div>
    </div>
  `).join('');
}

// --- エラー表示 ---
function showError(query, errorMessage, errorDetails) {
    let detailsHtml = '';
    if (errorDetails) {
        // If details is an object, stringify it
        const detailsText = typeof errorDetails === 'object' ? JSON.stringify(errorDetails, null, 2) : errorDetails;
        detailsHtml = `
      <details style="margin-top: 10px; text-align: left; color: #aaa; cursor: pointer;">
        <summary>詳細エラー (開発者用)</summary>
        <pre style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 0.7rem; color: #ffaaaa;">${escapeHtml(detailsText)}</pre>
      </details>
    `;
    }

    resultArea.innerHTML = `
    <div class="result-card no-result">
      <div class="no-result-icon">⚠️</div>
      <p class="no-result-title">エラーが発生しました</p>
      <p class="no-result-text" style="font-size: 0.8rem; color: #ff8888; white-space: pre-wrap;">
        ${escapeHtml(errorMessage || '通信エラーが発生しました')}
      </p>
      ${detailsHtml}
      <p class="no-result-text">
        しばらく待ってからもう一度お試しください。<br>
        解決しない場合は、この画面のエラーメッセージを開発者に伝えてください。
      </p>
    </div>
  `;
}

// --- 結果なし表示 (フォールバック) ---
function showNoResult(query) {
    resultArea.innerHTML = `
    <div class="result-card no-result">
      <div class="no-result-icon">🌙</div>
      <p class="no-result-title">「${escapeHtml(query)}」に一致する夢が見つかりませんでした</p>
      <p class="no-result-text">別のキーワードで試してみてください。<br>例：海、空、猫、飛ぶ、桜、虹など</p>
    </div>
  `;
}

// --- 入力なし表示 ---
function showNoInput() {
    resultArea.innerHTML = `
    <div class="result-card no-result">
      <div class="no-result-icon">✨</div>
      <p class="no-result-title">キーワードを入力してください</p>
      <p class="no-result-text">夢に出てきたものや場面を入力して、<br>その意味を占ってみましょう。</p>
    </div>
  `;
}

// --- HTMLエスケープ ---
function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/[&<>"']/g, function (match) {
        switch (match) {
            case '&': return '&amp;';
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '"': return '&quot;';
            case "'": return '&#39;';
        }
    });
}

// --- アプリ起動 ---
document.addEventListener('DOMContentLoaded', init);
