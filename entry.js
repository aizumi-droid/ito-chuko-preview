// The design preview never transmits or persists applicant information.
let entryDraft = null;
function formAvailability(){return `<p class="form-availability" id="form-availability" role="status">現在、フォームからの送信はできません。</p>`;}
function entrySteps(step=1) {
 return `<ol class="contact-steps" aria-label="採用エントリーの進行状況">${['入力','確認','完了'].map((label,i)=>`<li class="${i+1===step?'current':i+1<step?'done':''}" ${i+1===step?'aria-current="step"':''}><span>0${i+1}</span>${label}</li>`).join('')}</ol>`;
}
function entryPage() {
 return `<div class="entry-page">${interiorMast('Entry','採用エントリー','あなたの次の一歩を、ここから。<br>ご応募・採用に関するご相談をお聞かせください。','contact-mast')}<section class="contact-section"><div class="wrap contact-layout"><aside class="contact-aside entry-aside"><div><p class="small-latin">RECRUITMENT</p><h2>ものづくりを、<br>あなたの仕事に。</h2><p>仕事内容や働く環境、募集要項を<br>採用ページでご紹介しています。</p><a class="editorial-link" href="#/recruit">採用情報を見る</a></div><div class="contact-help"><p class="small-latin">BY PHONE</p><h2>お電話でのお問い合わせ</h2><p>伊藤鋳工株式会社 本社</p><a class="tel" href="tel:0523616511">052-361-6511</a></div></aside><div class="contact-form-column"><div id="entry-progress">${entrySteps()}</div>${formAvailability()}<div id="entry-form-area"></div></div></div></section></div>`;
}
function entryInputMarkup() {
 return `<div class="form-heading"><p class="small-latin">ENTRY FORM</p><h2 id="entry-input-title" tabindex="-1">まずは、あなたのことを。</h2><p>必須項目をご入力のうえ、確認画面へお進みください。</p></div><form id="entry-form"><div class="field-pair"><div class="field"><label for="entry-kind">ご希望の内容 <small>必須</small></label><select id="entry-kind" name="kind" required><option value="応募する">応募する</option><option value="採用について相談する">採用について相談する</option></select></div><div class="field"><label for="entry-job">希望職種 <small>必須</small></label><select id="entry-job" name="job" required><option value="">職種を選択してください</option>${recruitJobs.map(j=>`<option value="${j.id}">${j.name}</option>`).join('')}<option value="undecided">職種について相談したい</option></select></div></div><div class="field-pair"><div class="field"><label for="entry-name">お名前 <small>必須</small></label><input id="entry-name" name="name" autocomplete="name" maxlength="100" required placeholder="山田 太郎"></div><div class="field"><label for="entry-kana">ふりがな <small>必須</small></label><input id="entry-kana" name="kana" maxlength="100" required placeholder="やまだ たろう"></div></div><div class="field"><label for="entry-email">メールアドレス <small>必須</small></label><input id="entry-email" name="email" type="email" autocomplete="email" maxlength="254" required placeholder="example@example.com"></div><div class="field"><label for="entry-phone">電話番号 <small>任意</small></label><input id="entry-phone" name="phone" type="tel" autocomplete="tel" maxlength="30" placeholder="090-1234-5678"></div><div class="field"><label for="entry-message">ご質問・伝えておきたいこと <small>任意</small></label><textarea id="entry-message" name="message" maxlength="3000" placeholder="これまでのご経験や、ご希望、ご質問などを自由にご記入ください。"></textarea></div><button class="button form-submit" type="submit">入力内容を確認する</button></form>`;
}
function setupEntry() {
 const query=routeParams();
 const requestedJob=query.get('job');
 entryDraft=null;
 renderEntryInput(recruitJobs.some(j=>j.id===requestedJob)?{job:requestedJob}:{});
}
function renderEntryInput(values={},focus=false) {
 document.querySelector('#entry-progress').innerHTML=entrySteps(1);
 document.querySelector('#entry-form-area').innerHTML=entryInputMarkup();
 const form=document.querySelector('#entry-form');
 for(const [key,value] of Object.entries(values)){if(form.elements[key])form.elements[key].value=value;}
 if(focus)document.querySelector('#entry-input-title').focus();
 form.addEventListener('submit',e=>{
  e.preventDefault();
  for(const key of ['name','kana']){const field=form.elements[key];field.setCustomValidity(field.value.trim()?'':'入力してください。');field.addEventListener('input',()=>field.setCustomValidity(''),{once:true});}
  if(!form.reportValidity())return;
  entryDraft=Object.fromEntries(new FormData(form));
  const job=recruitJobs.find(j=>j.id===entryDraft.job)?.name||'職種について相談したい';
  const labels={kind:'ご希望の内容',job:'希望職種',name:'お名前',kana:'ふりがな',email:'メールアドレス',phone:'電話番号',message:'ご質問・ご要望'};
  const rows=Object.entries(labels).map(([key,label])=>`<div><dt>${label}</dt><dd>${esc(key==='job'?job:entryDraft[key]||'未入力')}</dd></div>`).join('');
  document.querySelector('#entry-progress').innerHTML=entrySteps(2);
  document.querySelector('#entry-form-area').innerHTML=`<section class="confirm-panel"><p class="small-latin">CONFIRM</p><h2 id="entry-confirm-title" tabindex="-1">入力内容の確認</h2><p>ご希望の職種や連絡先にお間違いがないか、ご確認ください。</p><dl class="confirm-rows">${rows}</dl><div class="dialog-actions"><button class="button" type="button" id="entry-send" disabled aria-describedby="form-availability">送信する</button><button class="button light" type="button" id="entry-back">入力内容を修正する</button></div></section>`;
  document.querySelector('#entry-confirm-title').focus();
  document.querySelector('#entry-back').addEventListener('click',()=>renderEntryInput(entryDraft,true));

 });
}
