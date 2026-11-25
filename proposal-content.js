const SITE_BASE = '/ito-chuko-preview';
function companyOverview(){
 return `<section class="company-overview" id="our-story" aria-labelledby="company-overview-title"><div class="wrap"><p class="small-latin overview-kicker">WHAT WE DO <span>伊藤鋳工について</span></p><div class="company-overview-grid"><h2 id="company-overview-title">鋳造と機械加工で、<br>産業の動きを支える。</h2><div class="company-overview-copy"><p>車輪・継手などの機械部品から、加工用素材の連鋳棒、図面をもとにした別注品まで。伊藤鋳工は、鋳造と機械加工の技術で、産業の現場に必要な製品を届けています。</p><nav class="company-overview-links" aria-label="事業について詳しく知る"><a href="#/products">製品紹介</a><a href="#/technology">技術とものづくり</a></nav></div></div></div></section>`;
}

// Editorial copy is based on the existing company message and verified public sources.
function representativeMessage(){
 return `<section class="company-message" id="representative-message"><div class="wrap"><div class="section-index"><span>MESSAGE</span><span>代表ご挨拶</span></div><div class="company-message-grid"><div class="company-message-copy"><h2>温故知新。<br>受け継ぎ、進化する。</h2><p>1914年の創業以来、伊藤鋳工は鋳造一筋に歩んできました。先人から受け継いだ技術を大切にしながら、お客様のご要望に応える製品づくりに取り組んでいます。</p><p>産業の変化とともに、製品に求められる品質やコスト、納期も変わります。研究開発、品質管理、生産体制の改善を重ね、多様なニーズに応えられるものづくりを目指してまいります。</p><p>これまでの経験を、次の技術へ。<br>今後とも、皆様のご愛顧とご支援を賜りますようお願い申し上げます。</p><div class="company-message-sign"><span>伊藤鋳工株式会社　代表</span><strong>伊藤 剛</strong></div></div><figure class="company-message-photo"><div><img src="./assets/company-message-original.jpg" alt="伊藤鋳工株式会社 代表 伊藤剛" width="1005" height="447" loading="lazy"></div><figcaption><span>ITO CASTING</span><span>代表　伊藤 剛</span></figcaption></figure></div></div></section>`;
}
function companyActivities(){
 return `<section class="company-activities" id="company-activities"><div class="wrap"><div class="section-index"><span>OUR BUSINESS</span><span>ものづくりの、その先へ</span></div><div class="company-activities-grid"><figure><img src="./assets/canal-golf-official.jpg" alt="CANAL SIDE GOLF RANGEのエントランス" width="1080" height="1300" loading="lazy"><figcaption>CANAL SIDE GOLF RANGE</figcaption></figure><div class="company-activities-copy"><p class="small-latin">INDOOR GOLF / NAGOYA</p><h2>日常に、<br>新しい楽しみを。</h2><p>伊藤鋳工は、名古屋市中川区でインドアゴルフ施設「CANAL SIDE GOLF RANGE」を運営しています。</p><p>ゴルフシミュレーターを備えた打席や個室、屋外のアプローチ・パター練習エリア。ものづくりに加え、ゴルフを楽しむ空間もお届けしています。</p><dl class="company-activity-facts"><div><dt>施設名</dt><dd>CANAL SIDE GOLF RANGE</dd></div><div><dt>所在地</dt><dd>名古屋市中川区三ツ屋町1丁目2017</dd></div><div><dt>運営会社</dt><dd>伊藤鋳工株式会社</dd></div></dl><a class="resource-button" href="https://canalgolf.jp/" target="_blank" rel="noopener">施設のサイトを見る<span class="external-label">別タブ</span></a><p class="company-activity-recruit">社員向けの利用制度については、<a href="#/recruit?section=recruit-environment">採用情報の「働く環境」</a>で紹介しています。</p></div></div></div></section>`;
}
const productQuestions=[
 ['製品の寸法や仕様は、どこで確認できますか？','各製品の詳細ページから、その製品に関連する図面・カタログをご覧いただけます。寸法の細部は、PDFをダウンロードしてご確認ください。'],
 ['図面・カタログはダウンロードできますか？','「図面・カタログ」ページでPDFを閲覧・ダウンロードできます。製品のカテゴリや、各製品の詳細ページから必要な資料をお探しください。'],
 ['CADデータはありますか？','重量戸車の7シリーズについて、DXF形式のCADデータをZIPで掲載しています。図面・カタログページからダウンロードできます。'],
 ['掲載されていない形状や寸法も相談できますか？','図面や現品をもとにした別注品のご相談を承ります。用途・形状・材質・寸法・数量・希望納期をお知らせください。製作の可否と対応条件は、内容を確認のうえご案内します。'],
 ['相談するときに、何を用意すればよいですか？','用途、ご希望の形状や寸法、材質、数量、希望納期を、わかる範囲でお知らせください。図面や現品の写真がある場合は、あわせてご用意ください。'],
 ['製品が決まっていなくても相談できますか？','用途や必要な仕様をお聞かせください。製品選びや別注品についてのご相談は、お問い合わせページのお電話から承ります。']
];
function productFAQ(){return `<section class="product-faq" id="product-faq"><div class="wrap product-faq-grid"><div><p class="small-latin">PRODUCT FAQ</p><h2>製品選びの、<br>その前に。</h2><p>図面・仕様・ご相談について</p></div><div>${productQuestions.map(([q,a],i)=>`<details><summary><span>Q${String(i+1).padStart(2,'0')}</span><h3>${q}</h3><b aria-hidden="true">＋</b></summary><p>${a}</p></details>`).join('')}</div></div></section>`;}
const productContexts={
 1:['クレーンの走行を支える車輪。','CACブッシュ入・ベアリング入の2タイプの資料を掲載しています。'],
 2:['設備の走行に用いる車輪。','チルド車輪、DXシリーズ・片ツバ車輪、セット車輪の資料から仕様をご確認いただけます。'],
 3:['ベアリングを収める機械部品。','取付部や軸まわりの寸法・形状は、製品図面をご確認ください。'],
 4:['両側にツバを持つ走行用の車輪。','公開資料の呼称・寸法表と、お使いの設備の条件を照らし合わせてご確認ください。'],
 5:['ウレタンを用いたクレーン用車輪。','車輪と軸まわりの寸法は、関連図面でご確認いただけます。'],
 6:['重量物の移動を支える戸車。','カタログと、KA・KF・KS・KC・KR・KN・SKAシリーズのCADデータを掲載しています。'],
 7:['ロープを受ける溝を持つ車輪。','ロープ径や取付条件に関わる寸法を、関連図面でご確認ください。'],
 8:['回転する軸をつなぐ継手。','公開仕様の材質はFC250。寸法・形状は、関連資料をご確認ください。'],
 9:['分割形状の軸継手。','公開仕様の材質はFCD450。軸径や取付部の寸法を、関連図面でご確認ください。'],
 10:['機械の操作に用いるハンドル。','公開仕様の材質はSCS13。各部の寸法・形状は、カタログをご確認ください。'],
 11:['軸の回転をつなぐ、たわみ軸継手。','公開仕様の材質はFC250。本体の図面に加え、部品寸法表も掲載しています。'],
 12:['加工する製品に合わせて選ぶ、鋳鉄の素材。','丸・角・平角などの形状、FC250・FCD600・FCD450の材質をご案内しています。'],
 13:['必要な一品を、図面や現品から。','用途・形状・材質・数量を伺い、必要な仕様を確認するところからご相談を承ります。']
};
function productDetailPage(){
 const p=products.find(p=>p.id===Number(routeParams().get('id')));
 if(!p)return `${pageIntro('PRODUCTS','製品が見つかりません')}<div class="wrap"><a class="resource-button" href="#/products">製品一覧へ戻る</a></div>`;
 const files=technicalDocuments.filter(d=>d.productId===p.id),ctx=productContexts[p.id];
 return `<article class="product-full"><div class="wrap"><nav class="product-full-breadcrumb" aria-label="パンくず"><a href="#/">HOME</a><span>/</span><a href="#/products">製品紹介</a><span>/</span><span>${p.name}</span></nav><header class="product-full-heading"><p class="small-latin">PRODUCT ${String(p.id).padStart(2,'0')} / ${p.en}</p><h1>${p.name}</h1><p>${ctx[0]}</p></header><div class="product-full-grid"><figure class="product-full-photo"><div><span class="product-full-crop"><img src="./assets/product-${p.id}.jpg" alt="${p.name}" width="164" height="154"></span></div><figcaption>${p.category}<span>ITO CASTING</span></figcaption></figure><div class="product-full-copy"><h2>製品について</h2><p>${p.desc}</p><dl><div><dt>カテゴリ</dt><dd>${p.category}</dd></div><div><dt>製品仕様</dt><dd>${p.spec}</dd></div><div><dt>ご相談時に</dt><dd>用途・寸法・数量・ご希望の時期をお知らせください。</dd></div></dl><button type="button" class="resource-button" data-inquire="${p.id}">この製品について相談する</button></div></div>${files.length?`<section class="product-full-docs"><div class="product-full-section-title"><div><p class="small-latin">DRAWINGS & CATALOGUE</p><h2>この製品の資料</h2></div><a href="#/catalogue?product=${p.id}">関連資料をまとめて見る</a></div><div class="document-grid">${files.map(technicalDocumentCard).join('')}</div></section>`:`<section class="product-full-request"><h2>${p.id===13?'別注品のご相談':'掲載のない寸法・形状について'}</h2><p>${p.id===13?'図面や現品をもとに、必要な仕様を一緒に確認します。製作の可否・対応条件は、内容を確認のうえご案内します。':'規格にない寸法の切出し製造についてもご相談ください。必要な材質・形状・寸法・数量をお知らせください。'}</p></section>`}${p.id===6?cadLibrary():''}<nav class="product-full-bottom"><a href="#/products">製品一覧に戻る</a><a href="#/catalogue">図面・カタログ一覧</a></nav></div></article>`;
}
function routeState(){
 if(location.hash.startsWith('#/')){const [key,query='']=location.hash.slice(2).split('?');return {key:key||'home',query};}
 const pathname=location.pathname.startsWith(SITE_BASE+'/')?location.pathname.slice(SITE_BASE.length):location.pathname===SITE_BASE?'/':location.pathname;
 const p=pathname.replace(/\/+$/,'');let match;
 if((match=p.match(/^\/products\/(\d+)$/)))return {key:'product',query:'id='+match[1]};
 if((match=p.match(/^\/recruit\/jobs\/(\d+)$/)))return {key:'recruit-job',query:'id='+match[1]};
 if((match=p.match(/^\/catalogue\/documents\/([\w-]+)$/)))return {key:'document',query:'id='+match[1]};
 return {key:p.slice(1)||'home',query:location.search.slice(1)};
}
function routeParams(){return new URLSearchParams(routeState().query);}
function siteHref(key,query=''){
 const params=new URLSearchParams(query);let path=key==='home'||!key?'/':`/${key}/`;
 if(key==='product'){path=`/products/${params.get('id')}/`;params.delete('id');}
 if(key==='recruit-job'){path=`/recruit/jobs/${params.get('id')}/`;params.delete('id');}
 if(key==='document'){path=`/catalogue/documents/${params.get('id')}/`;params.delete('id');}
 return SITE_BASE+path+(params.size?'?'+params.toString():'');
}
function siteLinks(html){
 return html.replace(/href="#\/([^"?]*)(?:\?([^"]*))?"/g,(_,key,query)=>`href="${siteHref(key,query||'')}"`)
 .replace(/href="#(?!\/)([^"]+)"/g,(_,id)=>`href="${siteHref(routeState().key,routeState().query)}#${id}"`);
}
function currentPageInfo(){
 const {key,query}=routeState();const params=routeParams();
 const descriptions={home:'1914年創業の伊藤鋳工株式会社。鋳造と機械加工による製品・図面、会社の歩み、採用情報をご案内します。',about:'伊藤鋳工の代表ご挨拶、会社概要、沿革、拠点案内とCANAL SIDE GOLF RANGEの運営をご紹介します。',products:'車輪・継手・機械部品・連鋳棒・別注品。13件の製品情報から、仕様・関連図面・ご相談先を確認できます。',catalogue:'伊藤鋳工の製品図面・カタログをPDFで閲覧・ダウンロード。重量戸車7シリーズのDXFデータも掲載しています。',technology:'鋳造・機械加工・別注品のご相談。伊藤鋳工のものづくりと製品づくりの流れをご紹介します。',recruit:'伊藤鋳工の仕事内容、社員紹介、教育・資格取得支援、働く環境、募集5件の条件をご紹介します。',contact:'製品・図面・別注品に関するご相談はこちら。伊藤鋳工の連絡先をご案内します。',entry:'伊藤鋳工への採用応募・採用に関するご相談のページです。'};
 let title=key==='home'?'伊藤鋳工株式会社':`${routes[key]?.title||'伊藤鋳工株式会社'} | 伊藤鋳工株式会社`,description=descriptions[key]||descriptions.home;
 const p=key==='product'?products.find(x=>x.id===Number(params.get('id'))):null;
 const job=key==='recruit-job'?currentOpenings.find(x=>x.id===params.get('id')):null;
 const doc=key==='document'?technicalDocuments.find(x=>x.id===params.get('id')):null;
 if(p){title=`${p.name} | 伊藤鋳工株式会社`;description=p.desc+' '+p.spec;}
 if(job){title=`${job.title}・${job.theme} | 伊藤鋳工株式会社 採用情報`;description=`${job.title}の募集詳細。月給${job.salaryMin}〜27万円、本社勤務。${job.intro}`;}
 if(doc){title=`${doc.title}の図面・仕様表 | 伊藤鋳工株式会社`;description=`${documentProduct(doc).name}・${doc.title}の図面を閲覧し、PDFをダウンロードできます。`;}
 const canonical=siteHref(key,['product','recruit-job','document'].includes(key)?query:'');
 const org={'@type':'Organization','@id':SITE_BASE+'/#organization',name:'伊藤鋳工株式会社',url:SITE_BASE+'/',foundingDate:'1914-01-05',telephone:'+81-52-361-6511',address:{'@type':'PostalAddress',streetAddress:'中川区三ツ屋町1丁目2017',addressLocality:'名古屋市',addressRegion:'愛知県',postalCode:'454-0831',addressCountry:'JP'}};
 const page={'@type':'WebPage',name:title,description,url:canonical,about:{'@id':SITE_BASE+'/#organization'}};
 return {key,title,description,canonical,schema:{'@context':'https://schema.org','@graph':[org,page]}};
}
function refreshPageInfo(){
 const info=currentPageInfo();document.title=info.title;
 document.querySelector('meta[name="description"]').content=info.description;
 const canonical=document.querySelector('link[rel="canonical"]');if(canonical)canonical.href=info.canonical;
 const schema=document.querySelector('#site-structured-data');if(schema)schema.textContent=JSON.stringify(info.schema);
 document.querySelector('meta[property="og:title"]')?.setAttribute('content',info.title);
 document.querySelector('meta[property="og:description"]')?.setAttribute('content',info.description);
 document.querySelector('meta[property="og:url"]')?.setAttribute('content',new URL(info.canonical,location.origin).href);
}
