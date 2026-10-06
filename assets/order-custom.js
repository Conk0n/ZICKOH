(()=>{
'use strict';
const $=id=>document.getElementById(id), form=$('order-form');
const products={custom:{title:'オーダーメイド ガラスマウスパッド',price:21980,size:'490 × 430 × 3mm',lead:'デザイン確定と入金の両方が完了してから、お届けまで2〜3週間'},mayu:{title:'MAYU',price:17980,size:'450 × 400 × 3mm',lead:'入金確認後、お届けまで2〜3週間'}};
const yen=v=>'¥'+v.toLocaleString('ja-JP')+'（税込）';
let imageURL=null;
function shipping(){
 if(!$('prefecture').value||!$('island').value)return {pending:true,label:'配送先の選択後に確認'};
 if($('prefecture').value==='沖縄県'||$('island').value==='yes')return {pending:true,label:'沖縄・離島の追加送料：未確定。お支払い前にご案内します。'};
 if($('island').value==='unknown')return {pending:true,label:'離島該当の有無を確認後、追加送料をご案内します。'};
 return {pending:false,label:'送料込み（追加送料なし）'};
}
function update(){
 const p=products[$('product').value];
 $('product-title').textContent=p.title;$('unit-price').textContent=yen(p.price);$('product-size').textContent=p.size;$('lead-time').textContent=p.lead;
 const custom=$('product').value==='custom';$('design-fields').hidden=!custom;
 for(const id of ['design','rights-type','creator']){$(id).disabled=!custom;$(id).required=custom;}
 $('rights-note').disabled=!custom;
 $('shipping-note').textContent=shipping().label;
}
function show(which){
 for(const [id,name] of [['order-form','input'],['review','review'],['after','after']])$(id).hidden=name!==which;
 ['input','review','after'].forEach((name,i)=>{const s=$('step'+(i+1));if(name===which)s.setAttribute('aria-current','step');else s.removeAttribute('aria-current')});
 const target=which==='input'?$('product'):which==='review'?$('review-title'):$('after-title');target.focus();target.scrollIntoView({block:'start',behavior:'auto'});
}
function row(label,value,total=false){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;if(total)dd.className='total';$('review-list').append(dt,dd);}
function validateImage(){
 const f=$('design').files[0];$('design').setCustomValidity('');
 if(!f)return;
 if(!/\.(png|jpe?g|webp)$/i.test(f.name)||!['image/png','image/jpeg','image/webp'].includes(f.type))$('design').setCustomValidity('PNG・JPG・WEBPの画像を選んでください。');
 else if(f.size>20*1024*1024)$('design').setCustomValidity('確認用画面では20MB以下の画像を選んでください。');
}
$('design').addEventListener('change',()=>{
 if(imageURL){URL.revokeObjectURL(imageURL);imageURL=null;}
 $('design-preview').hidden=true;$('design-preview').removeAttribute('src');validateImage();
 if($('design').files[0]&&$('design').validity.valid){imageURL=URL.createObjectURL($('design').files[0]);$('design-preview').src=imageURL;$('design-preview').hidden=false;}
});
$('design-preview').addEventListener('error',()=>{$('design-preview').hidden=true;$('design').setCustomValidity('画像を読み込めません。別のPNG・JPG・WEBP画像を選んでください。');});
for(const id of ['product','prefecture','island'])$(id).addEventListener('change',update);
for(const id of ['name','phone','address','creator'])$(id).addEventListener('input',()=>$(id).setCustomValidity(''));
form.addEventListener('submit',event=>{
 event.preventDefault();$('form-error').textContent='';
 for(const id of ['name','phone','address','creator']){if(!$(id).disabled)$(id).setCustomValidity($(id).value.trim()?'':'空白以外の内容を入力してください。');}
 if($('product').value==='custom')validateImage();
 if(!form.reportValidity()){$('form-error').textContent='必須項目と入力内容を確認してください。';return;}
 const p=products[$('product').value],n=Number($('quantity').value),sub=p.price*n,s=shipping();
 $('review-list').replaceChildren();row('商品',p.title);row('仕様',p.size+'／スピードモデル／専用マウスソール付属');row('単価',yen(p.price));row('数量',n+'点');row('商品小計',yen(sub));row('送料',s.label);row('お支払い総額',s.pending?'未確定（商品小計 '+yen(sub)+' ＋ 確定後の追加送料）':yen(sub),true);
 for(const [id,label] of [['name','お名前'],['email','メール'],['phone','電話番号'],['postcode','郵便番号']])row(label,$(id).value.trim());
 row('配送先',$('prefecture').value+' '+$('address').value.trim());
 if($('product').value==='custom'){row('画像',$('design').files[0].name);row('権利',$('rights-type').value);row('原作者・権利者',$('creator').value.trim());row('許諾の補足',$('rights-note').value.trim()||'なし');}
 row('備考',$('note').value.trim()||'なし');$('review-lead').textContent='納期：'+p.lead;show('review');
});
$('edit').addEventListener('click',()=>show('input'));
$('next').addEventListener('click',()=>{
 const steps=$('product').value==='custom'?['申込み受付後、受付番号と申込み内容をご案内します。','画像・権利・印刷可否を確認します。必要な画像調整は事前にご相談します。','送料を含む総額を確定し、お支払い方法をご案内します。','デザイン確定と入金の両方が完了後に制作します。お届けまで2〜3週間が目安です。','発送後に配送情報をご案内します。']:['注文受付後、受付番号と注文内容をご案内します。','送料を含む総額を確認し、お支払いいただきます。','入金確認後に制作します。お届けまで2〜3週間が目安です。','発送後に配送情報をご案内します。'];
 $('after-steps').replaceChildren();for(const text of steps){const li=document.createElement('li');li.textContent=text;$('after-steps').append(li);}show('after');
});
$('back-review').addEventListener('click',()=>show('review'));

update();$('review-button').disabled=false;
})();
