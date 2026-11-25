const documentCategories = [['all','すべて'],['wheels','車輪'],['couplings','継手'],['parts','機械部品']];
const fileSize = bytes => bytes >= 1000000 ? `${(bytes/1000000).toFixed(1)} MB` : `${Math.ceil(bytes/1000)} KB`;
const documentProduct = d => products.find(p=>p.id===d.productId);
const selectedDocumentProduct = () => products.find(p=>p.id===Number(routeParams().get('product')));
function technicalDocumentCard(d) {
 const p=documentProduct(d);
 return `<article class="document-card"><a class="document-card-link" href="#/document?id=${d.id}" aria-label="${p.name}・${d.title}の図面を見る"><div class="document-thumb"><img src="./downloads/previews/${d.id}-thumb.webp" alt="${d.title}の図面プレビュー" loading="lazy"><span>PDF</span></div><div class="document-card-copy"><p class="document-category">${p.category}<span>${String(p.id).padStart(2,'0')}</span></p>${d.title!==p.name?`<p class="document-product-name">${p.name}</p>`:''}<h2>${d.title}</h2><p class="document-file-meta">図面・カタログ <span>${fileSize(d.bytes)}</span></p><span class="document-view-label">図面を見る</span></div></a><a class="document-save" href="./downloads/${d.file}" download aria-label="${p.name}・${d.title}のPDFをダウンロード">PDFをダウンロード<span aria-hidden="true">↓</span></a></article>`;
}
function cadLibrary() {
 return `<section class="cad-library" id="cad-library" aria-labelledby="cad-library-title"><div class="cad-heading"><div><p class="small-latin">CAD DATA</p><h2 id="cad-library-title">重量戸車のCADデータ</h2></div><p>シリーズごとのDXFデータを、<br>ZIP形式でダウンロードできます。</p></div><div class="cad-file-grid">${cadDocuments.map(d=>`<a href="./downloads/${d.file}" download class="cad-file"><span class="cad-series">${d.id.replace('_data','')}<small>シリーズ</small></span><span class="cad-format">DXF / ZIP<span>${d.drawingCount}図面 · ${fileSize(d.bytes)}</span></span><span class="cad-download" aria-hidden="true">↓</span></a>`).join('')}</div></section>`;
}
function documentsPage() {
 const p=selectedDocumentProduct();
 const files=p?technicalDocuments.filter(d=>d.productId===p.id):technicalDocuments;
 return `${interiorMast('Drawings','図面・カタログ','製品の仕様と寸法を、確かめる。<br>図面の閲覧・ダウンロードはこちらから。','documents-mast')}<section class="document-library"><div class="wrap"><div class="document-library-intro"><a href="#/products" class="document-back">製品紹介に戻る</a><p>PDF <b>${files.length}</b> 点${!p||p.id===6?'<span class="document-intro-divider"></span>CAD <b>7</b> シリーズ':''}</p></div>${p?`<div class="document-related"><div><p class="small-latin">RELATED DOCUMENTS</p><h2>${p.name}の資料</h2></div><a href="#/catalogue">すべての資料を見る</a></div>`:`<nav class="document-filters" aria-label="図面のカテゴリ">${documentCategories.map(([key,label])=>`<button type="button" data-document-filter="${key}" aria-pressed="${key==='all'}">${label}<span>${key==='all'?technicalDocuments.length:technicalDocuments.filter(d=>documentProduct(d).group===key).length}</span></button>`).join('')}</nav>`}<p class="document-result" id="document-result" role="status">${files.length}件の資料</p><div class="document-grid" id="document-grid">${files.map(technicalDocumentCard).join('')}</div><div id="cad-library-container">${!p||p.id===6?cadLibrary():''}</div><div class="document-help"><div><p class="small-latin">NEED ASSISTANCE?</p><h2>掲載のない仕様・図面について</h2><p>必要な寸法・材質・用途などをお知らせください。</p></div><a class="resource-button" href="#/contact">図面・仕様について相談する</a></div></div></section>`;
}
function filterDocuments(category) {
 const files=technicalDocuments.filter(d=>category==='all'||documentProduct(d).group===category);
 document.querySelector('#document-grid').innerHTML=siteLinks(files.map(technicalDocumentCard).join(''));
 document.querySelector('#document-result').textContent=`${files.length}件の資料`;
 document.querySelectorAll('[data-document-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.documentFilter===category)));
 document.querySelector('#cad-library-container').hidden=category!=='all'&&category!=='wheels';
}
function documentPage() {
 const id=routeParams().get('id');
 const d=technicalDocuments.find(d=>d.id===id);
 if(!d)return `${pageIntro('DOCUMENTS','資料が見つかりません','図面・カタログ一覧から資料をお選びください。')}<div class="wrap document-missing"><a class="resource-button" href="#/catalogue">図面・カタログ一覧へ</a></div>`;
 const p=documentProduct(d);
 return `<section class="document-viewer"><div class="wrap"><nav class="document-view-breadcrumb" aria-label="パンくず"><a href="#/products">製品紹介</a><span>/</span><a href="#/catalogue">図面・カタログ</a><span>/</span><span>${d.title}</span></nav><div class="document-view-heading"><div><p class="small-latin">DRAWING / ${p.category}</p>${d.title!==p.name?`<p class="document-product-name">${p.name}</p>`:''}<h1>${d.title}</h1><p class="document-file-meta">PDF · ${fileSize(d.bytes)}</p></div><a class="resource-button" href="./downloads/${d.file}" download>PDFをダウンロード <span aria-hidden="true">↓</span></a></div><div class="document-view-toolbar"><a href="#/catalogue?product=${p.id}">この製品の資料一覧</a><div class="document-zoom-controls" aria-label="図面の表示倍率"><button type="button" data-drawing-zoom="fit" aria-pressed="true">全体表示</button><button type="button" data-drawing-zoom="detail" aria-pressed="false">拡大表示</button></div></div><div class="drawing-pages" id="drawing-pages">${d.pages.map((page,i)=>`<div class="drawing-scroll" tabindex="0" role="region" aria-label="${d.title}の図面。拡大表示時は左右にスクロールできます。"><img src="./downloads/previews/${page.image}" width="${page.width}" height="${page.height}" alt="${d.title}の図面・寸法表 ${i+1}ページ" decoding="async"></div>`).join('')}${d.id==='k-11'?'<div class="drawing-supplement-heading"><h2>部品寸法表</h2><a href="./downloads/k-11_1.jpg" download>画像をダウンロード</a></div><div class="drawing-scroll" tabindex="0" role="region" aria-label="フランヂ形タワミ軸継手の部品寸法表"><img src="./downloads/k-11_1.jpg" width="640" height="246" alt="フランヂ形タワミ軸継手の部品寸法表" loading="lazy"></div>':''}</div><p class="document-view-note">寸法の細部は拡大表示、またはPDFをダウンロードしてご確認ください。</p>${p.id===6?cadLibrary():''}<div class="document-view-footer"><a href="#/catalogue">図面・カタログ一覧に戻る</a><button class="resource-button" type="button" data-inquire="${p.id}">この製品について相談する</button></div></div></section>`;
}
document.addEventListener('click',e=>{
 const filter=e.target.closest('[data-document-filter]');if(filter){filterDocuments(filter.dataset.documentFilter);return;}
 const zoom=e.target.closest('[data-drawing-zoom]');if(zoom){const expanded=zoom.dataset.drawingZoom==='detail';document.querySelector('#drawing-pages').classList.toggle('is-expanded',expanded);document.querySelectorAll('[data-drawing-zoom]').forEach(b=>b.setAttribute('aria-pressed',String(b===zoom)));}
});
