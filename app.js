const main = document.querySelector('#main');
const dialog = document.querySelector('#product-dialog');
let inquiryProduct = '';
let previousProductTrigger = null;
let currentFilter = 'all';
let formSnapshot = null;
let revealObserver = null;
let motionImages = [];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arrow = '<span class="circle-arrow" aria-hidden="true">↗</span>';
const products = [
 {id:1,name:'鋳鋼製クレーン車輪',en:'CRANE WHEELS',group:'wheels',category:'車輪',desc:'クレーン車輪の製品シリーズ。CACブッシュ入タイプ、ベアリング入タイプなど、用途に合わせた仕様をご確認いただけます。',spec:'CACブッシュ入タイプ・ベアリング入タイプ',pdf:'k-01.pdf'},
 {id:2,name:'チルド車輪',en:'CHILLED WHEELS',group:'wheels',category:'車輪',desc:'チルド車輪、DXシリーズ、セット車輪などの製品情報をご案内します。呼径や耐荷重などの詳細は、公開仕様表をご確認ください。',spec:'チルド車輪・DXシリーズ・セット車輪',pdf:'k-02.pdf'},
 {id:3,name:'ベアリングケース',en:'BEARING CASES',group:'parts',category:'機械部品',desc:'ベアリングケースの製品情報。各部の寸法と図面をご確認のうえ、ご使用条件に応じてご相談ください。',spec:'寸法・形状は公開図面をご確認ください',pdf:'k-03.pdf'},
 {id:4,name:'両ツバ車輪',en:'DOUBLE FLANGED WHEELS',group:'wheels',category:'車輪',desc:'両ツバ車輪の製品情報。ご希望の寸法や用途をお知らせください。詳細な仕様はカタログからご覧いただけます。',spec:'寸法・形状は公開図面をご確認ください',pdf:'k-04.pdf'},
 {id:5,name:'ウレタンクレーン車輪',en:'URETHANE CRANE WHEELS',group:'wheels',category:'車輪',desc:'ウレタンクレーン車輪の製品情報。各部寸法を資料で確認し、用途や数量についてご相談いただけます。',spec:'寸法・形状は公開図面をご確認ください',pdf:'k-05.pdf'},
 {id:6,name:'重量戸車',en:'HEAVY DUTY WHEELS',group:'wheels',category:'車輪',desc:'重量戸車の製品情報。公開されているカタログから、各シリーズの形状や寸法をご確認いただけます。',spec:'各シリーズは公開図面をご確認ください',pdf:'k-06.pdf'},
 {id:7,name:'ロープ車',en:'ROPE SHEAVES',group:'wheels',category:'車輪',desc:'ロープ車の製品情報。詳細な寸法や形状は図面をご確認ください。用途に合わせた製作のご相談も承ります。',spec:'寸法・形状は公開図面をご確認ください',pdf:'k-07.pdf'},
 {id:8,name:'ブレーキカップリング',en:'BRAKE COUPLINGS',group:'couplings',category:'継手',desc:'ブレーキカップリングの製品情報。各部寸法や対応する仕様を、公開仕様表からご確認いただけます。',spec:'材質 FC250',pdf:'k-08.pdf'},
 {id:9,name:'筒割カップリング',en:'SPLIT COUPLINGS',group:'couplings',category:'継手',desc:'筒割カップリングの製品情報。軸径や本体寸法などの仕様をご確認のうえ、ご相談ください。',spec:'材質 FCD450',pdf:'k-09.pdf'},
 {id:10,name:'ステンレスハンドル',en:'STAINLESS HANDLES',group:'parts',category:'機械部品',desc:'ステンレスハンドルの製品情報。各部寸法、形状などの詳細は公開カタログをご覧ください。',spec:'材質 SCS13',pdf:'k-10.pdf'},
 {id:11,name:'フランヂ形タワミ軸継手',en:'FLEXIBLE COUPLINGS',group:'couplings',category:'継手',desc:'フランヂ形タワミ軸継手の製品情報。本体と部品の寸法を、公開仕様表からご確認いただけます。',spec:'材質 FC250',pdf:'k-11.pdf'},
 {id:12,name:'連鋳棒',en:'CONTINUOUS CAST IRON BARS',group:'materials',category:'素材',desc:'丸・角・平角など、さまざまな形状の連鋳棒。規格にない寸法の切出し製造についてもご相談ください。',spec:'FC250・FCD600・FCD450',pdf:null},
 {id:13,name:'ITK別注品',en:'CUSTOM CASTINGS',group:'custom',category:'別注品',desc:'図面や現品をもとにした製品のご相談。用途、形状、材質、数量など、分かる範囲でお知らせください。',spec:'対応条件は個別にご相談ください',pdf:null}
];
function productCard(p) {
 return `<a class="product-card" href="${siteHref('product','id='+p.id)}" aria-label="${p.name}の詳細を見る"><span class="product-picture"><span class="product-serial">${String(p.id).padStart(2,'0')}</span><span class="crop"><img src="./assets/product-${p.id}.jpg" alt="${p.name}" width="164" height="154" loading="lazy"></span></span><span class="product-caption"><small>${p.en}</small><strong>${p.name}</strong><span class="product-card-action">詳細を見る</span></span></a>`;
}
function pageIntro(en,title,desc='') {
 return `<section class="page-intro"><div class="wrap"><div class="breadcrumb"><a href="#/">HOME</a><span>/</span><span>${title}</span></div><div class="eyebrow">${en}</div><h1>${title}</h1>${desc?`<p>${desc}</p>`:''}</div></section>`;
}
function contactBand(label='製品・図面・別注品のご相談',copy='お客様のものづくりを、ここから。') {
 return `<section class="contact-editorial"><div class="wrap"><a href="#/contact"><div><p>${esc(label)}</p><h2>Contact</h2></div><span class="contact-direction" aria-hidden="true">↗</span></a><div class="contact-editorial-foot"><span>${esc(copy)}</span><a href="tel:0523616511">052-361-6511 <small>本社</small></a></div></div></section>`;
}
const productStories = [
 {id:1,label:'車輪',en:'WHEELS',headline:'産業の動きを、支える。',text:'クレーン車輪、チルド車輪、重量戸車。用途に合わせた製品から、仕様や図面をご確認いただけます。',note:'CRANE WHEELS / 鋳鋼製クレーン車輪'},
 {id:8,label:'継手',en:'COUPLINGS',headline:'回転する力を、つなぐ。',text:'ブレーキカップリング、筒割カップリング、フランヂ形タワミ軸継手。形状や材質に応じた製品をご案内します。',note:'BRAKE COUPLINGS / ブレーキカップリング'},
 {id:12,label:'素材',en:'MATERIALS',headline:'ものづくりの、出発点。',text:'丸、角、平角などの連鋳棒。必要な形状や材質、寸法についてご相談いただけます。',note:'CONTINUOUS CAST IRON BARS / 連鋳棒'},
 {id:13,label:'別注品',en:'CUSTOM',headline:'必要な形を、一緒に。',text:'図面や現品をもとに、用途・形状・材質・数量を確認。ご要望に合わせた製作をご相談ください。',note:'CUSTOM CASTINGS / ITK別注品'}
];
const craftStories = [
 {title:'鋳造',en:'CASTING',image:'process-1.jpg',alt:'溶けた金属を鋳型へ注ぐ鋳造の様子',text:'熱で溶かした金属を、鋳型へ。形のない素材から製品の形を生み出す、ものづくりの原点です。'},
 {title:'機械加工',en:'MACHINING',image:'process-2.jpg',alt:'旋盤による金属の機械加工',text:'鋳造した製品を、求められる形へ仕上げる。長年積み重ねてきた加工の経験を、一つひとつの製品に活かします。'},
 {title:'別注品のご相談',en:'CUSTOM MANUFACTURING',image:'process-3.jpg',alt:'伊藤鋳工の製造現場',text:'用途、形状、材質、数量。図面や現品をもとに、必要な仕様を確認するところから、ご相談を承ります。'}
];
function productStoryPanel(index=0){
 const s=productStories[index];
 return `<div class="showcase-image"><span class="showcase-annotation">ITO CASTING COLLECTION</span><div class="product-picture"><span class="crop"><img src="./assets/product-${s.id}.jpg" alt="${products.find(p=>p.id===s.id).name}" width="164" height="154"></span></div><span class="showcase-image-note">${s.note}</span></div><div class="showcase-copy"><span class="micro-label">0${index+1} / 04</span><div class="showcase-en">${s.en}</div><h3>${s.headline}</h3><p>${s.text}</p><button type="button" class="text-link" data-product="${s.id}">製品の詳細・図面 ${arrow}</button></div>`;
}
function referencePhoto(file,alt,classes='',extra='',eager=false) {
 const label=esc(`${alt}（撮影参考用のイメージ画像）`);
 const focus=classes.includes('recruit-cover')?'xMidYMin':'xMidYMid';
 return `<figure class="photoshoot-photo ${classes}"><svg class="photo-window" viewBox="0 0 1536 900" preserveAspectRatio="${focus} slice" role="img" aria-label="${label}" focusable="false"><image href="./assets/${file}" width="1536" height="1024"/></svg>${extra}<figcaption class="image-disclaimer">画像はイメージです</figcaption></figure>`;
}

function homePage() {
 return `<section class="foundry-hero" aria-labelledby="foundry-title">
   <div class="foundry-image"><img src="./assets/casting-concept.webp" alt="溶けた鉄を鋳型へ注ぐ鋳造シーンのイメージ画像" width="1672" height="941" fetchpriority="high"></div>
   <div class="hero-frame"><p class="hero-label">ITO CASTING / SINCE 1914</p><div class="hero-headline"><p>百年の技術を、次の時代へ。</p><h1 id="foundry-title">技を継ぎ、<br>未来を鋳る。</h1></div><div class="hero-bottom"><a href="#home-about" data-scroll="home-about" class="scroll-down"><span>SCROLL</span><i aria-hidden="true">↓</i></a><p>鋳造と機械加工で、産業を支える。<br>伊藤鋳工株式会社</p></div></div>
   <span class="image-disclaimer hero-disclaimer">画像はイメージです</span>
 </section>
 <div class="hero-route"><span>CASTING <i>×</i> MACHINING</span><div><a href="#/products">製品・図面を探す</a><a href="#/contact">製作について相談する</a></div></div>
 <section class="heritage-section" id="home-about"><div class="wrap"><div class="section-index"><span>01 / ABOUT US</span><span>伊藤鋳工について</span></div><div class="heritage-grid"><div class="heritage-title reveal"><p class="section-english">A century.<br>And beyond.</p><h2>受け継ぐ技術に、<br>新しい意志を。</h2></div><div class="heritage-story reveal"><p class="heritage-word">温故知新。</p><p>古きをたずね、新しきを知る。<br>1914年、名古屋で始まった私たちのものづくり。<br>積み重ねてきた経験と知恵に、新しい発想を重ね、<br>産業の現場を支える製品をつくり続けています。</p><p>車輪、継手、連鋳棒、そして別注品。<br>一つひとつの製品に、次の時代へつなぐ技術を。</p><a class="heritage-about-link" href="#/about">私たちについて<span aria-hidden="true"></span></a></div></div><div class="heritage-history"><div class="heritage-history-intro"><p class="small-latin">OUR HISTORY</p><p>一世紀の歩みを、<br>次のものづくりへ。</p><a href="#/about?section=our-history">沿革を見る</a></div><ol class="heritage-milestones">${[['1914','名古屋で創業','鋳造業としての歩みが始まる。'],['1969','佐屋工場を新設','連鋳棒の生産を開始。'],['1984','機械加工の領域へ','鋳造から加工へ、技術を広げる。']].map(([year,title,text])=>`<li><time>${year}</time><h3>${title}</h3><p>${text}</p></li>`).join('')}</ol></div></div></section>
 <section class="craft-section"><div class="wrap"><div class="section-index"><span>02 / TECHNOLOGY</span><span>技術とものづくり</span></div><div class="craft-title-row reveal"><h2>熱を、かたちに。<br>技術を、確かさに。</h2><p>溶かす。形づくる。仕上げる。<br>素材から製品へ。<br>鋳造と加工の経験が、一つの形になる。</p></div></div><div class="craft-composition"><div class="craft-number" aria-hidden="true">CRAFT<br>& FORM.</div>${referencePhoto('machining-concept.webp','鋳物の車輪を旋盤で加工する場面','concept-photo machining-photo reveal')}<div class="craft-caption">FROM MOLTEN IRON TO A FINISHED FORM</div></div><div class="wrap craft-links"><a href="#/technology?section=tech-casting"><span class="craft-link-index">01</span><span><strong>鋳造</strong><small>CASTING</small><p>熱で溶かした金属に、製品の形を与える。</p></span></a><a href="#/technology?section=tech-machining"><span class="craft-link-index">02</span><span><strong>機械加工</strong><small>MACHINING</small><p>求められる寸法と形へ、一つずつ仕上げる。</p></span></a></div></section>
 <section class="products-editorial"><div class="wrap"><div class="section-index"><span>03 / PRODUCTS</span><span>製品紹介</span></div><div class="products-title-row reveal"><h2>Products<span>産業の動きを、支えるもの。</span></h2><a class="editorial-link" href="#/products">すべての製品・図面</a></div><div class="featured-products">${[products[0],products[7],products[11]].map((p,i)=>`<a class="featured-product reveal" href="${siteHref('product','id='+p.id)}" aria-label="${p.name}の詳細を見る"><span class="featured-image"><img src="./assets/product-concept-${['wheel','coupling','bars'][i]}.webp" alt="${p.name}の撮影イメージ。実際の製品写真ではありません。" width="1448" height="1086" loading="lazy"><span class="image-disclaimer">画像はイメージです</span></span><span class="featured-text"><span class="featured-meta"><small>${p.en}</small><span class="featured-count">0${i+1}</span></span><strong>${p.name}</strong><span class="featured-details">詳細を見る</span></span></a>`).join('')}</div><a class="custom-order" href="#/contact"><div><span>CUSTOM MADE</span><h3>その一品を、一緒に。</h3><p>図面や現品をもとにした別注品の製作も、ご相談ください。</p></div><span class="custom-action">別注品のご相談</span></a></div></section>
 <section class="people-editorial">${referencePhoto('craftsperson-bench.webp','製品と向き合う職人の横顔と手元','people-photo','<span class="photo-scene-label">PEOPLE & CRAFT</span>')}<div class="people-copy reveal"><div class="section-index"><span>04 / RECRUIT</span><span>採用情報</span></div><h2>この熱を、<br>次の誰かへ。</h2><p>自分の手でつくったものが、<br>誰かの仕事を支えていく。<br>ものづくりの現場で、技術を自分の力に。</p><a class="editorial-link" href="#/recruit">伊藤鋳工で働く</a></div></section>
 ${contactBand()}`;
}

function interiorMast(en,title,desc='',theme='') {
 return `<header class="interior-mast ${theme}"><div class="wrap"><nav class="interior-breadcrumb" aria-label="パンくず"><a href="#/">HOME</a><span>/</span><span>${title}</span></nav><div class="interior-mast-row"><div><p class="interior-en">${en}</p><h1>${title}</h1></div>${desc?`<p class="interior-description">${desc}</p>`:''}</div></div></header>`;
}
function localNav(items){return `<nav class="interior-nav" aria-label="ページ内メニュー"><div class="wrap">${items.map(([id,label],i)=>`<a href="#${id}" data-scroll="${id}"><span>0${i+1}</span>${label}</a>`).join('')}</div></nav>`;}
function interiorHeading(en,title){return `<div class="interior-heading"><p>${en}</p><h2>${title}</h2></div>`;}
function contactSteps(step=1){return `<ol class="contact-steps" aria-label="お問い合わせの進行状況">${['入力','確認','完了'].map((label,i)=>`<li class="${i+1===step?'current':i+1<step?'done':''}" ${i+1===step?'aria-current="step"':''}><span>0${i+1}</span>${label}</li>`).join('')}</ol>`;}

function productsPage() {
 return `${interiorMast('Products','製品紹介・図面','動きを支える、力をつなぐ。<br>用途に合う製品を、ここから。','products-mast')}
 <section class="catalogue-section"><div class="wrap catalogue-layout"><aside class="catalogue-aside"><p class="small-latin">PRODUCT CATEGORY</p><h2>製品を探す</h2><div class="filter-group" aria-label="製品カテゴリ">${[['all','すべて'],['wheels','車輪'],['couplings','継手'],['parts','機械部品'],['materials','素材'],['custom','別注品']].map(([key,label])=>`<button class="filter-button ${currentFilter===key?'active':''}" type="button" data-filter="${key}" aria-pressed="${currentFilter===key}"><span>${label}</span><small>${key==='all'?products.length:products.filter(p=>p.group===key).length}</small></button>`).join('')}</div></aside>
 <div class="catalogue-main"><div class="catalogue-topline"><p class="catalogue-count" id="catalogue-count" aria-live="polite">全${products.length}件</p><a class="catalogue-docs-link" href="#/catalogue">図面・カタログを見る</a></div><div class="product-grid catalogue-grid" id="catalogue-grid">${products.map(productCard).join('')}</div><div class="empty-results" id="empty-results" hidden>該当する製品がありません。<br>別のカテゴリを選んでください。</div></div></div></section>
 ${productFAQ()}
 ${contactBand('お探しの製品が見つからない方へ','用途・材質・寸法など、分かる範囲でご相談ください。')}`;
}
function aboutPage() {
 return `${interiorMast('About us','私たちについて','一世紀を超えて、鉄と向き合う。<br>受け継いだ技術を、次の時代へ。')}
 ${referencePhoto('factory-overview.webp','鋳造工場の空間とものづくりの現場を見渡す全景','about-cover','<div class="wrap"><p>OUR ORIGIN, OUR FUTURE.</p><span>Since <b>1914</b></span></div>',true)}
 ${localNav([['our-story','伊藤鋳工について'],['representative-message','代表ご挨拶'],['company-profile','会社概要'],['our-history','沿革'],['company-activities','新たな取り組み'],['our-locations','拠点案内']])}
 ${companyOverview()}
 ${representativeMessage()}
 <section class="interior-section section-tint" id="company-profile"><div class="wrap information-grid">${interiorHeading('COMPANY PROFILE','会社概要')}<table class="interior-table"><tbody><tr><th scope="row">商号</th><td>伊藤鋳工株式会社</td></tr><tr><th scope="row">創業</th><td>1914年（大正3年）1月5日</td></tr><tr><th scope="row">代表者</th><td>伊藤 剛</td></tr><tr><th scope="row">資本金</th><td>4,800万円</td></tr><tr><th scope="row">所在地</th><td>本社 / 名古屋市中川区三ツ屋町1丁目2017<br>佐屋工場 / 愛知県愛西市大井町浦田面540</td></tr><tr><th scope="row">主な製品</th><td>各種車輪、カップリング、ステンレスハンドル、<br>連鋳棒、ITK別注品など</td></tr></tbody></table></div></section>
 <section class="interior-section" id="our-history"><div class="wrap information-grid">${interiorHeading('OUR HISTORY','技術と歩んだ、<br>一世紀。')}<div class="history-editorial">${[['1914','鋳造業を創業','伊藤忠治郎が名古屋市中川区西日置で鋳造業を創業。'],['1961','伊藤鋳工株式会社へ','株式会社に改組。'],['1969','佐屋工場を新設','連鋳棒の生産を開始。'],['1984','機械加工の領域へ','機械加工工場を増設し、NC旋盤等を設置。'],['2015','次のものづくりの拠点へ','佐屋・新工場が完成。']].map(([year,title,copy])=>`<article><span>${year}</span><div><h3>${title}</h3><p>${copy}</p></div></article>`).join('')}</div></div></section>
 ${companyActivities()}
 <section class="interior-section locations-section" id="our-locations"><div class="wrap">${interiorHeading('OUR LOCATIONS','愛知から、ものづくりを。')}<div class="locations-grid"><article><p class="small-latin">01 / NAGOYA</p><h3>本社</h3><p>〒454-0831<br>名古屋市中川区三ツ屋町1丁目2017</p><a class="location-phone" href="tel:0523616511">052-361-6511 <small>TEL</small></a><a class="editorial-link" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('伊藤鋳工株式会社 名古屋市中川区三ツ屋町1丁目2017')}" target="_blank" rel="noopener">Google Maps <span aria-hidden="true">↗</span></a></article><article><p class="small-latin">02 / AISAI</p><h3>佐屋工場</h3><p>〒496-0921<br>愛知県愛西市大井町浦田面540</p><a class="location-phone" href="tel:0567310692">0567-31-0692 <small>TEL</small></a><a class="editorial-link" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('伊藤鋳工 佐屋工場 愛西市大井町浦田面540')}" target="_blank" rel="noopener">Google Maps <span aria-hidden="true">↗</span></a></article></div></div></section>${contactBand()}`;
}
function technologyPage() {
 return `${interiorMast('Technology','技術とものづくり','溶かす。形づくる。仕上げる。<br>鋳造と加工で、求められる一品へ。','technology-mast')}
 ${referencePhoto('casting-material-study.webp','鋳肌の質感が見える鋳造部品','technology-cover','<p>CASTING <span>×</span> MACHINING</p>',true)}
 ${localNav([['tech-casting','鋳造'],['tech-machining','機械加工'],['tech-custom','別注品のご相談']])}
 <section class="interior-section technology-introduction"><div class="wrap statement-grid"><div class="interior-heading"><p>OUR CRAFT</p><h2>金属に、形を。<br>技術に、次の可能性を。</h2></div><div class="interior-prose"><p>熱で溶かした金属を、鋳型へ。<br>冷やし固めた製品を、求められる形に仕上げる。</p><p>鋳造と機械加工。<br>伊藤鋳工は、この二つの技術を積み重ね、<br>産業で使われる製品づくりに向き合ってきました。</p></div></div></section>
 <section class="craft-stories"><article class="craft-story" id="tech-casting"><div class="story-image"><img src="./assets/people.jpg" alt="伊藤鋳工の鋳造作業の様子" width="1000" height="500" loading="lazy"><span class="photo-index">ITO CASTING / THE WORKPLACE</span></div><div class="story-copy"><p class="story-counter">01 <span>CASTING</span></p><h2>熱から生まれる、<br>ものづくりの原点。</h2><h3>鋳造</h3><p>溶かした金属に、鋳型で形を与える。<br>製品づくりの出発点となる技術です。</p><p>長く培われてきた経験を、車輪や継手など、さまざまな産業製品に活かしています。</p><a class="editorial-link" href="#/products">鋳造から生まれる製品</a></div></article>
 <article class="craft-story reverse" id="tech-machining">${referencePhoto('machining-operator.webp','加工機の状態を確かめる作業者の後ろ姿','story-image operator-photo')}<div class="story-copy"><p class="story-counter">02 <span>MACHINING</span></p><h2>形を整え、<br>製品へと仕上げる。</h2><h3>機械加工</h3><p>鋳造した製品を、必要な寸法や形へ。<br>加工の経験を、一つひとつの仕上がりに。</p><p>1984年には機械加工工場を増設。鋳造と加工の両面から、製品についてのご相談を承ります。</p><a class="editorial-link" href="#/contact">加工について相談する</a></div></article>
 <article class="craft-story" id="tech-custom">${referencePhoto('custom-drawing.webp','図面と現品をもとに仕様を相談する手元','story-image custom-drawing-photo')}<div class="story-copy"><p class="story-counter">03 <span>CUSTOM MADE</span></p><h2>その一品を、<br>一緒に考える。</h2><h3>別注品のご相談</h3><p>図面や現品をもとに、必要な仕様を確認するところから、ご相談を承ります。</p><p>用途・形状、材質・寸法、図面の有無、数量・納期などをお知らせください。製作の可否・対応条件は、内容を確認のうえご案内します。</p><a class="editorial-link" href="#/contact">別注品について相談する</a></div></article></section>
 ${contactBand()}`;
}
const interviewPlans = [
 {id:'casting',n:'01',en:'CASTING',role:'鋳物工',title:'鉄に形を与える、<br>その面白さは。',lead:'形のない素材が、製品になっていく。鋳造の現場で感じる手応えと、技術を覚えていく過程を伝えるインタビューです。',themes:[['仕事を選んだきっかけ','ものづくりに興味を持った理由や、入社を決めたときのこと。'],['はじめて、形になった日','最初に覚えた仕事、難しかった工程、できるようになったときの手応え。'],['これから挑戦したいこと','身につけたい技能と、次に目指していること。']]},
 {id:'melting',n:'02',en:'MELTING',role:'電気炉溶解工',title:'熱と向き合う、<br>仕事の奥深さ。',lead:'鋳造につながる素材をつくる。その役割と、日々の判断で大切にしていることを、現場の視点から伝えるインタビューです。',themes:[['溶解の仕事とは','一日の中で担う役割と、ほかの工程とのつながり。'],['経験から学んだこと','作業を覚える中で印象に残った経験や、大切にしている確認。'],['仲間とつくる現場','声を掛け合う場面や、一緒に働く人との関わり方。']]},
 {id:'machining',n:'03',en:'MACHINING',role:'機械加工',title:'精度をつくる、<br>その手と目。',lead:'鋳造した素材を、求められる形へ。加工や測定を通じて感じる面白さと、少しずつ積み重なる成長を伝えるインタビューです。',themes:[['加工の面白さ','素材が製品へ仕上がっていく過程で、やりがいを感じる瞬間。'],['技術が身につくまで','最初に学んだこと、先輩に教わったこと、自分で工夫していること。'],['働く毎日のこと','普段の仕事の進め方や、職場の雰囲気について。']]},
 {id:'sales',n:'04',en:'SALES',role:'営業職',title:'お客様と現場を、<br>つなぐ仕事。',lead:'用途や要望を聞き、ものづくりにつなげる。製品の知識と人との対話が、仕事の中でどう生きるかを伝えるインタビューです。',themes:[['お客様の声を聞く','相談を受けるときに意識していることや、印象に残っているやり取り。'],['現場から学ぶこと','製品や工程を知る中で、仕事に生きた経験について。'],['信頼を積み重ねる','仕事の手応えを感じる場面と、これから目指したい姿。']]}
];
function interviewPhoto(p,classes=''){
 return `<figure class="photoshoot-photo interview-photo ${classes}"><svg class="photo-window" viewBox="0 0 1086 1360" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${p.role}の人物撮影イメージ。実際の社員ではありません。" focusable="false"><image href="./assets/interview-${p.id}.webp" width="1086" height="1448"/></svg><figcaption class="image-disclaimer">画像はイメージです</figcaption></figure>`;
}
function interviewSection(){
 return `<section class="careers-interviews" id="recruit-people"><div class="wrap"><div class="interview-section-heading"><div><p class="small-latin">04 / PEOPLE OF ITO</p><h2><span>INTERVIEW</span>社員インタビュー</h2></div><div class="interview-section-intro"><p>仕事を選んだ理由も、やりがいも、一人ひとり。<br>職種ごとの視点から、伊藤鋳工で働く日々を伝えます。</p></div></div><div class="interview-grid">${interviewPlans.map(p=>`<article class="interview-card"><button type="button" data-interview="${p.id}" aria-label="${p.role}のインタビューを見る"><div class="interview-photo-wrap">${interviewPhoto(p)}<span class="interview-photo-number">${p.n}<small>INTERVIEW</small></span></div><div class="interview-card-body"><p class="interview-role"><span>${p.role}</span><small>${p.en}</small></p><h3>${p.title}</h3><span class="interview-card-action">インタビューを見る</span></div></button></article>`).join('')}</div></div></section>`;
}
let previousInterviewTrigger=null;
const interviewDialog=document.querySelector('#interview-dialog');
function openInterview(id,trigger){
 const p=interviewPlans.find(p=>p.id===id);if(!p)return;
 previousInterviewTrigger=trigger;
 document.querySelector('#interview-dialog-content').innerHTML=`<div class="interview-dialog-toolbar"><span>INTERVIEW ${p.n}</span></div><div class="interview-dialog-layout"><div class="interview-dialog-aside">${interviewPhoto(p,'interview-dialog-photo')}<p>${p.en}<span>${p.role}</span></p></div><div class="interview-dialog-copy"><p class="small-latin">PEOPLE OF ITO / ${p.n}</p><h2 id="interview-dialog-title" tabindex="-1">${p.title}</h2><p class="interview-dialog-lead">${p.lead}</p><div class="interview-topics"><h3>インタビュー内容</h3>${p.themes.map(([title,body],i)=>`<section><span>Q${i+1}</span><div><h4>${title}</h4><p>${body}</p></div></section>`).join('')}</div><button type="button" class="interview-to-work" data-interview-work>この職種の仕事内容を見る</button></div></div>`;
 interviewDialog.showModal();interviewDialog.scrollTop=0;document.body.style.overflow='hidden';document.querySelector('#interview-dialog-title').focus({preventScroll:true});
 interviewDialog.dataset.interviewJob=id;
}
function closeInterview(restoreFocus=true){if(!restoreFocus)previousInterviewTrigger=null;interviewDialog.close();document.body.style.overflow='';}
interviewDialog.addEventListener('close',()=>{document.body.style.overflow='';if(previousInterviewTrigger?.isConnected)previousInterviewTrigger.focus({preventScroll:true});});
interviewDialog.addEventListener('click',e=>{if(e.target===interviewDialog)closeInterview();});
document.querySelector('.interview-dialog-close').addEventListener('click',()=>closeInterview());

const recruitJobs = [
 {id:'casting',photo:'job-casting.webp',photoWidth:1536,photoHeight:1024,caption:'鋳型を整える、手元の仕事。',photoAlt:'砂型の表面を道具で整える鋳物工の作業風景',en:'CASTING',name:'鋳物工',verb:'形を、生み出す。',text:'溶かした金属を鋳型へ。形のない素材から、製品の形をつくる仕事です。鋳造は、伊藤鋳工のものづくりの原点。一つひとつの工程が、産業を支える製品につながっています。',steps:['鋳型で形をつくる','金属を注ぎ込む','鋳物として取り出す'],stepNotes:['つくりたい製品の形を、鋳型に。','溶かした金属を、鋳型の中へ。','冷えて固まった金属を取り出す。'],interest:'素材が形になる過程に、面白さを感じる方へ。'},
 {id:'melting',photo:'job-melting.webp',photoWidth:1536,photoHeight:1024,caption:'電気炉で、金属を溶かす。',photoAlt:'保護具を着用し電気炉の操業を確認する溶解工',en:'MELTING',name:'電気炉溶解工',verb:'熱で、素材を変える。',text:'電気炉で金属を溶かし、次の鋳造工程へつなぐ仕事です。製品になる前の素材と向き合い、ものづくりの土台を担います。熱と素材を扱う現場で、知識と経験を積み重ねていきます。',steps:['素材と向き合う','電気炉で溶かす','鋳造工程へつなぐ'],stepNotes:['製品のもとになる金属を扱う。','熱を加え、金属を液体の状態へ。','溶かした金属を、次の工程へ。'],interest:'製品が生まれる、その始まりに関わりたい方へ。'},
 {id:'machining',photo:'job-machining.webp',photoWidth:1536,photoHeight:1024,caption:'図面の寸法を、確かな形へ。',photoAlt:'加工した部品の寸法をノギスで測定する機械加工担当者',en:'MACHINING',name:'機械加工',verb:'精度を、つくり込む。',text:'鋳造した素材を、求められる寸法や形状へ。加工機を使い、製品として仕上げる仕事です。図面の中の形を、目の前の製品にしていく。ものづくりの確かさを、加工の工程から支えます。',steps:['図面と形を確認','加工機で仕上げる','寸法を確かめる'],stepNotes:['必要な形状と寸法を読み取る。','素材を削り、求められる形へ。','仕上がった製品の寸法を測る。'],interest:'細かな違いや、仕上がりにこだわりたい方へ。'},
 {id:'sales',photo:'job-sales.webp',photoWidth:1536,photoHeight:1024,caption:'ご要望を聞き、製品につなぐ。',photoAlt:'製品サンプルと図面を見ながらお客様と打ち合わせる営業担当者',en:'SALES',name:'営業職',verb:'人と、技術をつなぐ。',text:'お客様の用途やご要望を伺い、製品のご案内や製作の相談につなげる仕事です。車輪、継手、連鋳棒、別注品。製品を知り、現場を知ることが、お客様のものづくりを支える提案につながります。',steps:['ご要望を伺う','製品・仕様を確認','製作の相談へつなぐ'],stepNotes:['使い方やお困りごとを聞く。','用途に合う製品や仕様を考える。','お客様のご要望を、現場と共有する。'],interest:'人と話し、ものづくりを支える仕事に関わりたい方へ。'}
];
function recruitPage() {
 const nav=[['recruit-work','仕事を知る'],['recruit-people','人を知る'],['recruit-environment','働く環境'],['recruit-faq','よくある質問']];
 const faqs=[['未経験でも応募できますか？','現在掲載している本社・機械加工の募集は、未経験歓迎・資格不問です。機械加工の経験者や、フォークリフト・クレーンの資格をお持ちの方も歓迎しています。'],['現在の募集の勤務地はどこですか？','掲載中の5件は、名古屋市中川区三ツ屋町1-2017の本社勤務です。荒子駅から徒歩15分。車通勤が可能で、駐車場があります。'],['仕事に必要な資格の取得支援はありますか？','リフト・玉掛け・クレーンなど、仕事に関わる資格の取得支援があります。詳しい待遇は各募集の詳細ページをご確認ください。'],['応募する前に職場を見ることはできますか？','職場見学からのご応募も受け付けています。採用エントリーフォームの「採用について相談する」から、見学の希望をお知らせください。']];
 return `<div class="recruit-lp">
 <section class="lp-hero" id="recruit-top" aria-labelledby="lp-title"><figure class="lp-hero-photo"><img src="./assets/recruit-lp-hero.webp" width="1672" height="941" alt="工場で鋳造部品と向き合う若手職人の撮影イメージ" fetchpriority="high"><figcaption class="image-disclaimer">画像はイメージです</figcaption></figure><div class="lp-hero-shade"></div><div class="lp-container lp-hero-content"><p class="lp-hero-eyebrow"><i></i> ITO CASTING RECRUITMENT</p><div class="lp-hero-copy"><p class="lp-hero-location">愛知県 名古屋市・愛西市</p><h1 id="lp-title">つくる仕事で、<br>自分の未来を。</h1><p class="lp-hero-lead">鋳造・機械加工・営業。<br>産業を支えるものづくりを、あなたの仕事に。</p></div><div class="lp-hero-bottom"><span>CRAFT YOUR NEXT CHAPTER.</span><a href="#recruit-about" data-scroll="recruit-about">SCROLL TO EXPLORE</a></div></div></section>
 <section class="recruit-overview" aria-label="伊藤鋳工の基本情報"><div class="lp-container">
 <dl class="recruit-highlights">
 <div class="recruit-highlight"><dt><span>創業</span><small>ESTABLISHED</small></dt><dd><p class="recruit-highlight-value"><strong class="recruit-highlight-number">1914</strong><span>年</span></p><p class="recruit-highlight-note">名古屋で創業</p></dd></div>
 <div class="recruit-highlight"><dt><span>休日</span><small>DAYS OFF</small></dt><dd><p class="recruit-highlight-value"><span class="recruit-highlight-prefix">週休</span><strong class="recruit-highlight-number">2</strong><span>日</span></p><p class="recruit-highlight-note">本社・機械加工の募集は土日休み</p></dd></div>
 <div class="recruit-highlight"><dt><span>拠点</span><small>WORKPLACE</small></dt><dd><p class="recruit-highlight-value"><strong class="recruit-highlight-place">名古屋<span>・</span>愛西</strong></p><p class="recruit-highlight-note">本社・佐屋工場</p></dd></div>
 </dl>
 <nav class="recruit-section-menu" aria-label="採用情報のページ内メニュー">${[...nav.slice(0,3),['recruit-outline','募集要項'],nav[3]].map(([id,label],i)=>`<a href="#${id}" data-scroll="${id}"><small aria-hidden="true">0${i+1}</small><span>${label}</span></a>`).join('')}</nav>
 </div></section>
 <section class="lp-about lp-section" id="recruit-about"><div class="lp-container lp-about-grid"><div class="lp-about-copy"><p class="lp-kicker">01 / ABOUT ITO CASTING</p><h2 class="lp-title">あなたの仕事が、<br>誰かの現場を<br><span>動かしていく。</span></h2><p>大きな荷物を動かすクレーンの車輪。<br>機械の回転する力をつなぐ継手。<br>ものづくりの素材になる連鋳棒。</p><p>目立つ場所にはなくても、産業の現場には欠かせない。<br>そんな製品を、私たちはつくっています。</p><p>1914年、名古屋で始まった伊藤鋳工。<br>受け継いだ鋳造と加工の技術を、<br>これからのものづくりへつないでいきます。</p></div><div class="lp-about-visual">${referencePhoto('recruit-team.webp','工場で製品の打ち合わせをする仲間たち','lp-team-photo')}<p class="lp-photo-caption"><span>ONE TEAM, MANY ROLES.</span>つくる人も、支える人も。ひとつのものづくり。</p></div></div></section>
 <section class="lp-jobs lp-section" id="recruit-work"><div class="lp-container"><div class="lp-section-head"><div><p class="lp-kicker">02 / FIND YOUR WORK</p><h2 class="lp-title">あなたの興味から、<br>仕事を見つけよう。</h2></div><p>つくる。仕上げる。お客様とつなぐ。<br>あなたの興味に近い仕事から、のぞいてみてください。</p></div><div class="lp-job-tabs" role="tablist" aria-label="職種から仕事を知る">${recruitJobs.map((j,i)=>`<button id="job-tab-${j.id}" type="button" role="tab" data-job="${j.id}" aria-controls="job-${j.id}" aria-selected="${i===0}" tabindex="${i===0?0:-1}"><small>0${i+1}</small><span>${j.name}</span></button>`).join('')}</div>${recruitJobs.map((j,i)=>`<article class="lp-job-panel" id="job-${j.id}" role="tabpanel" aria-labelledby="job-tab-${j.id}" tabindex="0" ${i?'hidden':''}><div class="lp-job-feature"><figure class="lp-job-photo"><svg viewBox="0 0 ${j.photoWidth} ${Math.round(j.photoHeight*.90)}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${esc(j.photoAlt)}（撮影参考用のイメージ画像）" focusable="false"><image href="./assets/${j.photo}" width="${j.photoWidth}" height="${j.photoHeight}"/></svg><span class="lp-job-photo-index" aria-hidden="true">0${i+1} / AT WORK</span><figcaption><span class="lp-job-photo-caption">${j.caption}</span><span class="image-disclaimer">画像はイメージです</span></figcaption></figure><div class="lp-job-main"><p class="lp-job-en">${j.en}<span>0${i+1} / 04</span></p><h3>${j.verb}</h3><p class="lp-job-text">${j.text}</p><a class="lp-text-link" href="#recruit-outline" data-scroll="recruit-outline">募集要項を見る</a></div></div><section class="job-workflow" aria-labelledby="workflow-${j.id}"><div class="job-workflow-heading"><h4 id="workflow-${j.id}">仕事のイメージ<span>WORK FLOW</span></h4><p>${j.interest}</p></div><ol class="job-workflow-steps">${j.steps.map((s,n)=>`<li><div class="job-workflow-marker" aria-hidden="true"><small>STEP</small><span>0${n+1}</span></div><div class="job-workflow-copy"><h5>${s}</h5><p>${j.stepNotes[n]}</p></div></li>`).join('')}</ol></section></article>`).join('')}</div></section>
 <section class="lp-learning lp-section" id="recruit-learn"><div class="lp-container lp-learning-grid"><div class="lp-learning-visual">${referencePhoto('recruit-training.webp','先輩と若手が鋳造部品の寸法を一緒に確かめる場面','lp-training-photo')}<span class="lp-vertical-label" aria-hidden="true">LEARN. TRY. GROW.</span></div><div class="lp-learning-copy"><p class="lp-kicker">03 / LEARN & GROW</p><h2 class="lp-title">身につけた技術は、<br>自分の力になる。</h2><p>未経験から機械加工を学べる教育体制を整えています。<br>安全ルールや工具の名前を覚え、機械操作へ。<br>一つずつ、担当できる仕事を増やしていきます。</p><div class="lp-skills">${[['01','玉掛け','荷を安全に吊り上げるための技能'],['02','クレーン','荷を運ぶ機械を扱うための技能'],['03','フォークリフト','運搬作業を支えるための技能']].map(([n,t,d])=>`<div><span>${n}</span><p><b>${t}</b><small>${d}</small></p></div>`).join('')}</div><p class="lp-note">対象となる講習や受講条件は、職種・募集内容によってご確認ください。</p></div></div></section>
 ${interviewSection()}
 <section class="lp-environment lp-section" id="recruit-environment"><div class="lp-container"><div class="lp-section-head"><div><p class="lp-kicker">05 / WORK & LIFE</p><h2 class="lp-title">働くことも、<br>その先の暮らしも。</h2></div><p>現在掲載している本社・機械加工の募集から、<br>毎日に関わる条件をご紹介します。</p></div><div class="lp-condition-grid"><article><p>WORKING HOURS <span>勤務時間</span></p><h3>8:00<span>—</span>17:00</h3><small>実働8時間／月平均残業20時間以内</small></article><article><p>DAYS OFF <span>休日</span></p><h3>週休2日</h3><small>土日休み／お盆・年末年始休暇</small></article><article><p>MONTHLY SALARY <span>月給</span></p><h3>21<span>—</span>27<small>万円</small></h3><small>下限額は募集により21万円・22万円</small></article><article><p>EMPLOYMENT <span>雇用形態</span></p><h3>正社員</h3><small>試用・研修3か月／同条件</small></article></div>${recruitmentBenefits()}</div></section>
 ${recruitmentListings()}
 <section class="lp-faq lp-section" id="recruit-faq"><div class="lp-container lp-faq-grid"><div><p class="lp-kicker">07 / FAQ</p><h2 class="lp-title">応募の前に。</h2><p>よくある質問</p></div><div>${faqs.map(([q,a],i)=>`<details class="lp-faq-item"><summary><span>Q${i+1}</span><h3>${q}</h3><b aria-hidden="true">＋</b></summary><p>${a}</p></details>`).join('')}</div></div></section>
 <section class="lp-entry lp-section" id="recruit-entry"><div class="lp-container"><p class="lp-kicker">YOUR NEXT CHAPTER</p><div class="lp-entry-top"><h2>次につくるのは、<br><span>あなたの未来。</span></h2><div><p>ものづくりに向き合う、次の一歩。<br>あなたのご応募・ご相談をお待ちしています。</p><a class="lp-button lp-button-accent" href="#/entry" data-cta="recruit-entry">採用エントリーフォームへ</a><small>ご希望の職種を選んで、ご応募・ご相談いただけます。</small></div></div><ol class="lp-entry-steps"><li><span>01</span><div><h3>募集内容を確認</h3><p>職種・条件・応募資格をチェック。</p></div></li><li><span>02</span><div><h3>フォームからエントリー</h3><p>希望職種・連絡先を入力し、内容を確認。</p></div></li><li><span>03</span><div><h3>選考へ</h3><p>選考内容・日程を個別にご案内します。</p></div></li></ol></div></section>
 </div>`;
}
function selectRecruitJob(id,focus=false){
 document.querySelectorAll('.lp-job-tabs button[data-job]').forEach(b=>{const active=b.dataset.job===id;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;if(active&&focus)b.focus();});
 document.querySelectorAll('.lp-job-panel').forEach(p=>p.hidden=p.id!==`job-${id}`);
}


function contactPage() {
 return `${interiorMast('Contact','お問い合わせ','製品の仕様、図面、別注品の製作。<br>まずは、ご相談ください。','contact-mast')}<section class="contact-section"><div class="wrap contact-layout"><aside class="contact-aside"><div><p class="small-latin">BY PHONE</p><h2>お電話でのご相談</h2><p>本社</p><a class="tel" href="tel:0523616511">052-361-6511</a><p>佐屋工場：<a href="tel:0567310692">0567-31-0692</a></p></div><div class="contact-help"><h2>採用について</h2><p>現在の募集職種や応募方法は、<br>採用情報からご確認いただけます。</p><a class="text-link" href="#/recruit">採用情報を見る ${arrow}</a></div></aside><div class="contact-form-column"><div id="contact-progress">${contactSteps(1)}</div>${formAvailability()}<div id="contact-form-area"><div class="form-heading"><p class="small-latin">CONTACT FORM</p><h2>ご相談内容をお聞かせください。</h2><p>必須項目をご入力のうえ、確認画面へお進みください。</p></div><form id="contact-form"><div class="field"><label for="contact-kind">お問い合わせの種類 <small>必須</small></label><select id="contact-kind" name="kind" required><option value="製品について">製品について</option><option value="別注・製作について">別注・製作について</option><option value="その他">その他</option></select></div><div class="field"><label for="contact-product">対象の製品 <small>任意</small></label><input id="contact-product" name="product" value="${esc(inquiryProduct)}" placeholder="製品名がお分かりの場合はご入力ください"></div><div class="field"><label for="contact-company">会社名 <small>任意</small></label><input id="contact-company" name="company" autocomplete="organization" placeholder="株式会社○○"></div><div class="field-pair"><div class="field"><label for="contact-name">お名前 <small>必須</small></label><input id="contact-name" name="name" autocomplete="name" required placeholder="山田 太郎"></div><div class="field"><label for="contact-email">メールアドレス <small>必須</small></label><input id="contact-email" name="email" type="email" autocomplete="email" required placeholder="example@company.co.jp"></div></div><div class="field"><label for="contact-message">ご相談内容 <small>必須</small></label><textarea id="contact-message" name="message" required placeholder="用途、数量、材質、ご希望の時期など、分かる範囲でご入力ください。"></textarea></div><div class="field"><label for="contact-file">図面・現品の写真 <small>任意</small></label><input id="contact-file" name="attachment" type="file" accept=".pdf,.jpg,.jpeg,.png"><p class="field-help">PDF・JPG・PNG / 10MB以内。</p></div><p class="form-error" id="form-error" role="alert"></p><button class="button form-submit" type="submit">入力内容を確認する</button></form></div></div></div></section>`;
}
function renderCatalogue() {
 const match=products.filter(p=>currentFilter==='all'||p.group===currentFilter);
 document.querySelector('#catalogue-grid').innerHTML=match.map(productCard).join('');
 document.querySelector('#catalogue-count').textContent=currentFilter==='all'?`全${products.length}件`:`${match.length}件 / 全${products.length}件`;
 document.querySelector('#empty-results').hidden=match.length>0;
 document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b.dataset.filter===currentFilter);b.setAttribute('aria-pressed',String(b.dataset.filter===currentFilter));});
}
function openProduct(id,trigger) {
 const p=products.find(p=>p.id===Number(id));if(!p)return;
 previousProductTrigger=trigger;
 document.querySelector('#product-dialog-content').innerHTML=`<div class="product-detail-toolbar"><span>PRODUCT DETAILS</span><span>${String(p.id).padStart(2,'0')} / ${p.category}</span></div><div class="product-detail-layout"><div class="product-detail-visual"><div class="product-detail-photo"><span class="crop"><img src="./assets/product-${p.id}.jpg" width="164" height="154" alt="${p.name}"></span></div><p>${p.en}</p><span>ITO CASTING / PRODUCT COLLECTION</span></div><div class="product-detail-info"><p class="product-detail-category">${p.category}</p><h2 id="product-dialog-title" tabindex="-1">${p.name}</h2><p class="product-detail-description">${p.desc}</p><dl class="product-detail-facts"><div><dt>製品仕様</dt><dd>${p.spec}</dd></div><div><dt>ご相談時に</dt><dd>用途・数量・図面などをお知らせください。</dd></div></dl><div class="product-detail-actions">${technicalDocuments.some(d=>d.productId===p.id)?`<a class="detail-secondary" href="#/catalogue?product=${p.id}"><span><small>DRAWING / CATALOGUE</small>図面・カタログを見る</span></a>`:''}<button type="button" class="detail-primary" data-inquire="${p.id}">この製品について相談する</button></div></div></div>`;
 dialog.showModal();dialog.scrollTop=0;document.body.style.overflow='hidden';document.querySelector('#product-dialog-title').focus({preventScroll:true});
}
function closeProduct(){dialog.close();document.body.style.overflow='';}
dialog.addEventListener('close',()=>{document.body.style.overflow='';previousProductTrigger?.focus({preventScroll:true});});
dialog.addEventListener('click',e=>{if(e.target===dialog)closeProduct();});
document.querySelector('.dialog-close').addEventListener('click',closeProduct);
function setupContact() {
 const form=document.querySelector('#contact-form');if(!form)return;
 form.addEventListener('submit',e=>{
  e.preventDefault();if(!form.reportValidity())return;
  const file=form.elements.attachment.files[0];const error=document.querySelector('#form-error');
  if(file&&(file.size>10*1024*1024||!(/\.(pdf|jpe?g|png)$/i.test(file.name)))){error.textContent='PDF・JPG・PNG形式の10MB以内のファイルを選択してください。';return;}
  formSnapshot={kind:form.elements.kind.value,product:form.elements.product.value,company:form.elements.company.value,name:form.elements.name.value,email:form.elements.email.value,message:form.elements.message.value,filename:file?.name||'なし'};
  const labels={kind:'種類',product:'対象製品',company:'会社名',name:'お名前',email:'メール',message:'相談内容',filename:'添付ファイル'};
  const rows=Object.entries(labels).map(([key,label])=>`<div><dt>${label}</dt><dd>${esc(formSnapshot[key]||'未入力')}</dd></div>`).join('');
  document.querySelector('#contact-form-area').innerHTML=`<section class="confirm-panel" aria-labelledby="confirm-title"><h2 id="confirm-title" tabindex="-1">入力内容の確認</h2><p>ご相談内容や連絡先にお間違いがないか、ご確認ください。</p><dl class="confirm-rows">${rows}</dl><div class="dialog-actions"><button class="button" id="contact-send" type="button" disabled aria-describedby="form-availability">送信する</button><button class="button light" id="form-back" type="button">入力画面へ戻る</button></div></section>`;
  document.querySelector('#contact-progress').innerHTML=contactSteps(2);
  document.querySelector('#confirm-title').focus();
  document.querySelector('#form-back').addEventListener('click',()=>{renderRoute(false);const f=document.querySelector('#contact-form');for(const [key,value] of Object.entries(formSnapshot)){if(key!=='filename'&&f.elements[key])f.elements[key].value=value;}if(formSnapshot.filename!=='なし')document.querySelector('#form-error').textContent='添付ファイルを使用する場合は、もう一度選択してください。';f.elements.name.focus();});
 });
}
const routes={product:{title:'製品詳細',render:productDetailPage},home:{title:'伊藤鋳工株式会社',render:homePage},products:{title:'製品紹介',render:productsPage},catalogue:{title:'図面・カタログ',render:documentsPage},document:{title:'図面・仕様表',render:documentPage},about:{title:'私たちについて',render:aboutPage},technology:{title:'技術とものづくり',render:technologyPage},recruit:{title:'採用情報',render:recruitPage},'recruit-job':{title:'募集詳細',render:openingDetailPage},entry:{title:'採用エントリー',render:entryPage},contact:{title:'お問い合わせ',render:contactPage}};
function renderRoute(scroll=true) {
 const key=routeState().key;
 if(key==='main'){main.focus();return;}
 if(key==='home-about'){document.querySelector('#home-about')?.scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth'});return;}
 const route=routes[key]||routes.home;
 document.body.dataset.page=routes[key]?key:'home';
 revealObserver?.disconnect();
 if(dialog.open)closeProduct();
 if(interviewDialog.open)closeInterview();
 if(key==='contact'&&routeParams().get('product'))inquiryProduct=products.find(p=>p.id===Number(routeParams().get('product')))?.name||'';
 main.innerHTML=siteLinks(route.render());document.title=key==='home'?'伊藤鋳工株式会社':`${route.title} | 伊藤鋳工株式会社`;
 const navKey=['catalogue','document','product'].includes(key)?'products':['entry','recruit-job'].includes(key)?'recruit':key;
 document.querySelectorAll('[data-nav]').forEach(a=>{a.classList.toggle('active',a.dataset.nav===navKey);if(a.dataset.nav===navKey)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 closeMenu();if(key==='products')renderCatalogue();if(key==='contact')setupContact();if(key==='entry')setupEntry();else entryDraft=null;
 if(scroll){window.scrollTo({top:0,behavior:'instant'});main.focus({preventScroll:true});}
 motionImages=[...document.querySelectorAll('[data-parallax]')];
 document.querySelectorAll('.content-split > *, .process-detail, .company-facts, .contact-band').forEach(el=>el.classList.add('reveal'));
 window.ItoPolish?.init();
 const section=(!location.hash.startsWith('#/')?location.hash.slice(1):'')||routeParams().get('section');
 if(section)requestAnimationFrame(()=>document.getElementById(section)?.scrollIntoView({behavior:'instant'}));
 refreshPageInfo();
 updateScrollEffects();
}
const menuToggle=document.querySelector('.menu-toggle');
function closeMenu(){document.body.classList.remove('menu-open');menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','メニューを開く');document.querySelector('#mobile-menu').hidden=true;}
menuToggle.addEventListener('click',()=>{const expanded=menuToggle.getAttribute('aria-expanded')==='true';menuToggle.setAttribute('aria-expanded',String(!expanded));menuToggle.setAttribute('aria-label',expanded?'メニューを開く':'メニューを閉じる');document.querySelector('#mobile-menu').hidden=expanded;document.body.classList.toggle('menu-open',!expanded);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();}});
document.addEventListener('click',e=>{

 const job=e.target.closest('.lp-job-tabs button[data-job]');if(job){selectRecruitJob(job.dataset.job);return;}
 const interview=e.target.closest('[data-interview]');if(interview){openInterview(interview.dataset.interview,interview);return;}
 const interviewWork=e.target.closest('[data-interview-work]');if(interviewWork){const id=interviewDialog.dataset.interviewJob;closeInterview(false);selectRecruitJob(id);document.querySelector(`#job-${id}`)?.focus({preventScroll:true});document.querySelector('#recruit-work')?.scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth'});return;}
 const showcase=e.target.closest('[data-showcase]');if(showcase){selectShowcase(Number(showcase.dataset.showcase));return;}
 const craft=e.target.closest('[data-craft]');if(craft){selectCraft(Number(craft.dataset.craft));return;}
 const product=e.target.closest('[data-product]');if(product){e.preventDefault();location.assign(siteHref('product','id='+product.dataset.product));return;}
 const filter=e.target.closest('[data-filter]');if(filter){currentFilter=filter.dataset.filter;renderCatalogue();return;}
 const inquiry=e.target.closest('[data-inquire]');if(inquiry){inquiryProduct=products.find(p=>p.id===Number(inquiry.dataset.inquire)).name;closeProduct();location.assign(siteHref('contact','product='+inquiry.dataset.inquire));return;}
 const scrollLink=e.target.closest('[data-scroll]');if(scrollLink){e.preventDefault();document.getElementById(scrollLink.dataset.scroll)?.scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth'});return;}
 const navLink=e.target.closest('a[href^="#/"]');if(navLink&&navLink.hash===location.hash){e.preventDefault();renderRoute();}
});

function selectShowcase(index){
 const panel=document.querySelector('#product-showcase-panel');if(!panel)return;
 document.querySelectorAll('[data-showcase]').forEach((b,i)=>{b.classList.toggle('selected',i===index);b.setAttribute('aria-selected',String(i===index));b.tabIndex=i===index?0:-1;});
 panel.setAttribute('aria-labelledby',`product-tab-${index}`);panel.innerHTML=productStoryPanel(index);
}
function selectCraft(index){
 document.querySelectorAll('[data-craft]').forEach((b,i)=>{const active=i===index;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;b.parentElement.classList.toggle('selected',active);b.querySelector('i').textContent=active?'−':'+';document.querySelector(`#craft-panel-${i}`).hidden=!active;});
 const img=document.querySelector('#craft-stage-image');img.src=`./assets/${craftStories[index].image}`;img.alt=craftStories[index].alt;
 document.querySelector('#craft-stage-label').textContent=`0${index+1} / ${craftStories[index].en}`;
}
document.addEventListener('keydown',e=>{
 const jobTab=e.target.closest('.lp-job-tabs button[data-job]');if(jobTab){const tabs=[...document.querySelectorAll('.lp-job-tabs button[data-job]')];let index=tabs.indexOf(jobTab);if(e.key==='ArrowRight')index=(index+1)%tabs.length;else if(e.key==='ArrowLeft')index=(index+tabs.length-1)%tabs.length;else if(e.key==='Home')index=0;else if(e.key==='End')index=tabs.length-1;else return;e.preventDefault();selectRecruitJob(tabs[index].dataset.job,true);return;}
 const tab=e.target.closest('[data-showcase], [data-craft]');if(!tab)return;
 const isProduct=tab.hasAttribute('data-showcase');const selector=isProduct?'[data-showcase]':'[data-craft]';
 const tabs=[...document.querySelectorAll(selector)];let next=tabs.indexOf(tab);
 const forward=isProduct?'ArrowRight':'ArrowDown';const back=isProduct?'ArrowLeft':'ArrowUp';
 if(e.key===forward)next=(next+1)%tabs.length;else if(e.key===back)next=(next+tabs.length-1)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;
 e.preventDefault();(isProduct?selectShowcase:selectCraft)(next);tabs[next].focus();
});

let scrollFrame=0;
function updateScrollEffects(){
 document.body.classList.toggle('is-scrolled',window.scrollY>48);

 if(!reducedMotion.matches)motionImages.forEach(img=>{const parent=img.parentElement;const box=parent.getBoundingClientRect();if(box.bottom>0&&box.top<window.innerHeight){const shift=Math.min(32,Math.max(-32,-box.top*.055));img.style.setProperty('--parallax-y',`${shift}px`);}});
 window.ItoPolish?.update();
 scrollFrame=0;
}
window.addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScrollEffects);},{passive:true});
window.addEventListener('resize',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScrollEffects);},{passive:true});
reducedMotion.addEventListener('change',()=>{motionImages.forEach(img=>img.style.setProperty('--parallax-y','0px'));updateScrollEffects();});
window.addEventListener('hashchange',()=>renderRoute());
renderRoute(false);
